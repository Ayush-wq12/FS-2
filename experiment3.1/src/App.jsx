import { useState } from 'react'
import './App.css'

const TOKEN_KEY = 'jwt-auth-demo-token'
const DEMO_USER = {
  email: 'demo@secure.app',
  password: 'jwt-demo-123',
  name: 'Avery Morgan',
  role: 'Administrator',
}

const encodePart = (value) =>
  btoa(JSON.stringify(value))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

const createDemoToken = () => {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'HS256', typ: 'JWT' }
  const payload = {
    sub: 'usr_2048',
    email: DEMO_USER.email,
    name: DEMO_USER.name,
    role: DEMO_USER.role,
    iat: now,
    exp: now + 60 * 60,
  }

  return `${encodePart(header)}.${encodePart(payload)}.demo-signature`
}

const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1]
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(normalized))
  } catch {
    return null
  }
}

const formatTime = (timestamp) =>
  new Date(timestamp * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [token, setToken] = useState(() => {
    const savedToken = sessionStorage.getItem(TOKEN_KEY)
    if (savedToken && decodeToken(savedToken)?.exp * 1000 > Date.now()) {
      return savedToken
    }
    sessionStorage.removeItem(TOKEN_KEY)
    return ''
  })
  const [error, setError] = useState('')
  const [requestStatus, setRequestStatus] = useState('idle')

  const claims = token ? decodeToken(token) : null
  const isAuthenticated = Boolean(claims)

  const handleLogin = (event) => {
    event.preventDefault()
    setError('')

    if (email.trim().toLowerCase() !== DEMO_USER.email || password !== DEMO_USER.password) {
      setError('Those credentials do not match the demo account.')
      return
    }

    const nextToken = createDemoToken()
    sessionStorage.setItem(TOKEN_KEY, nextToken)
    setToken(nextToken)
    setPassword('')
  }

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY)
    setToken('')
    setRequestStatus('idle')
    setEmail('')
  }

  const simulateRequest = () => {
    setRequestStatus(token ? 'authorized' : 'rejected')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Cipher home">
          <span className="brand-mark">C</span>
          <span>CIPHER<span className="brand-dot">/</span>AUTH</span>
        </a>
        <span className="lab-label">SECURITY LAB 03.1</span>
      </header>

      <section className="intro">
        <div>
          <p className="eyebrow">JWT authentication playground</p>
          <h1>Identity, made <em>stateless.</em></h1>
          <p className="intro-copy">
            A small working model of the login-to-request flow. Sign in, inspect the claims,
            then watch the token authorize a protected request.
          </p>
        </div>
        <div className="flow-map" aria-label="Authentication flow">
          <span>01 <strong>LOGIN</strong></span><i></i><span>02 <strong>TOKEN</strong></span><i></i><span>03 <strong>ACCESS</strong></span>
        </div>
      </section>

      <section className="workspace">
        {!isAuthenticated ? (
          <form className="panel login-panel" onSubmit={handleLogin}>
            <div className="panel-heading">
              <div><span className="panel-kicker">01 / Verify identity</span><h2>Welcome back</h2></div>
              <span className="status-pill neutral"><span></span> Signed out</span>
            </div>
            <p className="panel-copy">Use the demo credentials to issue a short-lived access token.</p>
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required />
              <button type="button" className="text-button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="primary-button" type="submit">Authenticate <span>→</span></button>
            <div className="demo-credentials"><span>DEMO ACCESS</span><code>demo@secure.app</code><code>jwt-demo-123</code></div>
          </form>
        ) : (
          <section className="panel session-panel">
            <div className="panel-heading">
              <div><span className="panel-kicker">01 / Identity verified</span><h2>Session active</h2></div>
              <span className="status-pill live"><span></span> Authenticated</span>
            </div>
            <div className="profile-row"><div className="avatar">AM</div><div><strong>{claims.name}</strong><p>{claims.email}</p></div><span className="role-tag">{claims.role}</span></div>
            <div className="session-meta"><div><span>SUBJECT ID</span><strong>{claims.sub}</strong></div><div><span>EXPIRES</span><strong>{formatTime(claims.exp)}</strong></div></div>
            <button className="secondary-button" type="button" onClick={handleLogout}>Sign out <span>↗</span></button>
          </section>
        )}

        <section className="panel token-panel">
          <div className="panel-heading"><div><span className="panel-kicker">02 / Inspect token</span><h2>JWT anatomy</h2></div><span className="token-type">HS256</span></div>
          {token && claims ? <>
            <div className="token-display"><span className="token-header">{token.split('.')[0]}</span><span className="token-payload">.{token.split('.')[1]}</span><span className="token-signature">.{token.split('.')[2]}</span></div>
            <div className="claim-list"><div><span>ALGORITHM</span><strong>HS256</strong></div><div><span>TYPE</span><strong>JWT</strong></div><div><span>ISSUED AT</span><strong>{formatTime(claims.iat)}</strong></div></div>
          </> : <div className="empty-token"><span className="lock-symbol">◇</span><p>Your signed token will appear here after authentication.</p></div>}
          <p className="security-note"><span>i</span> In production, signing and verification happen on the server. This browser-only signature is for learning.</p>
        </section>

        <section className="panel request-panel">
          <div className="panel-heading"><div><span className="panel-kicker">03 / Protected resource</span><h2>Request inspector</h2></div><span className="method-badge">GET</span></div>
          <div className="request-line"><span>/api/account</span><button className="run-button" type="button" onClick={simulateRequest}>Send request <span>↗</span></button></div>
          <div className={`request-result ${requestStatus}`}>
            <span className="result-icon">{requestStatus === 'authorized' ? '✓' : requestStatus === 'rejected' ? '×' : '—'}</span>
            <div><strong>{requestStatus === 'authorized' ? '200 · Request authorized' : requestStatus === 'rejected' ? '401 · Unauthorized' : 'Awaiting request'}</strong><p>{requestStatus === 'authorized' ? 'Bearer token accepted. Protected data is available.' : requestStatus === 'rejected' ? 'A valid access token is required.' : 'Attach the token to see the stateless check in action.'}</p></div>
          </div>
          <code className="auth-header">Authorization: Bearer {token ? `${token.slice(0, 18)}...` : '••••••••••••'}</code>
        </section>
      </section>
      <footer><span>JWT / SESSION MANAGEMENT</span><span>CLIENT-SIDE DEMONSTRATION · 2026</span></footer>
    </main>
  )
}

export default App
