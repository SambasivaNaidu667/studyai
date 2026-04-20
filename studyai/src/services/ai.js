


const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const MODEL = 'gemini-2.0-flash'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`


async function callGemini(system, userMessage) {
  const res = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
    }),
  })
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}))
    throw new Error(`API error: ${res.status} ${errData.error?.message || ''}`)
  }
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}


export async function chatWithAI(messages, subjectContext) {
  const system = `You are StudyAI, an encouraging, expert academic tutor. 
The student's pending topics: ${subjectContext}
Keep responses concise (3–5 sentences), practical, and motivating.
Use bullet points when listing. End with one actionable tip.
Format: plain text, no markdown headers.`

  
  const apiMessages = messages.map(m => ({
    role: m.role === 'ai' ? 'model' : 'user',
    parts: [{ text: m.text }],
  }))

  const res = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: apiMessages,
    }),
  })
  
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}))
    throw new Error(`API error: ${res.status} ${errData.error?.message || ''}`)
  }
  
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}





export async function generateStudyPlan(subjects, examDays, dailyHours) {
  const subjectList = subjects
    .map(s => `${s.name}: ${s.topics.filter(t => !t.done).map(t => `${t.name}(${t.hours}h,${t.priority})`).join(', ')}`)
    .join('\n')

  const system = `You are an expert study planner. Return ONLY valid JSON. No markdown.`
  const prompt = `Create a study plan:
Subjects & pending topics: ${subjectList}
Days until exam: ${examDays}
Daily hours available: ${dailyHours}

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
Generate ${Math.min(Math.ceil(examDays / 7), 4)} weeks.`

  const text = await callGemini(system, prompt)
  const clean = text.replace(/```json?|```/g, '').trim()
  return JSON.parse(clean)
}


export async function analyzeWeakAreas(subjects) {
  const subjectData = subjects.map(s => ({
    name: s.name,
    progress: Math.round((s.topics.filter(t => t.done).length / s.topics.length) * 100),
    pending: s.topics.filter(t => !t.done).map(t => t.name),
  }))

  const system = `You are a learning analytics expert. Be concise and actionable.`
  const prompt = `Analyze these subject stats and identify weak areas:
${JSON.stringify(subjectData, null, 2)}

Give 3–4 specific, actionable recommendations. Each on a new line starting with •`

  return callGemini(system, prompt)
}


export async function summarizeNotes(notes, topicName) {
  const system = `You are a study notes expert. Create clear, concise summaries.`
  const prompt = `Summarize these notes for "${topicName}":
${notes}

Format:
• Key point 1
• Key point 2
• Key point 3
(max 5 bullet points, each under 15 words)`

  return callGemini(system, prompt)
}
