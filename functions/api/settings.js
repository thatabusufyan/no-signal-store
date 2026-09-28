export async function onRequestGet({env}) {
  const defaults={brand:"NO SIGNAL",subbrand:"APPAREL CO.",tagline:"WEAR THE UNKNOWN",currency:"PKR",country:"Pakistan",email:"nosignal.apparelco@gmail.com",phone:"",instagram:"",tiktok:"",facebook:"",youtube:"",address:"",businessHours:"",whatsapp:"",shippingFee:250,freeShippingAbove:5000,cod:true,onlinePayments:true};
  if(!env.DB)return Response.json(defaults);
  const {results}=await env.DB.prepare("SELECT key,value FROM store_settings").all();const s={...defaults};for(const r of results){try{s[r.key]=JSON.parse(r.value)}catch{s[r.key]=r.value}}return Response.json(s);
}
