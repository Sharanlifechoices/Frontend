import { useCallback, useEffect, useState } from 'react'
import { admin } from '../../lib/adminApi'
import { uploadImage } from '../../lib/cloudinary'
import { Status } from './shared'
import { useAdminLoad, when } from './utils'

/** Gallery images and retreat images share one table; `kind` picks which half this tab manages. */
export default function GalleryTab({ kind }) {
  const loader = useCallback(() => admin.get(`/admin/gallery?type=${kind}`), [kind])
  const { data, loading, error, reload } = useAdminLoad(loader)
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!file) return undefined
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const upload = async (e) => {
    e.preventDefault()
    if (!file || !title.trim()) return
    setBusy(true)
    setMessage('')
    try {
      const url = await uploadImage(file)
      await admin.post('/admin/gallery', { url, title: title.trim(), type: kind })
      setTitle('')
      setFile(null)
      setPreview('')
      reload()
    } catch (err) {
      setMessage(err.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (item) => {
    if (!window.confirm(`Remove "${item.title}" from the ${kind === 'retreat' ? 'retreat gallery' : 'gallery'}?`)) return
    try {
      await admin.delete(`/admin/gallery/${item.id}`)
      reload()
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="ad-section">
      <form className="ad-toolbar" onSubmit={upload}>
        <input className="ad-input ad-grow" placeholder="Title / caption" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
        <label className="ad-btn">
          {file ? file.name : 'Choose image…'}
          <input type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
        <button className="ad-btn ad-btn--primary" disabled={busy || !file || !title.trim()}>{busy ? 'Uploading…' : 'Upload'}</button>
      </form>
      {preview && <img src={preview} alt="Preview" className="ad-preview" />}
      {message && <p className="ad-error" role="alert">{message}</p>}

      <Status loading={loading} error={error}>
        {data && (data.items.length === 0 ? <p className="ad-muted ad-center">No images yet.</p> : (
          <div className="ad-gallery">
            {data.items.map((item) => (
              <figure key={item.id} className="ad-gallery-item">
                <img src={item.url} alt={item.title} loading="lazy" />
                <figcaption>
                  <strong>{item.title}</strong>
                  <span className="ad-muted">{when(item.created_at)}</span>
                  <button className="ad-btn ad-btn--danger" onClick={() => remove(item)}>Remove</button>
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </Status>
    </div>
  )
}
