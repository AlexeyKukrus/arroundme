class p extends Error{status;constructor(t,r){super(r),this.name="HttpError",this.status=t}}const i=async(s,t,r)=>{const a={method:s,headers:{}};r instanceof FormData&&(a.body=r);const o=await fetch(t,a);if(!o.ok){let n=`Ошибка ответа сервера: ${o.status}`;try{const e=await o.clone().json();if(Array.isArray(e)){const h=e.map((c,f)=>`${f+1}. ${c.name}: ${c.message}`).join(`
`);n+=`
${h}
`}else e?.message&&(n+=` – ${e.name}: ${e.message}
`)}catch{}throw new p(o.status,n)}return o},w=async()=>{try{return await(await i("GET","/api/events")).json()}catch(s){throw console.error(s),s}},m=async s=>{const t=await i("GET",`/api/events/${s}`);if(!t.ok)throw new Error(`Failed to fetch event: ${t.status}`);return await t.json()};export{w as a,m as g};
