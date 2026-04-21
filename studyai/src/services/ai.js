


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


  // Gemini API requires the conversation to start with a 'user' message.
  // Drop any leading 'ai' (model) messages like the initial greeting.
  const firstUserIdx = messages.findIndex(m => m.role === 'user')
  const trimmed = firstUserIdx >= 0 ? messages.slice(firstUserIdx) : messages

  const apiMessages = trimmed.map(m => ({
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

  try {
    const text = await callGemini(system, prompt)
    const clean = text.replace(/```json?|```/g, '').trim()
    return JSON.parse(clean)
  } catch (err) {
    console.error('Study Plan AI fallback used due to quota:', err)
    return {
      weeks: [
        {
          week: 1, theme: "Core Concepts Revision", days: [
            { day: "Mon", sessions: [{ subject: subjects[0]?.name || "Core Subject", topic: subjects[0]?.topics[0]?.name || "Topic 1", hours: 2, color: subjects[0]?.color || "accent" }] },
            { day: "Tue", sessions: [{ subject: subjects[0]?.name || "Core Subject", topic: subjects[0]?.topics[1]?.name || "Topic 2", hours: 2, color: subjects[0]?.color || "accent" }] },
            { day: "Wed", sessions: [{ subject: subjects[1]?.name || "Second Subject", topic: subjects[1]?.topics[0]?.name || "Topic 1", hours: 2, color: subjects[1]?.color || "teal" }] },
            { day: "Thu", sessions: [{ subject: subjects[1]?.name || "Second Subject", topic: "Review Pending", hours: 1, color: "amber" }] },
            { day: "Fri", sessions: [{ subject: "Revision", topic: "Weekly Review", hours: 2, color: "green" }] }
          ]
        }
      ],
      insights: ["Focus on highest priority items first.", "Take short breaks every hour.", "Review mistakes actively."],
      priorityOrder: ["High Priority Topics", "Medium Priority"]
    }
  }
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
