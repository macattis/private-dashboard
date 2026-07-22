import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

const USERNAME = 'attila'
const PASSWORD = 'dashboard2026'

type ChartConfig = {
  title: string
  label: string
  symbol: string
  interval?: string
  sourceUrl: string
}

const charts: ChartConfig[] = [
  {
    title: 'EUR/HUF',
    label: 'Euro / forint',
    symbol: 'OANDA:EURHUF',
    sourceUrl: 'https://olajar.hu/EUR-HUF-arfolyam.html',
  },
  {
    title: 'USD/HUF',
    label: 'Dollár / forint',
    symbol: 'OANDA:USDHUF',
    sourceUrl: 'https://olajar.hu/USD-HUF-arfolyam.html',
  },
  {
    title: 'Földgáz / TTF',
    label: 'Holland TTF gáz',
    symbol: 'NYMEX:TTF1!',
    sourceUrl: 'https://olajar.hu/gaz-ar.html',
  },
  {
    title: 'Brent olaj',
    label: 'Kőolaj világpiaci ár',
    symbol: 'TVC:UKOIL',
    sourceUrl: 'https://olajar.hu/index.html',
  },
  {
    title: 'Arany',
    label: 'Befektetési arany',
    symbol: 'TVC:GOLD',
    sourceUrl: 'https://olajar.hu/arany-arfolyam.html',
  },
  {
    title: 'Magyar infláció',
    label: 'Inflációs adat',
    symbol: 'ECONOMICS:HUIRYY',
    interval: 'M',
    sourceUrl: 'https://olajar.hu/magyar-inflacio.html',
  },
]

function TradingViewChart({ chart }: { chart: ChartConfig }) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return

    container.current.innerHTML = '<div class="tradingview-widget-container__widget"></div>'

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: chart.symbol,
      interval: chart.interval ?? '60',
      timezone: 'Europe/Budapest',
      theme: 'dark',
      style: '1',
      locale: 'hu_HU',
      allow_symbol_change: true,
      calendar: false,
      support_host: 'https://www.tradingview.com',
    })

    container.current.appendChild(script)
  }, [chart])

  return <div className="tradingview-widget-container" ref={container} />
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin(event: FormEvent) {
    event.preventDefault()

    if (username === USERNAME && password === PASSWORD) {
      setIsLoggedIn(true)
      setError('')
      return
    }

    setError('Hibás felhasználónév vagy jelszó.')
  }

  if (!isLoggedIn) {
    return (
      <main className="login-page">
        <section className="login-panel">
          <p className="eyebrow">Private Dashboard</p>
          <h1>Belépés</h1>
          <p className="login-text">A dashboard tartalma csak bejelentkezés után látható.</p>

          <form onSubmit={handleLogin} className="login-form">
            <label>
              Felhasználónév
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
              />
            </label>

            <label>
              Jelszó
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </label>

            {error && <p className="error">{error}</p>}

            <button type="submit">Belépés</button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Private Dashboard</p>
          <h1>Pénzügyi áttekintő</h1>
        </div>

        <button className="logout-button" onClick={() => setIsLoggedIn(false)}>
          Kilépés
        </button>
      </header>

      <section className="market-grid">
        {charts.map((chart) => (
          <article className="chart-panel" key={chart.symbol}>
            <div className="panel-header">
              <div>
                <p className="eyebrow">{chart.label}</p>
                <h2>{chart.title}</h2>
              </div>

              <a href={chart.sourceUrl} target="_blank" rel="noreferrer">
                Forrás
              </a>
            </div>

            <div className="chart-frame">
              <TradingViewChart chart={chart} />
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

export default App
