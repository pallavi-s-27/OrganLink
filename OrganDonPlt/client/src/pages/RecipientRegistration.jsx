import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import api from '../services/api';
import GradientBackground from '../components/GradientBackground';

const schema = z.object({
  name: z.string().min(3, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(8, 'Phone number required'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  organType: z.string().min(1, 'Organ type is required'),
  urgency: z
    .number({ invalid_type_error: 'Urgency score required' })
    .min(1, 'Minimum urgency is 1')
    .max(10, 'Maximum urgency is 10'),
  hospital: z.string().optional(),
  diagnosis: z.string().optional(),
  notes: z.string().max(500, 'Max 500 characters').optional()
});

const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const organTypes = ['Heart', 'Kidney', 'Liver', 'Lung', 'Pancreas', 'Cornea', 'Bone Marrow'];

const RecipientRegistrationPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      city: '',
      country: '',
      bloodGroup: '',
      organType: '',
      urgency: 5,
      hospital: '',
      diagnosis: '',
      notes: ''
    }
  });

  const onSubmit = async (values) => {
    try {
      await api.post('/public/recipients', values);
      toast.success('Recipient intake submitted! Our transplant board will review your case.');
      reset();
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to submit registration right now.';
      toast.error(message);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <GradientBackground />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10 py-16 lg:py-24">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
            Care without compromise
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
            <span className="bg-gradient-to-r from-brand-200 via-white to-rose-200 bg-clip-text text-transparent">
              Request a life-saving organ transplant
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/70">
            Share your clinical summary to join OrganLink&apos;s national recipient wait list. Our medical review board evaluates each case within 48 hours and coordinates with your hospital for documentation.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-12 grid gap-8 lg:grid-cols-12">
          <section className="glass-panel-elevated rounded-3xl border border-white/15 p-6 sm:p-8 lg:col-span-7 space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-white/80">Full name</label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  placeholder="Jane Recipient"
                  {...register('name')}
                />
                {errors.name ? <p className="mt-2 text-xs text-rose-300">{errors.name.message}</p> : null}
              </div>
              <div>
                <label className="text-sm font-semibold text-white/80">Email address</label>
                <input
                  type="email"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  placeholder="you@example.org"
                  {...register('email')}
                />
                {errors.email ? <p className="mt-2 text-xs text-rose-300">{errors.email.message}</p> : null}
              </div>
              <div>
                <label className="text-sm font-semibold text-white/80">Phone</label>
                <input
                  type="tel"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  placeholder="(+91) 98765 43210"
                  {...register('phone')}
                />
                {errors.phone ? <p className="mt-2 text-xs text-rose-300">{errors.phone.message}</p> : null}
              </div>
              <div>
                <label className="text-sm font-semibold text-white/80">Treating hospital</label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  placeholder="Apollo Hospitals, Chennai"
                  {...register('hospital')}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-white/80">City</label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  placeholder="Chennai"
                  {...register('city')}
                />
                {errors.city ? <p className="mt-2 text-xs text-rose-300">{errors.city.message}</p> : null}
              </div>
              <div>
                <label className="text-sm font-semibold text-white/80">Country</label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  placeholder="India"
                  {...register('country')}
                />
                {errors.country ? <p className="mt-2 text-xs text-rose-300">{errors.country.message}</p> : null}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className="text-sm font-semibold text-white/80">Blood group</label>
                <select
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  {...register('bloodGroup')}
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
                {errors.bloodGroup ? <p className="mt-2 text-xs text-rose-300">{errors.bloodGroup.message}</p> : null}
              </div>
              <div>
                <label className="text-sm font-semibold text-white/80">Organ required</label>
                <select
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  {...register('organType')}
                >
                  <option value="">Select</option>
                  {organTypes.map((organ) => (
                    <option key={organ} value={organ}>
                      {organ}
                    </option>
                  ))}
                </select>
                {errors.organType ? <p className="mt-2 text-xs text-rose-300">{errors.organType.message}</p> : null}
              </div>
              <div>
                <label className="text-sm font-semibold text-white/80">Urgency score</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  step={1}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  {...register('urgency', { valueAsNumber: true })}
                />
                {errors.urgency ? <p className="mt-2 text-xs text-rose-300">{errors.urgency.message}</p> : null}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-white/80">Primary diagnosis summary</label>
              <textarea
                rows={4}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                placeholder="Include relevant labs, history, and current MELD/CTP scores if available."
                {...register('diagnosis')}
              />
              {errors.diagnosis ? <p className="mt-2 text-xs text-rose-300">{errors.diagnosis.message}</p> : null}
            </div>

            <div>
              <label className="text-sm font-semibold text-white/80">Additional notes (optional)</label>
              <textarea
                rows={3}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                placeholder="Add treating physician contact or transplant history."
                {...register('notes')}
              />
              {errors.notes ? <p className="mt-2 text-xs text-rose-300">{errors.notes.message}</p> : null}
            </div>
          </section>

          <aside className="glass-panel rounded-3xl border border-white/5 p-6 sm:p-8 space-y-6 lg:col-span-5">
            <div>
              <h2 className="text-xl font-semibold text-white">How OrganLink helps</h2>
              <p className="mt-3 text-sm text-white/70">
                We coordinate triage with state transplant registries, validate all medical records, and match you to verified donors across India. You&apos;ll receive secure updates via your hospital liaison.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-5 text-sm text-white/70 space-y-3 border border-white/10">
              <p>• Cases are prioritized based on urgency, compatibility, and hospital readiness.</p>
              <p>• All records comply with NDHM and NOTTO data sharing guidelines.</p>
              <p>• You&apos;ll receive a secure login once your application is approved.</p>
            </div>

            <button type="submit" className="btn-primary w-full justify-center" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Submit recipient case'}
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default RecipientRegistrationPage;
