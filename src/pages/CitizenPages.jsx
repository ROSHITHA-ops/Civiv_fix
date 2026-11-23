import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowRight, CheckCircle2, ChevronDown, Clock3, FilePlus2, ImagePlus, MapPin, MessageCircle, Search, Send, ShieldCheck, ThumbsUp, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { categories, statuses } from '../data/mockData'
import { EmptyState, IssueCard, NotificationRow, PageTitle, StatCard, StatusBadge } from '../components/UI'

export function getMonthlyTrend(reports, key = 'submitted') {
  const now = new Date()
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    return { month: date.toLocaleDateString('en-IN', { month: 'short' }), [key]: reports.filter((report) => report.reportedAt?.startsWith(monthKey)).length }
  })
}

function useUpvote() {
  const { complaints, setComplaints } = useApp()
  const [voted, setVoted] = useState(() => JSON.parse(localStorage.getItem('civicconnect_votes') || '[]'))
  function upvote(id) {
    if (voted.includes(id)) return
    const updated = [...voted, id]
    setVoted(updated)
    localStorage.setItem('civicconnect_votes', JSON.stringify(updated))
    setComplaints((current) => current.map((item) => item.id === id ? { ...item, votes: (item.votes || 0) + 1 } : item))
  }
  return { complaints, upvote, voted }
}

export function CitizenDashboard() {
  const { complaints, user, notifications } = useApp()
  const my = complaints.filter((item) => item.citizenEmail === user?.email)
  const monthData = getMonthlyTrend(my)
  const resolved = my.filter((item) => item.status === 'Resolved').length
  const inProgress = my.filter((item) => item.status === 'In Progress').length
  const pending = my.filter((item) => ['Submitted', 'Under Review'].includes(item.status)).length
  return <>
    <PageTitle eyebrow={`MONDAY, ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}`} title={`Good morning, ${user?.name?.split(' ')[0] || 'neighbor'}.`} description="Here’s what’s happening with your neighborhood reports." action={<Link className="button button-primary" to="/app/report"><FilePlus2 size={16} /> Report an issue</Link>} />
    <div className="stats-grid four"><StatCard label="Total complaints" value={my.length} note="Reports you've submitted" icon={FilePlus2} tone="teal" /><StatCard label="Awaiting action" value={pending} note="Submitted or under review" icon={Clock3} tone="amber" /><StatCard label="In progress" value={inProgress} note="Your city is working on it" icon={MessageCircle} tone="blue" /><StatCard label="Resolved" value={resolved} note="Issues fixed in your area" icon={CheckCircle2} tone="green" /></div>
    <div className="dashboard-grid"><section className="panel trend-panel"><div className="panel-heading"><div><h2>Your reporting activity</h2><p>A look at reports from the last six months</p></div><span className="period-chip">Last 6 months <ChevronDown size={14} /></span></div><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><AreaChart data={monthData} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}><defs><linearGradient id="citizenGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d9385" stopOpacity={0.22} /><stop offset="95%" stopColor="#0d9385" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#eef1f4" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8b96a5', fontSize: 12 }} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#8b96a5', fontSize: 12 }} /><Tooltip /><Area type="monotone" dataKey="submitted" stroke="#108c81" strokeWidth={2.5} fill="url(#citizenGradient)" /></AreaChart></ResponsiveContainer></div></section>
      <section className="panel quick-panel"><div className="panel-heading"><div><h2>Quick actions</h2><p>Make your voice count</p></div></div><Link className="quick-action primary-quick" to="/app/report"><div className="quick-action-icon"><FilePlus2 size={18} /></div><div><strong>Report an issue</strong><small>Tell us what needs attention</small></div><ArrowRight size={17} /></Link><Link className="quick-action" to="/app/my-complaints"><div className="quick-action-icon secondary"><Search size={18} /></div><div><strong>Track my complaints</strong><small>See updates on your reports</small></div><ArrowRight size={17} /></Link><Link className="quick-action" to="/issues"><div className="quick-action-icon secondary"><MapPin size={18} /></div><div><strong>Explore public issues</strong><small>See what neighbors reported</small></div><ArrowRight size={17} /></Link></section></div>
    <div className="dashboard-grid lower-grid"><section className="panel"><div className="panel-heading"><div><h2>Recent complaints</h2><p>Your latest community reports</p></div><Link className="text-link" to="/app/my-complaints">View all <ArrowRight size={14} /></Link></div>{my.length ? <ComplaintTable rows={my.slice(0, 5)} /> : <EmptyState title="Your first report starts here" text="Let your city know what needs attention in your neighborhood." />}</section><section className="panel"><div className="panel-heading"><div><h2>Recent updates</h2><p>Stay in the know</p></div><Link className="text-link" to="/app/notifications">See all <ArrowRight size={14} /></Link></div><div className="notification-list compact">{notifications.slice(0, 4).map((item) => <NotificationRow item={item} key={item.id} />)}{!notifications.length && <div className="quiet-note">Updates about your reports will appear here.</div>}</div></section></div>
  </>
}

export function ComplaintTable({ rows, admin = false, onStatusChange, onDelete }) {
  return <div className="table-scroll"><table className="data-table"><thead><tr><th>Issue</th>{admin && <th>Reporter</th>}<th>Reported</th><th>Status</th>{onStatusChange && <th>Update status</th>}{onDelete && <th></th>}</tr></thead><tbody>{rows.map((item) => <tr key={item.id}><td><Link to={`/issues/${item.id}`} className="table-issue"><span>{item.title}</span><small>{item.id} · {item.category}</small></Link></td>{admin && <td>{item.citizenName}<small>{item.city}</small></td>}<td>{new Date(item.reportedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td><td><StatusBadge status={item.status} /></td>{onStatusChange && <td><select className="table-select" value={item.status} onChange={(e) => onStatusChange(item.id, e.target.value)} aria-label={`Set status for ${item.id}`}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td>}{onDelete && <td>{item.status === 'Submitted' && <button className="icon-button danger-icon" onClick={() => onDelete(item.id)} aria-label={`Delete ${item.id}`}><Trash2 size={16} /></button>}</td>}</tr>)}</tbody></table></div>
}

export function ReportIssue() {
  const { user, setComplaints, addNotification } = useApp()
  const navigate = useNavigate()
  const [values, setValues] = useState({ title: '', description: '', category: '', city: '', area: '', landmark: '', priority: 'Medium' })
  const [image, setImage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  function update(key, value) { setValues((current) => ({ ...current, [key]: value })) }
  function selectImage(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return setError('Please choose an image file.')
    if (file.size > 5 * 1024 * 1024) return setError('Image must be 5 MB or smaller.')
    const reader = new FileReader()
    reader.onload = () => {
      const source = new Image()
      source.onload = () => {
        const scale = Math.min(1, 1200 / Math.max(source.width, source.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(source.width * scale)
        canvas.height = Math.round(source.height * scale)
        canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height)
        setImage(canvas.toDataURL('image/jpeg', 0.78))
        setError('')
      }
      source.onerror = () => setError('We couldn’t process that image. Please try another.')
      source.src = String(reader.result)
    }
    reader.onerror = () => setError('We couldn’t read that image. Please try another.')
    reader.readAsDataURL(file)
  }
  function submit(event) {
    event.preventDefault()
    setError('')
    if (!values.title.trim() || !values.description.trim() || !values.category || !values.city.trim() || !values.area.trim()) return setError('Please complete all required fields.')
    if (values.title.trim().length < 5) return setError('Issue title should be at least 5 characters.')
    setSaving(true)
    const id = `CC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    const item = { ...values, title: values.title.trim(), description: values.description.trim(), id, citizenEmail: user.email, citizenName: user.name, image, votes: 0, status: 'Submitted', reportedAt: new Date().toISOString().slice(0, 10), officer: '', comments: [], history: [{ status: 'Submitted', date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) }] }
    setComplaints((current) => [item, ...current])
    addNotification({ type: 'submitted', title: 'Issue report submitted', message: `${item.id} · ${item.title}`, date: 'Just now' })
    navigate(`/issues/${id}`, { state: { submitted: true } })
    setSaving(false)
  }
  return <>
    <PageTitle eyebrow="MAKE A DIFFERENCE" title="Report an issue" description="A few details can help your city team find and fix the problem." />
    <form className="report-layout" onSubmit={submit} noValidate><div className="report-main panel"><div className="form-section-title"><span>01</span><div><h2>Tell us what’s happening</h2><p>Clear details help the right team take action.</p></div></div>
      <label className="field-label">Issue title <span className="required">*</span><input value={values.title} onChange={(e) => update('title', e.target.value)} maxLength={100} placeholder="e.g. Large pothole near Main Road" /><small>Keep it short and specific</small></label>
      <label className="field-label">Description <span className="required">*</span><textarea rows="5" maxLength={800} value={values.description} onChange={(e) => update('description', e.target.value)} placeholder="Describe the issue, when you noticed it, and how it affects your neighborhood..." /><small>{values.description.length}/800 characters</small></label>
      <div className="form-row"><label className="field-label">Issue category <span className="required">*</span><select value={values.category} onChange={(e) => update('category', e.target.value)}><option value="">Select a category</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label className="field-label">Priority<select value={values.priority} onChange={(e) => update('priority', e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label></div>
      <div className="form-section-title location-title"><span>02</span><div><h2>Where is the issue?</h2><p>Help the city team locate it quickly.</p></div></div>
      <div className="form-row"><label className="field-label">City <span className="required">*</span><input value={values.city} onChange={(e) => update('city', e.target.value)} placeholder="e.g. Pune" /></label><label className="field-label">Area / street <span className="required">*</span><input value={values.area} onChange={(e) => update('area', e.target.value)} placeholder="e.g. Shivajinagar, Main Road" /></label></div>
      <label className="field-label">Nearby landmark <span className="optional">(optional)</span><input value={values.landmark} onChange={(e) => update('landmark', e.target.value)} placeholder="e.g. Near Central Bus Stop" /></label>
      <div className="form-section-title location-title"><span>03</span><div><h2>Add a photo</h2><p>A picture can help the team understand the issue faster.</p></div></div>
      <label className={`upload-zone ${image ? 'has-image' : ''}`}>{image ? <img src={image} alt="Issue preview" /> : <><div className="upload-icon"><ImagePlus size={21} /></div><strong>Drop a photo here, or <span>browse</span></strong><small>JPG, PNG, or WEBP · up to 5 MB</small></>}<input type="file" accept="image/*" onChange={selectImage} hidden /></label>
      <div className="report-submit-row">{error && <div className="form-alert error">{error}</div>}<button disabled={saving} className="button button-primary" type="submit">{saving ? 'Submitting…' : 'Submit complaint'} <ArrowRight size={16} /></button><span><ShieldCheck size={14} /> Your contact details stay private</span></div>
    </div><aside className="report-aside"><div className="panel report-tip"><div className="tip-icon"><CheckCircle2 size={20} /></div><h3>What happens next?</h3><div className="tip-step"><b>01</b><span><strong>We’ll log your report</strong><small>You’ll get a unique tracking ID.</small></span></div><div className="tip-step"><b>02</b><span><strong>Your city reviews it</strong><small>The right team will take a look.</small></span></div><div className="tip-step"><b>03</b><span><strong>Follow the progress</strong><small>Updates appear in your dashboard.</small></span></div></div><div className="privacy-note"><ShieldCheck size={17} /><div><strong>A note on privacy</strong><p>Your report will be visible to the community. Your email and phone number won’t be shown publicly.</p></div></div></aside></form>
  </>
}

export function AllIssues({ compact = false }) {
  const { complaints, upvote, voted } = useUpvote()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(params.get('category') || '')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('newest')
  const [limit, setLimit] = useState(6)
  const filtered = useMemo(() => complaints.filter((item) => {
    const text = `${item.title} ${item.city} ${item.area} ${item.id}`.toLowerCase()
    return text.includes(query.toLowerCase()) && (!category || item.category === category) && (!status || item.status === status)
  }).sort((a, b) => sort === 'popular' ? (b.votes || 0) - (a.votes || 0) : sort === 'oldest' ? a.reportedAt.localeCompare(b.reportedAt) : b.reportedAt.localeCompare(a.reportedAt)), [complaints, query, category, status, sort])
  function changeCategory(value) { setCategory(value); setParams(value ? { category: value } : {}) }
  return <div className={compact ? '' : 'public-issues-page'}>
    {!compact && <div className="public-page-nav"><Link to="/" className="public-back">← <span>Back to home</span></Link><span>THE NEIGHBORHOOD BOARD</span><Link className="button button-primary button-small" to="/login">Join the community <ArrowRight size={15} /></Link></div>}
    <PageTitle eyebrow="YOUR CITY, IN THE OPEN" title="Public issues" description="See what your neighbors are reporting, and follow the progress as your city takes action." action={<Link className="button button-primary" to="/app/report"><FilePlus2 size={16} /> Report an issue</Link>} />
    <div className="filters-bar"><div className="search-field"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search issues, locations or ID..." /></div><select value={category} onChange={(e) => changeCategory(e.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="newest">Most recent</option><option value="oldest">Oldest</option><option value="popular">Most upvoted</option></select></div>
    <div className="result-count">Showing <b>{Math.min(limit, filtered.length)}</b> of <b>{filtered.length}</b> community reports</div>
    {filtered.length ? <div className="issues-grid">{filtered.slice(0, limit).map((issue) => <IssueCard key={issue.id} issue={issue} onUpvote={upvote} voted={voted.includes(issue.id)} />)}</div> : <EmptyState title="No issues match those filters" text="Try another search or clear one of the filters." />}
    {limit < filtered.length && <button className="button button-outline load-more" onClick={() => setLimit((value) => value + 6)}>Load more issues <ChevronDown size={16} /></button>}
  </div>
}

export function IssueDetails() {
  const { id } = useParams()
  const { complaints, setComplaints, user, addNotification } = useApp()
  const { voted, upvote } = useUpvote()
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const issue = complaints.find((item) => item.id === id)
  if (!issue) return <div className="public-issues-page"><EmptyState title="We couldn’t find that issue" text="It may have been removed or the link may be incorrect." /><Link className="button button-primary" to="/issues">Browse public issues</Link></div>
  function comment(event) {
    event.preventDefault()
    if (!text.trim()) return setError('Write a comment before posting.')
    const newComment = { name: user?.name || 'Community member', text: text.trim(), date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) }
    setComplaints((current) => current.map((item) => item.id === id ? { ...item, comments: [...(item.comments || []), newComment] } : item))
    addNotification({ type: 'update', title: 'Comment added', message: `Your comment on ${issue.id} was posted.`, date: 'Just now' })
    setText(''); setError('')
  }
  return <div className="details-page"><Link to="/issues" className="back-link">← Back to public issues</Link><div className="details-layout"><main><div className="details-image"><img src={issue.image} alt={issue.title} /><span className="category-chip">{issue.category}</span></div><div className="details-heading"><div><div className="details-id">{issue.id} <span>·</span> Reported {new Date(issue.reportedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div><h1>{issue.title}</h1></div><StatusBadge status={issue.status} /></div><p className="details-description">{issue.description}</p><div className="detail-location"><MapPin size={17} /><div><strong>{issue.area}</strong><span>{issue.landmark ? `${issue.landmark} · ` : ''}{issue.city}</span></div></div>
      <section className="panel comments-panel"><div className="panel-heading"><div><h2>Community conversation</h2><p>{issue.comments?.length || 0} updates on this issue</p></div><MessageCircle size={19} /></div>{issue.comments?.length ? <div className="comments-list">{issue.comments.map((item, index) => <div className="comment-row" key={`${item.name}-${index}`}><div className="avatar">{item.name.split(' ').map((word) => word[0]).slice(0, 2).join('')}</div><div><div className="comment-author"><strong>{item.name}</strong><small>{item.date}</small></div><p>{item.text}</p></div></div>)}</div> : <p className="quiet-note">No comments yet. Add a helpful update or let your neighbors know you’re following this issue.</p>}<form onSubmit={comment} className="comment-form"><input value={text} onChange={(e) => setText(e.target.value)} placeholder={user ? 'Add a constructive comment…' : 'Sign in to join the conversation'} disabled={!user} /><button className="button button-primary button-small" disabled={!user}><Send size={14} /> Post</button></form>{error && <small className="field-error">{error}</small>}{!user && <Link className="text-link sign-in-hint" to="/login">Sign in to comment <ArrowRight size={13} /></Link>}</section></main>
      <aside><div className="panel detail-side"><h3>Issue overview</h3><div className="detail-fact"><span>Complaint ID</span><b>{issue.id}</b></div><div className="detail-fact"><span>Category</span><b>{issue.category}</b></div><div className="detail-fact"><span>Priority</span><b className={`priority-${issue.priority?.toLowerCase()}`}>{issue.priority || 'Medium'}</b></div><div className="detail-fact"><span>Assigned team</span><b>{issue.officer || 'Awaiting assignment'}</b></div><button className={`button ${voted.includes(issue.id) ? 'button-outline' : 'button-primary'} full-button`} onClick={() => upvote(issue.id)}><ThumbsUp size={16} /> {voted.includes(issue.id) ? 'You support this' : `Support this issue · ${issue.votes || 0}`}</button></div><div className="panel timeline-panel"><h3>Progress timeline</h3><div className="timeline">{(issue.history || [{ status: issue.status, date: issue.reportedAt }]).map((event, index) => <div className={`timeline-item ${index === (issue.history?.length || 1) - 1 ? 'current' : ''}`} key={`${event.status}-${index}`}><span className="timeline-dot" /><div><strong>{event.status}</strong><small>{event.date}</small></div></div>)}</div></div></aside></div></div>
}

export function MyComplaints() {
  const { complaints, user, setComplaints } = useApp()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const my = complaints.filter((item) => item.citizenEmail === user?.email).filter((item) => `${item.title} ${item.id} ${item.category}`.toLowerCase().includes(query.toLowerCase()) && (!status || item.status === status))
  function remove(id) { if (window.confirm('Delete this pending complaint? This cannot be undone.')) setComplaints((current) => current.filter((item) => item.id !== id)) }
  return <><PageTitle eyebrow="YOUR REPORTS" title="My complaints" description="Keep up with every issue you’ve raised and the action being taken." action={<Link to="/app/report" className="button button-primary"><FilePlus2 size={16} /> New report</Link>} /><div className="filters-bar"><div className="search-field"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search my complaints..." /></div><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select></div><section className="panel">{my.length ? <ComplaintTable rows={my} onDelete={(id) => complaints.find((item) => item.id === id)?.status === 'Submitted' && remove(id)} /> : <EmptyState title="No complaints found" text="Your submitted reports will appear here." />}</section><p className="page-footnote">You can delete a report while it is still in the Submitted state.</p></>
}

export function Notifications() {
  const { notifications, setNotifications, user, complaints } = useApp()
  const relevant = notifications.filter((item) => !item.email || item.email === user?.email)
  return <><PageTitle eyebrow="UPDATES FROM YOUR CITY" title="Notifications" description="A simple timeline of changes to your reports." action={relevant.length > 0 && <button className="button button-outline button-small" onClick={() => setNotifications((items) => items.map((item) => ({ ...item, read: true })))}>Mark all as read</button>} /><section className="panel notification-page">{relevant.length ? <div className="notification-list">{relevant.map((item) => <NotificationRow item={item} key={item.id} />)}</div> : complaints.some((item) => item.citizenEmail === user?.email) ? <EmptyState title="You’re all caught up" text="When there’s news about your reports, you’ll find it here." /> : <EmptyState />}</section></>
}

export function Profile() {
  const { user, setUser, users, setUsers, setComplaints, addNotification } = useApp()
  const [values, setValues] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' })
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  function save(event) {
    event.preventDefault(); setNotice(''); setError('')
    if (!values.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return setError('Enter your name and a valid email address.')
    const email = values.email.trim().toLowerCase()
    if (users.some((person) => person.email !== user.email && person.email.toLowerCase() === email)) return setError('That email is already connected to an account.')
    const updated = { ...user, ...values, name: values.name.trim(), email }
    setUsers((current) => current.map((person) => person.email === user.email ? { ...person, ...updated } : person))
    setComplaints((current) => current.map((item) => item.citizenEmail === user.email ? { ...item, citizenEmail: email, citizenName: updated.name } : item))
    setUser(updated); addNotification({ type: 'update', title: 'Profile updated', message: 'Your account details were saved.', date: 'Just now' }); setNotice('Your profile has been updated.')
  }
  return <><PageTitle eyebrow="ACCOUNT SETTINGS" title="My profile" description="Keep your contact details up to date so your city can follow up when it matters." /><div className="profile-layout"><section className="panel profile-card"><div className="profile-avatar">{user?.name?.split(' ').map((word) => word[0]).slice(0, 2).join('')}</div><h2>{user?.name}</h2><p>{user?.email}</p><span className="profile-role">CIVICCONNECT CITIZEN</span><div className="profile-note"><ShieldCheck size={16} /><span>Demo account · stored on this device only</span></div></section><form className="panel profile-form" onSubmit={save}><div className="panel-heading"><div><h2>Personal information</h2><p>Your details are not shown on public reports.</p></div></div><label className="field-label">Full name<input value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} /></label><label className="field-label">Email address<input type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} /></label><label className="field-label">Phone number<input type="tel" value={values.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} /></label>{error && <div className="form-alert error">{error}</div>}{notice && <div className="form-alert success">{notice}</div>}<button className="button button-primary">Save changes <ArrowRight size={15} /></button></form></div></>
}
