'use client'
import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, CheckCircle2, CreditCard, LifeBuoy, LoaderCircle, Sparkles } from 'lucide-react'
import type { RelocationProfile } from '@/lib/profile'
import type { PlanTier } from '@/lib/plan-tiers'
import { PrivacyAccountPage } from './privacy-account-page'
import { TrialRedeemForm } from './trial-redeem-form'
import { DashboardCustomizer } from './dashboard/customize'
import type { DashboardLayout } from '@/lib/dashboard-layout'

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'billing', label: 'Billing' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'help', label: 'Help' },
] as const
type TabId = (typeof TABS)[number]['id']

export function AccountTabs({ initial, email, initialTab = 'profile', dashboardLayout }: { initial: RelocationProfile; email: string; initialTab?: TabId; dashboardLayout: DashboardLayout }) {
  const [tab, setTab] = useState<TabId>(initialTab)
  return (
    <div className={tab === 'dashboard' ? 'mx-auto max-w-6xl' : 'mx-auto max-w-3xl'}>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Account</h1>
      <div className="k-tabbar mt-4"><div className="k-tabs" role="tablist" aria-label="Account sections">{TABS.map((item) => <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} onClick={() => setTab(item.id)} className="k-tab">{item.label}</button>)}</div></div>
      <div className="mt-6" role="tabpanel">
        {tab === 'profile' && <ProfilePanel initial={initial} email={email} />}
        {tab === 'dashboard' && <DashboardCustomizer initial={dashboardLayout} />}
        {tab === 'billing' && <BillingPanel plan={initial.plan} />}
        {tab === 'notifications' && <NotificationsPanel />}
        {tab === 'help' && <HelpPanel email={email} />}
      </div>
    </div>
  )
}

function ProfilePanel({ initial, email }: { initial: RelocationProfile; email: string }) {
  const [profile, setProfile] = useState(initial); const [message, setMessage] = useState('')
  async function save(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setMessage('Saving…'); const response = await fetch('/api/profile', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ display_name:profile.display_name, current_country:profile.current_country, timeline:profile.timeline }) }); setMessage(response.ok ? 'Saved.' : 'Unable to save.') }
  const avatar = (profile.display_name || email).trim().charAt(0).toUpperCase() || 'K'
  return <div className="space-y-8"><form onSubmit={save} className="card-surface p-6 sm:p-8" aria-labelledby="profile-heading"><div className="flex items-center gap-4"><span className="grid size-14 shrink-0 place-items-center rounded-full bg-gold-soft text-xl font-bold text-navy">{avatar}</span><div><h2 id="profile-heading" className="text-lg font-bold text-navy">Your profile</h2><p className="text-sm text-muted">Photo upload is coming soon — for now your initial stands in.</p></div></div><div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="block text-sm font-bold text-navy">Display name<input className="field mt-2" value={profile.display_name ?? ''} onChange={(e)=>setProfile({...profile,display_name:e.target.value||null})} placeholder="Your name" /></label><label className="block text-sm font-bold text-navy">Email<input className="field mt-2 bg-canvas" value={email} disabled /></label><label className="block text-sm font-bold text-navy">Current country<input className="field mt-2" value={profile.current_country ?? ''} onChange={(e)=>setProfile({...profile,current_country:e.target.value||null})} placeholder="e.g. United States" /></label><label className="block text-sm font-bold text-navy">Move timeline<select className="field mt-2" value={profile.timeline ?? ''} onChange={(e)=>setProfile({...profile,timeline:(e.target.value||null) as RelocationProfile['timeline']})}><option value="">Not selected</option><option>0-3 months</option><option>3-6 months</option><option>6-12 months</option><option>12+ months</option><option>Just researching</option></select></label></div><div className="mt-6 flex flex-wrap items-center gap-4"><button type="submit" className="gold-button">Save changes</button><Link href="/profile-wizard" className="text-sm font-bold text-gold-deep hover:text-navy">{profile.wizard_status==='completed'?'Retake the quiz':'Finish the quiz'}</Link>{message&&<p role="status" className="text-sm text-muted">{message}</p>}</div></form><PrivacyAccountPage email={email}/></div>
}

/* Paid tiers mirror the public pricing section (src/app/(marketing)/page.tsx) so the
   upgrade options here always match what is offered. Prices in USD. */
const PAID_TIERS = [
  {
    id: 'plus' as const,
    name: 'Plus',
    price: '$12',
    period: '/mo',
    annual: 'or $99/yr — save ~2 months',
    tagline: 'Turn a maybe into a real, tracked plan.',
    cta: 'Choose Plus',
    href: '/signup?plan=plus',
    featured: true,
    features: [
      'Everything in Explorer, plus:',
      'Full Match Score across all destinations',
      'Personalized Pathway eligibility',
      'Full Move Plan, Documents & Readiness Tracker',
      'Full Cost Calculator & Greenbook Insights',
      'Full Kolmari Club community',
    ],
  },
  {
    id: 'navigator' as const,
    name: 'Navigator',
    price: '$29',
    period: '/mo',
    annual: 'or $249/yr — save ~2 months',
    tagline: 'For households executing a move across destinations.',
    cta: 'Choose Navigator',
    href: '/signup?plan=navigator',
    featured: false,
    features: [
      'Everything in Plus, plus:',
      'Compare destinations side by side',
      'Full household modeling (partner, dependents)',
      'Multiple active Move Plans',
      'Priority Greenbook updates & deeper data',
    ],
  },
]

function TierCard({ tier }: { tier: (typeof PAID_TIERS)[number] }) {
  return (
    <div className={`flex flex-col rounded-[var(--radius-card)] p-6 ${tier.featured ? 'bg-navy-deep text-white shadow-card' : 'border border-line bg-white'}`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className={`text-lg font-extrabold ${tier.featured ? 'text-white' : 'text-navy'}`}>{tier.name}</h3>
        {tier.featured && <span className="rounded-full bg-gold px-2.5 py-1 text-xs font-extrabold text-navy-deep">Most popular</span>}
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className={`text-4xl font-extrabold ${tier.featured ? 'text-white' : 'text-navy'}`}>{tier.price}</span>
        <span className={tier.featured ? 'text-white/70' : 'text-muted'}>{tier.period}</span>
      </div>
      <p className={`mt-1 text-xs font-semibold ${tier.featured ? 'text-gold' : 'text-gold-deep'}`}>{tier.annual}</p>
      <p className={`mt-3 text-sm leading-6 ${tier.featured ? 'text-white/75' : 'text-muted'}`}>{tier.tagline}</p>
      <Link
        href={tier.href}
        className={tier.featured
          ? 'gold-button mt-5 w-full justify-center'
          : 'mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-btn)] border border-line px-5 font-bold text-navy transition hover:border-gold'}
      >
        {tier.cta} <ArrowRight size={16} />
      </Link>
      <ul className="mt-6 space-y-3">
        {tier.features.map((feature, index) => (
          <li key={feature} className={`flex items-start gap-2.5 text-sm leading-6 ${tier.featured ? 'text-white/85' : 'text-navy'} ${index === 0 ? 'font-semibold' : ''}`}>
            <Check size={16} className={`mt-0.5 shrink-0 ${tier.featured ? 'text-gold' : 'text-gold-deep'}`} aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function BillingPanel({ plan }: { plan: PlanTier }) {
  const planLabel = plan === 'navigator' ? 'Kolmari Navigator — active' : plan === 'plus' ? 'Kolmari Plus — active' : 'Explorer plan — free'
  const upgradeTiers = PAID_TIERS.filter((tier) => (plan === 'free' ? true : tier.id === 'navigator'))
  return (
    <div className="card-surface p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <span className="grid size-9 place-items-center rounded-[var(--radius-field)] bg-gold-soft"><CreditCard size={16} className="text-gold-deep"/></span>
        <div><h2 className="font-bold text-navy">Your plan</h2><p className="mt-0.5 text-sm text-muted">Manage your Kolmari subscription.</p></div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-field)] border border-line bg-canvas p-4">
        <div className="flex items-center gap-2">{plan === 'free' ? <Sparkles size={18} className="text-gold-deep"/> : <CheckCircle2 size={18} className="text-ok"/>}<span className="font-semibold text-navy">{planLabel}</span></div>
      </div>
      {upgradeTiers.length > 0 && (
        <div className="mt-6 border-t border-line pt-6">
          <h3 className="font-bold text-navy">{plan === 'free' ? 'Upgrade your plan' : 'Need multi-destination planning?'}</h3>
          <p className="mt-1 text-sm text-muted">{plan === 'free' ? 'Every plan starts free — you only upgrade when a plan is worth it.' : 'Navigator adds side-by-side comparison, household modeling, and multiple active Move Plans.'}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {upgradeTiers.map((tier) => <TierCard key={tier.id} tier={tier} />)}
          </div>
        </div>
      )}
      {plan === 'free' && (
        <div className="mt-6 border-t border-line pt-6">
          <h3 className="font-bold text-navy">Have a trial code?</h3>
          <p className="mt-1 text-sm text-muted">Redeem it here to unlock Kolmari Plus free.</p>
          <TrialRedeemForm tight />
        </div>
      )}
      <p className="mt-4 text-sm leading-6 text-muted">Prices in USD. Kolmari is launching free — paid checkout is coming soon, so nothing is charged today. Trial codes redeem Plus immediately.</p>
    </div>
  )
}

function NotificationsPanel(){const[reminders,setReminders]=useState(true);const[product,setProduct]=useState(true);return <div className="card-surface p-6 sm:p-8"><h2 className="font-bold text-navy">Notifications</h2><p className="mt-0.5 text-sm text-muted">Choose what Kolmari surfaces. Email delivery is coming soon; these control in-app prompts.</p><div className="mt-5 space-y-3">{[['Planning reminders','Progress nudges and next-step prompts in your dashboard.',reminders,setReminders],['Product updates','New destinations, features, and Greenbook entries.',product,setProduct]].map(([title,copy,value,set]:any)=><label key={title} className="flex items-center justify-between gap-4 rounded-[var(--radius-field)] bg-canvas p-4"><span><strong className="block text-sm text-navy">{title}</strong><small className="text-muted">{copy}</small></span><input type="checkbox" checked={value} onChange={(e)=>set(e.target.checked)} className="size-4 accent-[var(--color-gold-deep)]"/></label>)}</div></div>}

function HelpPanel({ email }: { email:string }) { const[subject,setSubject]=useState('');const[msg,setMsg]=useState('');const[state,setState]=useState<'idle'|'sending'|'sent'|'error'>('idle');const[error,setError]=useState('');async function send(event:FormEvent<HTMLFormElement>){event.preventDefault();setState('sending');setError('');try{const response=await fetch('/api/support',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subject,message:msg})});const result=await response.json();if(!response.ok)throw new Error(result.error??'Unable to send your message.');setState('sent');setSubject('');setMsg('')}catch(reason){setState('error');setError(reason instanceof Error?reason.message:'Unable to send your message.')}}return <div className="card-surface p-6 sm:p-8"><div className="flex items-start gap-3"><span className="grid size-9 place-items-center rounded-[var(--radius-field)] bg-gold-soft"><LifeBuoy size={16} className="text-gold-deep"/></span><div><h2 className="font-bold text-navy">Get help</h2><p className="mt-0.5 text-sm text-muted">Send us a message and we’ll get back to you at {email}.</p></div></div>{state==='sent'?<div className="mt-5 flex items-center gap-2 rounded-[var(--radius-field)] border border-ok/30 bg-ok/10 px-4 py-3 text-sm font-semibold text-ok"><CheckCircle2 size={16}/>Thanks — your message is in.</div>:<form onSubmit={send} className="mt-5 space-y-4"><label className="block text-sm font-bold text-navy">Subject<input className="field mt-2" value={subject} onChange={(e)=>setSubject(e.target.value)} maxLength={140}/></label><label className="block text-sm font-bold text-navy">Message<textarea className="field mt-2 min-h-32" value={msg} onChange={(e)=>setMsg(e.target.value)} maxLength={4000} required/></label>{error&&<p role="alert" className="text-sm font-semibold text-danger">{error}</p>}<button type="submit" disabled={state==='sending'} className="gold-button disabled:opacity-60">{state==='sending'?<LoaderCircle size={16} className="animate-spin"/>:null}Send message</button></form>}</div> }
