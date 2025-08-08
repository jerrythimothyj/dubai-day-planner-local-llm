export async function getForecast({ latitude, longitude, days = 3 }) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    hourly: 'temperature_2m,precipitation_probability',
    daily: 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum',
    forecast_days: String(days),
    timezone: 'auto'
  })
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
  return res.json()
}

export const PRESETS = [
  { id: 'dubai', name: 'Dubai', latitude: 25.276987, longitude: 55.296249 },
  { id: 'abu-dhabi', name: 'Abu Dhabi', latitude: 24.453884, longitude: 54.3773438 },
  { id: 'sharjah', name: 'Sharjah', latitude: 25.346255, longitude: 55.420931 },
]
