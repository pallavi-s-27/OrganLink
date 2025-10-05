import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import FormField from '../components/FormField';
import GradientBackground from '../components/GradientBackground';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Minimum 6 characters')
});

const LoginPage = () => {
  const { register: field, handleSubmit, formState, setFocus } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' }
  });
  const { errors, isSubmitting } = formState;
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const onSubmit = async (values) => {
    try {
      await login(values);
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (error) {
      const message = error?.response?.data?.message || 'Incorrect email or password. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-16">
      <GradientBackground />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-brand-400/30 rounded-full animate-float" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-float" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-cyan-400/50 rounded-full animate-float" style={{animationDelay: '2s'}} />
      </div>

      <div className="glass-panel-elevated relative z-10 w-full max-w-lg rounded-[32px] p-12 shadow-2xl border border-white/15">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/30">
              OL
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              OrganLink
            </span>
          </div>
          <div className="inline-flex items-center rounded-2xl bg-gradient-to-r from-brand-500/15 to-purple-500/15 px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-brand-200 border border-brand-500/20">
            Secure clinician access
          </div>
          <h1 className="mt-7 text-4xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Log in to OrganLink
          </h1>
          <p className="mt-3 text-white/60">
            Use your hospital-issued credentials to review matches, transports, and approvals across the OrganLink India network.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField label="Email address" error={errors.email?.message}>
            <div className="relative">
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full pl-4 pr-4 py-4 bg-gradient-to-r from-slate-800/60 to-slate-800/40 border border-white/10 rounded-2xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-400/50 transition-all duration-200 hover:border-white/20"
                {...field('email')} 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-purple-500/5 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
            </div>
          </FormField>
          <FormField label="Password" error={errors.password?.message}>
            <div className="relative">
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full pl-4 pr-4 py-4 bg-gradient-to-r from-slate-800/60 to-slate-800/40 border border-white/10 rounded-2xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-400/50 transition-all duration-200 hover:border-white/20"
                {...field('password')} 
              />
            </div>
          </FormField>
          <button
            type="submit"
            className="btn-primary w-full py-4 text-lg font-semibold relative overflow-hidden group"
            disabled={isSubmitting}
          >
            <span className="relative z-10">
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
          </button>
        </form>
        <div className="mt-8 rounded-2xl bg-white/5 p-4 text-sm text-white/60 border border-white/10">
          <p className="font-semibold text-white/80">Having trouble signing in?</p>
          <p className="mt-2">
            Contact the OrganLink operations desk at <span className="text-brand-200 font-medium">ops@organlink.in</span>{' '}
            or call <span className="text-brand-200 font-medium">1800-120-ORGN</span>. Account provisioning is handled exclusively by hospital administrators.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
