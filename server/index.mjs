import express from 'express'
import cors from 'cors'
import { fetch } from 'undici'   // <- add this line

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

// Chat proxy → Ollama REST (must have ollama running locally)
app.post('/api/chat', async (req, res) => {
  try {
    const { model = 'qwen2.5:3b-instruct', messages = [], temperature = 0.7, max_tokens = 400 } = req.body || {}
    const r = await fetch('http://127.0.0.1:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, options: { temperature, num_predict: max_tokens }, stream: false })
    })
    if (!r.ok) {
      const t = await r.text().catch(() => '')
      return res.status(500).json({ error: `Ollama error ${r.status}: ${t}` })
    }
    const data = await r.json()
    const content = data?.message?.content ?? ''
    res.json({ content, raw: data })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

const port = 3001
app.listen(port, () => console.log(`[ddp-local-backend] listening on http://localhost:${port}`))