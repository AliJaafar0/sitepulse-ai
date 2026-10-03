import type { Finding } from './scan';
export async function generateInsights(input:{score:number;findings:Finding[];url:string}){
 const key=process.env.OPENAI_API_KEY;
 if(!key)return {summary:`Your site scored ${input.score}/100. The biggest gains should come from addressing the highest-severity findings first.`,actions:input.findings.slice(0,5).map(f=>`${f.title}: ${f.detail}`),source:'built-in'};
 try{const r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',temperature:.2,messages:[{role:'system',content:'You are a website audit assistant. Return strict JSON with summary:string and actions:string[]. Be concise, factual and actionable.'},{role:'user',content:JSON.stringify(input)}]})}); if(!r.ok)throw new Error('AI request failed'); const data=await r.json(); const content=data.choices?.[0]?.message?.content||'{}'; const parsed=JSON.parse(content.replace(/^```json\s*|\s*```$/g,'')); return {...parsed,source:'openai'};
 }catch{return {summary:`AI analysis is temporarily unavailable. Your scan scored ${input.score}/100.`,actions:input.findings.slice(0,5).map(f=>f.title),source:'fallback'}}
}
