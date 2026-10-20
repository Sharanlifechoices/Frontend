import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaTrash, FaRegCalendarAlt } from 'react-icons/fa'
import { useAuth } from '../context/auth-context'
import { useCart } from '../context/cart-context'
import { checkoutCart } from '../lib/checkout'
import { niceDate } from '../lib/dates'
import { formatMoney } from '../lib/money'
import AddToCartButton from '../components/commerce/AddToCartButton'
import ScheduleModal from '../components/commerce/ScheduleModal'
import '../components/commerce/Commerce.css'
import './Cart.css'

const REC_TITLES = {
  people_also_liked: 'People also liked',
  explore_with_sharan: 'You might be interested in exploring with Sharan Babaji',
}

function Thumb({ item }) {
  return item.cover
    ? <img src={item.cover} alt="" className="cart-thumb" />
    : <span className="cart-thumb cart-thumb--icon" aria-hidden="true"><FaRegCalendarAlt /></span>
}

function Recommendations({ recs }) {
  const groups = Object.keys(REC_TITLES).map((reason) => ({ reason, picks: recs.filter((r) => r.reason === reason) })).filter((g) => g.picks.length)
  if (!groups.length) return null
  return (
    <div className="cart-recs">
      {groups.map(({ reason, picks }) => (
        <section key={reason}>
          <h2>{REC_TITLES[reason]}</h2>
          <div className="cart-rec-grid">
            {picks.map(({ item }) => (
              <article className="cart-rec" key={item.id}>
                <Thumb item={item} />
                <div className="cart-rec-info">
                  <Link to={item.route || '/books'}><strong>{item.title}</strong></Link>
                  {item.subtitle && <span className="cm-muted">{item.subtitle}</span>}
                  <span className="cart-price">{formatMoney(item.price_minor, item.currency)}</span>
                </div>
                <AddToCartButton item={item} label="Add" variant="outline" />
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

const BOOK_MAIL_SEARCH = 'Welcome to the World of NumberSaysSo'
const BOOK_MAIL_FROM = 'info@my-lifechoices.com'

/** Where the book email went and how to find it if it was filed under Spam or Promotions. */
function MailHint({ sentTo, searchFor = BOOK_MAIL_SEARCH, from = BOOK_MAIL_FROM }) {
  return (
    <div className="cart-mailhint" role="note">
      {sentTo && <p>We&rsquo;ve sent your book link to <strong>{sentTo}</strong>.</p>}
      <p>
        Can&rsquo;t find it? Search your mail for <strong>&ldquo;{searchFor}&rdquo;</strong> and check your <strong>Spam</strong> and <strong>Promotions</strong> folders.
        If it&rsquo;s there, mark it <em>Not spam</em> or move it to <em>Primary</em> so future mail from {from} reaches you.
      </p>
    </div>
  )
}

function Receipt({ result }) {
  const { status, order } = result
  const mail = order?.confirmation_email
  const hasBook = order?.items.some((i) => i.pdf_url)
  return (
    <section className="cart-page">
      <div className="container cart-narrow">
        <div className="cart-receipt">
          <div className="success-icon">&#10003;</div>
          {status === 'paid' ? (
            <>
              <h1>Thank you!</h1>
              <p>Your payment is confirmed. A receipt {order.items.some((i) => i.pdf_url) ? 'with your book download links ' : ''}is on its way to your email.</p>
              {(mail || hasBook) && <MailHint sentTo={mail?.sent_to} searchFor={mail?.search_for} from={mail?.from} />}
              <ul className="cart-receipt-items">
                {order.items.map((i, n) => (
                  <li key={`${i.item_id}-${n}`}>
                    <span>{i.title}{i.subtitle ? ` — ${i.subtitle}` : ''}
                      {i.preferred_date && <em> · {niceDate(i.preferred_date)}, {i.preferred_time} SGT (to be confirmed)</em>}
                    </span>
                    {i.pdf_url && <a href={i.pdf_url} target="_blank" rel="noopener noreferrer">Download PDF</a>}
                  </li>
                ))}
              </ul>
              <p className="cart-total-line"><span>Paid</span><strong>{formatMoney(order.total_minor, order.currency)}</strong></p>
            </>
          ) : (
            <>
              <h1>Payment received</h1>
              <p>We could not confirm it with our server just now, but your payment went through. We are finishing your order and you will get an email shortly. You can also check <Link to="/profile">your purchases</Link> in a few minutes.</p>
              <MailHint />

            </>
          )}
          <div className="cm-actions">
            <Link to="/profile" className="btn-primary"><span>View my purchases</span></Link>
            <Link to="/books" className="btn-outline"><span>Keep browsing</span></Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Cart() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { items, total_minor: total, currency, notice, dismissNotice, removeItem, updateSchedule, refresh, recommendations } = useCart()
  const [recs, setRecs] = useState([])
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [rowError, setRowError] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    let alive = true
    recommendations().then((r) => alive && setRecs(r)).catch(() => {})
    return () => { alive = false }
  }, [recommendations])

  const remove = async (id) => {
    setRowError('')
    try { await removeItem(id) } catch (e) { setRowError(e.message) }
  }

  const saveSchedule = async ({ date, time }) => {
    setBusy(true)
    setRowError('')
    try {
      await updateSchedule(editing.id, { date, time })
      setEditing(null)
    } catch (e) {
      setRowError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const pay = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } })
      return
    }
    setBusy(true)
    setError('')
    try {
      const outcome = await checkoutCart()
      if (outcome.status === 'dismissed') {
        setError(outcome.error ? `Payment was not completed: ${outcome.error}` : 'Payment was not completed. Your cart is unchanged.')
      } else {
        setResult(outcome)
        refresh().catch(() => {})
      }
    } catch (e) {
      setError(e.paymentId ? `We could not verify your payment (reference ${e.paymentId}). If you were charged, please contact us with this reference.` : e.message)
      if (e.status === 400 || e.status === 409) refresh().catch(() => {})
    } finally {
      setBusy(false)
    }
  }

  if (result) return <Receipt result={result} />

  return (
    <section className="cart-page">
      <div className="container cart-narrow">
        <h1 className="cart-title">Your cart</h1>

        {notice && (
          <div className="cm-banner" role="status">
            {notice} <button type="button" className="cm-link" onClick={dismissNotice}>Dismiss</button>
          </div>
        )}

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <div className="cm-actions">
              <Link to="/books" className="btn-primary"><span>Browse books</span></Link>
              <Link to="/numerology" className="btn-outline"><span>Explore sessions</span></Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="cart-lines">
              {items.map((item) => (
                <li className="cart-line" key={item.id}>
                  <Thumb item={item} />
                  <div className="cart-line-info">
                    <strong>{item.title}</strong>
                    {item.subtitle && <span className="cm-muted">{item.subtitle}</span>}
                    {item.requires_schedule && (
                      <span className="cart-schedule">
                        <FaRegCalendarAlt /> {item.preferred_date ? `${niceDate(item.preferred_date)}, ${item.preferred_time} SGT` : 'Choose a time'}
                        <button type="button" className="cm-link" onClick={() => setEditing(item)}>Change</button>
                      </span>
                    )}
                  </div>
                  <span className="cart-price">{formatMoney(item.price_minor, item.currency)}</span>
                  <button type="button" className="cart-remove" onClick={() => remove(item.id)} aria-label={`Remove ${item.title}`}><FaTrash /></button>
                </li>
              ))}
            </ul>
            {rowError && <p className="cm-error" role="alert">{rowError}</p>}

            <div className="cart-summary">
              <p className="cart-total-line"><span>Total</span><strong>{formatMoney(total, currency)}</strong></p>
              {!user && <p className="cm-muted">Sign in or create a free account to check out. Your cart will be waiting.</p>}
              {error && <p className="cm-error" role="alert">{error}</p>}
              <button type="button" className="btn-primary cart-pay" onClick={pay} disabled={busy}>
                <span>{busy ? 'Please wait…' : user ? `Pay ${formatMoney(total, currency)}` : 'Sign in to check out'}</span>
              </button>
              <p className="cm-muted cart-secure">Payments are processed securely by Razorpay.</p>
            </div>
          </>
        )}

        <Recommendations recs={recs} />
      </div>

      {editing && (
        <ScheduleModal
          title={editing.title} initial={{ date: editing.preferred_date || '', time: editing.preferred_time || '' }}
          confirmLabel="Save time" busy={busy} error={rowError} onConfirm={saveSchedule} onClose={() => { setEditing(null); setRowError('') }}
        />
      )}
    </section>
  )
}
