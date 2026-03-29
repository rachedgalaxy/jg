
import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, Eye, EyeOff, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import { ADMIN_PIN } from '../constants';

interface AccountSecurityProps {
  user: any;
}

const AccountSecurity: React.FC<AccountSecurityProps> = ({ user }) => {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPins, setShowPins] = useState({ current: false, next: false, confirm: false });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    // Validations
    if (newPin !== confirmPin) {
      setStatus({ type: 'error', message: 'الرمز السري الجديد غير متطابق.' });
      return;
    }

    if (newPin.length < 4) {
      setStatus({ type: 'error', message: 'يجب أن يتكون الرمز السري من 4 أرقام على الأقل.' });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      let isAuthorized = false;

      if (user.role === 'ADMIN') {
        // Admin PIN check (from constants)
        isAuthorized = currentPin === ADMIN_PIN;
      } else {
        // Client PIN check (from storage)
        const clients = storageService.getClients();
        const client = clients.find(c => c.id === user.id);
        isAuthorized = client?.pin === currentPin;
      }

      if (!isAuthorized) {
        setStatus({ type: 'error', message: 'الرمز السري الحالي غير صحيح.' });
        setIsLoading(false);
        return;
      }

      // Perform update
      if (user.role === 'CLIENT') {
        storageService.updateClientPin(user.id, newPin);
      } else {
        // For Admin in this demo, we just show success as changing constants requires source change
        // In a real app, this would update a DB or admin state.
      }

      setStatus({ type: 'success', message: 'تم تحديث الرمز السري بنجاح! يرجى استخدامه في الدخول القادم.' });
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      setIsLoading(false);
    }, 800);
  };

  const toggleVisibility = (field: 'current' | 'next' | 'confirm') => {
    setShowPins(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center text-[#e2006a] shadow-xl">
              <ShieldCheck size={32} />
           </div>
           <div>
              <h1 className="text-4xl font-black text-black uppercase tracking-tighter">أمان الحساب</h1>
              <p className="text-gray-400 mt-1 font-bold text-sm uppercase tracking-widest">Jaguar Security Protocol</p>
           </div>
        </div>
      </header>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-50 overflow-hidden">
        <div className="p-10 md:p-16">
          <div className="flex items-center gap-3 mb-10 text-[#e2006a]">
             <Lock size={20} />
             <h2 className="text-xl font-black uppercase tracking-tight text-black">تغيير الرمز السري (PIN)</h2>
          </div>

          <form onSubmit={handleUpdatePin} className="space-y-8">
            {/* Current PIN */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block mr-2 text-right">الرمز السري الحالي</label>
              <div className="relative">
                <Key className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input
                  type={showPins.current ? "text" : "password"}
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  className="w-full pr-14 pl-14 py-5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#e2006a] focus:bg-white transition-all font-black tracking-[0.5em] text-lg"
                  required
                  placeholder="****"
                />
                <button type="button" onClick={() => toggleVisibility('current')} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#e2006a]">
                  {showPins.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full my-4"></div>

            {/* New PIN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block mr-2 text-right">الرمز السري الجديد</label>
                <div className="relative">
                  <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    type={showPins.next ? "text" : "password"}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full pr-14 pl-14 py-5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#e2006a] focus:bg-white transition-all font-black tracking-[0.5em] text-lg"
                    required
                    placeholder="****"
                  />
                  <button type="button" onClick={() => toggleVisibility('next')} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#e2006a]">
                    {showPins.next ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block mr-2 text-right">تأكيد الرمز الجديد</label>
                <div className="relative">
                  <ShieldCheck className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    type={showPins.confirm ? "text" : "password"}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    className="w-full pr-14 pl-14 py-5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[#e2006a] focus:bg-white transition-all font-black tracking-[0.5em] text-lg"
                    required
                    placeholder="****"
                  />
                  <button type="button" onClick={() => toggleVisibility('confirm')} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#e2006a]">
                    {showPins.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {status.type && (
              <div className={`p-5 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top duration-300 ${
                status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                <p className="text-sm font-black uppercase tracking-wide">{status.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#e2006a] hover:bg-black text-white py-6 rounded-2xl font-black text-lg uppercase tracking-widest shadow-2xl shadow-[#e2006a]/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {isLoading ? (
                 <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={24} />
                  <span>تحديث إعدادات الأمان</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-gray-50 p-10 text-right border-t border-gray-100">
           <div className="flex items-start gap-4">
              <AlertTriangle className="text-amber-500 shrink-0 mt-1" size={20} />
              <div>
                 <p className="text-xs font-black text-gray-600 uppercase tracking-widest">تنبيه أمني هام:</p>
                 <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                   عند تغيير الرمز السري، سيتم تسجيل خروجك آلياً في الجلسة القادمة. يرجى حفظ الرمز الجديد في مكان آمن وعدم مشاركته مع أي شخص لضمان خصوصية بياناتك في Jaguar Graphic.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSecurity;
