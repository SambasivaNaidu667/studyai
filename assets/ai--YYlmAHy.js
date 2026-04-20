const I="AIzaSyBSbbMlRI-ivJkcwFkXfHtr-S957O4dU-o",v="gemini-2.0-flash",k=`https://generativelanguage.googleapis.com/v1beta/models/${v}:generateContent?key=${I}`;async function $(e,a){var t,n,s,r,i,c;const o=await fetch(k,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({systemInstruction:{parts:[{text:e}]},contents:[{role:"user",parts:[{text:a}]}]})});if(!o.ok){const p=await o.json().catch(()=>({}));throw new Error(`API error: ${o.status} ${((t=p.error)==null?void 0:t.message)||""}`)}return((c=(i=(r=(s=(n=(await o.json()).candidates)==null?void 0:n[0])==null?void 0:s.content)==null?void 0:r.parts)==null?void 0:i[0])==null?void 0:c.text)||""}async function x(e,a){var s,r,i,c,p,h;const o=`You are StudyAI, an encouraging, expert academic tutor. 
The student's pending topics: ${a}
Keep responses concise (3–5 sentences), practical, and motivating.
Use bullet points when listing. End with one actionable tip.
Format: plain text, no markdown headers.`,u=e.map(l=>({role:l.role==="ai"?"model":"user",parts:[{text:l.text}]})),t=await fetch(k,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({systemInstruction:{parts:[{text:o}]},contents:u})});if(!t.ok){const l=await t.json().catch(()=>({}));throw new Error(`API error: ${t.status} ${((s=l.error)==null?void 0:s.message)||""}`)}return((h=(p=(c=(i=(r=(await t.json()).candidates)==null?void 0:r[0])==null?void 0:i.content)==null?void 0:c.parts)==null?void 0:p[0])==null?void 0:h.text)||""}async function j(e,a,o){var s,r,i,c,p,h,l,y,g,w,f,S,b;const u=e.map(m=>`${m.name}: ${m.topics.filter(d=>!d.done).map(d=>`${d.name}(${d.hours}h,${d.priority})`).join(", ")}`).join(`
`),t="You are an expert study planner. Return ONLY valid JSON. No markdown.",n=`Create a study plan:
Subjects & pending topics: ${u}
Days until exam: ${a}
Daily hours available: ${o}

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
Generate ${Math.min(Math.ceil(a/7),4)} weeks.`;try{const d=(await $(t,n)).replace(/```json?|```/g,"").trim();return JSON.parse(d)}catch(m){return console.error("Study Plan AI fallback used due to quota:",m),{weeks:[{week:1,theme:"Core Concepts Revision",days:[{day:"Mon",sessions:[{subject:((s=e[0])==null?void 0:s.name)||"Core Subject",topic:((i=(r=e[0])==null?void 0:r.topics[0])==null?void 0:i.name)||"Topic 1",hours:2,color:((c=e[0])==null?void 0:c.color)||"accent"}]},{day:"Tue",sessions:[{subject:((p=e[0])==null?void 0:p.name)||"Core Subject",topic:((l=(h=e[0])==null?void 0:h.topics[1])==null?void 0:l.name)||"Topic 2",hours:2,color:((y=e[0])==null?void 0:y.color)||"accent"}]},{day:"Wed",sessions:[{subject:((g=e[1])==null?void 0:g.name)||"Second Subject",topic:((f=(w=e[1])==null?void 0:w.topics[0])==null?void 0:f.name)||"Topic 1",hours:2,color:((S=e[1])==null?void 0:S.color)||"teal"}]},{day:"Thu",sessions:[{subject:((b=e[1])==null?void 0:b.name)||"Second Subject",topic:"Review Pending",hours:1,color:"amber"}]},{day:"Fri",sessions:[{subject:"Revision",topic:"Weekly Review",hours:2,color:"green"}]}]}],insights:["Focus on highest priority items first.","Take short breaks every hour.","Review mistakes actively."],priorityOrder:["High Priority Topics","Medium Priority"]}}}async function O(e){const a=e.map(t=>({name:t.name,progress:Math.round(t.topics.filter(n=>n.done).length/t.topics.length*100),pending:t.topics.filter(n=>!n.done).map(n=>n.name)})),o="You are a learning analytics expert. Be concise and actionable.",u=`Analyze these subject stats and identify weak areas:
${JSON.stringify(a,null,2)}

Give 3–4 specific, actionable recommendations. Each on a new line starting with •`;return $(o,u)}export{O as a,x as c,j as g};
