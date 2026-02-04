
import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onLogout?: () => void;
  activeModule: string;
  setActiveModule: (module: string) => void;
  user?: { name: string; email: string };
}

const Layout: React.FC<LayoutProps> = ({ children, title, onLogout, activeModule, setActiveModule, user }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const menuItems = [
    { id: 'home', label: 'INICIO' },
    { id: 'cema576', label: 'CEMA 576' },
    { id: 'transportadores', label: 'TRANSPORTADORES' },
    { id: 'impact', label: 'IMPACTO' },
    { id: 'calc1', label: 'CALCULADORA' },
    { id: 'configuracion', label: 'CONFIGURACIÓN' },
  ];

  return (
    <div className="flex min-h-screen relative">
      {/* Mobile Toggle */}
      <button 
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-[110] bg-white border border-gray-200 p-2 rounded-lg shadow-sm font-bold text-xs"
      >
        {isSidebarOpen ? 'CERRAR' : 'MENÚ'}
      </button>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[90]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 sidebar flex flex-col fixed h-full z-[100] ${isSidebarOpen ? 'open' : ''}`}>
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="p-8 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#5e72e4] rounded flex items-center justify-center font-extrabold text-white text-sm">
                  C
                </div>
                <span className="text-[#32325d] font-extrabold text-sm tracking-tight uppercase">Asistente CEMA</span>
              </div>
            </div>

            <nav className="lg:max-h-[calc(100vh-200px)] overflow-y-auto">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-8 py-4 transition-all text-[11px] font-extrabold tracking-widest ${
                    activeModule === item.id 
                    ? 'active-menu-item' 
                    : 'text-slate-400 hover:text-slate-600 border-r-4 border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {user && (
            <div className="p-8 border-t border-gray-100 flex-shrink-0">
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black mb-1">Usuario Activo</p>
              <p className="text-[#32325d] text-xs font-bold truncate">{user.name}</p>
              <button 
                onClick={onLogout}
                className="mt-4 text-[9px] font-black text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest"
              >
                SALIR DEL SISTEMA
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 main-content flex flex-col min-h-screen w-full">
        <header className="px-4 lg:px-8 py-6 border-b border-gray-100 bg-white">
          <div className="max-w-[1920px] mx-auto flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Dashboard / {menuItems.find(m => m.id === activeModule)?.label}
              </p>
              <h1 className="text-xl font-extrabold text-[#32325d] uppercase tracking-tighter">
                {title || menuItems.find(m => m.id === activeModule)?.label}
              </h1>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8 max-w-[1920px] w-full mx-auto">
          {children}
        </div>

        <footer className="p-8 border-t border-gray-50 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            &copy; CEMA Standard Assistant • Ingeniería Aplicada
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Layout;
