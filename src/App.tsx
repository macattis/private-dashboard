import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

const users = [
  { username: 'VBGABESZ', password: 'admin' },
  { username: 'DMIHOLICS', password: 'admin' },
  { username: 'TVBARBARA', password: 'admin' },
  { username: 'TTOROK', password: 'admin' },
]

type ChartConfig = {
  title: string
  label: string
  sourceUrl: string
  kind: 'tradingview' | 'iframe'
  symbol?: string
  interval?: string
  iframeUrl?: string
}

const charts: ChartConfig[] = [
  {
    title: 'EUR/HUF',
    label: 'Euro / forint',
    kind: 'tradingview',
    symbol: 'OANDA:EURHUF',
    sourceUrl: 'https://olajar.hu/EUR-HUF-arfolyam.html',
  },
  {
    title: 'USD/HUF',
    label: 'Dollár / forint',
    kind: 'tradingview',
    symbol: 'OANDA:USDHUF',
    sourceUrl: 'https://olajar.hu/USD-HUF-arfolyam.html',
  },
  {
    title: 'Földgáz / TTF',
    label: 'Európai gázár',
    kind: 'tradingview',
    symbol: 'ICEEUR:TFM1!',
    sourceUrl: 'https://www.tradingview.com/symbols/ICEEUR-TFM1!/',
  },
  {
    title: 'Földgáz / Henry Hub',
    label: 'Alternatív gázár',
    kind: 'tradingview',
    symbol: 'NYMEX:NG1!',
    sourceUrl: 'https://www.tradingview.com/symbols/NYMEX-NG1!/',
  },
  {
    title: 'KYOS gázpiaci oldal',
    label: 'Külső gázpiaci grafikon',
    kind: 'iframe',
    iframeUrl:
      'https://gas.kyos.com/?gclid=EAIaIQobChMIvrTXvoeF9gIVjuJ3Ch3D5ABcEAMYASAAEgJwK_D_BwE&fbclid=IwAR0KU16EzXwNyCk2jK49ueBuJfAgld7ObPLJqMCtyBnAshii9ticOmdo-BY',
    sourceUrl:
      'https://gas.kyos.com/?gclid=EAIaIQobChMIvrTXvoeF9gIVjuJ3Ch3D5ABcEAMYASAAEgJwK_D_BwE&fbclid=IwAR0KU16EzXwNyCk2jK49ueBuJfAgld7ObPLJqMCtyBnAshii9ticOmdo-BY',
  },
  {
    title: 'Brent olaj',
    label: 'Kőolaj világpiaci ár',
    kind: 'tradingview',
    symbol: 'TVC:UKOIL',
    sourceUrl: 'https://olajar.hu/index.html',
  },
  {
    title: 'Arany',
    label: 'Befektetési arany',
    kind: 'tradingview',
    symbol: 'TVC:GOLD',
    sourceUrl: 'https://olajar.hu/arany-arfolyam.html',
  },
  {
    title: 'Magyar infláció',
    label: 'KSH inflációs radar',
    kind: 'iframe',
    iframeUrl: 'https://www.ksh.gov.hu/interaktiv/fogyar_radar/index.html',
    sourceUrl: 'https://www.ksh.gov.hu/interaktiv/fogyar_radar/index.html',
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
      symbol: chart.symbol ?? 'OANDA:EURHUF',
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

function IframeChart({ chart }: { chart: ChartConfig }) {
  return (
    <iframe
      className="external-chart"
      src={chart.iframeUrl}
      title={chart.title}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  )
}

function ChartCard({ chart }: { chart: ChartConfig }) {
  return (
    <article className={`chart-panel chart-panel-${chart.kind}`}>
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
        {chart.kind === 'iframe' ? <IframeChart chart={chart} /> : <TradingViewChart chart={chart} />}
      </div>
    </article>
  )
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeUser, setActiveUser] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin(event: FormEvent) {
    event.preventDefault()

    const normalizedUsername = username.trim().toUpperCase()
    const user = users.find(
      (candidate) => candidate.username === normalizedUsername && candidate.password === password,
    )

    if (user) {
      setIsLoggedIn(true)
      setActiveUser(user.username)
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
          <p className="dashboard-user">Belépve: {activeUser}</p>
        </div>

        <button
          className="logout-button"
          onClick={() => {
            setIsLoggedIn(false)
            setActiveUser('')
            setPassword('')
          }}
        >
          Kilépés
        </button>
      </header>

      <section className="market-grid">
        {charts.map((chart) => (
          <ChartCard chart={chart} key={`${chart.kind}-${chart.title}`} />
        ))}
      </section>
    </main>
  )
}

export default App
