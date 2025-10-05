const GradientBackground = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    {/* Main hero gradient */}
    <div className="absolute -top-1/2 left-1/2 h-[1400px] w-[1400px] -translate-x-1/2 rounded-full bg-gradient-to-b from-brand-500/20 via-brand-600/10 to-transparent blur-3xl animate-pulse-slow" />
    
    {/* Secondary accent gradients */}
    <div className="absolute top-1/4 -right-64 h-[800px] w-[800px] rounded-full bg-gradient-to-l from-accent-500/15 via-accent-400/8 to-transparent blur-3xl animate-float" />
    <div className="absolute -bottom-64 -left-32 h-[700px] w-[700px] rounded-full bg-gradient-to-r from-emerald-500/10 via-cyan-400/8 to-transparent blur-3xl" />
    
    {/* Subtle texture overlay */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[length:50px_50px]" />
    
    {/* Ambient light spots */}
    <div className="absolute top-20 left-20 h-32 w-32 rounded-full bg-brand-400/20 blur-2xl animate-pulse-slow" />
    <div className="absolute bottom-20 right-20 h-32 w-32 rounded-full bg-accent-400/20 blur-2xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
    <div className="absolute top-1/2 left-1/4 h-24 w-24 rounded-full bg-emerald-400/15 blur-2xl animate-pulse-slow" style={{ animationDelay: '3s' }} />
  </div>
);

export default GradientBackground;
