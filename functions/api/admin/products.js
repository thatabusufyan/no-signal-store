import { json, requireAdmin } from "./_auth.js";

function normalize(p) {
  const media=JSON.parse(p.color_images_json||"{}");
  const gallery=Array.isArray(media.gallery)?media.gallery:Object.entries(media).filter(([k])=>!["gallery","musicUrl","musicVolume"].includes(k)).map(([color,src])=>({src,color}));
  return {...p,sizes:JSON.parse(p.sizes_json||"[]"),colors:JSON.parse(p.colors_json||"[]"),gallery,musicUrl:media.musicUrl||"",musicVolume:Number(media.musicVolume??0.35),featured:!!p.featured,published:!!p.published};
}

export async function onRequestGet({ request, env }) {
  const auth = await requireAdmin(request, env); if (!auth.ok) return auth.response;
  const { results } = await env.DB.prepare(`SELECT id,name,slug,category,price,compare_at AS compareAt,badge,description,image,sizes_json,colors_json,color_images_json,stock,featured,published,ceeprinto_product_id AS ceeprintoProductId FROM products ORDER BY created_at DESC`).all();
  return json(results.map(normalize));
}

export async function onRequestPost({ request, env }) {
  const auth = await requireAdmin(request, env); if (!auth.ok) return auth.response;
  let b; try { b = await request.json(); } catch { return json({error:"Invalid JSON."},400); }
  const id = b.id || `NS-${Date.now().toString(36).toUpperCase()}`;
  const slug = b.slug || String(b.name || id).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  await env.DB.prepare(`INSERT INTO products (id,name,slug,category,price,compare_at,badge,description,image,sizes_json,colors_json,stock,featured,published,ceeprinto_product_id,created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(id,b.name,slug,String(b.category||"ACCESSORIES").toUpperCase(),Number(b.price||0),b.compareAt?Number(b.compareAt):null,b.badge||"NEW",b.description||"",b.image||"assets/no-signal-logo.png",JSON.stringify(b.sizes||["S","M","L","XL"]),JSON.stringify(b.colors||["BLACK"]),JSON.stringify(b.gallery||[]),b.musicUrl||null,Number(b.musicVolume ?? 0.35),Number(b.stock||0),b.featured?1:0,b.published===false?0:1,b.ceeprintoProductId||null,new Date().toISOString()).run();
  return json({ok:true,id},201);
}

export async function onRequestDelete({ request, env }) {
  const auth = await requireAdmin(request, env); if (!auth.ok) return auth.response;
  let b; try { b = await request.json(); } catch { return json({error:"Invalid JSON."},400); }
  if (!b.id) return json({error:"Missing product id."},400);
  await env.DB.prepare("DELETE FROM products WHERE id=?").bind(b.id).run();
  return json({ok:true});
}
