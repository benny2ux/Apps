import React, { useState } from 'react';
import { appStore } from '../services/store';
import { ViolationAppeal, ModerationReport, User } from '../types';
import {
  ShieldAlert,
  Users,
  CheckCircle,
  XCircle,
  FileText,
  Sliders,
  DollarSign,
  AlertTriangle,
  Lock,
  Unlock,
  Radio,
  Clock,
  Check,
  X
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [adminTab, setAdminTab] = useState<'users' | 'appeals' | 'reports' | 'splits' | 'logs'>('appeals');
  const [appealReviewNotes, setAppealReviewNotes] = useState('');
  const [selectedAppealId, setSelectedAppealId] = useState<string | null>(null);

  const appeals = appStore.appeals;
  const reports = appStore.reports;
  const auditLogs = appStore.auditLogs;
  const users = appStore.users;

  const handleResolveAppeal = (appealId: string, approved: boolean) => {
    appStore.resolveAppeal(appealId, approved, appealReviewNotes || (approved ? 'Accepted with evidence' : 'Violation upheld'));
    setSelectedAppealId(null);
    setAppealReviewNotes('');
  };

  const handleToggleUserSuspension = (targetUser: User) => {
    targetUser.isAccountSuspended = !targetUser.isAccountSuspended;
    appStore.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      adminUsername: appStore.currentUser.username,
      action: targetUser.isAccountSuspended ? 'SUSPEND_ACCOUNT' : 'UNSUSPEND_ACCOUNT',
      target: `@${targetUser.username}`,
      details: targetUser.isAccountSuspended ? 'Account suspended for policy evaluation.' : 'Account restored.',
      timestamp: Date.now()
    });
    appStore.notify();
  };

  const handleClearStrikes = (targetUser: User) => {
    targetUser.liveStrikes = 0;
    targetUser.isLiveSuspended = false;
    appStore.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      adminUsername: appStore.currentUser.username,
      action: 'CLEAR_LIVE_STRIKES',
      target: `@${targetUser.username}`,
      details: 'LIVE strikes cleared and broadcasting restored.',
      timestamp: Date.now()
    });
    appStore.notify();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-purple-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-gray-900 via-purple-950 to-gray-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold">TIME UP Central Safety & Admin Console</h2>
              <p className="text-xs text-purple-300">
                Logged in as Authorized Administrator (@{appStore.currentUser.username})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
          >
            Exit Console
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-gray-200 bg-gray-50 px-4 text-xs font-bold">
          {[
            { id: 'appeals', label: `Appeals Queue (${appeals.filter(a => a.status === 'pending').length})`, icon: AlertTriangle },
            { id: 'reports', label: `Reports (${reports.filter(r => r.status === 'pending').length})`, icon: FileText },
            { id: 'users', label: 'User & Strike Management', icon: Users },
            { id: 'splits', label: 'Revenue & Commission Settings', icon: Sliders },
            { id: 'logs', label: 'Audit Log', icon: Clock }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`py-3 px-3 flex items-center gap-1.5 border-b-2 transition-all ${
                  isActive
                    ? 'border-purple-700 text-purple-900 font-extrabold'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: APPEALS REVIEW (Section 23) */}
          {adminTab === 'appeals' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-purple-50 text-xs text-purple-900">
                <strong>Section 23 Appeals Workflow:</strong> Users who receive LIVE policy strikes can appeal. An independent administrator reviews the case, notes, and evidence. Approval restores privileges and clears the recorded strike.
              </div>

              {appeals.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400">No appeals in queue.</div>
              ) : (
                appeals.map(appeal => (
                  <div
                    key={appeal.id}
                    className="p-4 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-gray-900">
                          @{appeal.username}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 font-black text-[10px]">
                          Strike #{appeal.strikeNumber}
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          appeal.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : appeal.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {appeal.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-gray-700">Violation Reason:</span>
                      <p className="text-gray-600 bg-gray-50 p-2 rounded-lg">{appeal.violationReason}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-gray-700">Creator's Appeal & Evidence:</span>
                      <p className="text-gray-800 bg-purple-50/60 p-2 rounded-lg font-medium">
                        "{appeal.appealExplanation}" — {appeal.evidenceNotes}
                      </p>
                    </div>

                    {appeal.status === 'pending' && (
                      <div className="pt-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={selectedAppealId === appeal.id ? appealReviewNotes : ''}
                          onChange={e => {
                            setSelectedAppealId(appeal.id);
                            setAppealReviewNotes(e.target.value);
                          }}
                          placeholder="Administrator decision notes..."
                          className="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 text-xs"
                        />
                        <button
                          onClick={() => handleResolveAppeal(appeal.id, true)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve Appeal
                        </button>
                        <button
                          onClick={() => handleResolveAppeal(appeal.id, false)}
                          className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: REPORTS */}
          {adminTab === 'reports' && (
            <div className="space-y-3">
              {reports.map(rep => (
                <div key={rep.id} className="p-4 rounded-2xl border border-gray-200 bg-white text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-red-600 uppercase tracking-wide">
                      {rep.reason}
                    </span>
                    <span className="text-gray-400">{new Date(rep.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-gray-700">{rep.details}</p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        rep.status = 'actioned';
                        appStore.notify();
                      }}
                      className="px-3 py-1 rounded-lg bg-purple-700 text-white font-bold"
                    >
                      Take Action
                    </button>
                    <button
                      onClick={() => {
                        rep.status = 'dismissed';
                        appStore.notify();
                      }}
                      className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 font-bold"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: USER & STRIKE MANAGEMENT */}
          {adminTab === 'users' && (
            <div className="space-y-3">
              {users.map(u => (
                <div
                  key={u.id}
                  className="p-3.5 rounded-2xl border border-gray-200 bg-white flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.displayName} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900">{u.displayName}</span>
                        <span className="text-gray-400">(@{u.username})</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`font-bold ${u.liveStrikes > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          LIVE Strikes: {u.liveStrikes}/3
                        </span>
                        {u.isLiveSuspended && (
                          <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-black">
                            LIVE SUSPENDED
                          </span>
                        )}
                        {u.isAccountSuspended && (
                          <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-black">
                            ACCOUNT SUSPENDED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {u.liveStrikes > 0 && (
                      <button
                        onClick={() => handleClearStrikes(u)}
                        className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs"
                      >
                        Reset Strikes
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleUserSuspension(u)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                        u.isAccountSuspended
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-50 text-red-600 border border-red-200'
                      }`}
                    >
                      {u.isAccountSuspended ? 'Restore Account' : 'Suspend Account'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: REVENUE SPLIT SETTINGS */}
          {adminTab === 'splits' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900">
                <strong>Platform Revenue Split Configuration:</strong> Live gift transactions automatically calculate distributions based on these rates.
              </div>

              <div className="p-4 rounded-2xl border border-gray-200 space-y-3">
                <span className="font-bold text-gray-900 block text-sm">Guest Gift Split:</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block">Guest Share (%)</label>
                    <input
                      type="number"
                      value={appStore.revenueSplits.guestRecipient * 100}
                      onChange={e => {
                        const val = parseFloat(e.target.value) / 100;
                        appStore.updateRevenueSplits({ ...appStore.revenueSplits, guestRecipient: val });
                      }}
                      className="w-full p-2 rounded-xl border border-gray-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block">Host Share (%)</label>
                    <input
                      type="number"
                      value={appStore.revenueSplits.guestHost * 100}
                      onChange={e => {
                        const val = parseFloat(e.target.value) / 100;
                        appStore.updateRevenueSplits({ ...appStore.revenueSplits, guestHost: val });
                      }}
                      className="w-full p-2 rounded-xl border border-gray-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block">Platform Share (%)</label>
                    <input
                      type="number"
                      value={appStore.revenueSplits.guestPlatform * 100}
                      onChange={e => {
                        const val = parseFloat(e.target.value) / 100;
                        appStore.updateRevenueSplits({ ...appStore.revenueSplits, guestPlatform: val });
                      }}
                      className="w-full p-2 rounded-xl border border-gray-300 font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AUDIT LOG */}
          {adminTab === 'logs' && (
            <div className="space-y-2 text-xs">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3 rounded-xl border border-gray-200 bg-gray-50 flex items-start justify-between">
                  <div>
                    <span className="font-extrabold text-purple-900 block">
                      [{log.action}] · {log.target}
                    </span>
                    <p className="text-gray-600 mt-0.5">{log.details}</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      By {log.adminUsername}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
