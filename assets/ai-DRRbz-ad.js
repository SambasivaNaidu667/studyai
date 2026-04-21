const T=atob("QUl6YVN5RFJxSkgxbEk3SGJSWTVrRXM1R21fVEpKWmJ0anVjTVVF"),d=atob("Z3NrX2hpc1huTjBlbG05T1NEVm1BbFptV0dkcm8zRlhVb0xTUU1CQVVveE5pVmxqek9wdmVJMmY="),j="https://generativelanguage.googleapis.com/v1beta/models",b="https://api.groq.com/openai/v1/chat/completions",G="llama3-70b-8192",x=["gemini-2.5-flash","gemini-2.0-flash"];function A(e){return`${j}/${e}:generateContent?key=${T}`}async function I(e,a){var r,n,o,i,c,l;const t=await fetch(A(e),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!t.ok){const u=await t.json().catch(()=>({}));throw new Error(`Gemini ${e} ${t.status}: ${((r=u.error)==null?void 0:r.message)||"error"}`)}return((l=(c=(i=(o=(n=(await t.json()).candidates)==null?void 0:n[0])==null?void 0:o.content)==null?void 0:i.parts)==null?void 0:c[0])==null?void 0:l.text)||""}async function O(e,a){var r,n,o,i;if(!d)throw new Error("Groq API key not configured");const t=await fetch(b,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`},body:JSON.stringify({model:G,messages:[{role:"system",content:e},{role:"user",content:a}],temperature:.7,max_tokens:512})});if(!t.ok){const c=await t.json().catch(()=>({}));throw new Error(`Groq ${t.status}: ${((r=c.error)==null?void 0:r.message)||"error"}`)}return((i=(o=(n=(await t.json()).choices)==null?void 0:n[0])==null?void 0:o.message)==null?void 0:i.content)||""}async function v(e,a){var n,o,i,c;if(!d||d==="paste_your_full_groq_key_here")throw new Error("Groq API key not configured");const t=[{role:"system",content:e},...a.map(l=>({role:l.role==="ai"?"assistant":"user",content:l.text}))],s=await fetch(b,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`},body:JSON.stringify({model:G,messages:t,temperature:.7,max_tokens:512})});if(!s.ok){const l=await s.json().catch(()=>({}));throw new Error(`Groq ${s.status}: ${((n=l.error)==null?void 0:n.message)||"error"}`)}return((c=(i=(o=(await s.json()).choices)==null?void 0:o[0])==null?void 0:i.message)==null?void 0:c.content)||""}async function E(e,a){for(const t of x)try{return await I(t,{systemInstruction:{parts:[{text:e}]},contents:[{role:"user",parts:[{text:a}]}]})}catch(s){console.warn(`[AI] ${t} failed:`,s.message)}return console.warn("[AI] All Gemini models failed, trying Groq..."),O(e,a)}async function M(e,a){const t=`You are StudyAI, an encouraging, expert academic tutor. 
The student's pending topics: ${a}
Keep responses concise (3–5 sentences), practical, and motivating.
Use bullet points when listing. End with one actionable tip.
Format: plain text, no markdown headers.`,s=e.findIndex(o=>o.role==="user"),r=s>=0?e.slice(s):e,n=r.map(o=>({role:o.role==="ai"?"model":"user",parts:[{text:o.text}]}));for(const o of x)try{return await I(o,{systemInstruction:{parts:[{text:t}]},contents:n})}catch(i){console.warn(`[AI] ${o} failed:`,i.message)}return console.warn("[AI] All Gemini models failed, trying Groq..."),v(t,r)}async function N(e,a,t){var o,i,c,l,u,h,y,g,f,w,k,S,$;const s=e.map(m=>`${m.name}: ${m.topics.filter(p=>!p.done).map(p=>`${p.name}(${p.hours}h,${p.priority})`).join(", ")}`).join(`
`),r="You are an expert study planner. Return ONLY valid JSON. No markdown.",n=`Create a study plan:
Subjects & pending topics: ${s}
Days until exam: ${a}
Daily hours available: ${t}

Return JSON with:
{
  "weeks": [
    {
      "week": 1,
      "theme": "theme name",
      "days": [
        { "day": "Mon", "sessions": [{"subject":"X","topic":"Y","hours":2,"color":"accent"}] }
      ]
    }
  ],
  "insights": ["insight1", "insight2", "insight3"],
  "priorityOrder": ["topic1","topic2","topic3"]
}
Colors must be one of: accent, teal, amber, coral, green.
Generate ${Math.min(Math.ceil(a/7),4)} weeks.`;try{const p=(await E(r,n)).replace(/```json?|```/g,"").trim();return JSON.parse(p)}catch(m){return console.error("[AI] Study Plan all providers failed:",m),{weeks:[{week:1,theme:"Core Concepts Revision",days:[{day:"Mon",sessions:[{subject:((o=e[0])==null?void 0:o.name)||"Core Subject",topic:((c=(i=e[0])==null?void 0:i.topics[0])==null?void 0:c.name)||"Topic 1",hours:2,color:((l=e[0])==null?void 0:l.color)||"accent"}]},{day:"Tue",sessions:[{subject:((u=e[0])==null?void 0:u.name)||"Core Subject",topic:((y=(h=e[0])==null?void 0:h.topics[1])==null?void 0:y.name)||"Topic 2",hours:2,color:((g=e[0])==null?void 0:g.color)||"accent"}]},{day:"Wed",sessions:[{subject:((f=e[1])==null?void 0:f.name)||"Second Subject",topic:((k=(w=e[1])==null?void 0:w.topics[0])==null?void 0:k.name)||"Topic 1",hours:2,color:((S=e[1])==null?void 0:S.color)||"teal"}]},{day:"Thu",sessions:[{subject:(($=e[1])==null?void 0:$.name)||"Second Subject",topic:"Review Pending",hours:1,color:"amber"}]},{day:"Fri",sessions:[{subject:"Revision",topic:"Weekly Review",hours:2,color:"green"}]}]}],insights:["Focus on highest priority items first.","Take short breaks every hour.","Review mistakes actively."],priorityOrder:["High Priority Topics","Medium Priority"]}}}async function R(e){const a=e.map(r=>({name:r.name,progress:Math.round(r.topics.filter(n=>n.done).length/r.topics.length*100),pending:r.topics.filter(n=>!n.done).map(n=>n.name)})),t="You are a learning analytics expert. Be concise and actionable.",s=`Analyze these subject stats and identify weak areas:
${JSON.stringify(a,null,2)}

Give 3–4 specific, actionable recommendations. Each on a new line starting with •`;return E(t,s)}export{R as a,M as c,N as g};
