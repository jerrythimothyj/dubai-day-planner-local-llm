import { useEffect, useMemo, useState } from 'react'
import AIPlanner from './components_AIPlanner.jsx'
import { getForecast, PRESETS } from './api_weather.js'

function formatDaily(d) {
  const days = []
  const toISODate = (iso) => new Date(iso).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
  for (let i = 0; i < d.time.length; i++) {
    days.push({
      date: toISODate(d.time[i]),
      tmax: d.temperature_2m_max[i],
      tmin: d.temperature_2m_min[i],
      rain: d.precipitation_sum[i]
    })
  }
  return days
}

export default function App() {
  const [city, setCity] = useState(PRESETS[0])
  const [days, setDays] = useState([])
  const [hourly, setHourly] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function refresh() {
    setLoading(true); setError(null)
    try {
      const data = await getForecast({ latitude: city.latitude, longitude: city.longitude, days: 3 })
      const daily = formatDaily(data.daily)
      setDays(daily)
      setHourly(data.hourly)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [city.id])

  const weatherSummary = useMemo(() => {
    if (!days.length) return 'No data yet.'
    const d0 = days[0]
    return `Today ${d0.date}: High ${Math.round(d0.tmax)}°C, Low ${Math.round(d0.tmin)}°C, Rain ${Math.round(d0.rain)} mm.`
  }, [days])

  return (
    <div className="container">
      <h1>Dubai Day Planner</h1>

      <div className="card">
        <div className="row">
          <div style={{minWidth: 220, flex: 1}}>
            <label>City</label>
            <select
              value={city.id}
              onChange={e => setCity(PRESETS.find(p => p.id === e.target.value) ?? PRESETS[0])}
            >
              {PRESETS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div style={{alignSelf: 'end'}}>
            <button onClick={refresh} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</button>
          </div>
        </div>
        {error && <p style={{color:'#ff8080'}}>{error}</p>}
        <div className="grid" style={{marginTop: 12}}>
          {days.map((d, idx) => (
            <div className="card" key={idx}>
              <h3>{d.date}</h3>
              <div className="row">
                <div><span className="badge">High</span> <b>{Math.round(d.tmax)}°C</b></div>
                <div><span className="badge">Low</span> <b>{Math.round(d.tmin)}°C</b></div>
                <div><span className="badge">Rain</span> <b>{Math.round(d.rain)} mm</b></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AIPlanner weatherSummary={weatherSummary} cityName={city.name} />


    </div>
  )
}
