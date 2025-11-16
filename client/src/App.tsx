import { useEffect, useState } from 'react'
import './App.css'

type Comment = {
  _id: string
  videoId: string
  text: string
  createdAt?: string
  replies?: { _id: string; text: string; createdAt?: string }[]
}

type Note = {
  _id: string
  videoId: string
  note: string
  createdAt?: string
}

type EventLog = {
  _id: string
  videoId?: string
  event: string
  createdAt?: string
}

function CommentReply({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState('')
  return (
    <div className="flex items-center gap-2">
      <input className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Reply" value={text} onChange={(e)=>setText(e.target.value)} />
      <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={()=>{ onSubmit(text); setText('') }}>Send</button>
    </div>
  )
}

const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const [videoId, setVideoId] = useState<string>('TLewwYmQ_tA')
  // Removed loading/error telemetry for a lean UI

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')

  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingNoteText, setEditingNoteText] = useState('')

  const [events, setEvents] = useState<EventLog[]>([])

  const [darkMode, setDarkMode] = useState<boolean>(false)

  useEffect(() => {
    const saved = localStorage.getItem('ytvc-theme')
    if (saved === 'dark') setDarkMode(true)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
      localStorage.setItem('ytvc-theme','dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('ytvc-theme','light')
    }
  }, [darkMode])

  function toggleDarkMode() {
    setDarkMode(d => !d)
  }

  // Load defaults on initial render
  useEffect(() => {
    loadComments()
    loadNotes()
    loadEvents()
  }, [])

  async function api(path: string, method: string = 'GET', body?: any) {
    const res = await fetch(apiUrl + path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || 'Request failed')
    }
    try {
      return await res.json()
    } catch {
      return null
    }
  }

  async function loadVideoDetails() {
    try {
      const data = await api(`/video/details/${videoId}`)
      if (data) {
        setTitle(data?.video?.snippet?.title ?? '')
        setDescription(data?.video?.snippet?.description ?? '')
        if (Array.isArray(data.notes)) setNotes(data.notes)
      }
    } catch {
    }
  }

  useEffect(() => {
      loadVideoDetails()
  }, [])

  async function saveVideoDetails() {
    if (!videoId) return
    try {
      await api(`/video/update/${videoId}`, 'PATCH', { title, description })
    } catch {
    }
  }

  async function loadComments() {
    try {
      const data = await api(`/comments/${videoId}`)
      if (data && data.items && Array.isArray(data.items)) {
        const items = data.items
        const mapped = (items as any[]).map((item) => {
          const top = item.snippet?.topLevelComment?.snippet
          const text = top?.textOriginal ?? ''
          const createdAt = top?.publishedAt ?? undefined
          const cId = item.id ?? ''
          const videoFrom = top?.videoId ?? videoId
          let replies: Comment['replies'] = []
          const repliesList = item.snippet?.replies?.comments
          if (Array.isArray(repliesList)) {
            replies = repliesList.map((r: any) => ({
              _id: r.id ?? '',
              text: r.snippet?.textOriginal ?? '',
              createdAt: r.snippet?.publishedAt ?? undefined
            }))
          }
          return { _id: cId, videoId: videoFrom, text, createdAt, replies } as Comment
        })
        setComments(mapped)
      } else if (Array.isArray(data)) {
        setComments(data as Comment[])
      }
    } catch {
    }
  }

  async function addComment() {
    if (!videoId || !newComment.trim()) return
    try {
      await api(`/comments/${videoId}`, 'POST', { text: newComment.trim() })
      setNewComment('')
      await loadComments()
    } catch {
    }
  }

  async function deleteComment(id: string) {
    try {
      await api(`/comments/${id}`, 'DELETE')
      await loadComments()
    } catch {
    }
  }

  async function addReply(commentId: string, text: string) {
    if (!text.trim()) return
    await api(`/comments/reply/${commentId}`, 'POST', { text: text.trim() })
    await loadComments()
  }

  async function loadNotes() {
    try {
      const data = await api(`/notes/${videoId}`)
      if (Array.isArray(data)) setNotes(data)
    } catch {
    }
  }

  async function addNote() {
    if (!videoId || !newNote.trim()) return
    await api(`/notes/${videoId}`, 'POST', { note: newNote.trim() })
    setNewNote('')
    await loadNotes()
  }

  async function updateNote(noteId: string) {
    try {
      await api(`/notes/${noteId}`, 'PATCH', { note: editingNoteText })
      setEditingNoteId(null)
      setEditingNoteText('')
      await loadNotes()
    } catch {
    }
  }

  async function deleteNote(noteId: string) {
    await api(`/notes/${noteId}`, 'DELETE')
    await loadNotes()
  }

  async function loadEvents() {
    try {
      const data = await api('/events')
      if (Array.isArray(data)) setEvents(data)
    } catch {
    }
  }

  return (
    <div className={`min-h-screen bg-gray-50 text-gray-900 font-sans ${darkMode ? 'dark' : ''}`} >
      <header className="p-4 border-b shadow-sm flex items-center justify-between flex-wrap gap-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-500 text-white dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold flex items-center gap-2">🎬 YouTube Video Controller</span>
          <span className="text-sm hidden sm:inline text-white/90">Lean UI</span>
        </div>
        <div className="flex items-center gap-2">
          <input aria-label="Video ID" className="border border-white/60 bg-white/90 dark:bg-gray-800/60 text-black dark:text-white rounded px-2 py-1 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-white/60" value={videoId} onChange={(e)=>setVideoId(e.target.value)} placeholder="video-id" />
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-white/60" onClick={loadVideoDetails}>Load</button>
          <button aria-label="Toggle color scheme" onClick={toggleDarkMode} className="p-2 ml-1 rounded bg-white/90 text-gray-800 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-white/60">{darkMode ? '🌙' : '☀️'}</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2 dark:text-white">Video Preview</h2>
          <div className="w-full relative" style={{ paddingBottom: '56.25%', height: 0 }}>
            <iframe
              title="video-preview"
              src={videoId ? `https://www.youtube.com/embed/${videoId}` : ''}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0, borderRadius: '12px' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-2">
              <label className="w-20 text-right text-sm text-gray-600 dark:text-gray-300">Title</label>
              <input className="border border-gray-300 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500" value={title} onChange={(e)=>setTitle(e.target.value)} />
            </div>
            <div className="flex items-start gap-2 mb-2">
              <label className="w-20 text-right text-sm text-gray-600 dark:text-gray-300 pt-2">Description</label>
              <textarea className="border border-gray-300 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500" value={description} onChange={(e)=>setDescription(e.target.value)} rows={4} />
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={saveVideoDetails}>Save</button>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4" aria-label="comments">
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Comments</h2>
            <div className="flex items-center gap-2 mb-2">
              <input className="flex-1 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add a comment" value={newComment} onChange={(e)=>setNewComment(e.target.value)} />
              <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={addComment}>Add</button>
            </div>
            <button className="mb-2 bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600" onClick={loadComments}>Load</button>
            <ul>
              {comments.map((c)=> (
                <li key={c._id} className="mb-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  <div className="mb-1">{c.text}</div>
                  {c.createdAt && <span className="text-xs text-gray-500">{c.createdAt}</span>}
                  <div className="mt-1 mb-1"><CommentReply onSubmit={(txt)=>addReply(c._id, txt)} /></div>
                  <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={()=>deleteComment(c._id)}>Delete</button>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4" aria-label="notes">
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Notes</h2>
            <div className="flex items-center gap-2 mb-2">
              <input className="flex-1 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add note" value={newNote} onChange={(e)=>setNewNote(e.target.value)} />
              <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={addNote}>Add</button>
            </div>
            <button className="mb-2 bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600" onClick={loadNotes}>Load</button>
            <ul>
              {notes.map((n)=> (
                <li key={n._id} className="mb-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  {editingNoteId === n._id ? (
                    <div className="flex items-center gap-2">
                      <input className="flex-1 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editingNoteText} onChange={(e)=>setEditingNoteText(e.target.value)} />
                      <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={()=>updateNote(n._id)}>Save</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{n.note}</span>
                      <span className="text-xs text-gray-500">{n.createdAt ?? ''}</span>
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={()=>{ setEditingNoteId(n._id); setEditingNoteText(n.note) }}>Edit</button>
                      <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={()=>deleteNote(n._id)}>Delete</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4" aria-label="events">
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Events</h2>
            <button className="mb-2 bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600" onClick={loadEvents}>Load</button>
            <ul>
              {events.map((e)=> (
                <li key={e._id} className="mb-1 flex items-center gap-2">
                  <span>{e.event}</span>
                  {e.createdAt && <span className="text-xs text-gray-500">{e.createdAt}</span>}
                </li>
              ))}
            </ul>
          </section>
        </section>
      </main>
    </div>
  )
}

export default App
