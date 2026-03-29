
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
  EyeOff
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { Client } from '../../types';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(storageService.getClients());
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Partial<Client>>({});
  const [showPin, setShowPin] = useState(false);

  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.phone.includes(searchTerm)
    );
  }, [clients, searchTerm]);

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الزبون من Jaguar Graphic؟')) {
      storageService.deleteClient(id);
      setClients(storageService.getClients());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client: Client = {
      id: currentClient.id || Math.random().toString(36).substr(2, 9),
      name: currentClient.name || '',
      phone: currentClient.phone || '',
      pin: currentClient.pin || '1234',
      createdAt: currentClient.createdAt || new Date().toISOString()
    };
    storageService.saveClient(client);
    setClients(storageService.getClients());
    setIsModalOpen(false);
    setCurrentClient({});
    setShowPin(false);
  };

  const openModal = (client: Partial<Client> = {}) => {
    setCurrentClient(client);
    setShowPin(false);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50">
        <div>
          <h1 className="text-4xl font-black text-black uppercase tracking-tighter">إدارة الزبائن</h1>
          <p className="text-gray-400 mt-2 font-bold text-sm tracking-widest uppercase">قاعدة بيانات Jaguar Graphic</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-[#e2006a] hover:bg-black text-white px-10 py-5 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-[#e2006a]/20 transition-all transform active:scale-95 font-black uppercase tracking-widest text-sm"
        >
          <UserPlus size={22} />
          <span>إضافة زبون جديد</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
        <div className="relative w-full">
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={24} />
          <input 
            type="text" 
            placeholder="بحث عن زبون بالاسم أو رقم الهاتف..."
            className="w-full pr-16 pl-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-[#e2006a]/5 focus:border-[#e2006a] outline-none transition-all font-bold text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-10 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.3em]">بروفايل الزبون</th>
                <th className="px-10 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.3em]">رقم الهاتف</th>
                <th className="px-10 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.3em]">الرمز السري (PIN)</th>
                <th className="px-10 py-6 font-black text-[10px] text-gray-400 uppercase tracking-[0.3em] text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center font-black text-xl shadow-lg group-hover:bg-[#e2006a] transition-colors">
                        {client.name.charAt(0)}
                      </div>
                      <span className="font-black text-gray-900 text-lg uppercase tracking-tight">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-gray-500 font-black tracking-widest">{client.phone}</td>
                  <td className="px-10 py-6">
                    <span className="bg-gray-100 px-4 py-2 rounded-xl text-sm font-black tracking-[0.5em] text-black shadow-inner">{client.pin}</span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => openModal(client)}
                        className="p-3 text-black hover:bg-black hover:text-white rounded-xl transition-all border border-gray-100"
                        title="تعديل"
                      >
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(client.id)}
                        className="p-3 text-[#e2006a] hover:bg-[#e2006a] hover:text-white rounded-xl transition-all border border-gray-100"
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
        {filteredClients.length === 0 && (
          <div className="p-32 text-center">
            <Users className="mx-auto text-gray-100 mb-6" size={64} />
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">لم يتم العثور على أي زبائن</p>
          </div>
        )}
      </div>

      {/* Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-black p-8 text-white flex justify-between items-center">
              <h2 className="text-xl font-black flex items-center gap-3 uppercase italic tracking-tighter">
                {currentClient.id ? <Edit size={24} className="text-[#e2006a]" /> : <UserPlus size={24} className="text-[#e2006a]" />} 
                {currentClient.id ? 'تعديل بيانات الزبون' : 'إضافة زبون جديد'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-3 rounded-2xl transition-all">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2 text-right">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mr-2">الاسم الكامل</label>
                <div className="relative">
                   <Users className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                   <input 
                    type="text" 
                    className="w-full pr-14 pl-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-[#e2006a] font-black uppercase tracking-wide text-sm"
                    required
                    placeholder="اسم الزبون..."
                    value={currentClient.name || ''}
                    onChange={(e) => setCurrentClient({...currentClient, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2 text-right">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mr-2">رقم الهاتف</label>
                <div className="relative">
                   <Phone className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                   <input 
                    type="tel" 
                    className="w-full pr-14 pl-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-[#e2006a] font-black tracking-widest text-sm text-left"
                    required
                    placeholder="06XXXXXXXX"
                    value={currentClient.phone || ''}
                    onChange={(e) => setCurrentClient({...currentClient, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2 text-right">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mr-2">الرمز السري (PIN)</label>
                <div className="relative">
                   <Key className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                   <input 
                    type={showPin ? "text" : "password"}
                    className="w-full pr-14 pl-14 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-[#e2006a] font-black tracking-[0.8em] text-sm text-left"
                    required
                    value={currentClient.pin || ''}
                    onChange={(e) => setCurrentClient({...currentClient, pin: e.target.value})}
                    placeholder="****"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#e2006a] transition-colors focus:outline-none"
                  >
                    {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-4 pt-6">
                <button type="submit" className="w-full bg-[#e2006a] hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl shadow-[#e2006a]/20 transition-all uppercase tracking-[0.3em] text-sm">حفظ البيانات</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-black py-5 rounded-2xl transition-all uppercase tracking-[0.3em] text-sm">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
