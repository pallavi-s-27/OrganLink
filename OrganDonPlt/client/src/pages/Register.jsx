import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import FormField from '../components/FormField';
import PageHeader from '../components/PageHeader';
import toast from 'react-hot-toast';

const schema = z
  .object({
    name: z.string().min(3, 'Name is required'),
    email: z.string().email('Valid email required'),
    password: z.string().min(6, 'Minimum 6 characters'),
    confirmPassword: z.string(),
    role: z.enum(['donor', 'recipient', 'doctor', 'admin']),
    phone: z.string().min(10, 'Phone number required'),
    organization: z.string().min(2, 'Hospital / organization required'),
    city: z.string().min(2, 'City required'),
    country: z.string().min(2, 'Country required'),
    bloodGroup: z.string().optional(),
    organType: z.string().optional(),
    urgency: z
      .number({ invalid_type_error: 'Urgency score required' })
      .min(1)
      .max(10)
      .optional()
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match'
  });

const roleHints = {
  donor: 'Provide organ availability and health profile details.',
  recipient: 'Submit urgency details and required organ information.',
  doctor: 'Manage approvals, match reviews, and medical evaluations.',
  admin: 'Oversee system operations, access logs, and assignments.'
};

const RegisterPage = () => {
  const { onboardUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      role: 'donor',
      urgency: 5
    }
  });

  const selectedRole = watch('role');

  const needsMedicalProfile = useMemo(() => ['donor', 'recipient'].includes(selectedRole), [selectedRole]);
  const needsUrgency = selectedRole === 'recipient';

  const onSubmit = async (values) => {
    const { confirmPassword, ...rest } = values;
    const payload = {
      ...rest,
      urgency: needsUrgency ? rest.urgency : undefined
    };

    try {
      await onboardUser(payload);
      toast.success('Profile onboarded successfully.');
      reset();
    } catch (error) {
      const message = error?.response?.data?.message ?? 'Unable to create profile. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Onboard a new profile"
        description="Register donors, recipients, and clinical staff with role-aware workflows."
      />
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-12">
        <section className="glass-panel space-y-6 rounded-3xl p-6 lg:col-span-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Role & Access</h3>
            <p className="mt-1 text-sm text-white/60">Choose the portal experience tailored to the stakeholder.</p>
          </div>
          <FormField label="Select role" error={errors.role?.message}>
            <select {...register('role')}>
              <option value="donor">Donor</option>
              <option value="recipient">Recipient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </FormField>
          <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/70">
            {roleHints[selectedRole]}
          </div>
        </section>

        <section className="glass-panel space-y-6 rounded-3xl p-6 lg:col-span-8">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField label="Full name" error={errors.name?.message}>
              <input type="text" placeholder="Dr. Sarah Mitchell" {...register('name')} />
            </FormField>
            <FormField label="Email address" error={errors.email?.message}>
              <input type="email" placeholder="you@hospital.org" {...register('email')} />
            </FormField>
            <FormField label="Phone" error={errors.phone?.message}>
              <input type="tel" placeholder="(+1) 555-0199" {...register('phone')} />
            </FormField>
            <FormField label="Organization / Hospital" error={errors.organization?.message}>
              <input type="text" placeholder="Mercy General Hospital" {...register('organization')} />
            </FormField>
            <FormField label="City" error={errors.city?.message}>
              <input type="text" placeholder="Seattle" {...register('city')} />
            </FormField>
            <FormField label="Country" error={errors.country?.message}>
              <input type="text" placeholder="United States" {...register('country')} />
            </FormField>
          </div>

          {needsMedicalProfile ? (
            <div className="rounded-2xl bg-white/5 p-5">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-white/60">Clinical Profile</h4>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <FormField label="Blood group" error={errors.bloodGroup?.message}>
                  <select {...register('bloodGroup')}>
                    <option value="">Select</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </FormField>
                <FormField label="Organ focus" error={errors.organType?.message}>
                  <select {...register('organType')}>
                    <option value="">Select</option>
                    <option value="Heart">Heart</option>
                    <option value="Kidney">Kidney</option>
                    <option value="Liver">Liver</option>
                    <option value="Lung">Lung</option>
                    <option value="Pancreas">Pancreas</option>
                    <option value="Cornea">Cornea</option>
                  </select>
                </FormField>
                {needsUrgency ? (
                  <FormField label="Urgency score" error={errors.urgency?.message}>
                    <input type="number" min={1} max={10} step={1} {...register('urgency', { valueAsNumber: true })} />
                  </FormField>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2">
            <FormField label="Password" error={errors.password?.message}>
              <input type="password" placeholder="Create strong password" {...register('password')} />
            </FormField>
            <FormField label="Confirm password" error={errors.confirmPassword?.message}>
              <input type="password" placeholder="Re-enter password" {...register('confirmPassword')} />
            </FormField>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
            <p>By creating an account, you agree to comply with HIPAA safeguards and GDPR privacy laws.</p>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating profile…' : 'Register profile'}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
};

export default RegisterPage;
