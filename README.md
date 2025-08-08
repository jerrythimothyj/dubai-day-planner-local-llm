# Dubai Day Planner (Free, Zero-Backend)

A tiny React app that shows a 3-day forecast (Open-Meteo) and generates itinerary tips **on-device** using **WebLLM** (no API keys, no server, zero cost).

## 1) Run locally
```bash
npm i
npm run dev
# open http://localhost:5173
```

> Requires Node 18+. If the AI panel says your browser lacks WebGPU, try Chrome/Edge on desktop.

## 2) Deploy – Cloudflare Pages (₹0)
1. Push this folder to a new GitHub repo.
2. In Cloudflare Pages: **Create Project → Connect to Git →** select the repo.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Deploy → you get a free `*.pages.dev` URL.

(Alternatives: GitHub Pages or Vercel Hobby work fine too.)

## 3) How it’s free
- **Open-Meteo** API (no key) for weather.
- **WebLLM** runs fully in your browser (WebGPU) with small, pre-quantized models.
- Static hosting on Cloudflare Pages free tier.

## 4) Local Agents (optional learning)
Inside `agents/ollama-agent/` is a minimal Node script to chat via **Ollama** (local LLM).

```bash
# Install Ollama (macOS): https://ollama.com/download
ollama pull llama3

cd agents/ollama-agent
npm i
node index.mjs "Create a 4-hour indoor plan in Dubai for a hot day"
```

You can expand this into a tool-using agent (e.g., retrieve attractions JSON from your repo and reason about it).

## 5) MCP (optional learning)
Use an MCP-capable client (e.g., a code editor with MCP support) and attach a **filesystem MCP server** that points to this repo. Ask your assistant to append itineraries to `data/` and commit. (This project keeps it simple; you can add such workflows later.)

---

### Tech Notes
- WebLLM models are selected in the UI; start with the smallest for compatibility.
- If a model fails to load on a device, switch to the 1B option or update your browser.
- Modify cities in `src/api_weather.js`.

### License
MIT
