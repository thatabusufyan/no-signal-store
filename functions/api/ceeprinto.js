const DEFAULT_BASE="https://ceeprinto.com/wp-json/ceeprinto/v2";

async function cpRequest(env,path,options={}){
  const base=env.CEEPRINTO_API_BASE_URL||DEFAULT_BASE;
  const headers={
    "Authorization":`Bearer ${env.CEEPRINTO_API_TOKEN}`,
    "Content-Type":"application/json",
    ...(options.headers||{})
  };
  const r=await fetch(`${base}${path}`,{...options,headers});
  let body={}; try{body=await r.json()}catch(_){}
  if(!r.ok){
    const e=body?.error;
    throw new Error(e?.message||`CeePrinto request failed (${r.status})`);
  }
  return body;
}

export async function submitCeePrintoOrder({env,orderId,customer,items}){
  if(!env.CEEPRINTO_API_TOKEN) return {configured:false,submitted:false};

  let shopId=Number(env.CEEPRINTO_SHOP_ID||0);
  if(!shopId){
    const externalShopId=env.CEEPRINTO_EXTERNAL_SHOP_ID||"no-signal-store";
    const shop=await cpRequest(env,"/shops",{method:"POST",body:JSON.stringify({
      channel:"custom",external_shop_id:externalShopId,name:env.CEEPRINTO_SHOP_NAME||"NO SIGNAL"
    })});
    shopId=Number(shop?.data?.id||0);
    if(!shopId) throw new Error("CeePrinto did not return a shop ID.");
  }

  const missing=items.filter(x=>!x.ceeprintoProductId);
  if(missing.length) throw new Error("CeePrinto mapping is missing for one or more ordered products.");

  const name=String(customer.name||"").trim().split(/\s+/);
  const firstName=name.shift()||"Customer";
  const lastName=name.join(" ");
  const payload={
    shop_id:shopId,
    external_order_id:orderId,
    currency:"PKR",
    shipping_address:{
      first_name:firstName,
      last_name:lastName,
      phone:customer.phone,
      email:customer.email||undefined,
      address_1:customer.address,
      city:customer.city,
      postcode:customer.postalCode||undefined,
      country:"PK"
    },
    line_items:items.map(x=>({
      external_variant_id:String(x.ceeprintoProductId),
      quantity:Number(x.quantity),
      customer_price:Number(x.unitPrice).toFixed(2),
      customer_price_currency:"PKR",
      customer_variant:[x.size,x.color].filter(Boolean).join(" / ")
    }))
  };

  return {
    configured:true,
    submitted:true,
    response:await cpRequest(env,"/orders",{
      method:"POST",
      headers:{"Idempotency-Key":`${env.CEEPRINTO_EXTERNAL_SHOP_ID||"no-signal-store"}:${orderId}`},
      body:JSON.stringify(payload)
    })
  };
}

export async function onRequestPost({ request, env }) {
  if(!env.CEEPRINTO_API_TOKEN) return Response.json({ok:false,configured:false,message:"CeePrinto API token is not configured."},{status:503});
  let body; try{body=await request.json()}catch{return Response.json({error:"Invalid JSON."},{status:400})}
  try{
    const result=await submitCeePrintoOrder({env,orderId:body.orderId,customer:body.customer,items:body.items||[]});
    return Response.json({ok:true,...result});
  }catch(err){
    return Response.json({ok:false,error:err.message},{status:502});
  }
}
