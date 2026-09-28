
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => `${NO_SIGNAL.settings.currency} ${Number(n).toLocaleString("en-PK")}`;

let products = JSON.parse(localStorage.getItem("ns_products") || "null") || NO_SIGNAL.products;
let cart = JSON.parse(localStorage.getItem("ns_cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("ns_wishlist") || "[]");
let orders = JSON.parse(localStorage.getItem("ns_orders") || "[]");
const savedSettings = JSON.parse(localStorage.getItem("ns_settings") || "null");
if (savedSettings) Object.assign(NO_SIGNAL.settings, savedSettings);
let currentCategory = "ALL";
let adminUnlocked = sessionStorage.getItem("ns_admin_unlocked") === "1";
const ADMIN_PIN = "NOSIGNAL"; // Demo gate only. Real launch must use server authentication.

function playProductTransition(id){
  const overlay=$("#productTransition");
  overlay.classList.remove("play"); void overlay.offsetWidth; overlay.classList.add("play");
  setTimeout(()=>{ productDetail(id); }, 1050);
  setTimeout(()=>overlay.classList.remove("play"), 1900);
}


function save(){localStorage.setItem("ns_products",JSON.stringify(products));localStorage.setItem("ns_cart",JSON.stringify(cart));localStorage.setItem("ns_wishlist",JSON.stringify(wishlist));localStorage.setItem("ns_orders",JSON.stringify(orders));localStorage.setItem("ns_settings",JSON.stringify(NO_SIGNAL.settings));}
function countBag(){return cart.reduce((a,x)=>a+x.qty,0)}
function updateCounts(){$("#bagCount").textContent=countBag();$("#wishCount").textContent=wishlist.length}

function renderProducts(){
  const q=($("#searchInput")?.value||"").toLowerCase();
  const list=products.filter(p=>(currentCategory==="ALL"||p.category===currentCategory)&&(!q||`${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q)));
  $("#productGrid").innerHTML=list.map(p=>`
    <article class="product">
      <div class="product-image" data-product="${p.id}">
        <span class="product-badge">${p.badge||"CORE"}</span>
        <button class="heart ${wishlist.includes(p.id)?"on":""}" data-wish="${p.id}">${wishlist.includes(p.id)?"♥":"♡"}</button>
        <img src="${p.image}" alt="${p.name}">
      </div>
      <div class="product-info" data-product="${p.id}">
        <div class="product-name">${p.name}</div><div class="product-cat">${p.category}</div>
        <div class="product-price">${money(p.price)} ${p.compareAt?`<span class="old">${money(p.compareAt)}</span>`:""}</div>
      </div>
    </article>`).join("");
  updateCounts();
}

function openDrawer(html){$("#drawerContent").innerHTML=html;$("#drawer").classList.add("open");$("#drawer").setAttribute("aria-hidden","false")}
function closeDrawer(){$("#drawer").classList.remove("open");$("#drawer").setAttribute("aria-hidden","true")}

function productDetail(id){
 const p=products.find(x=>x.id===id); if(!p)return;
 openDrawer(`<p class="eyebrow">${p.category} / ${p.id}</p><h2>${p.name}</h2><div class="drawer-img"><img src="${p.image}" alt="${p.name}"></div><div class="drawer-price">${money(p.price)}</div><p class="muted">${p.description}</p><p class="eyebrow">SELECT SIZE</p><div class="size-row">${p.sizes.map((s,i)=>`<button class="${i===0?"selected":""}" data-size="${s}">${s}</button>`).join("")}</div><button class="button button-lime full" id="addToBag" data-id="${p.id}">ADD TO BAG <span>+</span></button>`);
}
function cartView(){
 let total=cart.reduce((a,x)=>a+x.price*x.qty,0), shipping=total>=NO_SIGNAL.settings.freeShippingAbove||!cart.length?0:NO_SIGNAL.settings.shippingFee;
 openDrawer(`<p class="eyebrow">YOUR BAG</p><h2>${cart.length?countBag()+" ITEMS":"EMPTY SIGNAL"}</h2><div>${cart.map(x=>`<div class="cart-line"><img src="${x.image}" alt=""><div><b>${x.name}</b><small style="display:block;color:#666;margin-top:5px">${money(x.price)}</small><div class="qty"><button data-minus="${x.id}">−</button><span>${x.qty}</span><button data-plus="${x.id}">+</button></div></div><button class="close" style="position:static;font-size:20px" data-remove="${x.id}">×</button></div>`).join("")}</div>${cart.length?`<div style="padding-top:25px"><p class="muted">SUBTOTAL <span style="float:right;color:white">${money(total)}</span></p><p class="muted">SHIPPING <span style="float:right;color:white">${shipping?money(shipping):"FREE"}</span></p><h3>TOTAL <span style="float:right;color:var(--lime)">${money(total+shipping)}</span></h3><button class="button button-lime full" id="checkout">CHECKOUT <span>→</span></button></div>`:""}`);
}
function toggleWish(id){wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];save();renderProducts()}
function add(id){const p=products.find(x=>x.id===id);if(!p)return;const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({...p,qty:1});save();updateCounts();cartView()}

function checkout(){
 if(!cart.length)return;
 const total=cart.reduce((a,x)=>a+x.price*x.qty,0);
 openDrawer(`<p class="eyebrow">CHECKOUT / ${money(total)}</p><h2>YOUR DETAILS.</h2><form id="checkoutForm" class="admin-form"><input required placeholder="FULL NAME"><input required placeholder="PHONE"><input required type="email" placeholder="EMAIL"><input required placeholder="CITY"><textarea required placeholder="COMPLETE DELIVERY ADDRESS"></textarea><input placeholder="POSTAL CODE"><select id="pay" style="background:#0d0d0d;border:1px solid #333;color:white;padding:13px;font:10px Space Mono"><option>Cash on Delivery</option><option>Online Payment</option></select><button>PLACE ORDER</button></form>`);
 $("#checkoutForm").onsubmit=e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target));orders.push({id:"NS-"+Math.floor(1000+Math.random()*9000),date:new Date().toISOString(),items:cart,total,payment:data.pay,status:"Order Received",customer:data});cart=[];save();updateCounts();openDrawer(`<p class="eyebrow">ORDER CONFIRMED</p><h2>THANK YOU.</h2><p class="muted">Your NO SIGNAL order has been received.</p><div style="border:1px solid var(--lime);padding:20px;margin-top:30px">ORDER NUMBER<br><strong style="font-size:24px;color:var(--lime)">${orders.at(-1).id}</strong></div>`)}
}

function adminTab(tab="products"){
 let html="";
 if(tab==="products"){
   html=`<div class="admin-row"><b>ADD NEW PRODUCT</b><button class="button button-lime" id="newProduct">+ ADD</button></div>${products.map(p=>`<div class="admin-row"><div><b>${p.name}</b><small>${p.category} · ${money(p.price)}</small></div><span>${p.stock} IN STOCK</span><button data-del-product="${p.id}" style="background:none;border:0;color:#ff3b30">DELETE</button></div>`).join("")}`;
 } else if(tab==="orders"){
   html=orders.length?orders.map(o=>`<div class="admin-row"><div><b>${o.id}</b><small>${o.customer?.FULL_NAME||"Customer"} · ${o.payment}</small></div><span>${money(o.total)}</span><span>${o.status}</span></div>`).join(""):`<p class="muted">No orders yet. Test checkout to create one.</p>`;
 } else {
   const s=NO_SIGNAL.settings;
   html=`<p class="muted" style="margin-bottom:22px">Edit your store details here. No code changes are required.</p>
   <form id="settingsForm" class="admin-form">
   <input name="brand" value="${s.brand||""}" placeholder="BRAND NAME">
   <input name="subbrand" value="${s.subbrand||""}" placeholder="SUB-BRAND">
   <input name="tagline" value="${s.tagline||""}" placeholder="TAGLINE">
   <input name="email" value="${s.email||""}" placeholder="EMAIL">
   <input name="phone" value="${s.phone||""}" placeholder="PHONE">
   <input name="whatsapp" value="${s.whatsapp||""}" placeholder="WHATSAPP">
   <input name="instagram" value="${s.instagram||""}" placeholder="INSTAGRAM URL / @HANDLE">
   <input name="tiktok" value="${s.tiktok||""}" placeholder="TIKTOK URL / @HANDLE">
   <input name="facebook" value="${s.facebook||""}" placeholder="FACEBOOK URL">
   <input name="youtube" value="${s.youtube||""}" placeholder="YOUTUBE URL">
   <input name="facebook" value="${s.facebook||""}" placeholder="FACEBOOK">
   <input name="youtube" value="${s.youtube||""}" placeholder="YOUTUBE">
   <input name="address" value="${s.address||""}" placeholder="BUSINESS / RETURN ADDRESS">
   <input name="businessHours" value="${s.businessHours||""}" placeholder="BUSINESS HOURS">
   <input name="shippingFee" value="${s.shippingFee??""}" placeholder="STANDARD SHIPPING FEE (PKR)">
   <input name="freeShippingAbove" value="${s.freeShippingAbove??""}" placeholder="FREE SHIPPING ABOVE (PKR)">
   <button>SAVE ALL STORE DETAILS</button></form>`;
 }
 $("#adminContent").innerHTML=html;
 $("#newProduct")?.addEventListener("click",()=>{ $("#adminContent").innerHTML=`<form id="productForm" class="admin-form"><input name="name" required placeholder="PRODUCT NAME"><input name="price" required type="number" placeholder="PRICE PKR"><input name="category" required placeholder="CATEGORY (T-SHIRTS / HOODIES / ACCESSORIES)"><input name="stock" required type="number" placeholder="STOCK"><input name="sizes" placeholder="SIZES: S,M,L,XL"><input name="badge" placeholder="BADGE"><textarea name="description" placeholder="DESCRIPTION"></textarea><button>CREATE PRODUCT</button></form>`;$("#productForm").onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));products.push({id:"NS-"+String(products.length+1).padStart(3,"0"),name:d.name,category:d.category.toUpperCase(),price:+d.price,stock:+d.stock,badge:d.badge||"NEW",sizes:(d.sizes||"S,M,L,XL").split(",").map(x=>x.trim()),colors:["BLACK"],description:d.description||"",image:"assets/no-signal-logo.png"});save();adminTab();renderProducts()}})
 $$("[data-del-product]").forEach(b=>b.onclick=()=>{products=products.filter(p=>p.id!==b.dataset.delProduct);save();adminTab();renderProducts()});
 $("#settingsForm")?.addEventListener("submit",e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));Object.assign(NO_SIGNAL.settings,d,{shippingFee:+d.shippingFee,freeShippingAbove:+d.freeShippingAbove});save();alert("Store details saved. No code changes are required.")});
}

function openAdmin(){
  $("#adminModal").classList.add("open");
  if(adminUnlocked){ adminTab(); return; }
  $("#adminContent").innerHTML=`<div class="admin-lock"><p class="eyebrow">PRIVATE AREA</p><h2>ADMIN ACCESS.</h2><p class="muted">Store management is private. Enter your admin password to continue.</p><form id="adminLogin"><input id="adminPassword" type="password" autocomplete="current-password" placeholder="ADMIN PASSWORD" required><div id="adminError" class="admin-error"></div><button>UNLOCK ADMIN</button></form></div>`;
  $("#adminLogin").onsubmit=e=>{e.preventDefault();const v=$("#adminPassword").value;if(v===ADMIN_PIN){adminUnlocked=true;sessionStorage.setItem("ns_admin_unlocked","1");adminTab()}else{$("#adminError").textContent="Incorrect password."}};
}
function closeModal(id){$("#"+id+"Modal").classList.remove("open")}

document.addEventListener("click",e=>{
 const p=e.target.closest("[data-product]"); if(p && !e.target.closest("[data-wish]")) playProductTransition(p.dataset.product);
 if(e.target.closest("[data-wish]")) toggleWish(e.target.closest("[data-wish]").dataset.wish);
 if(e.target.closest("[data-open='bag']"))cartView();
 if(e.target.closest("[data-open='search']")){$("#searchModal").classList.add("open");setTimeout(()=>$("#searchInput").focus(),50)}
 if(e.target.closest("[data-open='admin']"))openAdmin();
 if(e.target.id==="closeDrawer"||e.target.classList.contains("drawer-backdrop"))closeDrawer();
 if(e.target.closest("[data-close='search']"))closeModal("search");
 if(e.target.closest("[data-close='admin']"))closeModal("admin");
 if(e.target.id==="addToBag")add(e.target.dataset.id);
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
renderProducts();updateCounts();
