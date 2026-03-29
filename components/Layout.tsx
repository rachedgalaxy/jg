
import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  LogOut, 
  Menu, 
  X,
  ChevronLeft,
  ShieldCheck,
  UserCheck,
  Tags,
  Settings
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'ADMIN';
  const isWorker = user?.role === 'WORKER';

  let menuItems: any[] = [];
  
  if (isAdmin) {
    menuItems = [
      { name: 'لوحة التحكم', icon: <LayoutDashboard size={18} />, path: '/admin' },
      { name: 'إدارة الطلبات', icon: <ClipboardList size={18} />, path: '/admin/orders' },
      { name: 'قائمة الزبائن', icon: <Users size={18} />, path: '/admin/clients' },
      { name: 'طاقم العمل', icon: <UserCheck size={18} />, path: '/admin/workers' },
      { name: 'إدارة الأسعار', icon: <Tags size={18} />, path: '/admin/prices' },
      { name: 'إعدادات الوكالة', icon: <Settings size={18} />, path: '/admin/settings' },
      { name: 'أمان الحساب', icon: <ShieldCheck size={18} />, path: '/account-security' },
    ];
  } else if (isWorker) {
    menuItems = [
      { name: 'إدارة الطلبات', icon: <ClipboardList size={18} />, path: '/admin/orders' },
    ];
  } else {
    menuItems = [
      { name: 'طلباتي', icon: <ClipboardList size={18} />, path: '/client' },
      { name: 'أمان الحساب', icon: <ShieldCheck size={18} />, path: '/account-security' },
    ];
  }

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fcfcfc] overflow-hidden font-medium">
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-100 text-black p-4 flex justify-between items-center shadow-md border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img src="https://i.ibb.co/60Md0hTy/jg.png" alt="JG" className="h-8" />
          <span className="font-black text-sm uppercase tracking-widest text-black">Jaguar Graphic</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-[#e2006a] text-white rounded-xl shadow-lg shadow-[#e2006a]/20">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-72 bg-gray-100 text-gray-800 transform transition-transform duration-500 ease-in-out border-l border-gray-200
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <div className="p-10 border-b border-gray-200 hidden md:flex flex-col items-center">
          <img src="https://i.ibb.co/60Md0hTy/jg.png" alt="Jaguar Graphic Logo" className="h-20 mb-4 drop-shadow-lg" />
          <p className="text-[10px] font-black text-[#e2006a] tracking-[0.4em] uppercase text-center">Jaguar Graphic</p>
        </div>

        <nav className="mt-8 px-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group
                  ${location.pathname === item.path 
                    ? 'bg-[#e2006a] text-white shadow-xl shadow-[#e2006a]/20 font-black' 
                    : 'text-gray-600 hover:bg-gray-200 hover:text-black'}
                `}
              >
                <div className="flex items-center gap-4">
                    <span className={`${location.pathname === item.path ? 'text-white' : 'text-[#e2006a]'}`}>
                        {item.icon}
                    </span>
                    <span className="text-sm tracking-wide uppercase">{item.name}</span>
                </div>
                {location.pathname === item.path && <ChevronLeft size={16} />}
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-6">
          <div className="bg-white rounded-[2rem] p-5 mb-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-black text-lg shadow-inner border border-gray-200">
                {user?.name?.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black truncate text-gray-900">{user?.name}</p>
                <p className="text-[9px] font-bold text-[#e2006a] uppercase tracking-widest">
                  {isAdmin ? 'Admin' : isWorker ? 'Staff' : 'Client'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-5 py-4 bg-transparent hover:bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 transition-all font-black text-xs uppercase tracking-widest"
          >
            <LogOut size={16} />
            <span>خروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-10 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2006a; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Layout;
