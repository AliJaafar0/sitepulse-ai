import { URL } from 'node:url';
import dns from 'node:dns/promises';
import net from 'node:net';
import { z } from 'zod';
const inputSchema=z.string().url().max(2048);
function privateIp(ip:string){if(net.isIP(ip)===4){const [a,b]=ip.split('.').map(Number);return a===10||a===127||a===0||(a===192&&b===168)||(a===172&&b>=16&&b<=31)} return ip==='::1'||ip.startsWith('fc')||ip.startsWith('fd')}
async function safeUrl(raw:string){const parsed=new URL(inputSchema.parse(raw)); if(!['http:','https:'].includes(parsed.protocol)) throw new Error('Only HTTP and HTTPS URLs are supported.'); if(parsed.username||parsed.password)throw new Error('Credentials in URLs are not allowed.'); const host=parsed.hostname.toLowerCase(); if(['localhost','localhost.localdomain'].includes(host)||host.endsWith('.local'))throw new Error('Local addresses are not allowed.'); const addresses=await dns.lookup(host,{all:true}); if(addresses.some(x=>privateIp(x.address)))throw new Error('Private network targets are not allowed.'); return parsed}
const score=(ok:number,total:number)=>Math.round(ok/total*100);
export type Finding={category:string;severity:'high'|'medium'|'low';title:string;detail:string};
export async function scanWebsite(raw:string){
 const target=await safeUrl(raw); const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),12000); const started=Date.now();
 let res:Response; try{res=await fetch(target,{redirect:'follow',signal:controller.signal,headers:{'user-agent':'SitePulseAI/1.0 website-health-monitor'}})}finally{clearTimeout(timer)}
 const responseMs=Date.now()-started; const html=await res.text(); const limited=html.slice(0,2_000_000); const title=limited.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g,' ').trim()||''; const description=limited.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i)?.[1]||limited.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i)?.[1]||'';
 const headings=(limited.match(/<h[1-6][^>]*>/gi)||[]).length; const images=(limited.match(/<img\b[^>]*>/gi)||[]); const missingAlt=images.filter(x=>!/\balt\s*=/.test(x)).length; const links=(limited.match(/<a\b[^>]*href=["'][^"']+["']/gi)||[]).length;
 const findings:Finding[]=[];
 const seoChecks=[!!title,title.length<=65,!!description,description.length<=170,headings>0]; const secChecks=[target.protocol==='https:',!!res.headers.get('content-security-policy'),!!res.headers.get('x-content-type-options'),!!res.headers.get('strict-transport-security')]; const accChecks=[images.length===0||missingAlt===0,headings>0,!!limited.match(/<html[^>]+lang=/i)]; const perfChecks=[responseMs<1000,responseMs<2000,limited.length<1_500_000];
 if(!title)findings.push({category:'SEO',severity:'high',title:'Missing page title',detail:'Add a descriptive <title> so search engines and users can identify the page.'}); else if(title.length>65)findings.push({category:'SEO',severity:'low',title:'Title is long',detail:`The title is ${title.length} characters. Keep important wording near the beginning.`});
 if(!description)findings.push({category:'SEO',severity:'medium',title:'Missing meta description',detail:'Add a concise description for search snippets and link previews.'});
 if(missingAlt)findings.push({category:'Accessibility',severity:'medium',title:`${missingAlt} image(s) missing alt text`,detail:'Provide meaningful alternative text for informative images.'});
 if(!limited.match(/<html[^>]+lang=/i))findings.push({category:'Accessibility',severity:'low',title:'Document language is not declared',detail:'Set the HTML lang attribute to improve assistive technology support.'});
 if(target.protocol!=='https:')findings.push({category:'Security',severity:'high',title:'HTTPS is not enabled',detail:'Serve the website over HTTPS to protect traffic in transit.'});
 if(!res.headers.get('content-security-policy'))findings.push({category:'Security',severity:'medium',title:'CSP header not detected',detail:'Consider a Content-Security-Policy to reduce script injection risk.'});
 if(!res.headers.get('x-content-type-options'))findings.push({category:'Security',severity:'low',title:'X-Content-Type-Options missing',detail:'Add nosniff to reduce MIME-type confusion.'});
 if(responseMs>2000)findings.push({category:'Performance',severity:'medium',title:'Slow initial response',detail:`The server responded in ${responseMs} ms. Review hosting, caching, and server work.`});
 const performance=score(perfChecks.filter(Boolean).length,perfChecks.length); const seo=score(seoChecks.filter(Boolean).length,seoChecks.length); const accessibility=score(accChecks.filter(Boolean).length,accChecks.length); const security=score(secChecks.filter(Boolean).length,secChecks.length); const overall=Math.round((performance+seo+accessibility+security)/4);
 return {score:overall,performance,seo,accessibility,security,responseMs,pageTitle:title,description,findings,metrics:{status:res.status,statusText:res.statusText,contentBytes:Buffer.byteLength(limited),links,images:images.length,headings}};
}
