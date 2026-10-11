import { useCallback, useEffect, useState } from 'react'
import { admin } from '../../lib/adminApi'
import { Badge, Status } from './shared'
import { STATUS_TONE, useAdminLoad, when } from './utils'

const STARTER = '<h2>Hello from My LifeChoices</h2>\n<p>Write your update here.</p>\n<p>With gratitude,<br>Sharan Babaji</p>'

function Editor({ draft, onSaved, onClear }) {
  const [subject, setSubject] = useState(draft?.subject || '')
  const [body, setBody] = useState(draft?.body_html || STARTER)
  const [testTo, setTestTo] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const editable = !draft || draft.status === 'draft'

  const save = async () => {
    setBusy(true)
    setMessage('')
    try {
      const saved = draft ? await admin.put(`/admin/newsletters/${draft.id}`, { subject, body_html: body }) : await admin.post('/admin/newsletters', { subject, body_html: body })
      setMessage('Draft saved.')
      onSaved(saved)
      return saved
    } catch (e) {
      setMessage(e.message)
      return null
    } finally {
      setBusy(false)
    }
  }

  const sendTest = async () => {
    setMessage('')
    const saved = editable ? await save() : draft
    if (!saved) return
    setBusy(true)
    try {
      await admin.post(`/admin/newsletters/${saved.id}/test`, { to: testTo.trim() })
      setMessage(`Test email sent to ${testTo.trim()}.`)
    } catch (e) {
      setMessage(`Test failed: ${e.message}`)
    } finally {
      setBusy(false)
    }
  }

  const send = async () => {
    setMessage('')
    const saved = editable ? await save() : draft
    if (!saved) return
    setBusy(true)
    try {
      const { count } = await admin.get('/admin/newsletter/audience')
      if (!window.confirm(`Send "${subject}" to ${count} people now? This cannot be undone.`)) return
      await admin.post(`/admin/newsletters/${saved.id}/send`, { confirm_audience: count })
      setMessage('Sending started. Progress shows in the list below.')
      onSaved({ ...saved, status: 'sending' })
    } catch (e) {
      setMessage(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ad-panel">
      <div className="ad-toolbar">
        <h3 className="ad-grow">{draft ? (editable ? 'Edit draft' : `Newsletter (${draft.status})`) : 'New newsletter'}</h3>
        {draft && <button className="ad-link" onClick={onClear}>Close ✕</button>}
      </div>
      <input className="ad-input" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={200} disabled={!editable} />
      <div className="ad-two-col">
        <textarea className="ad-input ad-code" rows={14} value={body} onChange={(e) => setBody(e.target.value)} disabled={!editable} spellCheck={false} aria-label="Email body (HTML)" />
        <iframe className="ad-preview-frame" title="Email preview" sandbox="" srcDoc={`<body style="font-family:Arial,sans-serif;color:#222;padding:16px">${body}</body>`} />
      </div>
      <p className="ad-muted">The body is HTML. A footer with an unsubscribe link is added automatically to every email.</p>
      <div className="ad-toolbar">
        {editable && <button className="ad-btn" onClick={save} disabled={busy || !subject.trim() || !body.trim()}>Save draft</button>}
        <input className="ad-input" type="email" placeholder="Test email address" value={testTo} onChange={(e) => setTestTo(e.target.value)} />
        <button className="ad-btn" onClick={sendTest} disabled={busy || !testTo.trim() || !subject.trim()}>Send test</button>
        {(editable || draft?.status === 'partial') && (
          <button className="ad-btn ad-btn--primary" onClick={send} disabled={busy || !subject.trim() || !body.trim()}>{draft?.status === 'partial' ? 'Resume sending' : 'Send to everyone…'}</button>
        )}
      </div>
      {message && <p className="ad-muted" role="status">{message}</p>}
    </div>
  )
}

export default function NewsletterTab() {
  const [selected, setSelected] = useState(null) // null = list only, 'new' or a newsletter row = editor
  const audienceLoader = useCallback(() => admin.get('/admin/newsletter/audience'), [])
  const audience = useAdminLoad(audienceLoader)
  const listLoader = useCallback(() => admin.get('/admin/newsletters'), [])
  const list = useAdminLoad(listLoader)
  const reloadList = list.reload
  const anySending = Boolean(list.data?.newsletters.some((n) => n.status === 'sending'))

  useEffect(() => {
    if (!anySending) return undefined
    const timer = setInterval(reloadList, 4000) // progress while a send is running
    return () => clearInterval(timer)
  }, [anySending, reloadList])

  const open = async (n) => {
    try { setSelected(await admin.get(`/admin/newsletters/${n.id}`)) } catch { /* shown by the list on next reload */ }
  }
  const remove = async (n) => {
    if (!window.confirm(`Delete draft "${n.subject}"?`)) return
    try { await admin.delete(`/admin/newsletters/${n.id}`); reloadList() } catch { /* only drafts can be deleted */ }
  }

  return (
    <div className="ad-section">
      <div className="ad-panel">
        <h3>Audience</h3>
        <Status loading={audience.loading} error={audience.error}>
          {audience.data && (
            <>
              <p><strong className="ad-big">{audience.data.count}</strong> people would receive a newsletter today: verified, subscribed accounts that signed up or bought something in the last {audience.data.window_days} days.</p>
              {audience.data.sample.length > 0 && <p className="ad-muted">e.g. {audience.data.sample.slice(0, 5).join(', ')}{audience.data.count > 5 ? '…' : ''}</p>}
            </>
          )}
        </Status>
        <button className="ad-link" onClick={audience.reload}>Refresh</button>
      </div>

      {selected ? (
        <Editor key={selected === 'new' ? 'new' : selected.id} draft={selected === 'new' ? null : selected}
          onSaved={(n) => { setSelected(n); reloadList() }} onClear={() => setSelected(null)} />
      ) : (
        <button className="ad-btn ad-btn--primary" onClick={() => setSelected('new')}>+ New newsletter</button>
      )}

      <h3>Newsletters</h3>
      <Status loading={list.loading && !list.data} error={list.error}>
        {list.data && (list.data.newsletters.length === 0 ? <p className="ad-muted">None yet.</p> : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead><tr><th>Subject</th><th>Status</th><th>Sent</th><th>Failed</th><th>Created</th><th /></tr></thead>
              <tbody>
                {list.data.newsletters.map((n) => (
                  <tr key={n.id} className="ad-clickable" onClick={() => open(n)}>
                    <td><strong>{n.subject}</strong></td>
                    <td><Badge tone={STATUS_TONE[n.status]}>{n.status}</Badge></td>
                    <td>{n.sent_count}{n.audience_count != null ? ` / ${n.audience_count}` : ''}</td>
                    <td>{n.failed_count || '—'}</td>
                    <td>{when(n.created_at)}</td>
                    <td onClick={(e) => e.stopPropagation()}>{n.status === 'draft' && <button className="ad-link" onClick={() => remove(n)}>Delete</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </Status>
    </div>
  )
}
