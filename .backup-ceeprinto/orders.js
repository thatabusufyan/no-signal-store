function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json"}})}
export async function onRequestPost({request,env}){
 if(!env.DB)return json({error:"Database is not configured yet."},503);let body;try{body=await request.json()}catch{return json({error:"Invalid JSON."},400)}
 for(const key of ["customer","items","paymentMethod"])if(!body[key])return json({error:`Missing ${key}.`},400);if(!Array.isArray(body.items)||!body.items.length)return json({error:"Cart is empty."},400);
 const id=`NS-${Date.now().toString(36).toUpperCase()}`,c=body.customer,customerId=crypto.randomUUID();const subtotal=body.items.reduce((s,i)=>s+Number(i.unitPrice||0)*Number(i.quantity||0),0),shipping=Number(body.shipping||0),total=subtotal+shipping;
 await env.DB.prepare(`INSERT INTO customers (id,name,email,phone,city,address,postal_code) VALUES (?,?,?,?,?,?,?)`).bind(customerId,c.name,c.email||null,c.phone,c.city||null,c.address,c.postalCode||null).run();
 await env.DB.prepare(`INSERT INTO orders (id,customer_id,subtotal,shipping,total,payment_method) VALUES (?,?,?,?,?,?)`).bind(id,customerId,subtotal,shipping,total,body.paymentMethod).run();
 for(const i of body.items)await env.DB.prepare(`INSERT INTO order_items (order_id,product_id,name,size,color,quantity,unit_price) VALUES (?,?,?,?,?,?,?)`).bind(id,i.productId,i.name,i.size||null,i.color||null,Number(i.quantity),Number(i.unitPrice)).run();
 return json({ok:true,orderId:id,status:"received"},201);
}
