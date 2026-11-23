import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronRight, Clock3, MapPin, ShieldCheck, Sparkles, Users, Wrench } from 'lucide-react'
import { Brand, StatusBadge } from '../components/UI'
import { useApp } from '../context/AppContext'

const categories = [
  { icon: '⌁', title: 'Roads & potholes', note: 'Safer streets start here', color: 'blue' },
  { icon: '♧', title: 'Waste & cleanliness', note: 'Cleaner neighborhoods', color: 'green' },
  { icon: '☼', title: 'Street lighting', note: 'Bright, safe evenings', color: 'gold' },
  { icon: '◉', title: 'Water & drainage', note: 'Keep things flowing', color: 'purple' },
]

export function Home() {
  const { complaints } = useApp()
  const resolved = complaints.filter((item) => item.status === 'Resolved').length
  const active = complaints.filter((item) => !['Resolved', 'Rejected'].includes(item.status)).length
  return <div className="landing">
    <header className="landing-nav"><Brand /><nav><a href="#how-it-works">How it works</a><a href="#community">Community</a><Link to="/issues">Explore issues</Link></nav><div className="landing-nav-actions"><Link className="nav-login" to="/login">Log in</Link><Link className="button button-primary button-small" to="/register">Get started <ArrowRight size={15} /></Link><Link className="admin-entry" to="/admin-login">Admin</Link></div></header>
    <main>
      <section className="hero">
        <div className="hero-copy"><div className="hero-kicker"><span className="pulse-dot" /> YOUR CITY. YOUR VOICE. YOUR IMPACT.</div><h1>Together, let's build a <em>better city.</em></h1><p className="hero-lead">See something that needs fixing? Bring it to the people who can. CivicConnect makes it simple to report local issues and follow every step toward a solution.</p>
          <div className="hero-actions"><Link className="button button-primary" to="/app/report">Report an issue <ArrowRight size={17} /></Link><Link className="button button-outline" to="/issues">Explore issues <ArrowUpRight size={16} /></Link></div>
          <div className="hero-trust"><div className="avatar-stack"><span>AS</span><span>PI</span><span>RK</span><span>+</span></div><div><strong>Made for neighborhoods</strong><small>By the people who call them home</small></div></div>
        </div>
        <div className="hero-art"><div className="hero-photo"><img src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=85" alt="A thriving Indian city neighborhood at dusk" /><div className="photo-shade" /></div>
          <div className="floating-report"><div className="mini-report-icon"><Wrench size={17} /></div><div><strong>Issue resolved!</strong><span>Streetlight · Pune</span></div><span className="mini-check"><Check size={14} /></span></div>
          <div className="floating-stat"><span className="stat-spark">↗</span><div><strong>{resolved || 2} issues</strong><small>made better this week</small></div></div>
          <div className="hero-caption"><span><MapPin size={14} /> Your neighborhood, in focus</span><span className="caption-dot" /> PUNE, INDIA</div>
        </div>
        <a className="scroll-cue" href="#impact"><ArrowDown size={16} /> SCROLL TO EXPLORE</a>
      </section>
      <section className="impact-strip" id="impact"><div className="impact-intro"><span className="eyebrow">SMALL ACTIONS. REAL CHANGE.</span><h2>Progress you<br />can be part of.</h2></div><div className="impact-stat"><strong>{complaints.length.toLocaleString()}<sup>+</sup></strong><span>Issues reported</span><small>Every report starts a conversation</small></div><div className="impact-stat"><strong>{resolved.toLocaleString()}<sup>+</sup></strong><span>Issues resolved</span><small>Neighbors seeing a real difference</small></div><div className="impact-stat"><strong>{active.toLocaleString()}</strong><span>Being worked on</span><small>Progress you can follow</small></div></section>
      <section className="section-wrap how-section" id="how-it-works"><div className="section-heading"><div><span className="eyebrow">A BETTER WAY TO BE HEARD</span><h2>Three steps. One better city.</h2></div><p>We connect residents and local teams, making it easier to turn everyday frustrations into visible progress.</p></div><div className="steps-grid"><article className="step-card"><div className="step-number">01 <span><MapPin size={19} /></span></div><h3>Spot something?</h3><p>From a broken streetlight to a blocked drain, your local knowledge makes a difference.</p><span className="step-foot">NOTICE IT <ChevronRight size={14} /></span></article><article className="step-card featured"><div className="step-number">02 <span><Sparkles size={19} /></span></div><h3>Make it visible.</h3><p>Share a photo and a few details. We’ll get your report to the right people.</p><span className="step-foot">REPORT IT <ChevronRight size={14} /></span></article><article className="step-card"><div className="step-number">03 <span><Check size={19} /></span></div><h3>Follow the fix.</h3><p>See updates as they happen, and know when your neighborhood gets its fix.</p><span className="step-foot">SEE PROGRESS <ChevronRight size={14} /></span></article></div></section>
      <section className="category-section"><div className="section-wrap"><div className="section-heading"><div><span className="eyebrow">WHERE CAN WE HELP?</span><h2>Everyday issues, meet<br />real-world action.</h2></div><Link className="text-link" to="/issues">Explore all issues <ArrowRight size={15} /></Link></div><div className="category-grid">{categories.map((category, i) => <Link key={category.title} to={`/issues?category=${encodeURIComponent(i === 0 ? 'Road Damage' : i === 1 ? 'Garbage Collection' : i === 2 ? 'Streetlight Problem' : 'Water Leakage')}`} className={`category-card category-${category.color}`}><div className="category-symbol">{category.icon}</div><div><h3>{category.title}</h3><p>{category.note}</p></div><ArrowUpRight className="category-arrow" size={18} /></Link>)}</div></div></section>
      <section className="section-wrap community-section" id="community"><div className="community-copy"><span className="eyebrow">THE NEIGHBORHOOD BOARD</span><h2>What’s happening<br />around your city.</h2><p>Real reports from real people. Explore what your neighbors are sharing and add your voice to the issues that matter.</p><Link className="button button-dark" to="/issues">See public issues <ArrowRight size={16} /></Link><div className="community-proof"><Users size={17} /><span><b>Join your neighbors</b> in making local change visible.</span></div></div>
        <div className="home-issues">{complaints.slice(0, 3).map((issue) => <Link to={`/issues/${issue.id}`} className="home-issue-row" key={issue.id}><img src={issue.image} alt="" /><div className="home-issue-copy"><span>{issue.category} <span className="tiny-separator">•</span> {issue.city}</span><strong>{issue.title}</strong><small><Clock3 size={12} /> Updated {new Date(issue.reportedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</small></div><StatusBadge status={issue.status} /></Link>)}
          <div className="home-issue-footer"><span><ShieldCheck size={15} /> Every report is trackable</span><Link to="/issues">VIEW ALL <ArrowRight size={13} /></Link></div>
        </div></section>
      <section className="quote-band"><div className="quote-mark">“</div><blockquote>It’s a small thing to report a broken light, but a big thing to know it got fixed. That’s what makes a neighborhood feel like home.</blockquote><div className="quote-byline"><div className="quote-avatar">PI</div><span><b>Priya Iyer</b><small>Resident, Mumbai</small></span><div className="quote-line" /></div></section>
      <section className="cta-section"><div><span className="eyebrow">YOUR CITY IS LISTENING</span><h2>See it. Say it.<br /><em>Let’s fix it.</em></h2></div><div><p>A better city doesn’t happen by accident. It happens when we all show up.</p><Link to="/register" className="button button-white">Join CivicConnect <ArrowRight size={16} /></Link></div><div className="cta-circle">C</div></section>
    </main>
    <footer className="landing-footer"><Brand /><p>Making local change feel a little closer.</p><div className="footer-links"><a href="#how-it-works">How it works</a><Link to="/issues">Public issues</Link><Link to="/admin-login">Admin portal</Link><a href="mailto:hello@civicconnect.in">Contact</a></div><small>© 2026 CivicConnect. Built for better neighborhoods.</small></footer>
  </div>
}

export function AuthPage({ mode }) {
  const { users, setUsers, setUser } = useApp()
  const [values, setValues] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const isRegister = mode === 'register'
  const admin = mode === 'admin'
  const navigate = useNavigate()
  const location = useLocation()

  function submit(event) {
    event.preventDefault()
    setError(''); setMessage('')
    const email = values.email.trim().toLowerCase()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email address.')
    if (values.password.length < 8) return setError('Password must be at least 8 characters.')
    if (isRegister) {
      if (!values.name.trim()) return setError('Please enter your full name.')
      if (!/^\d{10}$/.test(values.phone.replace(/\D/g, ''))) return setError('Enter a valid 10-digit phone number.')
      if (values.password !== values.confirm) return setError('Your passwords do not match.')
      if (users.some((person) => person.email.toLowerCase() === email)) return setError('An account with this email already exists.')
      const newUser = { name: values.name.trim(), email, phone: values.phone.trim(), password: values.password, role: 'citizen' }
      setUsers((current) => [...current, newUser]); setUser(newUser); navigate(location.state?.from?.pathname?.startsWith('/app') ? location.state.from.pathname : '/app/dashboard')
      return
    }
    if (admin) {
      if (email !== 'admin@civicconnect.com' || values.password !== 'Admin123') return setError('The email or password is incorrect.')
      const adminUser = { name: 'Civic Admin', email, role: 'admin' }; setUser(adminUser); navigate(location.state?.from?.pathname?.startsWith('/admin') ? location.state.from.pathname : '/admin')
      return
    }
    const found = users.find((person) => person.email.toLowerCase() === email && person.password === values.password)
    if (!found) return setError('We couldn’t find an account with those details.')
    setUser({ ...found, role: 'citizen' }); navigate(location.state?.from?.pathname?.startsWith('/app') ? location.state.from.pathname : '/app/dashboard')
  }

  return <div className="auth-page"><div className="auth-visual"><div className="auth-visual-top"><Brand light /><Link to="/">Back to home <ArrowRight size={14} /></Link></div><div className="auth-visual-content"><span className="eyebrow">YOUR CITY, CLOSER</span><h1>Good things happen when we <em>show up.</em></h1><p>Small actions, shared by a community, can make a world of difference to the place we call home.</p><div className="auth-visual-stats"><div><strong>12+</strong><span>issues on the board</span></div><div><strong>5</strong><span>cities connected</span></div></div></div><div className="auth-visual-footer">A community-powered civic platform <span>© 2026 CivicConnect</span></div></div>
    <div className="auth-form-side"><div className="auth-mobile-brand"><Brand /></div><div className="auth-form-wrap"><span className="eyebrow">{admin ? 'CIVICCONNECT ADMIN' : 'CIVICCONNECT COMMUNITY'}</span><h2>{isRegister ? 'Create your account' : admin ? 'Welcome, administrator' : 'Welcome back'}</h2><p className="auth-subtitle">{isRegister ? 'Join your neighbors and help make local change happen.' : admin ? 'Sign in to manage community reports.' : 'Sign in to follow your reports and your city’s progress.'}</p>
      <form className="auth-form" onSubmit={submit} noValidate>
        {isRegister && <label>Full name<input value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} autoComplete="name" placeholder="e.g. Aarav Sharma" /></label>}
        <label>Email address<input type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} autoComplete="email" placeholder="you@example.com" /></label>
        {isRegister && <label>Phone number<input type="tel" value={values.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} autoComplete="tel" placeholder="10-digit mobile number" /></label>}
        <label>Password<div className="password-field"><input type={visible ? 'text' : 'password'} value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder="At least 8 characters" /><button type="button" onClick={() => setVisible(!visible)}>{visible ? 'Hide' : 'Show'}</button></div></label>
        {isRegister && <label>Confirm password<input type={visible ? 'text' : 'password'} value={values.confirm} onChange={(e) => setValues({ ...values, confirm: e.target.value })} autoComplete="new-password" placeholder="Enter your password again" /></label>}
        {error && <div className="form-alert error">{error}</div>}{message && <div className="form-alert success">{message}</div>}
        <button className="button button-primary auth-submit" type="submit">{isRegister ? 'Create account' : 'Sign in'} <ArrowRight size={16} /></button>
      </form>
      {!admin && <div className="auth-switch">{isRegister ? 'Already have an account?' : 'New to CivicConnect?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></div>}
      {admin ? <div className="demo-hint"><ShieldCheck size={16} /><span><b>Demo administrator access</b><br />admin@civicconnect.com · Admin123</span></div> : <div className="demo-hint"><ShieldCheck size={16} /><span><b>Demo citizen account</b><br />demo@civicconnect.com · Citizen123</span></div>}
      <small className="auth-disclaimer">Demo only. This frontend stores account data in your browser and does not provide server-side security.</small>
    </div><div className="auth-side-foot">By continuing, you agree to help keep your community respectful and constructive.</div></div></div>
}
