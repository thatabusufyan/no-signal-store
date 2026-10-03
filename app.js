
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => `${NO_SIGNAL.settings.currency} ${Number(n).toLocaleString("en-PK")}`;

let products = NO_SIGNAL.products.slice();
let cart = JSON.parse(localStorage.getItem("ns_cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("ns_wishlist") || "[]");
let orders = [];
let adminUnlocked = false;
let currentCategory = "ALL";

function playProductTransition(id){
  const p=products.find(x=>x.id===id);
  if(p?.musicUrl){
    try{
      if(window.noSignalProductAudio){window.noSignalProductAudio.pause();window.noSignalProductAudio.currentTime=0;}
      const audio=new Audio(p.musicUrl);
      audio.loop=true;
      audio.volume=Math.max(0,Math.min(1,Number(p.musicVolume ?? 0.35)));
      window.noSignalProductAudio=audio;
      audio.play().catch(()=>{});
    }catch(_){}
  }
  const overlay=$("#productTransition");
  overlay.classList.remove("play"); void overlay.offsetWidth; overlay.classList.add("play");
  setTimeout(()=>{ productDetail(id); }, 1050);
  setTimeout(()=>overlay.classList.remove("play"), 1900);
}


function save(){localStorage.setItem("ns_cart",JSON.stringify(cart));localStorage.setItem("ns_wishlist",JSON.stringify(wishlist));}
function countBag(){return cart.reduce((a,x)=>a+x.qty,0)}
function updateCounts(){$("#bagCount").textContent=countBag();$("#wishCount").textContent=wishlist.length}

function normalizeGallery(p){
  if(Array.isArray(p?.gallery)) return p.gallery.filter(x=>x&&x.src);
  const legacy=p?.colorImages||{};
  return Object.entries(legacy).filter(([k])=>k!=="gallery").map(([color,src])=>({src,color}));
}
function getMainImages(p){
  const g=normalizeGallery(p), main=g.filter(x=>!x.color||x.type==="main");
  return main.length?main:g;
}
function getColorImages(p,color){
  const g=normalizeGallery(p), wanted=String(color||"").toLowerCase();
  const matching=g.filter(x=>x.color&&String(x.color).toLowerCase()===wanted);
  return matching.length?matching:getMainImages(p);
}
function getColorImage(p,color){return getColorImages(p,color)[0]?.src||p?.image||"assets/no-signal-logo.png";}

function renderProducts(){
  const q=($("#searchInput")?.value||"").toLowerCase();
  const list=products.filter(p=>(currentCategory==="ALL"||p.category===currentCategory)&&(!q||`${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q)));
  $("#productGrid").innerHTML=list.map(p=>`
    <article class="product">
      <div class="product-image" data-product="${p.id}">
        <span class="product-badge">${p.badge||"CORE"}</span>
        <button class="heart ${wishlist.includes(p.id)?"on":""}" data-wish="${p.id}">${wishlist.includes(p.id)?"♥":"♡"}</button>
        <img class="catalogue-product-image" src="${getMainImages(p)[0]?.src||p.image||"assets/no-signal-logo.png"}" alt="${p.name}">
        ${Array.isArray(p.colors)&&p.colors.length>1?`
          <div class="catalogue-colors">
            ${p.colors.map((c,i)=>`
              <button type="button"
                class="catalogue-color ${i===0?"selected":""}"
                data-catalogue-color="${c}"
                data-product-color="${p.id}"
                title="${c}">
                ${c}
              </button>
            `).join("")}
          </div>
        `:""}
      </div>
      <div class="product-info" data-product="${p.id}">
        <div class="product-name">${p.name}</div><div class="product-cat">${p.category}</div>
        <div class="product-price">${money(p.price)} ${p.compareAt?`<span class="old">${money(p.compareAt)}</span>`:""}</div>
      </div>
    </article>`).join("");
  updateCounts();
}

function openDrawer(html){$("#drawerContent").innerHTML=html;$("#drawer").classList.add("open");$("#drawer").setAttribute("aria-hidden","false")}
function closeDrawer(){
  if(window.noSignalProductAudio){try{window.noSignalProductAudio.pause();window.noSignalProductAudio.currentTime=0}catch(_){} window.noSignalProductAudio=null;}
  $("#drawer").classList.remove("open");$("#drawer").setAttribute("aria-hidden","true")
}

function productDetail(id){
 const p=products.find(x=>x.id===id); if(!p)return;

 const sizes=Array.isArray(p.sizes)&&p.sizes.length?p.sizes:["S","M","L","XL"];
 const colors=Array.isArray(p.colors)&&p.colors.length?p.colors:["BLACK"];
 const gallery=normalizeGallery(p);
 const firstColor=colors[0]||"";
 const initialImages=getMainImages(p);

 if(window.noSignalProductAudio){try{window.noSignalProductAudio.pause();window.noSignalProductAudio.currentTime=0}catch(_){}}
 window.noSignalProductAudio=null;

 openDrawer(`
  <p class="eyebrow">${p.category} / ${p.id}</p>
  <h2>${p.name}</h2>
  <div class="drawer-img">
    <img id="detailProductImage" src="${initialImages[0]?.src||p.image}" alt="${p.name}">
  </div>

  <div id="productImageRail" style="display:flex;gap:8px;overflow-x:auto;padding:12px 0">
    ${initialImages.map((img,i)=>`
      <button type="button" class="product-thumb ${i===0?"selected":""}" data-gallery-src="${img.src}" style="flex:0 0 68px;height:68px;padding:3px;background:#111;border:1px solid ${i===0?"var(--lime)":"#333"}">
        <img src="${img.src}" alt="" style="width:100%;height:100%;object-fit:cover">
      </button>`).join("")}
  </div>

  <div class="drawer-price">${money(p.price)}</div>
  <p class="muted">${p.description||""}</p>

  <p class="eyebrow">SELECT SIZE</p>
  <div class="size-row">
    ${sizes.map((s,i)=>`<button class="${i===0?"selected":""}" data-size="${s}">${s}</button>`).join("")}
  </div>

  <p class="eyebrow" style="margin-top:20px">SELECT COLOR</p>
  <div class="size-row">
    ${colors.map((c,i)=>`<button class="${i===0?"selected":""}" data-color="${c}">${c}</button>`).join("")}
  </div>

  <button class="button button-lime full" id="addToBag"
    data-id="${p.id}"
    data-selected-size="${sizes[0]}"
    data-selected-color="${firstColor}">
    ADD TO BAG <span>+</span>
  </button>
 `);

 const drawer=$("#drawerContent");

 function renderGallery(color){
   const imgs=getColorImages(p,color);
   const main=$("#detailProductImage");
   const rail=$("#productImageRail");
   if(main) main.src=imgs[0]?.src||p.image;
   if(rail) rail.innerHTML=imgs.map((img,i)=>`
     <button type="button" class="product-thumb ${i===0?"selected":""}" data-gallery-src="${img.src}" style="flex:0 0 68px;height:68px;padding:3px;background:#111;border:1px solid ${i===0?"var(--lime)":"#333"}">
       <img src="${img.src}" alt="" style="width:100%;height:100%;object-fit:cover">
     </button>`).join("");
 }

 drawer.querySelectorAll("[data-size]").forEach(btn=>{
   btn.addEventListener("click",()=>{
     drawer.querySelectorAll("[data-size]").forEach(x=>x.classList.remove("selected"));
     btn.classList.add("selected");
     $("#addToBag").dataset.selectedSize=btn.dataset.size;
   });
 });

 drawer.querySelectorAll("[data-color]").forEach(btn=>{
   btn.addEventListener("click",()=>{
     drawer.querySelectorAll("[data-color]").forEach(x=>x.classList.remove("selected"));
     btn.classList.add("selected");
     $("#addToBag").dataset.selectedColor=btn.dataset.color;
     renderGallery(btn.dataset.color);
   });
 });

 drawer.addEventListener("click",e=>{
   const thumb=e.target.closest("[data-gallery-src]");
   if(!thumb)return;
   const img=$("#detailProductImage");
   if(img)img.src=thumb.dataset.gallerySrc;
   drawer.querySelectorAll("[data-gallery-src]").forEach(x=>x.style.borderColor="#333");
   thumb.style.borderColor="var(--lime)";
 });


}

function cartView(){
 let total=cart.reduce((a,x)=>a+x.price*x.qty,0),
     shipping=total>=NO_SIGNAL.settings.freeShippingAbove||!cart.length?0:NO_SIGNAL.settings.shippingFee;

 openDrawer(`
  <p class="eyebrow">YOUR BAG</p>
  <h2>${cart.length?countBag()+" ITEMS":"EMPTY SIGNAL"}</h2>

  <div>
   ${cart.map((x,i)=>`
    <div class="cart-line">
      <img src="${x.image}" alt="${x.name}">
      <div>
        <b>${x.name}</b>
        <small style="display:block;color:#999;margin-top:5px">
          SIZE: ${x.size||"—"} · COLOR: ${x.color||"—"}
        </small>
        <small style="display:block;color:#666;margin-top:5px">
          ${money(x.price)}
        </small>

        <div class="qty">
          <button data-minus="${x.id}" data-cart-index="${i}">−</button>
          <span>${x.qty}</span>
          <button data-plus="${x.id}" data-cart-index="${i}">+</button>
        </div>
      </div>

      <button class="close" style="position:static;font-size:20px"
        data-remove="${x.id}" data-cart-index="${i}">×</button>
    </div>
   `).join("")}
  </div>

  ${cart.length?`
   <div style="padding-top:25px">
    <p class="muted">SUBTOTAL <span style="float:right;color:white">${money(total)}</span></p>
    <p class="muted">SHIPPING <span style="float:right;color:white">${shipping?money(shipping):"FREE"}</span></p>
    <h3>TOTAL <span style="float:right;color:var(--lime)">${money(total+shipping)}</span></h3>
    <button class="button button-lime full" id="checkout">CHECKOUT <span>→</span></button>
   </div>
  `:""}
 `);
}

function toggleWish(id){
 wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];
 save();
 renderProducts();
}

function add(id,size,color){
 const p=products.find(x=>x.id===id);
 if(!p)return;

 size=size||(p.sizes&&p.sizes[0])||"";
 color=color||(p.colors&&p.colors[0])||"";

 // Same product + different size/color = separate cart line
 const item=cart.find(x=>x.id===id&&x.size===size&&x.color===color);

 if(item){
   item.qty++;
 }else{
   cart.push({...p,image:getColorImage(p,color),qty:1,size,color});
 }

 save();
 updateCounts();
 cartView();
}

function checkout(){
 if(!cart.length)return;
 const subtotal=cart.reduce((a,x)=>a+x.price*x.qty,0);
 const shipping=subtotal>=NO_SIGNAL.settings.freeShippingAbove?0:NO_SIGNAL.settings.shippingFee;
 const total=subtotal+shipping;
 openDrawer(`<p class="eyebrow">CHECKOUT / ${money(total)}</p><h2>YOUR DETAILS.</h2><form id="checkoutForm" class="admin-form"><input name="name" required placeholder="FULL NAME"><input name="phone" required placeholder="PHONE"><input name="email" required type="email" placeholder="EMAIL"><input name="city" required placeholder="CITY"><textarea name="address" required placeholder="COMPLETE DELIVERY ADDRESS"></textarea><input name="postalCode" placeholder="POSTAL CODE"><select name="paymentMethod" style="background:#0d0d0d;border:1px solid #333;color:white;padding:13px;font:10px Space Mono"><option value="cod">Cash on Delivery</option></select><p class="muted" style="font-size:10px">Payment remains pending until the buyer actually pays. CeePrinto can collect COD after the order is accepted.</p><button>PLACE ORDER</button></form>`);
 $("#checkoutForm").onsubmit=async e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target));const payload={customer:data,paymentMethod:data.paymentMethod,shipping,items:cart.map(x=>({productId:x.id,name:x.name,size:x.size||"",color:x.color||"",quantity:x.qty,unitPrice:x.price}))};try{const r=await fetch('/api/orders',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});const out=await r.json();if(!r.ok)throw new Error(out.error||'Order failed');const orderId=out.orderId;cart=[];save();updateCounts();openDrawer(`<p class="eyebrow">ORDER RECEIVED</p><h2>THANK YOU.</h2><p class="muted">Your NO SIGNAL order has been received. PAYMENT STATUS: PENDING.</p><div style="border:1px solid var(--lime);padding:20px;margin-top:30px">ORDER NUMBER<br><strong style="font-size:24px;color:var(--lime)">${orderId}</strong></div>`)}catch(err){alert(err.message)}}
}
async function adminFetch(url, options={}){const r=await fetch(url,{credentials:'same-origin',...options});let data={};try{data=await r.json()}catch{}if(r.status===401){adminUnlocked=false;throw new Error('SESSION_EXPIRED')}if(!r.ok)throw new Error(data.error||'Request failed');return data}

async function adminTab(tab="products"){
 if(!adminUnlocked)return openAdmin();
 let html=`<p class="muted">LOADING...</p>`;$("#adminContent").innerHTML=html;
 try{
  if(tab==="products"){
   const ps=await adminFetch('/api/admin/products');
   html=`<div class="admin-row"><b>ADD NEW PRODUCT</b><button class="button button-lime" id="newProduct">+ ADD</button></div>${ps.map(p=>`<div class="admin-row"><div><b>${p.name}</b><small>${p.category} · ${money(p.price)}</small></div><span>${p.stock} IN STOCK</span><button data-del-product="${p.id}" style="background:none;border:0;color:#ff3b30">DELETE</button></div>`).join("")}`;
  } else if(tab==="orders"){
   const os=await adminFetch('/api/admin/orders');

   html=os.length?`
     <div>
       ${os.map((o,i)=>`
         <div class="admin-row order-row" data-order-index="${i}" style="cursor:pointer">
           <div>
             <b>${o.id}</b>
             <small style="display:block">
               CUSTOMER: ${o.customerName||"—"} · PHONE: ${o.phone||"—"} · EMAIL: ${o.email||"—"}
             </small>
             <small style="display:block;color:#777;margin-top:4px">
               ${o.city||"—"} · ${o.address||"—"} · ${o.postalCode||"—"}
             </small>
             <small style="display:block;color:#777;margin-top:4px">
               ITEMS: ${(o.items||[]).map(i=>`${i.name} / ${i.size||"—"} / ${i.color||"—"} × ${i.quantity}`).join(" · ")||"—"}
             </small>
             <small style="display:block;color:#777;margin-top:4px">
               PAYMENT: ${o.paymentMethod||"—"} / ${o.paymentStatus||"pending"} · FULFILLMENT: ${o.fulfillmentStatus||"received"}
             </small>
           </div>
           <span>${money(o.total)}</span>
           <span>${o.status||"received"}</span>
         </div>
       `).join("")}
     </div>
   `:`<p class="muted">No orders yet.</p>`;

   $("#adminContent").innerHTML=html;

   $("#adminContent").querySelectorAll("[data-order-index]").forEach(row=>{
     row.addEventListener("click",()=>{
       const o=os[Number(row.dataset.orderIndex)];
       const items=o.items||[];

       openDrawer(`
         <p class="eyebrow">ORDER DETAILS</p>
         <h2>${o.id}</h2>

         <div style="border:1px solid #333;padding:18px;margin:20px 0">
           <p class="eyebrow">CUSTOMER</p>
           <p><b>${o.customerName||"—"}</b></p>
           <p class="muted">${o.phone||"—"}</p>
           <p class="muted">${o.email||"—"}</p>
           <p class="muted">
             ${o.address||"—"}${o.city?`, ${o.city}`:""}${o.postalCode?` ${o.postalCode}`:""}
           </p>
         </div>

         <p class="eyebrow">ITEMS ORDERED</p>

         <div>
           ${items.map(item=>`
             <div style="border-bottom:1px solid #222;padding:14px 0">
               <b>${item.name}</b>
               <small style="display:block;color:#999;margin-top:5px">
                 SIZE: ${item.size||"—"} · COLOR: ${item.color||"—"} · QTY: ${item.quantity}
               </small>
               <small style="display:block;color:#666;margin-top:4px">
                 ${money(item.unitPrice)} each
               </small>
             </div>
           `).join("")}
         </div>

         <div style="margin-top:20px">
           <p class="muted">SUBTOTAL <span style="float:right;color:white">${money(o.subtotal)}</span></p>
           <p class="muted">SHIPPING <span style="float:right;color:white">${o.shipping?money(o.shipping):"FREE"}</span></p>
           <h3>TOTAL <span style="float:right;color:var(--lime)">${money(o.total)}</span></h3>
         </div>

         <div style="border-top:1px solid #333;padding-top:20px;margin-top:20px">
           <p class="muted">PAYMENT METHOD: <b style="color:white">${o.paymentMethod||"—"}</b></p>
           <p class="muted">PAYMENT STATUS: <b style="color:white">${o.paymentStatus||"pending"}</b> — this is not marked paid unless payment is actually confirmed.</p>
           <p class="muted">FULFILLMENT: <b style="color:white">${o.fulfillmentStatus||"received"}</b></p>
           ${o.trackingNumber?`<p class="muted">TRACKING: <b style="color:white">${o.trackingNumber}</b></p>`:""}
           ${o.ceeprintoOrderId?`<p class="muted">CEEPRINTO: <b style="color:white">${o.ceeprintoOrderId}</b></p>`:""}
           ${o.createdAt?`<p class="muted">ORDERED: <b style="color:white">${new Date(o.createdAt).toLocaleString()}</b></p>`:""}
         </div>
       `);
     });
   });
  } else {
   const ss=await adminFetch('/api/admin/settings'); const s={...NO_SIGNAL.settings,...ss}; Object.assign(NO_SIGNAL.settings,s);
   html=`<p class="muted" style="margin-bottom:22px">Edit your store details here. Changes are saved to the live database.</p><form id="settingsForm" class="admin-form">
   <input name="brand" value="${s.brand||''}" placeholder="BRAND NAME"><input name="subbrand" value="${s.subbrand||''}" placeholder="SUB-BRAND"><input name="tagline" value="${s.tagline||''}" placeholder="TAGLINE"><input name="email" value="${s.email||''}" placeholder="EMAIL"><input name="phone" value="${s.phone||''}" placeholder="PHONE"><input name="whatsapp" value="${s.whatsapp||''}" placeholder="WHATSAPP"><input name="instagram" value="${s.instagram||''}" placeholder="INSTAGRAM URL / @HANDLE"><input name="tiktok" value="${s.tiktok||''}" placeholder="TIKTOK URL / @HANDLE"><input name="facebook" value="${s.facebook||''}" placeholder="FACEBOOK URL"><input name="youtube" value="${s.youtube||''}" placeholder="YOUTUBE URL"><input name="address" value="${s.address||''}" placeholder="BUSINESS / RETURN ADDRESS"><input name="businessHours" value="${s.businessHours||''}" placeholder="BUSINESS HOURS"><input name="shippingFee" value="${s.shippingFee??''}" placeholder="STANDARD SHIPPING FEE (PKR)"><input name="freeShippingAbove" value="${s.freeShippingAbove??''}" placeholder="FREE SHIPPING ABOVE (PKR)"><button>SAVE ALL STORE DETAILS</button></form>`;
  }
  $("#adminContent").innerHTML=html;
  $("#newProduct")?.addEventListener("click",()=>{
    $("#adminContent").innerHTML=`<form id="productForm" class="admin-form">
      <input name="name" required placeholder="PRODUCT NAME">
      <input name="price" required type="number" min="0" placeholder="PRICE PKR">
      <input name="compareAt" type="number" min="0" placeholder="COMPARE-AT PRICE (OPTIONAL)">
      <input name="category" required placeholder="CATEGORY (T-SHIRTS / HOODIES / ACCESSORIES)">
      <input name="stock" required type="number" min="0" placeholder="STOCK">
      <input name="sizes" placeholder="SIZES: S,M,L,XL">
      <input name="colors" placeholder="COLORS: BLACK,WHITE,RED">
      <input name="badge" placeholder="BADGE (NEW / SALE / LIMITED)">

      <label style="display:block;font-size:10px;letter-spacing:.08em;color:#999;margin-top:14px">FULFILLMENT</label>
      <select name="fulfillmentType" style="background:#0d0d0d;color:white;border:1px solid #333;padding:10px;width:100%">
        <option value="internal">INTERNAL</option>
        <option value="ceeprinto">CEEPRINTO</option>
      </select>

      <input name="ceeprintoProductId" placeholder="CEEPRINTO VARIANT ID (OPTIONAL)">

      <label style="display:block;font-size:10px;letter-spacing:.08em;color:#999;margin-top:14px">MAIN PRODUCT IMAGES</label>
      <p class="muted" style="font-size:10px">Add as many main images as you want. These are the default product gallery.</p>
      <button type="button" class="button" id="addMainImage">+ ADD MAIN IMAGE</button>
      <div id="mainImageFields"></div>

      <label style="display:block;font-size:10px;letter-spacing:.08em;color:#999;margin-top:22px">COLOR-SPECIFIC IMAGES</label>
      <p class="muted" style="font-size:10px">Add unlimited images. Each image gets its own color assignment. Example: BLACK → 3 images, WHITE → 4 images.</p>
      <button type="button" class="button" id="addColorImage">+ ADD COLOR IMAGE</button>
      <div id="colorImageFields"></div>

      <label style="display:block;font-size:10px;letter-spacing:.08em;color:#999;margin-top:22px">PRODUCT MUSIC (OPTIONAL)</label>
      <input id="musicUrl" placeholder="MUSIC URL (OPTIONAL)">
      <p class="muted" style="font-size:10px">Use a direct audio URL. File uploads are disabled because the store is using URL-based media without R2.</p>
      <label style="display:block;font-size:10px;letter-spacing:.08em;color:#999;margin-top:8px">MUSIC VOLUME: <span id="musicVolumeValue">35%</span></label>
      <input id="musicVolume" type="range" min="0" max="100" value="35" step="1">

      <textarea name="description" placeholder="DESCRIPTION"></textarea>
      <button>CREATE PRODUCT</button>
    </form>`;

    const mainFields=$("#mainImageFields");
    const colorFields=$("#colorImageFields");
    const musicUrl=$("#musicUrl");
    const musicVolume=$("#musicVolume");
    const musicVolumeValue=$("#musicVolumeValue");

    const colorsInput=$("#productForm [name='colors']");

    function getColors(){
      return (colorsInput.value||"BLACK")
        .split(",")
        .map(x=>x.trim())
        .filter(Boolean);
    }

    function refreshColorInputs(){
      colorFields.querySelectorAll(".media-color").forEach(input=>{
        input.placeholder="TYPE COLOR (BLACK / WHITE / RED / etc.)";
      });
    }

    function addMediaRow(container,type){
      const row=document.createElement("div");
      row.className="media-row";
      row.style="border:1px solid #333;padding:14px;margin:10px 0";
      row.innerHTML=`
        <div class="muted" style="font-size:9px;margin-bottom:8px">${type==="color"?"COLOR-SPECIFIC IMAGE":"MAIN PRODUCT IMAGE"}</div>
        <input type="file" class="media-file" accept="image/*">
        <input type="text" class="media-url" placeholder="OR IMAGE URL" style="margin-top:7px">
        ${type==="color"?`<select class="media-color" style="margin-top:7px;background:#0d0d0d;color:white;border:1px solid #333;padding:10px;width:100%">${colorOptions()}</select>`:""}
        <div class="media-preview" style="border:1px solid #222;padding:8px;margin-top:8px;min-height:60px;color:#666;font-size:10px">IMAGE PREVIEW</div>
        <button type="button" class="button remove-media" style="margin-top:8px">REMOVE</button>`;
      container.appendChild(row);

      const file=row.querySelector(".media-file");
      const url=row.querySelector(".media-url");
      const preview=row.querySelector(".media-preview");
      const show=src=>preview.innerHTML=`<img src="${src}" alt="" style="max-width:100%;max-height:160px;object-fit:contain;display:block">`;

      file.addEventListener("change",()=>{
        const f=file.files?.[0];
        if(!f)return;
        if(!f.type.startsWith("image/")){
          alert("Please choose an image.");
          file.value="";
          return;
        }
        if(f.size>10*1024*1024){
          alert("Each image must be 10 MB or smaller.");
          file.value="";
          return;
        }
        try{show(URL.createObjectURL(f));}catch(_){}
      });

      url.addEventListener("input",()=>{
        if(url.value.trim()&&!file.files?.length)show(url.value.trim());
      });

      row.querySelector(".remove-media").onclick=()=>row.remove();
    }

    colorsInput.addEventListener("input",refreshColorInputs);
    $("#addMainImage").addEventListener("click",()=>addMediaRow(mainFields,"main"));
    $("#addColorImage").addEventListener("click",()=>addMediaRow(colorFields,"color"));
    addMediaRow(mainFields,"main");
    addMediaRow(colorFields,"color");
    addMediaRow(colorFields,"color");
    musicVolume.addEventListener("input",()=>musicVolumeValue.textContent=`${musicVolume.value}%`);

    async function uploadMedia(file){
      const fd=new FormData();
      fd.append("file",file);
      const r=await fetch("/api/admin/media",{method:"POST",credentials:"same-origin",body:fd});
      let out={}; try{out=await r.json()}catch(_){}
      if(!r.ok)throw new Error(out.error||"Media upload failed");
      return out.url;
    }

    async function collect(container,type){
      const gallery=[];
      for(const row of container.querySelectorAll("div")){
        if(!row.querySelector(".media-file"))continue;
        const file=row.querySelector(".media-file")?.files?.[0];
        const url=row.querySelector(".media-url")?.value.trim();
        const color=type==="color"?(row.querySelector(".media-color")?.value||""):"";
        if(type==="color"&&!color)throw new Error("Select a color for every color-specific image.");
        let src=url;
        if(file)src=await uploadMedia(file);
        if(src)gallery.push({src,color,type});
      }
      return gallery;
    }

    $("#productForm").onsubmit=async e=>{
      e.preventDefault();
      const d=Object.fromEntries(new FormData(e.target));
      try{
        const gallery=[...(await collect(mainFields,"main")),...(await collect(colorFields,"color"))];
        const music=d.musicUrl||"";

        const image=(gallery.find(x=>x.type==="main")||gallery[0])?.src||"assets/no-signal-logo.png";

        await adminFetch("/api/admin/products",{
          method:"POST",
          headers:{"content-type":"application/json"},
          body:JSON.stringify({
            name:d.name,price:+d.price,compareAt:d.compareAt?+d.compareAt:null,
            category:d.category,stock:+d.stock,
            sizes:(d.sizes||"S,M,L,XL").split(",").map(x=>x.trim()).filter(Boolean),
            colors:(d.colors||"BLACK").split(",").map(x=>x.trim()).filter(Boolean),
            badge:d.badge||"NEW",description:d.description||"",image,gallery,
            fulfillmentType:d.fulfillmentType||"internal",
            ceeprintoProductId:d.ceeprintoProductId||null,
            musicUrl:music,musicVolume:Number(musicVolume.value)/100
          })
        });
        await adminTab("products");
        await loadProducts();
      }catch(err){alert(err.message)}
    };
  });
  $$('[data-del-product]').forEach(b=>b.onclick=async()=>{if(!confirm('Delete this product?'))return;try{await adminFetch('/api/admin/products',{method:'DELETE',headers:{'content-type':'application/json'},body:JSON.stringify({id:b.dataset.delProduct})});await adminTab('products');await loadProducts()}catch(err){alert(err.message)}});
  $("#settingsForm")?.addEventListener("submit",async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));d.shippingFee=+d.shippingFee;d.freeShippingAbove=+d.freeShippingAbove;try{const out=await adminFetch('/api/admin/settings',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(d)});Object.assign(NO_SIGNAL.settings,out.settings);alert('Store details saved.')}catch(err){alert(err.message)}});
 }catch(err){if(err.message==='SESSION_EXPIRED'){openAdmin();return}$("#adminContent").innerHTML=`<p class="muted">${err.message}</p>`}
}

async function openAdmin(){
 $("#adminModal").classList.add("open");
 try{await adminFetch('/api/admin/session');adminUnlocked=true;adminTab();return}catch(_){}
 $("#adminContent").innerHTML=`<div class="admin-lock"><p class="eyebrow">PRIVATE AREA</p><h2>ADMIN ACCESS.</h2><p class="muted">Store management is private. Enter your admin password to continue.</p><form id="adminLogin"><input id="adminPassword" type="password" autocomplete="current-password" placeholder="ADMIN PASSWORD" required><div id="adminError" class="admin-error"></div><button>UNLOCK ADMIN</button></form></div>`;
 $("#adminLogin").onsubmit=async e=>{e.preventDefault();const v=$("#adminPassword").value;try{await adminFetch('/api/admin/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({password:v})});adminUnlocked=true;await adminTab()}catch(err){$("#adminError").textContent=err.message==='SESSION_EXPIRED'?'Session expired.':'Incorrect password.'}};
}
function closeModal(id){$("#"+id+"Modal").classList.remove("open")}

document.addEventListener("click",e=>{
 const colorBtn=e.target.closest("[data-catalogue-color]");
 if(colorBtn){
   e.preventDefault();
   e.stopPropagation();
   const product=products.find(x=>x.id===colorBtn.dataset.productColor);
   if(product){
     const img=colorBtn.closest(".product-image")?.querySelector(".catalogue-product-image");
     const src=getColorImage(product,colorBtn.dataset.catalogueColor);
     if(img) img.src=src;
     colorBtn.closest(".catalogue-colors")?.querySelectorAll("[data-catalogue-color]").forEach(x=>x.classList.remove("selected"));
     colorBtn.classList.add("selected");
   }
   return;
 }
 const p=e.target.closest("[data-product]"); if(p && !e.target.closest("[data-wish]")) playProductTransition(p.dataset.product);
 if(e.target.closest("[data-wish]")) toggleWish(e.target.closest("[data-wish]").dataset.wish);
 if(e.target.closest("[data-open='bag']"))cartView();
 if(e.target.closest("[data-open='search']")){$("#searchModal").classList.add("open");setTimeout(()=>$("#searchInput").focus(),50)}
 if(e.target.closest("[data-open='admin']"))openAdmin();
 if(e.target.id==="closeDrawer"||e.target.classList.contains("drawer-backdrop"))closeDrawer();
 if(e.target.closest("[data-close='search']"))closeModal("search");
 if(e.target.closest("[data-close='admin']"))closeModal("admin");
 if(e.target.id==="addToBag")add(e.target.dataset.id,e.target.dataset.selectedSize,e.target.dataset.selectedColor);
 if(e.target.id==="checkout")checkout();
 if(e.target.closest("[data-minus]")){const i=cart.find(x=>x.id===e.target.closest("[data-minus]").dataset.minus);if(i){i.qty--;if(i.qty<=0)cart=cart.filter(x=>x.id!==i.id);save();cartView();updateCounts()}}
 if(e.target.closest("[data-plus]")){const i=cart.find(x=>x.id===e.target.closest("[data-plus]").dataset.plus);if(i){i.qty++;save();cartView();updateCounts()}}
 if(e.target.closest("[data-remove]")){cart=cart.filter(x=>x.id!==e.target.closest("[data-remove]").dataset.remove);save();cartView();updateCounts()}
 if(e.target.closest("[data-size]")){$$("[data-size]").forEach(x=>x.classList.remove("selected"));e.target.closest("[data-size]").classList.add("selected")}
 if(e.target.closest(".filter")){$$(".filter").forEach(x=>x.classList.remove("active"));e.target.closest(".filter").classList.add("active");currentCategory=e.target.closest(".filter").dataset.cat;renderProducts()}
 if(e.target.closest("[data-admin-tab]")){$$(".admin-tabs button").forEach(x=>x.classList.remove("active"));e.target.closest("[data-admin-tab]").classList.add("active");adminTab(e.target.closest("[data-admin-tab]").dataset.adminTab)}
});
$("#searchInput").addEventListener("input",()=>{renderProducts();const q=$("#searchInput").value.toLowerCase();$("#searchResults").innerHTML=products.filter(p=>p.name.toLowerCase().includes(q)).map(p=>`<div class="search-result"><span>${p.name}</span><span>${money(p.price)}</span></div>`).join("")});
$$("[data-open='wishlist']").forEach(b=>b.addEventListener("click",()=>{openDrawer(`<p class="eyebrow">SAVED SIGNALS</p><h2>WISHLIST.</h2>${products.filter(p=>wishlist.includes(p.id)).map(p=>`<div class="cart-line"><img src="${p.image}"><div><b>${p.name}</b><small style="display:block;color:#666">${money(p.price)}</small></div><button class="button" data-product="${p.id}">VIEW</button></div>`).join("")||'<p class="muted">Nothing saved yet.</p>'}`)}));

$("#enter").addEventListener("click",()=>{
 try{const C=window.AudioContext||window.webkitAudioContext;const c=new C(),o=c.createOscillator(),g=c.createGain();o.type="sawtooth";o.frequency.setValueAtTime(90,c.currentTime);o.frequency.exponentialRampToValueAtTime(35,c.currentTime+.35);g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(.25,c.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.42);o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+.45)}catch(_){}
 $("#intro").classList.add("hide");
});
async function loadProducts(){try{const r=await fetch('/api/products');if(r.ok){const data=await r.json();if(Array.isArray(data)&&data.length)products=data;renderProducts()}}catch(_){} }
async function loadSettings(){try{const r=await fetch('/api/settings');if(r.ok)Object.assign(NO_SIGNAL.settings,await r.json())}catch(_){} }
loadSettings().then(loadProducts);
renderProducts();updateCounts();
