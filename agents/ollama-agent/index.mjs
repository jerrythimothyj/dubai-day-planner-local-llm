import Ollama from 'ollama'

const userMsg = process.argv.slice(2).join(' ') || 'Hello! Suggest a 3-activity indoor plan in Dubai.'

const res = await Ollama.chat({
  model: 'llama3',
  messages: [
    { role: 'system', content: 'You are a concise family day planner for Dubai.' },
    { role: 'user', content: userMsg }
  ]
})

console.log('\nAssistant:\n' + res.message.content + '\n')