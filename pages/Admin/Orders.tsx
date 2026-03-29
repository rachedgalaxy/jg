
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Printer, 
  Calendar,
  Trash2,
  Package,
  X,
  PlusCircle,
  MinusCircle,
  Users,
  Zap,
  DollarSign,
  Wallet,
  Monitor,
  ArrowLeftRight,
  ChevronDown,
  ShoppingBag,
  QrCode,
  Layout as LayoutIcon,
  Edit3,
  ShieldCheck,
  Lock,
  AlertTriangle,
  Globe,
  PencilRuler,
  Square,
  Circle,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  MousePointer2,
  Layers,
  Move,
  Trash
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { Order, OrderStatus, Client, OrderItem, ProductPrice, AgencySettings } from '../../types';
import { ADMIN_PIN } from '../../constants';

interface LayoutShape {
  id: string;
  type: 'RECT' | 'CIRCLE';
  length: number;
  width: number;
  price: number;
  unit: 'm' | 'cm';
  label: string;
  x: number;
  y: number;
}

interface OrdersProps {
  user: any;
}

const Orders: React.FC<OrdersProps> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>(storageService.getOrders());
  const [clients, setClients] = useState<Client[]>(storageService.getClients());
  const [productPrices, setProductPrices] = useState<ProductPrice[]>(storageService.getProductPrices());
  const [agency, setAgency] = useState<AgencySettings>(storageService.getAgencySettings());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPOSFullScreen, setIsPOSFullScreen] = useState(false);
  const [isPrintOptionsOpen, setIsPrintOptionsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDrawingToolOpen, setIsDrawingToolOpen] = useState(false);
  
  const [sessionShapes, setSessionShapes] = useState<LayoutShape[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(0.8);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [priceMode, setPriceMode] = useState<'CLIENT' | 'WHOLESALE'>('CLIENT');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  
  const [deletePin, setDeletePin] = useState('');
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [pinError, setPinError] = useState(false);

  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);
  const [printSettings, setPrintSettings] = useState({
    includeQR: true,
    includeTimeline: true
  });
  
  const [clientMode, setClientMode] = useState<'EXISTING' | 'NEW'>('EXISTING');
  const [newClientData, setNewClientData] = useState({ name: '', phone: '' });

  const [newOrderItems, setNewOrderItems] = useState<OrderItem[]>([
    { description: '', length: 1, width: 1, quantity: 1, pricePerSqm: 0 }
  ]);
  const [newOrderData, setNewOrderData] = useState({
    clientId: '',
    dueDate: new Date().toISOString().split('T')[0],
    paidAmount: 0
  });

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (isPrintOptionsOpen || isModalOpen) {
      setAgency(storageService.getAgencySettings());
    }
  }, [isPrintOptionsOpen, isModalOpen]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.id.includes(searchTerm);
      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + (item.length * item.width * item.quantity * item.pricePerSqm), 0);
  };

  const handleUpdateStatus = (id: string, status: OrderStatus) => {
    storageService.updateOrderStatus(id, status);
    setOrders(storageService.getOrders());
  };

  const handleOpenDelete = (id: string) => {
    setOrderToDelete(id);
    setDeletePin('');
    setPinError(false);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletePin === ADMIN_PIN) {
      if (orderToDelete) {
        storageService.deleteOrder(orderToDelete);
        setOrders(storageService.getOrders());
        setIsDeleteModalOpen(false);
        setOrderToDelete(null);
      }
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 500);
    }
  };

  const handleEdit = (order: Order) => {
    setIsEditMode(true);
    setEditingOrderId(order.id);
    setNewOrderData({
      clientId: order.clientId,
      dueDate: order.dueDate,
      paidAmount: order.paidAmount
    });
    setNewOrderItems([...order.items]);
    setClientMode('EXISTING');
    setIsModalOpen(true);
  };

  const addItemRow = () => {
    setNewOrderItems([...newOrderItems, { description: '', length: 1, width: 1, quantity: 1, pricePerSqm: 0 }]);
  };

  const removeItemRow = (index: number) => {
    if (newOrderItems.length > 1) {
      setNewOrderItems(newOrderItems.filter((_, i) => i !== index));
    }
  };

  const updateItemRow = (index: number, field: keyof OrderItem, value: any) => {
    const updated = [...newOrderItems];
    updated[index] = { ...updated[index], [field]: value };
    setNewOrderItems(updated);
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = productPrices.find(p => p.id === productId);
    if (!product) return;
    const updated = [...newOrderItems];
    updated[index] = {
      ...updated[index],
      description: product.name,
      pricePerSqm: priceMode === 'CLIENT' ? product.clientPrice : product.wholesalePrice
    };
    setNewOrderItems(updated);
  };

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    let finalClientId = newOrderData.clientId;
    let finalClientName = '';
    if (clientMode === 'NEW') {
      const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
      const newClient: Client = {
        id: Math.random().toString(36).substr(2, 9),
        name: newClientData.name,
        phone: newClientData.phone,
        pin: generatedPin,
        createdAt: new Date().toISOString()
      };
      storageService.saveClient(newClient);
      setClients(storageService.getClients());
      finalClientId = newClient.id;
      finalClientName = newClient.name;
    } else {
      const selectedClient = clients.find(c => c.id === finalClientId);
      if (!selectedClient) { alert('يرجى اختيار الزبون'); return; }
      finalClientName = selectedClient.name;
    }
    const total = calculateTotal(newOrderItems);
    const order: Order = {
      id: isEditMode && editingOrderId ? editingOrderId : `JG-${Math.floor(1000 + Math.random() * 9000)}`,
      clientId: finalClientId,
      clientName: finalClientName,
      description: newOrderItems[0].description || 'طلب جديد',
      items: [...newOrderItems],
      totalPrice: total,
      paidAmount: newOrderData.paidAmount,
      remainingAmount: total - newOrderData.paidAmount,
      status: isEditMode && editingOrderId ? (orders.find(o => o.id === editingOrderId)?.status || OrderStatus.NEW) : OrderStatus.NEW,
      createdAt: isEditMode && editingOrderId ? (orders.find(o => o.id === editingOrderId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
      dueDate: newOrderData.dueDate,
    };
    storageService.saveOrder(order);
    setOrders(storageService.getOrders());
    closePOS();
  };

  const closePOS = () => {
    setIsModalOpen(false);
    setIsPOSFullScreen(false);
    setIsEditMode(false);
    setEditingOrderId(null);
    setNewOrderItems([{ description: '', length: 1, width: 1, quantity: 1, pricePerSqm: 0 }]);
    setNewOrderData({ clientId: '', dueDate: new Date().toISOString().split('T')[0], paidAmount: 0 });
    setNewClientData({ name: '', phone: '' });
  };

  const generatePrintHTML = (order: Order) => {
    const currentAgency = storageService.getAgencySettings();
    const itemsHtml = order.items.map(item => `
      <tr>
        <td>${item.description}</td>
        <td>${item.length}×${item.width} م</td>
        <td>${item.quantity}</td>
        <td>${item.pricePerSqm.toLocaleString()}</td>
        <td>${(item.length * item.width * item.quantity * item.pricePerSqm).toLocaleString()}</td>
      </tr>
    `).join('');
    const client = clients.find(c => c.id === order.clientId);
    const clientPin = client?.pin || '****';
    const clientPhone = client?.phone || 'N/A';
    const siteUrl = window.location.origin;
    const qrDataText = `${currentAgency.name}\nInvoice: ${order.id}\nPhone: ${clientPhone}\nPin: ${clientPin}\nLink: ${siteUrl}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrDataText)}`;

    return `
      <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>فاتورة - ${order.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');
            body { font-family: 'Tajawal', sans-serif; padding: 40px; }
            header { display: flex; justify-content: space-between; border-bottom: 4px solid #e2006a; padding-bottom: 20px; margin-bottom: 30px; }
            .logo-img { max-height: 80px; }
            table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            th { background: #1a1a1a; color: white; padding: 12px; text-align: right; }
            td { padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; }
            .totals { width: 300px; margin-right: auto; }
            .totals div { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .grand-total { background: #e2006a; color: white; padding: 15px !important; border-radius: 10px; font-size: 20px; }
            .footer { margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
          </style>
        </head>
        <body>
          <header>
            <div>
              <img src="${currentAgency.logoUrl}" class="logo-img" />
              <h1 style="margin: 10px 0 0 0;">${currentAgency.name}</h1>
              <p>${currentAgency.description}</p>
            </div>
            <div style="text-align: left">
              <h2 style="margin:0; font-weight: 900; font-size: 28px;">فاتورة ضريبية</h2>
              <p>رقم: ${order.id}</p>
            </div>
          </header>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div><h3>معلومات الزبون</h3><p>الاسم: ${order.clientName}</p><p>الهاتف: ${clientPhone}</p></div>
            <div style="text-align: left;"><h3>التواريخ</h3><p>الطلب: ${new Date(order.createdAt).toLocaleDateString('ar-DZ')}</p><p>الاستلام: ${new Date(order.dueDate).toLocaleDateString('ar-DZ')}</p></div>
          </div>
          <table><thead><tr><th>البيان</th><th>المقاس</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr></thead><tbody>${itemsHtml}</tbody></table>
          <div class="totals">
            <div><span>المجموع الفرعي:</span><span>${order.totalPrice.toLocaleString()} د.ج</span></div>
            <div><span>المدفوع:</span><span style="color: green">${order.paidAmount.toLocaleString()} د.ج</span></div>
            <div class="grand-total"><span>المتبقي:</span><span>${order.remainingAmount.toLocaleString()} د.ج</span></div>
          </div>
          <div class="footer">
            <div>
              <p>${currentAgency.address} | هاتف: ${currentAgency.phone}</p>
              <p>البريد: ${currentAgency.email}</p>
              <p style="margin-top: 10px; font-weight: 900; color: #e2006a;">رمز الدخول (PIN): ${clientPin}</p>
            </div>
            ${printSettings.includeQR ? `<div style="text-align: center;"><img src="${qrCodeUrl}" width="100" /><p style="font-size: 10px; font-weight: 900; color: #e2006a; margin: 0;">تتبع طلبك</p></div>` : ''}
          </div>
          <script>window.onload = function() { window.print(); setTimeout(() => window.close(), 500); };</script>
        </body>
      </html>
    `;
  };

  const handleExecutePrint = () => {
    if (!selectedOrderForPrint) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) { alert('يرجى السماح بالنوافذ المنبثقة للطباعة'); return; }
    printWindow.document.write(generatePrintHTML(selectedOrderForPrint));
    printWindow.document.close();
    setIsPrintOptionsOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50">
        <div>
          <h1 className="text-4xl font-black text-black flex items-center gap-3 uppercase tracking-tighter">إدارة الطلبيات</h1>
          <p className="text-gray-400 mt-2 font-bold text-sm tracking-widest uppercase">نظام تتبع {agency.name}</p>
        </div>
        <button onClick={() => { setProductPrices(storageService.getProductPrices()); setIsModalOpen(true); }} className="bg-[#e2006a] hover:bg-black text-white px-10 py-5 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-[#e2006a]/20 transition-all transform active:scale-95 font-black uppercase tracking-widest text-sm">
          <Plus size={22} />
          <span>إضافة طلب جديد</span>
        </button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredOrders.length > 0 ? filteredOrders.map((order) => (
          <div key={order.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 hover:shadow-2xl transition-all duration-500 group relative">
            <div className="flex justify-between items-start mb-8">
              <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${
                order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700' :
                order.status === OrderStatus.READY ? 'bg-blue-100 text-blue-700' :
                order.status === OrderStatus.IN_PRINTING ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
              }`}>{order.status}</span>
              <div className="flex gap-2">
                <button onClick={() => { setSelectedOrderForPrint(order); setIsPrintOptionsOpen(true); }} className="p-3 text-[#e2006a] hover:bg-[#e2006a]/10 rounded-xl transition-all"><Printer size={20} /></button>
                {isAdmin && (
                  <>
                    <button onClick={() => handleEdit(order)} className="p-3 text-black hover:bg-black/10 rounded-xl transition-all"><Edit3 size={20} /></button>
                    <button onClick={() => handleOpenDelete(order.id)} className="p-3 text-gray-300 hover:text-red-600 rounded-xl transition-all"><Trash2 size={20} /></button>
                  </>
                )}
              </div>
            </div>
            <h3 className="text-2xl font-black text-black mb-1 uppercase tracking-tight truncate">{order.description}</h3>
            <p className="text-xs font-black text-[#e2006a] mb-8 uppercase tracking-[0.2em]">{order.clientName}</p>
            <div className="space-y-4 pt-8 border-t border-gray-50">
               <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest"><span className="text-gray-400">رقم الطلب:</span><span className="text-black">#{order.id}</span></div>
               <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest"><span className="text-gray-400">الإجمالي:</span><span className="text-black">{order.totalPrice.toLocaleString()} د.ج</span></div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-green-600"><span>المدفوع:</span><span>{order.paidAmount.toLocaleString()} د.ج</span></div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#e2006a]"><span>الباقي:</span><span>{order.remainingAmount.toLocaleString()} د.ج</span></div>
               </div>
               <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest pt-2"><span className="text-gray-400">تاريخ التسليم:</span><span className="text-black">{new Date(order.dueDate).toLocaleDateString('ar-DZ')}</span></div>
               <div className="mt-8">
                  <select className="w-full text-[10px] font-black border-2 border-[#e2006a]/20 bg-[#e2006a]/5 text-[#e2006a] rounded-xl px-3 py-3 outline-none focus:border-[#e2006a] cursor-pointer appearance-none text-center" value={order.status} onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}>
                    {Object.values(OrderStatus).map(status => (<option key={status} value={status} className="text-black">{status}</option>))}
                  </select>
               </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
             <Package className="text-gray-200 mx-auto mb-6" size={48} />
             <p className="text-gray-400 font-black uppercase tracking-widest text-xs">لا توجد طلبات نشطة</p>
          </div>
        )}
      </div>

      {/* POS Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`bg-white transition-all duration-300 flex flex-col shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 ${isPOSFullScreen ? 'w-full h-full rounded-none' : 'rounded-[3rem] w-full max-w-6xl h-[90vh]'}`}>
            <div className="bg-gray-50 p-8 border-b border-gray-200 flex justify-between items-center shrink-0">
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-[#e2006a] rounded-2xl flex items-center justify-center shadow-xl text-white"><Monitor size={32} /></div>
                 <div>
                    <h2 className="text-3xl font-black text-black tracking-tighter uppercase italic">{isEditMode ? 'تعديل الطلب' : 'نقطة بيع Jaguar'}</h2>
                 </div>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => setIsPOSFullScreen(!isPOSFullScreen)} className="w-12 h-12 bg-white rounded-xl border flex items-center justify-center">{isPOSFullScreen ? <Minimize size={20}/> : <Maximize size={20}/>}</button>
                  <button onClick={closePOS} className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center"><X size={20}/></button>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto p-10">
               <form onSubmit={handleAddOrder} id="pos-form" className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="md:col-span-2 bg-gray-50 p-8 rounded-[2rem] space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">بيانات الزبون</label>
                        <select className="w-full p-5 bg-white border-2 rounded-2xl font-black" required value={newOrderData.clientId} onChange={(e) => setNewOrderData({...newOrderData, clientId: e.target.value})}>
                          <option value="">اختر الزبون...</option>
                          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                     </div>
                     <div className="bg-gray-50 p-8 rounded-[2rem] space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">موعد الاستلام</label>
                        <input type="date" className="w-full p-5 bg-white border-2 rounded-2xl font-black" value={newOrderData.dueDate} onChange={(e) => setNewOrderData({...newOrderData, dueDate: e.target.value})} required />
                     </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center px-4">
                      <h3 className="font-black uppercase tracking-widest">البنود المطبوعة</h3>
                      <button type="button" onClick={addItemRow} className="bg-[#e2006a] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase">+ بند جديد</button>
                    </div>
                    <div className="bg-gray-50 rounded-[2rem] overflow-hidden border">
                       <table className="w-full">
                          <thead className="bg-gray-100 text-right"><tr className="text-[9px] font-black uppercase text-gray-400"><th className="p-6">الوصف</th><th className="p-6">المقاس (م)</th><th className="p-6">الكمية</th><th className="p-6">السعر</th><th className="p-6"></th></tr></thead>
                          <tbody>
                            {newOrderItems.map((item, index) => (
                              <tr key={index} className="border-t">
                                <td className="p-4"><input type="text" className="w-full p-4 rounded-xl border font-black" value={item.description} onChange={(e) => updateItemRow(index, 'description', e.target.value)} required /></td>
                                <td className="p-4 flex gap-2"><input type="number" step="0.01" className="w-20 p-4 rounded-xl border font-black" value={item.length} onChange={(e) => updateItemRow(index, 'length', Number(e.target.value))} /><input type="number" step="0.01" className="w-20 p-4 rounded-xl border font-black" value={item.width} onChange={(e) => updateItemRow(index, 'width', Number(e.target.value))} /></td>
                                <td className="p-4"><input type="number" className="w-20 p-4 rounded-xl border font-black" value={item.quantity} onChange={(e) => updateItemRow(index, 'quantity', Number(e.target.value))} /></td>
                                <td className="p-4"><input type="number" className="w-24 p-4 rounded-xl border font-black" value={item.pricePerSqm} onChange={(e) => updateItemRow(index, 'pricePerSqm', Number(e.target.value))} /></td>
                                <td className="p-4"><button type="button" onClick={() => removeItemRow(index)} className="text-red-500 p-2"><Trash2 size={20}/></button></td>
                              </tr>
                            ))}
                          </tbody>
                       </table>
                    </div>
                  </div>
               </form>
            </div>
            <div className="p-8 bg-gray-50 border-t flex items-center justify-between">
               <div className="flex gap-10">
                  <div className="text-right"><p className="text-[9px] font-black text-gray-400 uppercase">إجمالي الفاتورة</p><p className="text-3xl font-black">{calculateTotal(newOrderItems).toLocaleString()} د.ج</p></div>
                  <div className="text-right"><p className="text-[9px] font-black text-gray-400 uppercase">المدفوع حالياً</p><input type="number" className="bg-white border p-2 rounded-xl font-black w-32" value={newOrderData.paidAmount} onChange={(e) => setNewOrderData({...newOrderData, paidAmount: Number(e.target.value)})} /></div>
               </div>
               <button type="submit" form="pos-form" className="bg-black text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl">تأكيد الطلب</button>
            </div>
          </div>
        </div>
      )}

      {/* Print Options Modal */}
      {isPrintOptionsOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-black p-8 text-white flex justify-between items-center"><h2 className="text-xl font-black uppercase">خيارات الطباعة</h2><button onClick={() => setIsPrintOptionsOpen(false)}><X/></button></div>
            <div className="p-10 space-y-8">
              <label className="flex items-center gap-4 bg-gray-50 p-6 rounded-2xl cursor-pointer">
                <input type="checkbox" className="w-6 h-6" checked={printSettings.includeQR} onChange={(e) => setPrintSettings({...printSettings, includeQR: e.target.checked})} />
                <span className="font-black uppercase tracking-widest">إدراج رمز تتبع QR</span>
              </label>
              <button onClick={handleExecutePrint} className="w-full bg-[#e2006a] text-white py-6 rounded-2xl font-black uppercase tracking-widest shadow-xl">فتح الفاتورة للطباعة</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] w-full max-w-md p-10 text-center space-y-8">
            <AlertTriangle className="mx-auto text-red-500" size={48} />
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">تأكيد عملية الحذف</h2>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">أدخل الرمز السري للمدير</label>
              <input type="password" maxLength={4} className="w-full bg-gray-50 border-2 rounded-2xl p-5 text-center font-black tracking-[1em] text-2xl" value={deletePin} onChange={(e) => setDeletePin(e.target.value)} autoFocus />
            </div>
            {pinError && <p className="text-red-500 font-black text-[10px] uppercase">الرمز السري غير صحيح</p>}
            <div className="flex flex-col gap-4">
               <button onClick={confirmDelete} className="w-full bg-[#e2006a] text-white py-6 rounded-2xl font-black">حذف نهائي</button>
               <button onClick={() => setIsDeleteModalOpen(false)} className="w-full bg-gray-100 text-gray-500 py-6 rounded-2xl font-black">تراجع</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
