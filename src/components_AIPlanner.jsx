import { useState } from 'react'

export default function AIPlanner({ weatherSummary, cityName = 'Dubai' }) {
  const [localModel, setLocalModel] = useState('qwen2.5:1.5b-instruct')
  const [prompt, setPrompt] = useState(
    'Plan a half-day itinerary in the selected city for a family with two young kids. Consider heat and suggest indoor options if it is too hot.'
  )
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const systemPrompt = (city) => `You are a concise trip planner for the selected city: ${city}.
Rules:
- Recommend places ONLY within ${city}. Do NOT include places from other cities.
- If an attraction is outside ${city}, say it’s outside and give a similar alternative inside ${city}.
- Prefer family-friendly indoor options if it’s hot.
Return 4–6 bullet points with short tips and an indoor/outdoor % split.`

  const buildMessages = (city, weather, task) => ([
    { role: 'system', content: systemPrompt(city) },
    { role: 'user', content: `City: ${city}\nWeather: ${weather}\n\nTask: ${task}` },
  ])

  async function run() {
    setLoading(true)
    setAnswer('')
    try {
      const messages = buildMessages(cityName, weatherSummary, prompt)
      const r = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: localModel,
          messages,
          temperature: 0.7,
          max_tokens: 400
        })
      })
      const data = await r.json().catch(() => ({}))
      if (!r.ok) {
        const msg = data?.error || `Backend HTTP ${r.status}`
        throw new Error(msg)
      }
      setAnswer(data?.content || '(no content)')
    } catch (e) {
      setAnswer(String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3>AI Itinerary Assistant (Local LLM)</h3>
      <p className="kicker">Runs via Ollama on your Mac. No browser LLM.</p>

      <div className="row">
        <div style={{minWidth: 280, flex: 1}}>
          <label>Local model (Ollama)</label>
          <input
            value={localModel}
            onChange={e => setLocalModel(e.target.value)}
            placeholder="qwen2.5:1.5b-instruct"
          />
          <div className="kicker" style={{marginTop: 6}}>
            Tips: qwen2.5:1.5b-instruct (fast), qwen2.5:3b-instruct (balanced), llama3.1:8b-instruct-q4_K_M (higher quality)
          </div>
        </div>
      </div>

      <div className="row" style={{marginTop: 10}}>
        <div style={{flex: 2, minWidth: 320}}>
          <label>Prompt</label>
          <textarea rows={4} value={prompt} onChange={e => setPrompt(e.target.value)} />
        </div>
        <div style={{alignSelf: 'end'}}>
          <button onClick={run} disabled={loading}>{loading ? 'Thinking…' : 'Generate Plan'}</button>
        </div>
      </div>

      {answer && <div style={{marginTop: 12}}><pre>{answer}</pre></div>}
    </div>
  )
}