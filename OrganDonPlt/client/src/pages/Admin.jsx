import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import api from '../services/api';
import toast from 'react-hot-toast';
import StatusBadge from '../components/StatusBadge';

const AdminPage = () => {
  const [overview, setOverview] = useState({
    users: [],
    logs: [],
    approvals: [],
    donorApplications: [],
    recipientApplications: []
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [users, logs, approvals, donorApplications, recipientApplications] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/logs'),
        api.get('/admin/approvals'),
        api.get('/admin/applications/donors'),
        api.get('/admin/applications/recipients')
      ]);
      setOverview({
        users: users.data,
        logs: logs.data,
        approvals: approvals.data,
        donorApplications: donorApplications.data,
        recipientApplications: recipientApplications.data
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateApproval = async (id, status) => {
    try {
      await api.patch(`/admin/approvals/${id}`, { status });
      toast.success('Approval updated');
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Unable to update approval');
    }
  };

  const updateDonorApplication = async (id, decision) => {
    try {
      const notesInput =
        decision === 'reject' ? window.prompt('Add review notes (optional)')?.trim() : undefined;
      const payload = {
        decision,
        notes: notesInput ? notesInput : undefined
      };
      const { data } = await api.patch(`/admin/applications/donors/${id}`, payload);

      if (decision === 'approve') {
        if (data?.credentials?.password) {
          toast.success(
            `Donor approved. Temporary password: ${data.credentials.password}`,
            { duration: 7000 }
          );
        } else {
          toast.success('Donor application approved');
        }
      } else {
        toast.success('Donor application rejected');
      }
      fetchData();
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || 'Unable to update donor application';
      toast.error(message);
    }
  };

  const updateRecipientApplication = async (id, decision) => {
    try {
      const notesInput =
        decision === 'reject' ? window.prompt('Add review notes (optional)')?.trim() : undefined;
      const payload = {
        decision,
        notes: notesInput ? notesInput : undefined
      };
      const { data } = await api.patch(`/admin/applications/recipients/${id}`, payload);

      if (decision === 'approve') {
        if (data?.credentials?.password) {
          toast.success(
            `Recipient approved. Temporary password: ${data.credentials.password}`,
            { duration: 7000 }
          );
        } else {
          toast.success('Recipient application approved');
        }
      } else {
        toast.success('Recipient application rejected');
      }
      fetchData();
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || 'Unable to update recipient application';
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel grid place-items-center rounded-3xl py-24">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-brand-500/30 border-t-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Administrative console"
        description="Oversee onboarding requests, audit logs, and user privileges."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-panel rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-white">Pending approvals</h3>
            <p className="text-sm text-white/60">Review organ matches awaiting physician or admin sign-off.</p>
            <div className="mt-6 space-y-4">
              {overview.approvals.map((approval) => (
                <div key={approval._id} className="rounded-2xl bg-white/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/70">
                    <div>
                      <p className="text-base font-semibold text-white">{approval.organType}</p>
                      <p>Donor · {approval.donorName}</p>
                      <p>Recipient · {approval.recipientName}</p>
                    </div>
                    <StatusBadge status={approval.status} />
                  </div>
                  <p className="mt-3 text-xs text-white/50">Requested by {approval.requestedBy}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => updateApproval(approval._id, 'approved')}
                      className="btn-primary !py-2 text-xs"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => updateApproval(approval._id, 'rejected')}
                      className="btn-muted !py-2 text-xs"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {!overview.approvals.length ? (
                <p className="text-sm text-white/60">Everything is up-to-date. No outstanding approvals.</p>
              ) : null}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-white">Donor onboarding</h3>
            <p className="text-sm text-white/60">Approve or reject public donor registrations.</p>
            <div className="mt-6 space-y-4">
              {overview.donorApplications.map((application) => (
                <div key={application.id} className="rounded-2xl bg-white/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1 text-sm text-white/70">
                      <p className="text-base font-semibold text-white">{application.name}</p>
                      <p>{application.email}</p>
                      <p>Organ · {application.organType}</p>
                      <p>Blood group · {application.bloodGroup}</p>
                      <p className="text-xs text-white/40">Preferred hospital · {application.preferredHospital || '—'}</p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                  <p className="mt-3 text-xs text-white/50">
                    Submitted from {application.city}, {application.country}
                  </p>
                  {application.reviewNotes ? (
                    <p className="mt-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-white/60">
                      Notes: {application.reviewNotes}
                    </p>
                  ) : null}
                  {application.reviewedBy ? (
                    <p className="mt-2 text-[0.65rem] uppercase tracking-widest text-white/40">
                      Reviewed by {application.reviewedBy.name} {application.reviewedAt ? `on ${new Date(application.reviewedAt).toLocaleDateString()}` : ''}
                    </p>
                  ) : null}
                  {application.status === 'pending' ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => updateDonorApplication(application.id, 'approve')}
                        className="btn-primary !py-2 text-xs"
                      >
                        Approve & onboard
                      </button>
                      <button
                        type="button"
                        onClick={() => updateDonorApplication(application.id, 'reject')}
                        className="btn-muted !py-2 text-xs !text-rose-300 hover:!text-rose-100 hover:!border-rose-400"
                      >
                        Reject
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
              {!overview.donorApplications.length ? (
                <p className="text-sm text-white/60">No donor applications awaiting action.</p>
              ) : null}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-white">Recipient intake</h3>
            <p className="text-sm text-white/60">Verify clinical urgency for incoming recipients.</p>
            <div className="mt-6 space-y-4">
              {overview.recipientApplications.map((application) => (
                <div key={application.id} className="rounded-2xl bg-white/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1 text-sm text-white/70">
                      <p className="text-base font-semibold text-white">{application.name}</p>
                      <p>{application.email}</p>
                      <p>Organ needed · {application.organType}</p>
                      <p>Blood group · {application.bloodGroup}</p>
                      <p>Urgency score · {application.urgency}/10</p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                  <p className="mt-3 text-xs text-white/50">
                    Hospital · {application.hospital || 'Not specified'} · {application.city}, {application.country}
                  </p>
                  {application.diagnosis ? (
                    <p className="mt-2 rounded-xl bg-white/10 p-3 text-xs text-white/60">
                      Diagnosis: {application.diagnosis}
                    </p>
                  ) : null}
                  {application.reviewNotes ? (
                    <p className="mt-2 rounded-xl bg-white/10 p-3 text-xs text-white/60">
                      Notes: {application.reviewNotes}
                    </p>
                  ) : null}
                  {application.reviewedBy ? (
                    <p className="mt-2 text-[0.65rem] uppercase tracking-widest text-white/40">
                      Reviewed by {application.reviewedBy.name}{' '}
                      {application.reviewedAt ? `on ${new Date(application.reviewedAt).toLocaleDateString()}` : ''}
                    </p>
                  ) : null}
                  {application.status === 'pending' ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => updateRecipientApplication(application.id, 'approve')}
                        className="btn-primary !py-2 text-xs"
                      >
                        Approve & onboard
                      </button>
                      <button
                        type="button"
                        onClick={() => updateRecipientApplication(application.id, 'reject')}
                        className="btn-muted !py-2 text-xs !text-rose-300 hover:!text-rose-100 hover:!border-rose-400"
                      >
                        Reject
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
              {!overview.recipientApplications.length ? (
                <p className="text-sm text-white/60">No recipient applications awaiting action.</p>
              ) : null}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-white">User directory</h3>
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-2">
              {overview.users.map((user) => (
                <div key={user._id} className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-white/50">{user.email}</p>
                  <p className="mt-1 text-xs capitalize text-brand-200">Role · {user.role}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-white">Audit trail</h3>
            <DataTable
              data={overview.logs}
              columns={[
                { key: 'action', label: 'Action' },
                { key: 'actor', label: 'Actor' },
                { key: 'entity', label: 'Entity' },
                { key: 'createdAt', label: 'Time', format: 'date' }
              ]}
              emptyLabel="No audit entries yet."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
