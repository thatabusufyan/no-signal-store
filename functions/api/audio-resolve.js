function json(data,status=200){
  return new Response(JSON.stringify(data),{
    status,
    headers:{"content-type":"application/json","cache-control":"public, max-age=300"}
  });
}

function isDirectAudio(url){
  return /^data:audio\//i.test(url) || /\.(mp3|m4a|aac|ogg|oga|wav|webm)(?:[?#]|$)/i.test(url);
}

function decodeUrl(value){
  return String(value||"")
    .replace(/\\u002F/g,"/")
    .replace(/\\u0026/g,"&")
    .replace(/\\u003F/g,"?")
    .replace(/\\u003D/g,"=")
    .replace(/\\\//g,"/")
    .replace(/&amp;/g,"&")
    .trim();
}

export async function onRequestGet({request}){
  const raw=(new URL(request.url).searchParams.get("url")||"").trim();
  if(!raw)return json({error:"Missing audio URL."},400);

  if(isDirectAudio(raw))return json({url:raw});

  let target;
  try{target=new URL(raw)}catch{return json({error:"Invalid audio URL."},400)}

  if(!/^https?:$/.test(target.protocol))return json({error:"Unsupported audio URL."},400);

  // This resolver is intentionally limited to Pixabay pages.
  if(!/(^|\.)pixabay\.com$/i.test(target.hostname)) {
    return json({error:"Use a direct audio URL for other providers."},400);
  }

  try{
    const response=await fetch(target.toString(),{
      headers:{
        "user-agent":"Mozilla/5.0 (compatible; NO-SIGNAL media resolver)",
        "accept":"text/html,application/xhtml+xml"
      }
    });
    if(!response.ok)return json({error:"Could not read the music page."},502);

    const html=await response.text();
    const candidates=[];
    const add=value=>{
      const url=decodeUrl(value);
      if(url && /^https?:\/\//i.test(url) && isDirectAudio(url) && !candidates.includes(url))candidates.push(url);
    };

    // Pixabay pages can expose the downloadable audio URL in embedded page data.
    for(const m of html.matchAll(/https?:\/\/cdn\.pixabay\.com\/download\/audio\/[^"'<>\\s\\\\]+/gi)) add(m[0]);
    for(const m of html.matchAll(/https?:\/\/cdn\.pixabay\.com\/audio\/[^"'<>\\s\\\\]+/gi)) add(m[0]);
    for(const m of html.matchAll(/["'](?:audioUrl|audio_url|downloadUrl|download_url)["']\s*:\s*["']([^"']+)["']/gi)) add(m[1]);
    for(const m of html.matchAll(/<meta[^>]+(?:property|name)=["'](?:og:audio|twitter:player:stream)["'][^>]+content=["']([^"']+)["']/gi)) add(m[1]);

    if(candidates[0])return json({url:candidates[0]});
    return json({error:"No playable audio file was found on this Pixabay page."},404);
  }catch{
    return json({error:"Audio page could not be resolved."},502);
  }
}
