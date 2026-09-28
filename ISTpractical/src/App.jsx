import { useState } from 'react'
import './App.css'

const platforms = {
  twitter: { name: 'Twitter', limit: 280, handle: '@yourhandle' },
  linkedin: { name: 'LinkedIn', limit: 3000, handle: 'Your Name' },
}

function App() {
  const [platform, setPlatform] = useState('twitter')
  const [post, setPost] = useState('')
  const [posted, setPosted] = useState(false)

  const selectedPlatform = platforms[platform]
  const characterCount = Array.from(post).length
  const isOverLimit = characterCount > selectedPlatform.limit
  const remaining = selectedPlatform.limit - characterCount
  const overage = Math.abs(remaining)

  function handlePostChange(event) {
    setPost(event.target.value)
    setPosted(false)
  }

  function handlePlatformChange(nextPlatform) {
    setPlatform(nextPlatform)
    setPosted(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!post.trim() || isOverLimit) return
    setPosted(true)
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Postroom home">
          <span className="wordmark-mark">p.</span> postroom
        </a>
        <span className="topbar-note">SOCIAL PUBLISHING · PRACTICAL 01</span>
      </header>

      <section className="intro" id="top">
        <p className="eyebrow">QUESTION 1 / CONTROLLED INPUT</p>
        <h1>Post Composer</h1>
        <p className="intro-copy">
          Write once, check the limit, and shape your message for the right
          platform.
        </p>
      </section>

      <div className="workspace">
        <section className="composer-panel" aria-labelledby="composer-title">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">NEW POST</p>
              <h2 id="composer-title">Compose</h2>
            </div>
            <span className="draft-status"><span /> Draft</span>
          </div>

          <div className="platform-picker">
            <span className="field-label" id="platform-label">POSTING TO</span>
            <div className="platform-options" role="group" aria-labelledby="platform-label">
              {Object.entries(platforms).map(([key, item]) => (
                <button
                  className={`platform-option ${platform === key ? 'is-selected' : ''}`}
                  key={key}
                  type="button"
                  aria-pressed={platform === key}
                  onClick={() => handlePlatformChange(key)}
                >
                  <span className={`platform-symbol ${key}`} aria-hidden="true">
                    {key === 'twitter' ? '𝕏' : 'in'}
                  </span>
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="post-text">YOUR MESSAGE</label>
            <textarea
              id="post-text"
              value={post}
              onChange={handlePostChange}
              placeholder="What would you like to share?"
              aria-invalid={isOverLimit}
              aria-describedby="character-status"
              rows="7"
            />

            <div className={`character-status ${isOverLimit ? 'has-error' : ''}`} id="character-status" aria-live="polite">
              <span>
                {isOverLimit
                  ? `Over the ${selectedPlatform.name} limit by ${overage} character${overage === 1 ? '' : 's'}.`
                  : `${remaining} characters remaining`}
              </span>
              <span className="character-count">
                {characterCount.toLocaleString()} / {selectedPlatform.limit.toLocaleString()}
              </span>
            </div>

            {isOverLimit && (
              <p className="validation-error" role="alert">
                Your post exceeds the {selectedPlatform.name} character limit.
                Shorten it by {overage} character{overage === 1 ? '' : 's'} to continue.
              </p>
            )}

            <div className="composer-footer">
              <span className="limit-note">Limit: {selectedPlatform.limit.toLocaleString()} characters</span>
              <button className="publish-button" type="submit" disabled={!post.trim() || isOverLimit}>
                Publish post <span aria-hidden="true">↗</span>
              </button>
            </div>
          </form>

          {posted && (
            <p className="success-message" role="status">
              Your post is ready for {selectedPlatform.name}.
            </p>
          )}
        </section>

        <aside className="side-column">
          <section className="preview-panel" aria-labelledby="preview-title">
            <div className="side-heading">
              <p className="eyebrow">LIVE PREVIEW</p>
              <h2 id="preview-title">Your post</h2>
            </div>
            <article className="preview-post">
              <div className="avatar" aria-hidden="true">Y</div>
              <div className="preview-content">
                <div className="preview-author">
                  <strong>{selectedPlatform.handle}</strong>
                  <span>· just now</span>
                </div>
                <p className={post ? '' : 'placeholder-copy'}>
                  {post || 'Your message will appear here as you write.'}
                </p>
              </div>
            </article>
            <div className="preview-meta">
              <span className={`platform-dot ${platform}`} />
              Previewing {selectedPlatform.name}
            </div>
          </section>

          <section className="theory-panel" aria-labelledby="theory-title">
            <p className="eyebrow">A / THEORY</p>
            <h2 id="theory-title">Controlled components</h2>
            <p>
              A controlled component is an input whose value is managed by
              React state. Here, <code>post</code> is the source of truth for
              the textarea.
            </p>
            <p>
              Typing fires <code>onChange</code>, which saves the new value
              with <code>setPost</code>. React then renders the value back into
              the textarea, keeping the UI and state in sync.
            </p>
            <p>
              Validation uses the selected platform to choose a limit: 280
              characters for Twitter or 3,000 for LinkedIn. The character
              count, remaining amount, and error message are derived from the
              current text and limit.
            </p>
          </section>
        </aside>
      </div>

      <footer className="page-footer">
        <span>REACT STATE · INPUT VALIDATION</span>
        <span>IST PRACTICAL</span>
      </footer>
    </main>
  )
}

export default App
