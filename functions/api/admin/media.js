import { json, requireAdmin } from "./_auth.js";

export async function onRequestPost({ request, env }) {
  const auth=await requireAdmin(request,env);
  if(!auth.ok)return auth.response;
  if(!env.MEDIA)return json({error:"Media storage is not connected yet. Bind the R2 bucket as MEDIA and redeploy."},503);

  const form=await request.formData();
  const file=form.get("file");
  if(!(file instanceof File))return json({error:"Missing file."},400);

  const isImage=file.type.startsWith("image/");
  const isAudio=file.type.startsWith("audio/");
  if(!isImage&&!isAudio)return json({error:"Only image and audio files are allowed."},400);

  const max=isAudio?5*1024*1024:10*1024*1024;
  if(file.size>max)return json({error:`${isAudio?"Music":"Image"} file is too large.`},400);

  const ext=(file.name.split(".").pop()||"bin").toLowerCase().replace(/[^a-z0-9]/g,"");
  const key=`products/${crypto.randomUUID()}.${ext||"bin"}`;
  await env.MEDIA.put(key,file.stream(),{httpMetadata:{contentType:file.type}});
  return json({ok:true,key,url:`/media/${key}`},201);
}
