
import React, { useMemo, useState, useEffect } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Calendar,
  Phone,
  Maximize2,
  // Added missing Printer icon
  Printer
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { OrderStatus, Order, AgencySettings } from '../../types';

interface ClientPortalProps {
  user: any;
}

const ClientPortal: React.FC<ClientPortalProps> = ({ user }) => {
  const [agency, setAgency] = useState<AgencySettings>(storageService.getAgencySettings());
  const allOrders = storageService.getOrders();
  
  const myOrders = useMemo(() => {
    return allOrders.filter(o => o.clientId === user.id);
  }, [allOrders, user.id]);

  const stats = useMemo(() => ({
    total: myOrders.length,
    inProgress: myOrders.filter(o => o.status === OrderStatus.IN_PRINTING || o.status === OrderStatus.NEW).length,
    ready: myOrders.filter(o => o.status === OrderStatus.READY).length,
    delivered: myOrders.filter(o => o.status === OrderStatus.DELIVERED).length
  }), [myOrders]);

  const handlePrint = (order: Order) => {
    const currentAgency = storageService.getAgencySettings();
    const printWindow = window.open('', '_blank');
    if (!printWindow) { alert('يرجى السماح بالنوافذ المنبثقة'); return; }
    
    const siteUrl = window.location.origin;
    const itemsHtml = order.items.map(item => `
      <tr>
        <td>${item.description}</td>
        <td>${item.length} م × ${item.width} م</td>
        <td>${item.quantity}</td>
        <td>${(item.length * item.width * item.quantity * item.pricePerSqm).toLocaleString()} د.ج</td>
      </tr>
    `).join('');

    const content = `
      <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>${currentAgency.name} - فاتورة ${order.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');
            body { font-family: 'Tajawal', sans-serif; padding: 40px; }
            header { display: flex; justify-content: space-between; border-bottom: 4px solid #e2006a; padding-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th { background: #1a1a1a; color: white; padding: 12px; text-align: right; }
            td { padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; }
            .totals { width: 250px; margin-right: auto; margin-top: 30px; }
            .totals div { display: flex; justify-content: space-between; padding: 10px 0; }
            .grand { background: #1a1a1a; color: white; padding: 15px !important; border-radius: 10px; }
          </style>
        </head>
        <body>
          <header>
            <div><img src="${currentAgency.logoUrl}" height="60" /><h1>${currentAgency.name}</h1></div>
            <div style="text-align: left"><h2>فاتورة ضريبية</h2><p>رقم: ${order.id}</p></div>
          </header>
          <div style="margin-top: 20px;">
            <p>اسم الزبون: <strong>${order.clientName}</strong></p>
            <p>تاريخ التسليم: <strong>${new Date(order.dueDate).toLocaleDateString('ar-DZ')}</strong></p>
          </div>
          <table><thead><tr><th>البيان</th><th>المقاس</th><th>الكمية</th><th>الإجمالي</th></tr></thead><tbody>${itemsHtml}</tbody></table>
          <div class="totals">
             <div><span>المجموع:</span><span>${order.totalPrice.toLocaleString()} د.ج</span></div>
             <div><span>المدفوع:</span><span>${order.paidAmount.toLocaleString()} د.ج</span></div>
             <div class="grand"><span>المتبقي:</span><span>${order.remainingAmount.toLocaleString()} د.ج</span></div>
          </div>
          <div style="margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px;">
            <p>${currentAgency.address} | هاتف: ${currentAgency.phone}</p>
          </div>
          <script>window.onload = function() { window.print(); setTimeout(() => window.close(), 500); };</script>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50">
        <div>
          <h1 className="text-4xl font-black text-black uppercase tracking-tighter">أهلاً بك، {user.name}</h1>
          <p className="text-gray-400 mt-2 font-bold text-sm tracking-widest uppercase">{agency.name} Client Portal</p>
        </div>
        <div className="bg-black text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-sm tracking-widest">
          <Phone size={18} className="text-[#e2006a]" />
          {user.phone}
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatusBox label="الطلبات" value={stats.total} icon={<FileText/>} color="text-black" />
        <StatusBox label="قيد العمل" value={stats.inProgress} icon={<Clock/>} color="text-amber-600" />
        <StatusBox label="جاهز" value={stats.ready} icon={<CheckCircle2/>} color="text-[#e2006a]" />
        <StatusBox label="مستلم" value={stats.delivered} icon={<Package/>} color="text-green-600" />
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
          <FileText className="text-[#e2006a]" /> سجل طلبياتي
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {myOrders.map(order => (
            <div key={order.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 hover:shadow-2xl transition-all">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">#{order.id}</span>
                <button onClick={() => handlePrint(order)} className="p-3 bg-gray-50 hover:bg-[#e2006a] hover:text-white rounded-xl transition-all shadow-sm">
                  <Printer size={20} />
                </button>
              </div>
              <h4 className="text-2xl font-black mb-4 uppercase">{order.description}</h4>
              <div className="bg-gray-50 p-5 rounded-2xl space-y-2">
                 <div className="flex justify-between font-black text-xs uppercase tracking-widest"><span>الإجمالي:</span><span>{order.totalPrice.toLocaleString()} د.ج</span></div>
                 <div className="flex justify-between font-black text-xs uppercase tracking-widest text-green-600"><span>المدفوع:</span><span>{order.paidAmount.toLocaleString()} د.ج</span></div>
                 <div className="flex justify-between font-black text-sm uppercase tracking-widest text-[#e2006a] border-t border-dashed mt-2 pt-2"><span>الباقي:</span><span>{order.remainingAmount.toLocaleString()} د.ج</span></div>
              </div>
              <p className="mt-6 text-[10px] font-black uppercase text-gray-400">موعد التسليم المتوقع: {new Date(order.dueDate).toLocaleDateString('ar-DZ')}</p>
            </div>
          ))}
        </div>
        {myOrders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed">
            <FileText className="mx-auto text-gray-100 mb-4" size={48} />
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">لا توجد طلبيات سابقة</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBox = ({label, value, icon, color}: any) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50 flex flex-col items-center justify-center text-center">
    <div className={`mb-4 ${color}`}>{icon}</div>
    <p className="text-3xl font-black">{value}</p>
    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">{label}</p>
  </div>
);

export default ClientPortal;
