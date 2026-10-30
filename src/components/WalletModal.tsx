import React, { useState } from 'react';
import { COIN_PACKAGES, appStore } from '../services/store';
import { CoinPackage } from '../types';
import { Coins, X, CheckCircle2, ShieldCheck, Phone, CreditCard, Sparkles, AlertCircle } from 'lucide-react';
import { soundManager } from '../services/soundEffects';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const [selectedPkg, setSelectedPkg] = useState<CoinPackage>(COIN_PACKAGES[1]);
  const [paymentMethod, setPaymentMethod] = useState<'M-Pesa' | 'Airtel Money' | 'Visa' | 'Mastercard' | 'PayPal'>('M-Pesa');
  const [mpesaPhone, setMpesaPhone] = useState('+254 7');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stkStatus, setStkStatus] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const user = appStore.currentUser;

  const handleRecharge = () => {
    setIsProcessing(true);
    setStkStatus(null);
    setSuccessMsg(null);

    if (paymentMethod === 'M-Pesa' || paymentMethod === 'Airtel Money') {
      // Simulate Safaricom Daraja STK Push workflow
      setStkStatus('Initiating STK Push... Check your phone screen to enter PIN');
      setTimeout(() => {
        setStkStatus('STK Prompt Sent! Waiting for M-Pesa PIN confirmation...');
      }, 1000);

      setTimeout(() => {
        const res = appStore.rechargeCoins(selectedPkg, paymentMethod);
        setIsProcessing(false);
        setStkStatus(null);
        setSuccessMsg(`Payment confirmed! ${res.message}`);
        soundManager.playCoinClink();
      }, 2800);
    } else {
      // Card / PayPal flow
      setTimeout(() => {
        const res = appStore.rechargeCoins(selectedPkg, paymentMethod);
        setIsProcessing(false);
        setSuccessMsg(`Transaction authorized! ${res.message}`);
        soundManager.playCoinClink();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-800 via-purple-700 to-violet-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <Coins className="w-6 h-6 text-amber-300 drop-shadow" />
            </div>
            <div>
              <h2 className="text-lg font-bold">TIME UP Coin Wallet</h2>
              <p className="text-xs text-purple-200">Recharge coins to send virtual gifts and level up</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Banner */}
        <div className="p-5 bg-purple-50 border-b border-purple-100 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-purple-700">Available Balance</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-3xl font-black text-gray-900">{user.walletCoins.toLocaleString()}</span>
              <span className="text-sm font-bold text-amber-600 flex items-center gap-1">
                <Coins className="w-4 h-4" /> Coins
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500">Gifter Rank</span>
            <div className="text-sm font-bold text-purple-800">
              Diamond Lv.{user.gifterLevel}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Packages Grid */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
              Select Coin Package
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {COIN_PACKAGES.map(pkg => {
                const isSelected = selectedPkg.id === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPkg(pkg)}
                    className={`relative p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-400/40 shadow-sm'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2 right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[9px] uppercase tracking-wider shadow">
                        Popular
                      </span>
                    )}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-black text-gray-900">{pkg.coins}</span>
                      <Coins className="w-4 h-4 text-amber-500 inline" />
                    </div>
                    <div className="text-xs font-bold text-purple-700 mt-1">
                      KSh {pkg.priceKsh.toLocaleString()}
                    </div>
                    {pkg.bonus && (
                      <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                        {pkg.bonus}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
              Payment Provider
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'M-Pesa', label: 'M-Pesa (Daraja)', icon: '🟢' },
                { id: 'Airtel Money', label: 'Airtel Money', icon: '🔴' },
                { id: 'Visa', label: 'Visa Card', icon: '💳' },
                { id: 'Mastercard', label: 'Mastercard', icon: '💳' },
                { id: 'PayPal', label: 'PayPal', icon: '🅿️' }
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                    paymentMethod === method.id
                      ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-sm'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{method.icon}</span>
                  <span className="truncate">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* M-Pesa Phone Input if M-Pesa is selected */}
          {(paymentMethod === 'M-Pesa' || paymentMethod === 'Airtel Money') && (
            <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100">
              <label className="text-xs font-bold text-purple-900 flex items-center gap-1.5 mb-1.5">
                <Phone className="w-3.5 h-3.5 text-purple-700" />
                Mobile Phone for STK Push Prompt
              </label>
              <input
                type="tel"
                value={mpesaPhone}
                onChange={e => setMpesaPhone(e.target.value)}
                placeholder="+254 7XX XXX XXX"
                className="w-full px-3 py-2 rounded-xl border border-purple-200 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-[11px] text-purple-700/80 mt-1 block">
                Instant prompt sent to your mobile phone via secure Daraja gateway.
              </span>
            </div>
          )}

          {/* STK Push status alert */}
          {stkStatus && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-900 animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{stkStatus}</span>
            </div>
          )}

          {/* Success alert */}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit Secure Encryption</span>
          </div>

          <button
            onClick={handleRecharge}
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-700 to-violet-600 text-white font-bold text-sm shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isProcessing ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Coins className="w-4 h-4 text-amber-300" />
            )}
            <span>Pay KSh {selectedPkg.priceKsh.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
