
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Trash2, 
  Edit, 
  Phone, 
  Key,
  X,
  UserPlus,
  Eye,
  EyeOff,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { Worker } from '../../types';

const Workers: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>(storageService.getWorkers());
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWorker, setCurrentWorker] = useState<Partial<Worker>>({});
  const [showPin, setShowPin] = useState(false);

  const filteredWorkers = useMemo(() => {
    return workers.filter(w => 
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      w.phone.includes(searchTerm)
    );
  }, [workers, searchTerm]);

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العامل من طاقم Jaguar Graphic؟')) {
      storageService.deleteWorker(id);
      setWorkers(storageService.getWorkers());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const worker: Worker = {
      id: currentWorker.id || Math.random().toString(36).substr(2, 9),
      name: currentWorker.name || '',
      phone: currentWorker.phone || '',
      pin: currentWorker.pin || '0000',
      createdAt: currentWorker.createdAt || new Date().toISOString()
    };
    storageService.saveWorker(worker);
    setWorkers(storageService.getWorkers());
    setIsModalOpen(false);
    setCurrentWorker({});
    setShowPin(false);
  };

  const openModal = (worker: Partial<Worker> = {}) => {
    setCurrentWorker(worker);
    setShowPin(false);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50">
        <div>
          <h1 className="text-4xl font-black text-black uppercase tracking-tighter">إدارة العمال</h1>
          <p className="text-gray-400 mt-2 font-bold text-sm tracking-widest uppercase">طاقم عمل Jaguar Graphic</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-black hover:bg-[#e2006a] text-white px-10 py-5 rounded-2xl flex items-center justify-center gap-3 shadow-2xl transition-all transform active:scale-95 font-black uppercase tracking-widest text-sm"
        >
          <UserPlus size={22} />
          <span>إضافة عامل جديد</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
        <div className="relative w-full">
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={24} />
          <input 
            type="text" 
            placeholder="بحث عن عامل بالاسم أو رقم الهاتف..."
            className="w-full pr-16 pl-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-[#e2006a]/5 focus:border-[#e2006a] outline-none transition-all font-bold text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-10 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.3em]">اسم العامل</th>
                <th className="px-10 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.3em]">رقم الهاتف</th>
                <th className="px-10 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.3em]">الرمز السري</th>
                <th className="px-10 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.3em] text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredWorkers.map(worker => (
                <tr key={worker.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-[#e2006a] text-white flex items-center justify-center font-black text-xl shadow-lg">
                        {worker.name.charAt(0)}
                      </div>
                      <span className="font-black text-gray-900 text-lg uppercase tracking-tight">{worker.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-gray-500 font-black tracking-widest">{worker.phone}</td>
                  <td className="px-10 py-6">
                    <span className="bg-gray-100 px-4 py-2 rounded-xl text-sm font-black tracking-[0.5em] text-black shadow-inner">{worker.pin}</span>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => openModal(worker)}
                        className="p-3 text-black hover:bg-black hover:text-white rounded-xl transition-all border border-gray-100"
                        title="تعديل"
                      >
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(worker.id)}
                        className="p-3 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-gray-100"
                        title="حذف"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredWorkers.length === 0 && (
          <div className="p-32 text-center">
            <Users className="mx-auto text-gray-100 mb-6" size={64} />
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">لم يتم إضافة عمال بعد</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-[#e2006a] p-8 text-white flex justify-between items-center">
              <h2 className="text-xl font-black flex items-center gap-3 uppercase italic tracking-tighter">
                <UserCheck size={24} /> 
                {currentWorker.id ? 'تعديل بيانات العامل' : 'إضافة عامل جديد'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-3 rounded-2xl transition-all">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2 text-right">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mr-2">الاسم الكامل</label>
                <input 
                    type="text" 
                    className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-[#e2006a] font-black uppercase text-sm"
                    required
                    placeholder="اسم العامل..."
                    value={currentWorker.name || ''}
                    onChange={(e) => setCurrentWorker({...currentWorker, name: e.target.value})}
                  />
              </div>
              <div className="space-y-2 text-right">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mr-2">رقم الهاتف</label>
                <input 
                    type="tel" 
                    className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-[#e2006a] font-black tracking-widest text-sm text-left"
                    required
                    placeholder="06XXXXXXXX"
                    value={currentWorker.phone || ''}
                    onChange={(e) => setCurrentWorker({...currentWorker, phone: e.target.value})}
                  />
              </div>
              <div className="space-y-2 text-right">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mr-2">الرمز السري</label>
                <div className="relative">
                   <input 
                    type={showPin ? "text" : "password"}
                    className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-[#e2006a] font-black tracking-[0.8em] text-sm text-left"
                    required
                    value={currentWorker.pin || ''}
                    onChange={(e) => setCurrentWorker({...currentWorker, pin: e.target.value})}
                    placeholder="****"
                  />
                  <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-2xl flex items-start gap-3 border border-amber-100">
                 <ShieldAlert size={20} className="text-amber-600 shrink-0" />
                 <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase">سيتمكن العامل من الوصول الكامل لإدارة الطلبيات فقط وتغيير حالاتها.</p>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <button type="submit" className="w-full bg-black hover:bg-[#e2006a] text-white font-black py-5 rounded-2xl shadow-xl transition-all uppercase tracking-[0.3em] text-sm">حفظ العامل</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workers;
