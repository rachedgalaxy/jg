
import React, { useState, useMemo } from 'react';
import { 
  Tags, 
  Plus, 
  Trash2, 
  Edit, 
  X,
  PlusCircle,
  DollarSign,
  Package,
  Search,
  Zap
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { ProductPrice } from '../../types';

const PriceManagement: React.FC = () => {
  const [products, setProducts] = useState<ProductPrice[]>(storageService.getProductPrices());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentProduct, setCurrentProduct] = useState<Partial<ProductPrice>>({});

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, searchTerm]);

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج من قائمة الأسعار؟')) {
      storageService.deleteProductPrice(id);
      setProducts(storageService.getProductPrices());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product: ProductPrice = {
      id: currentProduct.id || Math.random().toString(36).substr(2, 9),
      name: currentProduct.name || '',
      clientPrice: Number(currentProduct.clientPrice) || 0,
      wholesalePrice: Number(currentProduct.wholesalePrice) || 0,
    };
    storageService.saveProductPrice(product);
    setProducts(storageService.getProductPrices());
    setIsModalOpen(false);
    setCurrentProduct({});
  };

  const openModal = (product: Partial<ProductPrice> = {}) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50">
        <div>
          <h1 className="text-4xl font-black text-black uppercase tracking-tighter">إدارة الأسعار</h1>
          <p className="text-gray-400 mt-2 font-bold text-sm tracking-widest uppercase">تحديد أسعار المنتجات (المتر²)</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-[#e2006a] hover:bg-black text-white px-10 py-5 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-[#e2006a]/20 transition-all transform active:scale-95 font-black uppercase tracking-widest text-sm"
        >
          <Plus size={22} />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
        <div className="relative w-full">
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={24} />
          <input 
            type="text" 
            placeholder="بحث عن منتج..."
            className="w-full pr-16 pl-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-[#e2006a]/5 focus:border-[#e2006a] outline-none transition-all font-bold text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#e2006a] border border-gray-100 group-hover:bg-[#e2006a] group-hover:text-white transition-colors">
                <Tags size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(product)} className="p-2 text-black hover:bg-black/5 rounded-lg transition-all"><Edit size={18} /></button>
                <button onClick={() => handleDelete(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-black uppercase tracking-tight mb-8 truncate">{product.name}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">سعر الزبون</p>
                <p className="text-xl font-black text-black italic">{product.clientPrice.toLocaleString()} <small className="text-[10px] uppercase font-bold text-[#e2006a]">د.ج</small></p>
              </div>
              <div className="bg-[#e2006a]/5 p-4 rounded-2xl border border-[#e2006a]/10 text-center">
                <p className="text-[9px] font-black text-[#e2006a] uppercase tracking-widest mb-1">سعر الجملة</p>
                <p className="text-xl font-black text-black italic">{product.wholesalePrice.toLocaleString()} <small className="text-[10px] uppercase font-bold text-[#e2006a]">د.ج</small></p>
              </div>
            </div>
          </div>
        ))}
        
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Tags className="text-gray-200" size={48} />
             </div>
             <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">لا توجد منتجات مسجلة حالياً</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-black p-8 text-white flex justify-between items-center">
              <h2 className="text-xl font-black flex items-center gap-3 uppercase italic tracking-tighter">
                {currentProduct.id ? 'تعديل سعر المنتج' : 'إضافة منتج جديد'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-3 rounded-2xl transition-all">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-2 text-right">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mr-2">اسم المادة / المنتج</label>
                <div className="relative">
                   <Package className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                   <input 
                    type="text" 
                    className="w-full pr-14 pl-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-[#e2006a] font-black uppercase tracking-wide text-sm"
                    required
                    placeholder="مثال: Autocollant, Flex..."
                    value={currentProduct.name || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 text-right">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mr-2">سعر الزبون (د.ج)</label>
                  <div className="relative">
                     <DollarSign className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                     <input 
                      type="number" 
                      className="w-full pr-12 pl-4 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-[#e2006a] font-black text-sm text-left"
                      required
                      placeholder="0"
                      value={currentProduct.clientPrice || ''}
                      onChange={(e) => setCurrentProduct({...currentProduct, clientPrice: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <label className="text-[10px] font-black text-[#e2006a] uppercase tracking-widest block mr-2">سعر الجملة (د.ج)</label>
                  <div className="relative">
                     {/* Added Zap icon here, fixed missing import error */}
                     <Zap className="absolute right-5 top-1/2 -translate-y-1/2 text-[#e2006a]/40" size={18} />
                     <input 
                      type="number" 
                      className="w-full pr-12 pl-4 py-5 bg-[#e2006a]/5 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-[#e2006a] font-black text-sm text-left text-[#e2006a]"
                      required
                      placeholder="0"
                      value={currentProduct.wholesalePrice || ''}
                      onChange={(e) => setCurrentProduct({...currentProduct, wholesalePrice: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-6">
                <button type="submit" className="w-full bg-[#e2006a] hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl shadow-[#e2006a]/20 transition-all uppercase tracking-[0.3em] text-sm">حفظ المنتج</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-black py-5 rounded-2xl transition-all uppercase tracking-[0.3em] text-sm">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceManagement;
