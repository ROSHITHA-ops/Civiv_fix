import { Link } from 'react-router-dom'
import { ArrowRight, Bell, CheckCircle2, CircleAlert, Clock3, MapPin, ThumbsUp } from 'lucide-react'

export function Brand({ light = false }) {
  return <Link to="/" className={`brand ${light ? 'brand-light' : ''}`}><span className="brand-mark">C</span><span>Civic<span className="brand-accent">Connect</span></span></Link>
}

export function StatusBadge({ status }) {
  const key = status?.toLowerCase().replaceAll(' ', '-')
  return <span className={`status-badge status-${key}`}>{status}</span>
}

export function StatCard({ label, value, note, icon: Icon, tone = 'teal' }) {
  return <div className="stat-card"><div className={`stat-icon icon-${tone}`}><Icon size={19} /></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div>{note && <div className="stat-note">{note}</div>}</div>
}

export function PageTitle({ eyebrow, title, description, action }) {
  return <div className="page-title"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>
}

export function IssueCard({ issue, onUpvote, voted }) {
  return <article className="issue-card">
    <Link to={`/issues/${issue.id}`} className="issue-image-link"><img src={issue.image || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=960&q=80'} alt="" className="issue-image" /><span className="category-chip">{issue.category}</span></Link>
    <div className="issue-body"><div className="issue-meta"><span><MapPin size={14} />{issue.city}</span><span>{new Date(issue.reportedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></div>
      <Link to={`/issues/${issue.id}`} className="issue-title"><h3>{issue.title}</h3></Link><p className="issue-location">{issue.area}</p>
      <div className="issue-card-footer"><StatusBadge status={issue.status} /><div className="issue-actions"><button className={`vote-button ${voted ? 'is-voted' : ''}`} onClick={() => onUpvote?.(issue.id)} aria-label="Upvote issue"><ThumbsUp size={15} />{issue.votes || 0}</button><Link className="text-link" to={`/issues/${issue.id}`}>Details <ArrowRight size={14} /></Link></div></div>
    </div>
  </article>
}

export function EmptyState({ title = 'Nothing to see here yet', text = 'Try changing your filters or check back later.' }) {
  return <div className="empty-state"><div className="empty-icon"><CircleAlert size={22} /></div><h3>{title}</h3><p>{text}</p></div>
}

export function NotificationRow({ item }) {
  const Icon = item.type === 'resolved' ? CheckCircle2 : item.type === 'update' ? Clock3 : Bell
  return <div className="notification-row"><div className={`notification-icon ${item.type || ''}`}><Icon size={17} /></div><div><strong>{item.title}</strong><p>{item.message}</p><small>{item.date || 'Just now'}</small></div></div>
}
