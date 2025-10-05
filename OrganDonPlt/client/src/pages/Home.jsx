import { Link } from 'react-router-dom';
import GradientBackground from '../components/GradientBackground';
import PublicNavbar from '../components/PublicNavbar';
import HeroIllustration from '../components/HeroIllustration';
import {
  ArrowRightIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
  CpuChipIcon,
  MapIcon
} from '@heroicons/react/24/outline';

const highlights = [
  {
    title: 'AI-Powered Matching System',
    description: 'Random Forest algorithms analyze age, blood group, HLA compatibility, and urgency scores for optimal donor-recipient matching.',
    icon: CpuChipIcon,
    accent: 'from-emerald-500/20 to-emerald-400/10'
  },
  {
    title: 'Real-time GPS Tracking',
    description: 'Live organ courier monitoring with Google Maps integration showing estimated delivery times to recipient hospitals.',
    icon: MapIcon,
    accent: 'from-rose-500/20 to-pink-400/10'
  },
  {
    title: 'Comprehensive Registration',
    description: 'Streamlined donor/recipient forms with role-based access for donors, recipients, doctors, and administrators.',
    icon: UsersIcon,
    accent: 'from-brand-500/20 to-indigo-400/10'
  }
];

const stats = [
  { label: 'Successful matches', value: '1,240' },
  { label: 'Registered donors', value: '850+' },
  { label: 'Active recipients', value: '320' }
];

const workflow = [
  {
    step: 'Step 1',
    title: 'Registration',
    description: 'Donors and recipients enter their details including age, blood group, organ type, and medical history through our secure forms.',
    icon: ClipboardDocumentCheckIcon
  },
  {
    step: 'Step 2',
    title: 'AI Matching',
    description: 'Machine learning models analyze compatibility factors and urgency scores to suggest the best donor-recipient matches.',
    icon: CpuChipIcon
  },
  {
    step: 'Step 3',
    title: 'Confirmation & Tracking',
    description: 'Doctor verifies the match, approves transport, and real-time GPS tracking monitors organ delivery to the recipient hospital.',
    icon: MapIcon
  }
];

const HomePage = () => {
  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <GradientBackground />

      <div className="relative z-10">
        <PublicNavbar />
        <main className="mx-auto flex max-w-7xl flex-col gap-20 px-4 pb-24 pt-10 sm:px-6 lg:gap-24 lg:px-10 lg:pt-16 xl:gap-28">
          <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] xl:gap-20">
            <div className="space-y-10 xl:space-y-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
              OrganLink India
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-brand-200 via-white to-purple-200 bg-clip-text text-transparent">
                AI-powered organ matching & real-time tracking
              </span>
              <span className="mt-4 block text-xl font-medium text-white/80 sm:text-2xl lg:text-3xl">
                Connecting donors, recipients, doctors, and hospitals through intelligent matching.
              </span>
            </h1>
            <p className="max-w-3xl text-base text-white/70 sm:text-lg">
              OrganLink uses machine learning to match donors with recipients based on compatibility scores, while providing real-time GPS tracking of organ transport with complete audit logs stored securely in MongoDB.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/donor-registration"
                className="btn-primary inline-flex items-center gap-2"
              >
                Register as Donor
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                to="/recipient-registration"
                className="btn-secondary inline-flex items-center gap-2"
              >
                Register as Recipient
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="btn-ghost inline-flex items-center gap-2"
              >
                Healthcare Login
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center shadow-lg shadow-slate-950/40">
                  <div className="text-2xl font-bold text-white sm:text-3xl">{item.value}</div>
                  <div className="mt-2 text-xs uppercase tracking-widest text-white/60 sm:text-sm">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-10">
            <HeroIllustration />
            <div className="relative">
              <div className="absolute inset-0 -translate-x-6 translate-y-6 rounded-[36px] bg-brand-500/10 blur-3xl" />
              <div className="relative glass-panel-elevated rounded-[36px] border border-white/10 backdrop-blur-3xl p-6 sm:p-10 shadow-2xl">
                <div className="grid gap-6"> 
                  {highlights.map((feature) => (
                    <div
                      key={feature.title}
                      className={`rounded-3xl border border-white/10 bg-gradient-to-r ${feature.accent} p-5 sm:p-6 shadow-lg`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-white/10 p-3">
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{feature.title}</h3>
                          <p className="mt-1 text-sm text-white/70">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </section>

          <section className="glass-panel-elevated rounded-[36px] border border-white/10 p-8 sm:p-10 xl:p-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  How it works
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  From registration to delivery
                </h2>
                <p className="text-sm text-white/70 sm:text-base">
                  Our streamlined workflow uses AI matching algorithms and real-time tracking to connect donors with recipients efficiently and transparently.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/donor-registration" className="btn-secondary inline-flex w-full justify-center gap-2 text-sm sm:w-auto">
                  Explore donor journey
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Link to="/recipient-registration" className="btn-ghost inline-flex w-full justify-center gap-2 text-sm sm:w-auto">
                  Explore recipient journey
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {workflow.map((item) => (
                <div key={item.title} className="group relative rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-white/60">
                      {item.step}
                    </span>
                    <div className="rounded-2xl bg-white/10 p-3 text-white/80">
                      <item.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    {item.description}
                  </p>
                  <div className="pointer-events-none absolute inset-x-4 bottom-4 h-1 rounded-full bg-gradient-to-r from-brand-400/60 via-emerald-400/40 to-sky-400/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-10 lg:grid-cols-2 xl:gap-16">
            <div className="glass-panel-elevated rounded-[32px] border border-white/12 p-8 sm:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Intelligent matching system
              </h2>
              <p className="mt-5 max-w-2xl text-base text-white/70 sm:text-lg">
                Our AI models use Random Forest and Logistic Regression to analyze age, gender, blood group, HLA matching, and urgency scores for optimal compatibility predictions.
              </p>
              <ul className="mt-7 space-y-4 text-sm text-white/80 sm:text-base">
                <li>✔️ Machine learning compatibility scoring with doctor verification</li>
                <li>✔️ Real-time GPS tracking with estimated delivery times</li>
                <li>✔️ Complete audit logs stored in MongoDB for transparency</li>
              </ul>
            </div>
            <div className="glass-panel rounded-[32px] border border-white/5 p-8 sm:p-10 space-y-6">
              <h3 className="text-xl font-semibold text-white">For healthcare professionals</h3>
              <p className="text-sm text-white/70 sm:text-base">
                Role-based access for donors, recipients, doctors, and administrators. Real-time dashboard with organ availability, match results, and transport tracking.
              </p>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-wider text-white/50">Platform features</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-white/70">
                  <span>• ReactJS Frontend</span>
                  <span>• Node.js + Express API</span>
                  <span>• MongoDB Database</span>
                  <span>• Google Maps Integration</span>
                </div>
              </div>
              <Link to="/login" className="btn-secondary inline-flex items-center gap-2">
                Request a clinical demo
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </section>

          <section id="process" className="glass-panel-elevated rounded-[36px] border border-white/10 p-8 sm:p-10 xl:p-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  Donation journey
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Complete donation journey
                </h2>
                <p className="text-sm text-white/70 sm:text-base">
                  From initial registration through AI matching to real-time delivery tracking, every step is logged and monitored for complete transparency.
                </p>
              </div>
              <Link to="/donor-registration" className="btn-primary inline-flex w-full justify-center gap-2 text-sm sm:w-auto">
                Start donor registration
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: 'Clinical interview',
                  description: 'Our transplant nurses verify your medical history and coordinate with empanelled Indian hospitals.'
                },
                {
                  title: 'Eligibility screening',
                  description: 'Lab work and imaging (if required) are scheduled with NABH accredited partner facilities.'
                },
                {
                  title: 'Active roster placement',
                  description: 'Once cleared, your profile appears to transplant centers with compatible recipients across India.'
                },
                {
                  title: 'Real-time updates',
                  description: 'Get notified through OrganLink when there’s a potential match or inter-state logistics update.'
                }
              ].map((step) => (
                <div key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm text-white/70">{step.description}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
