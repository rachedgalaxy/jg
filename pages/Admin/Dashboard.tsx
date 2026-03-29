
import React, { useMemo, useRef } from 'react';
import { 
  Users, 
  ClipboardList, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  Package,
  Download,
  Upload,
  Database,
  AlertCircle
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { OrderStatus } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const orders = storageService.getOrders();
  const clients = storageService.getClients();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => {
    const totalIncome = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const activeOrders = orders.filter(o => o.status !== OrderStatus.DELIVERED).length;
    const completedOrders = orders.filter(o => o.status === OrderStatus.DELIVERED).length;

    return {
      totalOrders: orders.length,
      totalIncome,
      activeOrders,
      completedOrders,
      totalClients: clients.length
    };
  }, [orders, clients]);

  const chartData = useMemo(() => {
    const statusCounts = Object.values(OrderStatus).map(status => ({
      name: status,
      count: orders.filter(o => o.status === status).length
    }));
    return statusCounts;
  }, [orders]);

  const COLORS = ['#e2006a', '#000000', '#333333', '#666666'];

  const handleExport = () => {
    storageService.exportData();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (confirm('تنبيه: استيراد البيانات سيقوم باستبدال كافة البيانات الحالية ببيانات الملف المختار. هل تريد الاستمرار؟')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (storageService.importData(content)) {
          alert('تم استيراد البيانات بنجاح! سيتم إعادة تحميل الصفحة.');
          window.location.reload();
        } else {
          alert('فشل استيراد الملف. يرجى التأكد من أن الملف صحيح.');
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-black uppercase tracking-tighter">الرئيسية</h1>
          <p className="text-gray-400 mt-1 font-bold text-sm">نظرة عامة على نشاط Jaguar Graphic</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="إجمالي الطلبات" 
          value={stats.totalOrders} 
          icon={<ClipboardList className="text-[#e2006a]" size={24} />} 
          color="bg-[#e2006a]/5" 
        />
        <StatCard 
          title="إجمالي المداخيل" 
          value={`${stats.totalIncome.toLocaleString()} د.ج`} 
          icon={<TrendingUp className="text-black" size={24} />} 
          color="bg-black/5" 
        />
        <StatCard 
          title="طلبات قيد العمل" 
          value={stats.activeOrders} 
          icon={<Clock className="text-[#e2006a]" size={24} />} 
          color="bg-[#e2006a]/5" 
        />
        <StatCard 
          title="الزبائن المسجلين" 
          value={stats.totalClients} 
          icon={<Users className="text-black" size={24} />} 
          color="bg-black/5" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="text-lg font-black mb-8 flex items-center gap-3 uppercase tracking-widest">
            <div className="w-2 h-6 bg-[#e2006a] rounded-full"></div>
            حالة الطلبات
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#fcfcfc'}}
                  contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', padding: '15px' }}
                />
                <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#e2006a' : '#000000'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="text-lg font-black mb-8 flex items-center gap-3 uppercase tracking-widest">
            <div className="w-2 h-6 bg-black rounded-full"></div>
            آخر الطلبيات
          </h3>
          <div className="space-y-5">
            {orders.slice(-5).reverse().map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white font-black text-xl shadow-lg">
                  {order.clientName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900 truncate uppercase">{order.description}</p>
                  <p className="text-[10px] text-[#e2006a] font-bold uppercase tracking-widest">{order.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">{order.totalPrice} <small className="text-[8px] text-gray-400">د.ج</small></p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">{new Date(order.createdAt).toLocaleDateString('ar-DZ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center text-white shadow-xl shadow-black/10">
              <Database size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-black uppercase tracking-tighter">إدارة البيانات</h3>
              <p className="text-gray-400 text-sm mt-1 font-medium">التحكم في النسخ الاحتياطي لـ Jaguar Graphic.</p>
              <div className="flex items-center gap-2 text-[#e2006a] mt-3 text-[10px] font-black uppercase tracking-widest">
                <AlertCircle size={14} />
                <span>البيانات محلية وآمنة على متصفحك.</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleExport}
              className="flex items-center gap-3 px-8 py-4 bg-[#e2006a] hover:bg-black text-white font-black rounded-2xl shadow-xl shadow-[#e2006a]/10 transition-all transform active:scale-95 uppercase tracking-widest text-sm"
            >
              <Download size={20} />
              <span>تصدير نسخة</span>
            </button>
            
            <button 
              onClick={handleImportClick}
              className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-black text-black hover:bg-black hover:text-white font-black rounded-2xl transition-all transform active:scale-95 uppercase tracking-widest text-sm"
            >
              <Upload size={20} />
              <span>استيراد بيانات</span>
            </button>
            
            <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-gray-50 flex items-center gap-6 hover:shadow-xl transition-all group">
    <div className={`w-16 h-16 ${color} rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{title}</p>
      <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);

export default Dashboard;
