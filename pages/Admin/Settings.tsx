
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Image as ImageIcon, 
  Phone, 
  Mail, 
  MapPin, 
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { AgencySettings } from '../../types';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AgencySettings>(storageService.getAgencySettings());
  const [saveStatus, setSaveStatus] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveAgencySettings(settings);
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 3000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50">
        <div>
          <h1 className="text-4xl font-black text-black uppercase tracking-tighter italic">إعدادات الوكالة</h1>
          <p className="text-gray-400 mt-2 font-bold text-sm tracking-widest uppercase">تخصيص بيانات الفواتير والشعار</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSave} className="bg-white p-10 md:p-14 rounded-[3rem] shadow-sm border border-gray-50 space-y-10">
            <section className="space-y-6">
              <h3 className="text-xs font-black text-[#e2006a] uppercase tracking-[0.3em] flex items-center gap-3">
                <FileText size={16}/> البيانات الأساسية للوكالة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2 block">اسم الوكالة (الرئيسي)</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-[#e2006a] focus:bg-white transition-all font-black text-sm uppercase"
                    value={settings.name}
                    onChange={(e) => setSettings({...settings, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2 block">الوصف أو التخصص</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-[#e2006a] focus:bg-white transition-all font-bold text-sm"
                    value={settings.description}
                    onChange={(e) => setSettings({...settings, description: e.target.value})}
                    required
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6 pt-6 border-t border-gray-50">
              <h3 className="text-xs font-black text-[#e2006a] uppercase tracking-[0.3em] flex items-center gap-3">
                <ImageIcon size={16}/> شعار الوكالة (Logo)
              </h3>
              <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex items-start gap-4">
                <AlertTriangle className="text-amber-600 shrink-0 mt-1" size={20} />
                <div className="space-y-2">
                  <p className="text-[11px] font-black text-amber-800 uppercase tracking-wide">تعليمات الشعار:</p>
                  <p className="text-[10px] text-amber-700 leading-relaxed font-bold">
                    للحصول على أفضل مظهر، ارفع شعارك على موقع <a href="https://imgbb.com" target="_blank" rel="noreferrer" className="underline decoration-2 font-black">ImgBB</a> ثم انسخ "الرابط المباشر" (Direct Link) وضعه في الحقل أدناه.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2 block">رابط الشعار المباشر</label>
                <div className="relative">
                  <ImageIcon className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="url" 
                    className="w-full pr-14 pl-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-[#e2006a] focus:bg-white transition-all font-bold text-xs"
                    placeholder="https://i.ibb.co/..."
                    value={settings.logoUrl}
                    onChange={(e) => setSettings({...settings, logoUrl: e.target.value})}
                    required
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6 pt-6 border-t border-gray-50">
              <h3 className="text-xs font-black text-[#e2006a] uppercase tracking-[0.3em] flex items-center gap-3">
                <Phone size={16}/> معلومات التواصل (تظهر في تذييل الفاتورة)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2 block">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="text" 
                      className="w-full pr-14 pl-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-[#e2006a] focus:bg-white transition-all font-black text-sm text-left"
                      value={settings.phone}
                      onChange={(e) => setSettings({...settings, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2 block">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="email" 
                      className="w-full pr-14 pl-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-[#e2006a] focus:bg-white transition-all font-black text-sm text-left"
                      value={settings.email}
                      onChange={(e) => setSettings({...settings, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2 block">العنوان الجغرافي (الولاية / المدينة)</label>
                <div className="relative">
                  <MapPin className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="text" 
                    className="w-full pr-14 pl-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-[#e2006a] focus:bg-white transition-all font-bold text-sm"
                    value={settings.address}
                    onChange={(e) => setSettings({...settings, address: e.target.value})}
                    required
                  />
                </div>
              </div>
            </section>

            <button 
              type="submit" 
              className="w-full bg-black hover:bg-[#e2006a] text-white py-6 rounded-2xl font-black text-lg transition-all shadow-2xl flex items-center justify-center gap-4 uppercase tracking-[0.2em]"
            >
              <Save size={24} />
              <span>حفظ وتطبيق الإعدادات</span>
            </button>

            {saveStatus && (
              <div className="bg-green-50 text-green-700 p-4 rounded-2xl flex items-center justify-center gap-3 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 size={18} />
                <span className="text-xs font-black uppercase tracking-widest">تم حفظ الإعدادات بنجاح! جميع الفواتير ستستخدم البيانات الجديدة الآن.</span>
              </div>
            )}
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-50 text-center">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">معاينة الشعار الحالي</h3>
            <div className="w-32 h-32 mx-auto bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-center overflow-hidden mb-4 shadow-inner">
              <img src={settings.logoUrl} alt="Logo Preview" className="max-w-[80%] max-h-[80%] object-contain" />
            </div>
            <p className="text-[9px] font-black text-black uppercase tracking-widest">{settings.name}</p>
          </div>

          <div className="bg-black p-10 rounded-[3rem] text-white space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#e2006a]/20 blur-[60px] rounded-full"></div>
            <h3 className="text-xl font-black italic tracking-tighter flex items-center gap-3 uppercase">
              <ExternalLink className="text-[#e2006a]" /> مراجع سريعة
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-[#e2006a] rounded-full mt-1.5"></div>
                <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase">سيتم تحديث ترويسة وتذييل الفاتورة المطبوعة تلقائياً.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-[#e2006a] rounded-full mt-1.5"></div>
                <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase">رابط الشعار المباشر يجب أن ينتهي بـ (.png) أو (.jpg).</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-[#e2006a] rounded-full mt-1.5"></div>
                <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase">المعلومات المحدثة ستظهر للزبائن أيضاً في بوابتهم الخاصة.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
