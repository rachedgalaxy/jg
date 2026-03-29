
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Phone, Eye, EyeOff, LogIn, Zap } from 'lucide-react';
import { storageService } from '../services/storageService';
import { ADMIN_PHONE, ADMIN_PIN } from '../constants';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [phone, setPhone] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      // 1. Admin Login
      if (phone === ADMIN_PHONE && pin === ADMIN_PIN) {
        onLogin({ id: 'admin', role: 'ADMIN', name: 'مدير Jaguar Graphic' });
        navigate('/admin');
        return;
      }

      // 2. Client Login
      const clients = storageService.getClients();
      const client = clients.find(c => c.phone === phone && c.pin === pin);
      
      if (client) {
        onLogin({ id: client.id, role: 'CLIENT', name: client.name, phone: client.phone });
        navigate('/client');
        return;
      }

      // 3. Worker Login
      const workers = storageService.getWorkers();
      const worker = workers.find(w => w.phone === phone && w.pin === pin);

      if (worker) {
        onLogin({ id: worker.id, role: 'WORKER', name: worker.name, phone: worker.phone });
        navigate('/admin/orders'); // Workers go directly to orders
        return;
      }

      setError('بيانات الدخول غير صحيحة. يرجى مراجعة Jaguar Graphic.');
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <img src="https://i.ibb.co/60Md0hTy/jg.png" alt="Jaguar Graphic Logo" className="h-32 mx-auto drop-shadow-2xl" />
          <h1 className="text-3xl font-black tracking-tighter mt-4 text-black uppercase">Jaguar <span className="text-[#e2006a]">Graphic</span></h1>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-50">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">تسجيل الدخول</h2>
            <div className="h-1.5 w-12 bg-[#e2006a] mx-auto mt-3 rounded-full"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mr-1 flex items-center gap-2 text-right">
                <Phone size={12} className="text-[#e2006a]" />
                رقم الهاتف
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#e2006a]/10 focus:border-[#e2006a] outline-none transition-all text-lg font-bold text-left"
                placeholder="06XXXXXXXX"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mr-1 flex items-center gap-2 text-right">
                <Key size={12} className="text-[#e2006a]" />
                الرمز السري PIN
              </label>
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full pr-6 pl-14 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#e2006a]/10 focus:border-[#e2006a] outline-none transition-all text-lg font-bold tracking-[0.5em] text-left"
                  placeholder="****"
                  required
                />
                <button type="button" onClick={() => setShowPin(!showPin)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 p-2">
                  {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-black border border-red-100 text-center uppercase">{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#e2006a] hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl shadow-[#e2006a]/20 flex items-center justify-center gap-3 transform active:scale-[0.98] transition-all text-lg uppercase tracking-widest ${isSubmitting ? 'opacity-70' : ''}`}
            >
              {isSubmitting ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                <><Zap size={20} className="fill-current" /><span>دخول للنظام</span></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
