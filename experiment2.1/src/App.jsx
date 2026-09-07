import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { addPost, deletePost, toggleLike, selectAllPosts } from './features/posts/postsSlice'
import { addPlatform, selectAllPlatforms } from './features/platforms/platformsSlice'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const posts = useSelector(selectAllPosts)
  const platforms = useSelector(selectAllPlatforms)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [platformId, setPlatformId] = useState('react')

  const [platformName, setPlatformName] = useState('')
  const [platformDescription, setPlatformDescription] = useState('')

  const handleAddPost = () => {
    if (!title || !content || !author) return

    dispatch(
      addPost({
        title,
        content,
        author,
        platformId,
      }),
    )

    setTitle('')
    setContent('')
    setAuthor('')
  }

  const handleAddPlatform = () => {
    if (!platformName || !platformDescription) return

    dispatch(
      addPlatform({
        id: platformName.toLowerCase().replace(/\s+/g, '-'),
        name: platformName,
        description: platformDescription,
      }),
    )

    setPlatformName('')
    setPlatformDescription('')
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Redux Toolkit Experiment</h1>
        <p>Centralized state management for posts and platform data</p>
      </header>

      <section className="panel-grid">
        <div className="panel">
          <h2>Add Post</h2>
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Post content"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <select value={platformId} onChange={(e) => setPlatformId(e.target.value)}>
            {platforms.map((platform) => (
              <option key={platform.id} value={platform.id}>
                {platform.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddPost}>Add Post</button>
        </div>

        <div className="panel">
          <h2>Add Platform</h2>
          <input
            type="text"
            placeholder="Platform name"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
          />
          <textarea
            rows="4"
            placeholder="Platform description"
            value={platformDescription}
            onChange={(e) => setPlatformDescription(e.target.value)}
          />
          <button onClick={handleAddPlatform}>Add Platform</button>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel">
          <h2>Platforms</h2>
          <ul className="list">
            {platforms.map((platform) => (
              <li key={platform.id} className="item-card">
                <strong>{platform.name}</strong>
                <span>{platform.description}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h2>Posts</h2>
          <ul className="list">
            {posts.map((post) => (
              <li key={post.id} className="item-card post-card">
                <div className="post-header">
                  <strong>{post.title}</strong>
                  <button className="delete-btn" onClick={() => dispatch(deletePost(post.id))}>
                    Delete
                  </button>
                </div>

                <p>{post.content}</p>
                <small>
                  By {post.author} • {post.likes} likes
                </small>

                <button className="like-btn" onClick={() => dispatch(toggleLike(post.id))}>
                  Like Post
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

export default App
