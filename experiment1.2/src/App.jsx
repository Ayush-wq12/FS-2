import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [drafts, setDrafts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load drafts from localStorage when the app starts
  useEffect(() => {
    const savedDrafts = localStorage.getItem("drafts");

    if (savedDrafts) {
      try {
        setDrafts(JSON.parse(savedDrafts));
      } catch (error) {
        console.error("Error loading drafts:", error);
        setDrafts([]);
      }
    }
  }, []);

  // Save drafts to localStorage whenever drafts change
  useEffect(() => {
    localStorage.setItem("drafts", JSON.stringify(drafts));
  }, [drafts]);

  // Simulated API call
  const fakeApi = (callback) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        callback();
        resolve();
      }, 500);
    });
  };

  // Save a new draft
  const saveDraft = async () => {
    if (!title.trim() || !content.trim()) {
      setMessage("Please enter both title and content.");
      return;
    }

    setLoading(true);
    setMessage("");

    await fakeApi(() => {
      const newDraft = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toLocaleString(),
      };

      setDrafts((prevDrafts) => [newDraft, ...prevDrafts]);

      setTitle("");
      setContent("");
      setMessage("Draft saved successfully.");
    });

    setLoading(false);
  };

  // Delete a draft
  const deleteDraft = async (id) => {
    setLoading(true);
    setMessage("");

    await fakeApi(() => {
      setDrafts((prevDrafts) =>
        prevDrafts.filter((draft) => draft.id !== id)
      );

      setMessage("Draft deleted successfully.");
    });

    setLoading(false);
  };

  // Edit a draft
  const editDraft = (draft) => {
    setEditingId(draft.id);
    setTitle(draft.title);
    setContent(draft.content);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Update an existing draft
  const updateDraft = async () => {
    if (!title.trim() || !content.trim()) {
      setMessage("Please enter both title and content.");
      return;
    }

    setLoading(true);
    setMessage("");

    await fakeApi(() => {
      setDrafts((prevDrafts) =>
        prevDrafts.map((draft) =>
          draft.id === editingId
            ? {
                ...draft,
                title: title.trim(),
                content: content.trim(),
                updatedAt: new Date().toLocaleString(),
              }
            : draft
        )
      );

      setTitle("");
      setContent("");
      setEditingId(null);
      setMessage("Draft updated successfully.");
    });

    setLoading(false);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setMessage("");
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>Draft Management System</h1>
          <p>Create, edit, save and manage your post drafts</p>
        </div>
      </header>

      {/* Main Container */}
      <main className="container">
        {/* Composer Section */}
        <section className="composer">
          <div className="section-header">
            <h2>
              {editingId !== null ? "Edit Draft" : "Create New Draft"}
            </h2>

            {editingId !== null && (
              <button
                type="button"
                className="cancel-top-btn"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>

          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Title</label>

            <input
              id="title"
              type="text"
              placeholder="Enter draft title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className="form-group">
            <label htmlFor="content">Content</label>

            <textarea
              id="content"
              placeholder="Write your draft content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="8"
            />

            <div className="character-count">
              {content.length} characters
            </div>
          </div>

          {/* Buttons */}
          <div className="button-group">
            {editingId !== null ? (
              <>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={updateDraft}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Draft"}
                </button>

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={cancelEdit}
                  disabled={loading}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                className="primary-btn"
                onClick={saveDraft}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Draft"}
              </button>
            )}
          </div>

          {/* Message */}
          {message && (
            <div
              className={`message ${
                message.includes("successfully") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}
        </section>

        {/* Saved Drafts */}
        <section className="draft-section">
          <div className="draft-section-header">
            <div>
              <h2>Saved Drafts</h2>
              <p>Your saved drafts are stored locally in your browser.</p>
            </div>

            <span className="draft-count">
              {drafts.length} {drafts.length === 1 ? "Draft" : "Drafts"}
            </span>
          </div>

          {/* Empty State */}
          {drafts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No drafts yet</h3>
              <p>
                Create your first draft using the form above.
              </p>
            </div>
          ) : (
            <div className="draft-list">
              {drafts.map((draft) => (
                <article className="draft-card" key={draft.id}>
                  <div className="draft-card-content">
                    <h3>{draft.title}</h3>

                    <p className="draft-text">{draft.content}</p>

                    <div className="draft-date">
                      <span>
                        Created: {draft.createdAt}
                      </span>

                      {draft.updatedAt && (
                        <span>
                          Updated: {draft.updatedAt}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="draft-actions">
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => editDraft(draft)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => deleteDraft(draft.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>React Draft Management System</p>
      </footer>
    </div>
  );
}

export default App;