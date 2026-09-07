import { useState } from 'react'
import './App.css'

const routes = [
  { method: 'GET', path: '/api/books', status: 200, time: 84 },
  { method: 'POST', path: '/api/loans', status: 201, time: 132 },
  { method: 'GET', path: '/api/members/42', status: 200, time: 61 },
  { method: 'GET', path: '/api/books/404', status: 404, time: 47 },
]

const initialLogs = [
  {
    id: 'log-1',
    type: 'request',
    method: 'GET',
    path: '/api/books',
    status: 200,
    duration: 84,
    correlationId: 'req_8f31c2a0',
    time: '10:42:18.402',
  },
  {
    id: 'log-2',
    type: 'request',
    method: 'POST',
    path: '/api/loans',
    status: 201,
    duration: 132,
    correlationId: 'req_19a7d4ef',
    time: '10:42:15.128',
  },
  {
    id: 'log-3',
    type: 'error',
    method: 'GET',
    path: '/api/books/404',
    status: 404,
    duration: 47,
    correlationId: 'req_4c9e110b',
    time: '10:41:59.774',
    message: 'BookNotFoundException handled by GlobalExceptionHandler',
  },
]

function makeCorrelationId() {
  return `req_${Math.random().toString(16).slice(2, 10)}`
}

function App() {
  const [logs, setLogs] = useState(initialLogs)
  const [selectedRoute, setSelectedRoute] = useState(routes[0])
  const [isSending, setIsSending] = useState(false)
  const [notice, setNotice] = useState('Ready to trace a request')

  function handleRequest() {
    const correlationId = makeCorrelationId()
    const route = selectedRoute
    setIsSending(true)
    setNotice(`Tracing ${route.method} ${route.path} with ${correlationId}`)

    window.setTimeout(() => {
      const isError = route.status >= 400
      const nextLog = {
        id: `${correlationId}-${Date.now()}`,
        type: isError ? 'error' : 'request',
        method: route.method,
        path: route.path,
        status: route.status,
        duration: route.time,
        correlationId,
        time: new Date().toLocaleTimeString([], { hour12: false }),
        message: isError
          ? 'BookNotFoundException handled by GlobalExceptionHandler'
          : undefined,
      }

      setLogs((currentLogs) => [nextLog, ...currentLogs].slice(0, 8))
      setIsSending(false)
      setNotice(
        isError
          ? `404 normalized by @ControllerAdvice · ${correlationId}`
          : `Request completed in ${route.time} ms · ${correlationId}`,
      )
    }, 650)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Tracepoint home">
          <span className="brand-mark">T</span>
          <span>tracepoint</span>
        </a>
        <div className="environment"><span className="live-dot" /> local / development</div>
      </header>

      <section className="intro" id="top">
        <div>
          <p className="eyebrow">Experiment 2.1.2 / observability lab</p>
          <h1>Make every request<br /><em>tell its story.</em></h1>
          <p className="intro-copy">A small control room for global exception handling, structured logs, and request tracing.</p>
        </div>
        <div className="intro-stat"><strong>{logs.length}</strong><span>events captured</span></div>
      </section>

      <section className="control-panel" aria-label="Request simulator">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">01 / Request simulator</p>
            <h2>Send a request through the middleware</h2>
          </div>
          <span className="status-pill"><span className="pulse" /> MDC connected</span>
        </div>
        <div className="request-controls">
          <label>
            <span>Endpoint</span>
            <select value={selectedRoute.path} onChange={(event) => setSelectedRoute(routes.find((route) => route.path === event.target.value))}>
              {routes.map((route) => <option key={route.path} value={route.path}>{route.method} {route.path}</option>)}
            </select>
          </label>
          <button className="send-button" type="button" onClick={handleRequest} disabled={isSending}>
            {isSending ? 'Tracing...' : 'Send request'} <span aria-hidden="true">-&gt;</span>
          </button>
        </div>
        <div className="notice" role="status"><span className="notice-icon">+</span>{notice}</div>
      </section>

      <section className="metrics" aria-label="Observability metrics">
        <article><span className="metric-label">Correlation IDs</span><strong>100%</strong><small>of requests traceable</small></article>
        <article><span className="metric-label">Error responses</span><strong>1</strong><small>handled centrally</small></article>
        <article><span className="metric-label">Median latency</span><strong>84<span>ms</span></strong><small>last 24 hours</small></article>
      </section>

      <section className="log-section">
        <div className="log-heading">
          <div><p className="section-kicker">02 / Structured log stream</p><h2>What the server knows</h2></div>
          <span className="log-count">{logs.length} records</span>
        </div>
        <div className="log-table" role="table" aria-label="Request logs">
          <div className="log-row log-header" role="row"><span>Event</span><span>Route</span><span>Correlation ID</span><span>Latency</span><span>Status</span></div>
          {logs.map((log) => (
            <div className="log-row" role="row" key={log.id}>
              <span className="event-cell"><i className={log.type} />{log.type === 'error' ? 'exception' : 'request'}<small>{log.time}</small></span>
              <span className="route-cell"><b>{log.method}</b> {log.path}{log.message && <small>{log.message}</small>}</span>
              <code>{log.correlationId}</code>
              <span>{log.duration} ms</span>
              <span className={`http-status ${log.status >= 400 ? 'failure' : 'success'}`}>{log.status}</span>
            </div>
          ))}
        </div>
      </section>

      <footer><span>GLOBAL EXCEPTION HANDLER</span><span>FILTER / MDC / SLF4J</span><span>STATUS: OBSERVABLE</span></footer>
    </main>
  )
}

export default App
