const v="",A="https://generativelanguage.googleapis.com/v1beta/models",$=["gemini-1.5-flash","gemini-1.5-flash-8b","gemini-2.0-flash-exp"],b=["llama-3.1-8b-instant","llama3-70b-8192","mixtral-8x7b-32768"];function E(e){return`${A}/${e}:generateContent?key=${v}`}async function S(e,r){var n,i,s,o,c,p;const t=await fetch(E(e),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!t.ok){const m=await t.json().catch(()=>({}));throw new Error(`Gemini ${e} ${t.status}: ${((n=m.error)==null?void 0:n.message)||"error"}`)}return((p=(c=(o=(s=(i=(await t.json()).candidates)==null?void 0:i[0])==null?void 0:s.content)==null?void 0:o.parts)==null?void 0:c[0])==null?void 0:p.text)||""}async function G(e,r,t){throw new Error("Groq key not set")}async function M(e,r,t){throw new Error("Groq key not set")}async function k(e,r){let t;for(const a of $)try{return await S(a,{systemInstruction:{parts:[{text:e}]},contents:[{role:"user",parts:[{text:r}]}]})}catch(n){console.warn(`[AI] Gemini ${a} failed, trying next...`),t=n}for(const a of b)try{return await G(a,e,r)}catch(n){console.warn(`[AI] Groq ${a} failed, trying next...`),t=n}throw t||new Error("All AI providers failed")}async function O(e,r){const t=`You are StudyAI, an encouraging, expert academic tutor. 
The student's pending topics: ${r}
Keep responses concise (3–5 sentences), practical, and motivating.
Use bullet points when listing. End with one actionable tip.
Format: plain text, no markdown headers.`,a=e.findIndex(o=>o.role==="user"),n=a>=0?e.slice(a):e,i=n.map(o=>({role:o.role==="ai"?"model":"user",parts:[{text:o.text}]}));let s;for(const o of $)try{return await S(o,{systemInstruction:{parts:[{text:t}]},contents:i})}catch(c){console.warn(`[AI] Gemini ${o} failed, trying next...`),s=c}for(const o of b)try{return await M(o,t,n)}catch(c){console.warn(`[AI] Groq ${o} failed, trying next...`),s=c}throw s||new Error("All AI providers failed")}async function T(e,r,t){var s,o,c,p,m,u,h,y,g,f,w,x,I;const a=e.map(d=>`${d.name}: ${d.topics.filter(l=>!l.done).map(l=>`${l.name}(${l.hours}h,${l.priority})`).join(", ")}`).join(`
`),n="You are an expert study planner. Return ONLY valid JSON. No markdown.",i=`Create a study plan:
Subjects & pending topics: ${a}
Days until exam: ${r}
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
Generate ${Math.min(Math.ceil(r/7),4)} weeks.`;try{const l=(await k(n,i)).replace(/```json?|```/g,"").trim();return JSON.parse(l)}catch(d){return console.error("[AI] Study Plan all providers failed:",d),{weeks:[{week:1,theme:"Core Concepts Revision",days:[{day:"Mon",sessions:[{subject:((s=e[0])==null?void 0:s.name)||"Core Subject",topic:((c=(o=e[0])==null?void 0:o.topics[0])==null?void 0:c.name)||"Topic 1",hours:2,color:((p=e[0])==null?void 0:p.color)||"accent"}]},{day:"Tue",sessions:[{subject:((m=e[0])==null?void 0:m.name)||"Core Subject",topic:((h=(u=e[0])==null?void 0:u.topics[1])==null?void 0:h.name)||"Topic 2",hours:2,color:((y=e[0])==null?void 0:y.color)||"accent"}]},{day:"Wed",sessions:[{subject:((g=e[1])==null?void 0:g.name)||"Second Subject",topic:((w=(f=e[1])==null?void 0:f.topics[0])==null?void 0:w.name)||"Topic 1",hours:2,color:((x=e[1])==null?void 0:x.color)||"teal"}]},{day:"Thu",sessions:[{subject:((I=e[1])==null?void 0:I.name)||"Second Subject",topic:"Review Pending",hours:1,color:"amber"}]},{day:"Fri",sessions:[{subject:"Revision",topic:"Weekly Review",hours:2,color:"green"}]}]}],insights:["Focus on highest priority items first.","Take short breaks every hour.","Review mistakes actively."],priorityOrder:["High Priority Topics","Medium Priority"]}}}async function j(e){const r=e.map(n=>({name:n.name,progress:Math.round(n.topics.filter(i=>i.done).length/n.topics.length*100),pending:n.topics.filter(i=>!i.done).map(i=>i.name)})),t="You are a learning analytics expert. Be concise and actionable.",a=`Analyze these subject stats and identify weak areas:
${JSON.stringify(r,null,2)}

Give 3–4 specific, actionable recommendations. Each on a new line starting with •`;return k(t,a)}export{j as a,O as c,T as g};
