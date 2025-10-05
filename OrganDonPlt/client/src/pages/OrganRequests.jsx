import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserPlusIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import PageHeader from '../components/PageHeader';
import FormField from '../components/FormField';
import api from '../services/api';
import toast from 'react-hot-toast';
import DataTable from '../components/DataTable';
import { useAuth } from '../hooks/useAuth';

const OrganRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const canSubmitRecipientRequest = useMemo(() => ['recipient', 'doctor', 'admin'].includes(user?.role), [user]);
  const canShareDonorAvailability = useMemo(() => ['donor', 'doctor', 'admin'].includes(user?.role), [user]);

  const requestForm = useForm({
    defaultValues: {
      organType: 'Kidney',
      urgency: 6,
      hospital: ''
    }
  });

  const availabilityForm = useForm({
    defaultValues: {
      organType: 'Kidney',
      preservationHours: 24,
      hospital: ''
    }
  });

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/organ-requests');
      setRequests(data);
    } catch (error) {
      console.error(error);
      toast.error('Could not load organ request data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const submitRequest = requestForm.handleSubmit(async (values) => {
    try {
      await api.post('/organ-requests', values);
      toast.success('Recipient request submitted');
      requestForm.reset();
      fetchRequests();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Unable to submit request');
    }
  });

  const submitAvailability = availabilityForm.handleSubmit(async (values) => {
    try {
      await api.post('/donors/availability', values);
      toast.success('Donor availability shared');
      availabilityForm.reset();
      fetchRequests();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Unable to update availability');
    }
  });

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="relative">
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl animate-pulse delay-1000" />
        <PageHeader
          title={
            <span className="bg-gradient-to-r from-white via-rose-200 to-emerald-200 bg-clip-text text-transparent">
              Matchmaking Hub
            </span>
          }
          description="Submit organ requests, share donor availability, and monitor match readiness in one place."
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {canSubmitRecipientRequest && (
        <form onSubmit={submitRequest} className="glass-panel-elevated space-y-6 rounded-3xl p-8 group hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-rose-500/20 p-3 rounded-2xl">
              <ClipboardDocumentListIcon className="h-6 w-6 text-rose-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-rose-200 bg-clip-text text-transparent">
                Recipient Organ Request
              </h3>
              <p className="text-sm text-white/60 mt-1">
                Capture recipient specifics to fast-track compatibility workflows
              </p>
            </div>
          </div>

          <FormField label="Organ type" error={requestForm.formState.errors.organType?.message}>
            <select {...requestForm.register('organType')}>
              <option value="Heart">Heart</option>
              <option value="Kidney">Kidney</option>
              <option value="Liver">Liver</option>
              <option value="Lung">Lung</option>
            </select>
          </FormField>

          <FormField label="Hospital" error={requestForm.formState.errors.hospital?.message}>
            <input type="text" placeholder="Recipient hospital" {...requestForm.register('hospital')} />
          </FormField>

          <FormField label="Urgency (1-10)" error={requestForm.formState.errors.urgency?.message}>
            <input
              type="number"
              min={1}
              max={10}
              step={1}
              {...requestForm.register('urgency', { valueAsNumber: true })}
            />
          </FormField>

          <FormField label="Clinical notes" error={requestForm.formState.errors.notes?.message}>
            <textarea
              rows={4}
              placeholder="Include severity, supporting labs, travel constraints"
              {...requestForm.register('notes')}
            />
          </FormField>

          <button 
            type="submit" 
            className="btn-primary w-full py-4 relative overflow-hidden group/btn" 
            disabled={requestForm.formState.isSubmitting}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {requestForm.formState.isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting request...
                </>
              ) : (
                <>
                  Submit Request
                  <span className="text-lg">→</span>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500" />
          </button>
        </form>
        )}

        {canShareDonorAvailability && (
        <form onSubmit={submitAvailability} className="glass-panel-elevated space-y-6 rounded-3xl p-8 group hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-emerald-500/20 p-3 rounded-2xl">
              <UserPlusIcon className="h-6 w-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                Donor Availability
              </h3>
              <p className="text-sm text-white/60 mt-1">Share viable organ inventory and logistics readiness</p>
            </div>
          </div>

          <FormField label="Organ type" error={availabilityForm.formState.errors.organType?.message}>
            <select {...availabilityForm.register('organType')}>
              <option value="Heart">Heart</option>
              <option value="Kidney">Kidney</option>
              <option value="Liver">Liver</option>
              <option value="Lung">Lung</option>
            </select>
          </FormField>
          <FormField label="Preservation window (hrs)" error={availabilityForm.formState.errors.preservationHours?.message}>
            <input
              type="number"
              min={1}
              max={72}
              {...availabilityForm.register('preservationHours', { valueAsNumber: true })}
            />
          </FormField>
          <FormField label="Recovery hospital" error={availabilityForm.formState.errors.hospital?.message}>
            <input type="text" placeholder="Recovery center" {...availabilityForm.register('hospital')} />
          </FormField>
          <FormField label="Medical notes" error={availabilityForm.formState.errors.notes?.message}>
            <textarea
              rows={4}
              placeholder="Condition, stability metrics, transport preferences"
              {...availabilityForm.register('notes')}
            />
          </FormField>
          <button 
            type="submit" 
            className="btn-secondary w-full py-4 relative overflow-hidden group/btn" 
            disabled={availabilityForm.formState.isSubmitting}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {availabilityForm.formState.isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sharing availability...
                </>
              ) : (
                <>
                  Share Availability
                  <span className="text-lg">✓</span>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500" />
          </button>
        </form>
        )}

        {!canSubmitRecipientRequest && !canShareDonorAvailability && (
          <div className="glass-panel-elevated rounded-3xl p-8 text-center text-white/70">
            No submission actions are available for your role.
          </div>
        )}
      </div>

      <div className="space-y-4">
        <PageHeader title="Open Requests" description="Track current requests, statuses, and medical notes." />
        {loading ? (
          <div className="glass-panel grid place-items-center rounded-3xl py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500/30 border-t-brand-500" />
          </div>
        ) : (
          <DataTable
            data={requests}
            columns={[
              { key: 'organType', label: 'Organ' },
              { key: 'requesterName', label: 'Requested By' },
              { key: 'hospital', label: 'Hospital' },
              { key: 'urgencyLabel', label: 'Urgency' },
              { key: 'status', label: 'Status' },
              { key: 'createdAt', label: 'Created', format: 'date' }
            ]}
            emptyLabel="No active requests yet."
          />
        )}
      </div>
    </div>
  );
};

export default OrganRequestsPage;
