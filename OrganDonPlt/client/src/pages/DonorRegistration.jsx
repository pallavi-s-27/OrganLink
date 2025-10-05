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
  preferredHospital: z.string().optional(),
  availability: z.string().optional(),
  notes: z.string().max(500, 'Max 500 characters').optional(),
  consent: z.boolean().refine((value) => value, { message: 'Consent is required to register' })
});

const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const organTypes = ['Heart', 'Kidney', 'Liver', 'Lung', 'Pancreas', 'Cornea', 'Bone Marrow'];

const DonorRegistrationPage = () => {
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
      preferredHospital: '',
      availability: '',
      notes: '',
      consent: false
    }
  });

  const onSubmit = async (values) => {
    try {
  await api.post('/public/donors', values);
  toast.success('Thank you! The OrganLink India team will reach out shortly.');
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
            Join India&apos;s transplant movement
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
            <span className="bg-gradient-to-r from-brand-200 via-white to-emerald-200 bg-clip-text text-transparent">
              Become a registered organ donor
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/70">
            Share your details and our coordination team will verify them with
            your State Organ & Tissue Transplant Organisation (SOTTO). We comply
            with NOTTO norms, maintain digital consent trails, and partner with
            NABH-accredited hospitals across India.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-12 grid gap-8 lg:grid-cols-12"
        >
          <section className="glass-panel-elevated rounded-3xl border border-white/15 p-6 sm:p-8 lg:col-span-7 space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-white/80">
                  Full name (as per Aadhaar)
                </label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  placeholder="Anita Sharma"
                  {...register("name")}
                />
                {errors.name ? (
                  <p className="mt-2 text-xs text-rose-300">
                    {errors.name.message}
                  </p>
                ) : null}
              </div>
              <div>
                <label className="text-sm font-semibold text-white/80">
                  Email address
                </label>
                <input
                  type="email"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  placeholder="you@example.in"
                  {...register("email")}
                />
                {errors.email ? (
                  <p className="mt-2 text-xs text-rose-300">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>
              <div>
                <label className="text-sm font-semibold text-white/80">
                  Phone (WhatsApp preferred)
                </label>
                <input
                  type="tel"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  placeholder="(+91) 98765 43210"
                  {...register("phone")}
                />
                {errors.phone ? (
                  <p className="mt-2 text-xs text-rose-300">
                    {errors.phone.message}
                  </p>
                ) : null}
              </div>
              <div>
                <label className="text-sm font-semibold text-white/80">
                  Preferred hospital / transplant centre
                </label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  placeholder="AIIMS New Delhi"
                  {...register("preferredHospital")}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-white/80">
                  City
                </label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  placeholder="Mumbai"
                  {...register("city")}
                />
                {errors.city ? (
                  <p className="mt-2 text-xs text-rose-300">
                    {errors.city.message}
                  </p>
                ) : null}
              </div>
              <div>
                <label className="text-sm font-semibold text-white/80">
                  Country
                </label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  placeholder="India"
                  {...register("country")}
                />
                {errors.country ? (
                  <p className="mt-2 text-xs text-rose-300">
                    {errors.country.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-white/80">
                  Blood group
                </label>
                <select
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  {...register("bloodGroup")}
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
                {errors.bloodGroup ? (
                  <p className="mt-2 text-xs text-rose-300">
                    {errors.bloodGroup.message}
                  </p>
                ) : null}
              </div>
              <div>
                <label className="text-sm font-semibold text-white/80">
                  Organ you wish to donate
                </label>
                <select
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  {...register("organType")}
                >
                  <option value="">Select</option>
                  {organTypes.map((organ) => (
                    <option key={organ} value={organ}>
                      {organ}
                    </option>
                  ))}
                </select>
                {errors.organType ? (
                  <p className="mt-2 text-xs text-rose-300">
                    {errors.organType.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-white/80">
                Preferred availability window
              </label>
              <input
                type="text"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                placeholder="Weekdays after 6 PM, weekends, etc."
                {...register("availability")}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-white/80">
                Medical notes (optional)
              </label>
              <textarea
                rows={4}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                placeholder="Mention existing health conditions, blood tests, eHealth ID, etc."
                {...register("notes")}
              />
              {errors.notes ? (
                <p className="mt-2 text-xs text-rose-300">
                  {errors.notes.message}
                </p>
              ) : null}
            </div>
          </section>

          <aside className="glass-panel rounded-3xl border border-white/5 p-6 sm:p-8 space-y-6 lg:col-span-5">
            <div>
              <h2 className="text-xl font-semibold text-white">
                What happens next?
              </h2>
              <p className="mt-3 text-sm text-white/70">
                Our transplant coordination desk reviews every submission within
                24 hours. We coordinate with your SOTTO office for verification
                before adding you to the active OrganLink donor roster.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-5 text-sm text-white/70 space-y-3 border border-white/10">
              <p>
                • All data is encrypted and reviewed only by certified
                transplant coordinators.
              </p>
              <p>
                • You can update or withdraw consent anytime by writing to
                support@organlink.in.
              </p>
              <p>
                • Final medical clearance is required before any transplant
                procedure as per NOTTO guidelines.
              </p>
            </div>

            <label className="flex items-start gap-3 text-sm text-white/70">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 rounded-md border border-white/20 bg-white/10"
                {...register("consent", { valueAsBoolean: true })}
              />
              <span>
                I authorize OrganLink and its partner hospitals to securely
                store the information I have shared and to contact me regarding
                organ donation opportunities. The information provided is true
                to the best of my knowledge.
              </span>
            </label>
            {errors.consent ? (
              <p className="text-xs text-rose-300">{errors.consent.message}</p>
            ) : null}

            <button
              type="submit"
              className="btn-primary w-full justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting…" : "Submit registration"}
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default DonorRegistrationPage;
