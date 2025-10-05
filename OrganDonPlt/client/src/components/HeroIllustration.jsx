import { BoltIcon, GlobeAsiaAustraliaIcon, TruckIcon } from '@heroicons/react/24/outline';

const HeroIllustration = () => (
  <div className="relative mx-auto w-full max-w-[460px] md:max-w-[520px]">
    <div className="absolute inset-0 rounded-[50px] bg-gradient-to-br from-brand-500/30 via-purple-500/15 to-sky-500/25 blur-3xl" />
    <div className="relative overflow-hidden rounded-[40px] border border-white/15 bg-gradient-to-br from-slate-950/95 via-slate-900/80 to-slate-950/95 px-7 py-8 shadow-[0_40px_160px_-35px_rgba(15,23,42,0.9)] sm:px-8 sm:py-9">
      <div className="relative h-[400px] sm:h-[440px]">
        <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-brand-500/40 via-emerald-400/25 to-indigo-400/35 blur-2xl" />
        <div className="floating-element absolute inset-0 flex items-center justify-center">
          <div className="h-48 w-48 rounded-full border border-white/15 bg-white/10 backdrop-blur-3xl shadow-inner" />
        </div>

        <div className="floating-element absolute left-6 top-8 w-52 rounded-3xl border border-white/20 bg-gradient-to-br from-white/15 to-white/5 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-3xl">
          <div className="flex items-start gap-4 text-xs text-white/75">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 p-3 text-emerald-100 shadow-lg">
              <GlobeAsiaAustraliaIcon className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-bold text-white tracking-wide">28 States + 8 UTs</p>
              <p className="text-[0.75rem] leading-snug text-white/70 font-medium">
                NOTTO-compliant data mesh
              </p>
            </div>
          </div>
        </div>

        <div className="floating-element absolute bottom-8 left-1/2 w-52 -translate-x-1/2 rounded-3xl border border-white/20 bg-gradient-to-br from-white/15 to-white/5 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-3xl">
          <div className="flex items-start gap-4 text-xs text-white/75">
            <div className="rounded-2xl bg-gradient-to-br from-sky-500/30 to-sky-600/20 p-3 text-sky-100 shadow-lg">
              <TruckIcon className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-bold text-white tracking-wide">Cold chain tracked</p>
              <p className="text-[0.75rem] leading-snug text-white/70 font-medium">
                Green corridors & airlifts
              </p>
            </div>
          </div>
        </div>

        <div className="floating-element absolute right-6 top-20 w-44 rounded-3xl border border-white/20 bg-gradient-to-br from-white/15 to-white/5 p-5 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-3xl">
          <div className="mb-3 text-[0.65rem] uppercase tracking-[0.4em] text-white/65 font-semibold">Donor alerts</div>
          <div className="flex items-center gap-2.5 text-sm">
            <div className="rounded-xl bg-gradient-to-br from-amber-400/30 to-amber-500/20 p-2 shadow-lg">
              <BoltIcon className="h-4 w-4 text-amber-200" />
            </div>
            <span className="text-white/90">
              Matches <span className="font-bold text-emerald-300">under 18m</span>
            </span>
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-center px-6 max-w-[180px]">
          <div className="rounded-full border border-white/20 bg-gradient-to-r from-white/15 to-white/10 px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em] text-white/75 font-bold shadow-lg backdrop-blur-sm">
            Live
          </div>
          <h3 className="text-lg font-bold tracking-tight text-white bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent leading-tight">
            OrganLink Center
          </h3>
          <p className="text-[0.7rem] leading-snug text-white/75 font-medium">
            India's transplant network visibility
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default HeroIllustration;
