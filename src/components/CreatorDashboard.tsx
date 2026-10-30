import React, { useState } from 'react';
import { appStore } from '../services/store';
import { LeagueBadge } from './LeagueBadge';
import {
  TrendingUp,
  Award,
  Wallet,
  ArrowDownToLine,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Sparkles,
  Gift,
  HeartHandshake,
  ChevronRight
} from 'lucide-react';

interface CreatorDashboardProps {
  onClose: () => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'earnings' | 'league' | 'fanclub' | 'splits'>('earnings');
  const [withdrawAmount, setWithdrawAmount] = useState('500');
  const [withdrawMethod, setWithdrawMethod] = useState<'M-Pesa' | 'Bank' | 'PayPal'>('M-Pesa');
  const [accountDetails, setAccountDetails] = useState('+254 712 345 678');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const user = appStore.currentUser;

  // Calculate 48h League challenge remaining
  const timeLeftMs = Math.max(0, user.leagueChallengeExpiresAt - Date.now());
  const hoursLeft = Math.floor(timeLeftMs / (3600 * 1000));
  const minutesLeft = Math.floor((timeLeftMs % (3600 * 1000)) / (60 * 1000));

  const progressPercent = Math.min(100, Math.round((user.leagueCoinsReceived / user.leagueTargetCoins) * 100));

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(null);
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt < 200) {
      setFeedbackMsg({ type: 'error', text: 'Minimum withdrawal is KSh 200.' });
      return;
    }
    const res = appStore.requestWithdrawal(amt, withdrawMethod, accountDetails);
    if (!res.success) {
      setFeedbackMsg({ type: 'error', text: res.message });
    } else {
      setFeedbackMsg({ type: 'success', text: res.message });
      setWithdrawAmount('200');
    }
  };

  const handleClaimFanPoints = () => {
    const res = appStore.claimFanClubPoints();
    setFeedbackMsg({ type: res.success ? 'success' : 'error', text: res.message });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-900 via-purple-800 to-violet-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <TrendingUp className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Creator Studio & Earnings</h2>
                <LeagueBadge league={user.creatorLeague} size="sm" />
              </div>
              <p className="text-xs text-purple-200">Manage league challenges, withdrawals, and fan club</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
          >
            Close
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-gray-100 bg-purple-50/50 px-4 text-xs font-bold">
          {[
            { id: 'earnings', label: 'Earnings & Payouts', icon: Wallet },
            { id: 'league', label: 'Creator League (D2→A1)', icon: Award },
            { id: 'fanclub', label: 'Fan Club System', icon: HeartHandshake },
            { id: 'splits', label: 'Revenue Split Ledger', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 flex items-center gap-1.5 border-b-2 transition-all ${
                  isActive
                    ? 'border-purple-700 text-purple-900 font-extrabold'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {feedbackMsg && (
            <div
              className={`p-3 rounded-2xl flex items-center gap-2 text-xs font-semibold ${
                feedbackMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}
            >
              {feedbackMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* TAB 1: EARNINGS & WITHDRAWALS */}
          {activeTab === 'earnings' && (
            <div className="space-y-5">
              {/* Balances Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                  <span className="text-xs uppercase font-bold text-purple-800 tracking-wider">Available Balance</span>
                  <div className="text-2xl font-black text-gray-900 mt-1">
                    KSh {user.creatorEarningsKsh.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold mt-1 inline-block">
                    ✓ Cleared for withdrawal
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">Pending Audit</span>
                  <div className="text-2xl font-black text-gray-900 mt-1">
                    KSh {user.creatorPendingKsh.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <span className="text-[10px] text-amber-700 font-semibold mt-1 inline-block">
                    ⏳ Processing fraud checks
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <span className="text-xs uppercase font-bold text-gray-600 tracking-wider">Total Received</span>
                  <div className="text-2xl font-black text-gray-900 mt-1">
                    {user.leagueCoinsReceived.toLocaleString()} 🪙
                  </div>
                  <span className="text-[10px] text-gray-500 font-semibold mt-1 inline-block">
                    Gift coins to date
                  </span>
                </div>
              </div>

              {/* Withdrawal Request Form */}
              <div className="p-5 rounded-2xl border border-purple-200 bg-white shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                    <ArrowDownToLine className="w-4 h-4 text-purple-700" />
                    Request Creator Payout
                  </h3>
                  <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                    Min KSh 200
                  </span>
                </div>

                <form onSubmit={handleWithdraw} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Amount to Withdraw (KSh)
                      </label>
                      <input
                        type="number"
                        min="200"
                        max={user.creatorEarningsKsh}
                        value={withdrawAmount}
                        onChange={e => setWithdrawAmount(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Payout Method
                      </label>
                      <select
                        value={withdrawMethod}
                        onChange={e => setWithdrawMethod(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                      >
                        <option value="M-Pesa">Safaricom M-Pesa (Kenya)</option>
                        <option value="Bank">Bank Wire Transfer</option>
                        <option value="PayPal">PayPal Payout</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Account Number / Mobile Phone
                    </label>
                    <input
                      type="text"
                      value={accountDetails}
                      onChange={e => setAccountDetails(e.target.value)}
                      placeholder="+254 7XX XXX XXX or Account #"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                  >
                    Submit Withdrawal Request
                  </button>
                </form>
              </div>

              {/* Recent Withdrawals History */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Withdrawal History
                </h4>
                <div className="space-y-2">
                  {appStore.withdrawals.map(w => (
                    <div
                      key={w.id}
                      className="p-3 rounded-xl border border-gray-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-gray-900">
                          KSh {w.amountKsh.toLocaleString()} via {w.method}
                        </span>
                        <div className="text-[11px] text-gray-500">{w.accountDetails}</div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          w.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : w.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {w.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CREATOR LEAGUE (D2 -> A1) */}
          {activeTab === 'league' && (
            <div className="space-y-5">
              {/* League Rank Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950 via-purple-900 to-violet-900 text-white shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-purple-300 uppercase tracking-widest font-bold">
                      Current League
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-3xl font-black">{user.creatorLeague}</span>
                      <LeagueBadge league={user.creatorLeague} size="lg" showDetails={true} />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-purple-300 uppercase tracking-widest font-bold flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5" /> 48h Challenge Time
                    </span>
                    <span className="text-lg font-black text-amber-300">
                      {hoursLeft}h {minutesLeft}m Left
                    </span>
                  </div>
                </div>

                {/* Progress bar to next league */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1 text-purple-200">
                    <span>
                      {user.leagueCoinsReceived.toLocaleString()} / {user.leagueTargetCoins.toLocaleString()} Coins
                    </span>
                    <span>{progressPercent}% Complete</span>
                  </div>
                  <div className="w-full h-3 bg-purple-950/80 rounded-full overflow-hidden border border-purple-500/30">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* 30% Fragment Rule */}
                <div className="p-3 rounded-xl bg-white/10 text-xs text-purple-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0" />
                  <span>
                    <strong>League Rules:</strong> Achieve 100% to promote. Reaching at least 30% allows you to permanently preserve the challenge's collectible fragment even if demoted!
                  </span>
                </div>
              </div>

              {/* Collectible Fragments Collection */}
              <div>
                <h3 className="font-extrabold text-sm text-gray-900 mb-2">
                  Your Collectible League Fragments
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl border border-blue-200 bg-blue-50 text-center">
                    <span className="text-2xl">🔷</span>
                    <div className="text-xs font-bold text-blue-900 mt-1">Blue (D League)</div>
                    <div className="text-sm font-black text-blue-700">{user.leagueFragments.blue} Collected</div>
                  </div>

                  <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-center">
                    <span className="text-2xl">🔻</span>
                    <div className="text-xs font-bold text-rose-900 mt-1">Red (C League)</div>
                    <div className="text-sm font-black text-rose-700">{user.leagueFragments.red} Collected</div>
                  </div>

                  <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-center">
                    <span className="text-2xl">🔶</span>
                    <div className="text-xs font-bold text-amber-900 mt-1">Gold (B League)</div>
                    <div className="text-sm font-black text-amber-700">{user.leagueFragments.gold} Collected</div>
                  </div>

                  <div className="p-3 rounded-xl border border-purple-200 bg-purple-50 text-center">
                    <span className="text-2xl">🔮</span>
                    <div className="text-xs font-bold text-purple-900 mt-1">Purple (A League)</div>
                    <div className="text-sm font-black text-purple-700">{user.leagueFragments.purple} Collected</div>
                  </div>
                </div>
              </div>

              {/* 8 Leagues Thresholds Table */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50 text-xs">
                <span className="font-bold text-gray-900 block mb-2">Configured League Thresholds:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2 bg-white rounded-lg border"><strong>D2:</strong> 0–4,999</div>
                  <div className="p-2 bg-white rounded-lg border"><strong>D1:</strong> 5k–14,999</div>
                  <div className="p-2 bg-white rounded-lg border"><strong>C2:</strong> 15k–39,999</div>
                  <div className="p-2 bg-white rounded-lg border"><strong>C1:</strong> 40k–99,999</div>
                  <div className="p-2 bg-white rounded-lg border"><strong>B2:</strong> 100k–249,999</div>
                  <div className="p-2 bg-white rounded-lg border"><strong>B1:</strong> 250k–499,999</div>
                  <div className="p-2 bg-white rounded-lg border"><strong>A2:</strong> 500k–999,999</div>
                  <div className="p-2 bg-white rounded-lg border"><strong>A1:</strong> 1,000,000+</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FAN CLUB SYSTEM */}
          {activeTab === 'fanclub' && (
            <div className="space-y-4">
              {user.fanClub ? (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                        Active Fan Club
                      </span>
                      <h3 className="text-lg font-black text-gray-900 mt-0.5">
                        {user.fanClub.creatorName} Fan Club
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-purple-700 text-white font-extrabold text-xs shadow">
                      {user.fanClub.role} · Lv.{user.fanClub.level}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-purple-100">
                    <div>
                      <span className="text-gray-500">Accumulated Points:</span>
                      <div className="text-base font-black text-purple-900">{user.fanClub.points} pts</div>
                    </div>
                    <button
                      onClick={handleClaimFanPoints}
                      className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow transition-all active:scale-95"
                    >
                      Claim +150 Points (Every 4h)
                    </button>
                  </div>

                  <div className="text-[11px] text-gray-600">
                    Fan Club Roles: <strong>Member</strong> (0-799 pts) → <strong>Superfan</strong> (800-1999 pts) → <strong>Guardian</strong> (2000+ pts). High rank unlocks colored chat auras and exclusive stickers!
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center rounded-2xl border border-dashed border-purple-300 bg-purple-50/50">
                  <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h4 className="font-bold text-gray-900 text-sm">Join a Creator Fan Club</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    Support your favorite creators, participate in exclusive activities, send hearts, and earn Guardian status!
                  </p>
                  <button
                    onClick={() => {
                      appStore.joinFanClub('user_apex', 'Apex Nairobi');
                      setFeedbackMsg({ type: 'success', text: 'Joined Apex Nairobi Fan Club!' });
                    }}
                    className="mt-3 px-5 py-2 rounded-full bg-purple-700 text-white font-bold text-xs shadow hover:bg-purple-800"
                  >
                    Join Apex Nairobi Fan Club (50 Coins)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REVENUE SPLIT LEDGER (Section 16) */}
          {activeTab === 'splits' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                <h4 className="font-black text-purple-900 text-sm mb-1">
                  Enforced Real-Time Gift Revenue Splits
                </h4>
                <p className="text-purple-700">
                  All virtual gift transactions are permanently calculated and logged using these exact backend splits:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Guest receives gift */}
                <div className="p-4 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-2">
                  <span className="font-extrabold text-sm text-gray-900 block">
                    When a LIVE Guest receives a gift:
                  </span>
                  <div className="space-y-1.5">
                    <div className="flex justify-between p-2 rounded-lg bg-emerald-50 text-emerald-900 font-bold">
                      <span>Guest Receiving Gift:</span>
                      <span>60%</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-purple-50 text-purple-900 font-bold">
                      <span>LIVE Host:</span>
                      <span>10%</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-gray-50 text-gray-800 font-bold">
                      <span>TIME UP Platform:</span>
                      <span>30%</span>
                    </div>
                  </div>
                </div>

                {/* Host receives gift */}
                <div className="p-4 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-2">
                  <span className="font-extrabold text-sm text-gray-900 block">
                    When the LIVE Host receives a gift:
                  </span>
                  <div className="space-y-1.5">
                    <div className="flex justify-between p-2 rounded-lg bg-emerald-50 text-emerald-900 font-bold">
                      <span>LIVE Host:</span>
                      <span>65%</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-gray-50 text-gray-800 font-bold">
                      <span>TIME UP Platform:</span>
                      <span>35%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
