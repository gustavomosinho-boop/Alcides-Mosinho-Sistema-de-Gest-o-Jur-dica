import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';
import { 
  LayoutDashboard, 
  Newspaper, 
  Scale, 
  DollarSign, 
  Users, 
  FolderOpen, 
  Calendar, 
  LogOut, 
  Menu, 
  X,
  FileText,
  Briefcase,
  User as UserIcon,
  UserCheck,
  Camera,
  Handshake,
  UserCog,
  Calculator,
  ShoppingBag,
  Building,
  Shield,
  MessageSquare,
  Mic
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  onUpdateAvatar: (file: File) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, currentPage, onNavigate, onUpdateAvatar }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Define menu items based on roles
  const getMenuItems = () => {
    const items = [];

    // Common Dashboard
    items.push({ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: Object.values(UserRole) });

    // Client Portal Specific
    if (user.role === UserRole.CLIENT) {
      items.push({ id: 'my-holding', label: 'My Holding', icon: Building, roles: [UserRole.CLIENT] }); // NEW
      items.push({ id: 'my-documents', label: 'Meus Documentos', icon: FolderOpen, roles: [UserRole.CLIENT] });
      items.push({ id: 'send-documents', label: 'Enviar Documentos', icon: FileText, roles: [UserRole.CLIENT] });
      items.push({ id: 'client-finance', label: 'Financeiro', icon: DollarSign, roles: [UserRole.CLIENT] });
      items.push({ id: 'client-accounting', label: 'Contabilidade', icon: Calculator, roles: [UserRole.CLIENT] });
      items.push({ id: 'client-agenda', label: 'Agenda & Reuniões', icon: Calendar, roles: [UserRole.CLIENT] });
      
      // Store & Services for Client
      items.push({ id: 'store', label: 'Produtos A&M', icon: ShoppingBag, roles: [UserRole.CLIENT] });
      items.push({ id: 'services', label: 'Serviços', icon: Briefcase, roles: [UserRole.CLIENT] });
      items.push({ id: 'chat', label: 'Chat VIP', icon: MessageSquare, roles: [UserRole.CLIENT] });
      return items;
    }

    // External Partner Specific
    if (user.role === UserRole.EXTERNAL_PARTNER) {
      items.push({ id: 'clients', label: 'Meus Clientes', icon: UserCheck, roles: [UserRole.EXTERNAL_PARTNER] });
      items.push({ id: 'processes', label: 'Processos Vinculados', icon: Briefcase, roles: [UserRole.EXTERNAL_PARTNER] });
      items.push({ id: 'partner-agenda', label: 'Agenda & Reuniões', icon: Calendar, roles: [UserRole.EXTERNAL_PARTNER] });
      items.push({ id: 'partner-contract', label: 'Nosso Contrato', icon: Handshake, roles: [UserRole.EXTERNAL_PARTNER] });
      items.push({ id: 'store', label: 'Produtos A&M', icon: ShoppingBag, roles: [UserRole.EXTERNAL_PARTNER] });
      return items;
    }

    // Hearing Lawyer Specific (Audiencista) - NEW
    if (user.role === UserRole.HEARING_LAWYER) {
      items.push({ id: 'hearing-panel', label: 'Painel Audiencista', icon: Mic, roles: [UserRole.HEARING_LAWYER] });
      items.push({ id: 'my-profile', label: 'Área do Prestador', icon: UserIcon, roles: [UserRole.HEARING_LAWYER] });
      items.push({ id: 'chat', label: 'Chat', icon: MessageSquare, roles: [UserRole.HEARING_LAWYER] });
      return items;
    }

    // Accounting Specific
    if (user.role === UserRole.ACCOUNTING) {
      items.push({ id: 'internal-news', label: 'Mural Interno', icon: Newspaper, roles: [UserRole.ACCOUNTING] });
      items.push({ id: 'accounting-clients', label: 'Clientes Contábeis', icon: Users, roles: [UserRole.ACCOUNTING] });
      items.push({ id: 'accounting-docs', label: 'Gestão de Documentos', icon: FolderOpen, roles: [UserRole.ACCOUNTING] });
      items.push({ id: 'accounting-taxes', label: 'Emissão de Guias', icon: FileText, roles: [UserRole.ACCOUNTING] });
      items.push({ id: 'accounting-reports', label: 'Relatórios Contábeis', icon: Calculator, roles: [UserRole.ACCOUNTING] });
      items.push({ id: 'chat', label: 'Chat', icon: MessageSquare, roles: [UserRole.ACCOUNTING] });
      return items;
    }

    // Internal Staff Menus (Partners, Lawyers, etc.)
    items.push({ id: 'internal-news', label: 'Mural Interno', icon: Newspaper, roles: [UserRole.PARTNER, UserRole.LAWYER, UserRole.ADMIN, UserRole.FINANCE, UserRole.SECRETARY, UserRole.ANALYST] });
    items.push({ id: 'legal-news', label: 'Notícias Jurídicas', icon: Scale, roles: [UserRole.PARTNER, UserRole.LAWYER, UserRole.ADMIN, UserRole.SECRETARY] });
    items.push({ id: 'clients', label: 'Clientes', icon: UserCheck, roles: [UserRole.PARTNER, UserRole.LAWYER, UserRole.ADMIN, UserRole.SECRETARY] });
    items.push({ id: 'processes', label: 'Processos Judiciais', icon: Briefcase, roles: [UserRole.PARTNER, UserRole.LAWYER, UserRole.ADMIN, UserRole.SECRETARY, UserRole.FINANCE] });
    items.push({ id: 'meetings', label: 'Agenda & Reuniões', icon: Calendar, roles: [UserRole.PARTNER, UserRole.LAWYER, UserRole.ADMIN, UserRole.SECRETARY, UserRole.FINANCE] });
    items.push({ id: 'documents', label: 'Gestão Documentos', icon: FolderOpen, roles: [UserRole.PARTNER, UserRole.LAWYER, UserRole.ADMIN, UserRole.FINANCE] });
    
    // Restricted Modules
    if ([UserRole.PARTNER, UserRole.FINANCE].includes(user.role)) {
      items.push({ id: 'finance', label: 'Financeiro', icon: DollarSign, roles: [UserRole.PARTNER, UserRole.FINANCE] });
    }

    if (user.role === UserRole.PARTNER) {
      items.push({ id: 'partners-management', label: 'Meus Parceiros', icon: UserCog, roles: [UserRole.PARTNER] });
      items.push({ id: 'store-admin', label: 'Gestão Loja', icon: ShoppingBag, roles: [UserRole.PARTNER] });
    }

    if ([UserRole.PARTNER, UserRole.ADMIN, UserRole.FINANCE].includes(user.role)) {
      items.push({ id: 'people', label: 'Cadastro Pessoas', icon: Users, roles: [UserRole.PARTNER, UserRole.ADMIN, UserRole.FINANCE] });
    }

    if ([UserRole.PARTNER, UserRole.LAWYER, UserRole.FINANCE].includes(user.role)) {
       items.push({ id: 'hearings-manage', label: 'Audiencistas', icon: Mic, roles: [UserRole.PARTNER, UserRole.LAWYER] });
    }
    
    // Common for internal
    items.push({ id: 'chat', label: 'Chat', icon: MessageSquare, roles: [UserRole.PARTNER, UserRole.LAWYER, UserRole.ADMIN, UserRole.FINANCE, UserRole.SECRETARY] });
    items.push({ id: 'my-profile', label: 'Área do Prestador', icon: UserIcon, roles: [UserRole.PARTNER, UserRole.LAWYER, UserRole.ADMIN, UserRole.FINANCE, UserRole.SECRETARY, UserRole.ANALYST, UserRole.ACCOUNTING] });

    return items;
  };

  const menuItems = getMenuItems();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpdateAvatar(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-navy-900 text-white p-4 flex justify-between items-center shadow-md">
        <span className="text-xl font-serif text-gold-500 font-bold">A&M</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isMobileMenuOpen ? 'block' : 'hidden'} 
        md:block 
        w-full md:w-64 
        bg-navy-900 
        text-gray-300 
        flex-shrink-0 
        transition-all duration-300
        min-h-screen
      `}>
        <div className="p-6 text-center border-b border-navy-800 hidden md:block">
           <h1 className="text-3xl font-serif text-gold-500 font-bold tracking-wider">A&M</h1>
           <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Alcides & Mosinho</p>
        </div>

        <div className="p-4">
          <div className="mb-6 flex items-center gap-3 px-2">
            <div 
              className="relative w-12 h-12 rounded-full border border-gold-600 flex-shrink-0 cursor-pointer group overflow-hidden"
              onClick={triggerFileInput}
              title="Alterar foto de perfil"
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-navy-800 flex items-center justify-center text-gold-500 font-bold text-lg">
                  {user.name.charAt(0)}
                </div>
              )}
              
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>

              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/png, image/jpeg, image/jpg" 
                onChange={handleFileChange}
              />
            </div>

            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-gold-500 truncate">{user.role}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors
                  ${currentPage === item.id 
                    ? 'bg-navy-800 text-gold-500 border-l-4 border-gold-500' 
                    : 'hover:bg-navy-800 hover:text-white'}
                `}
              >
                {/* @ts-ignore - Generic Icon Component Issue */}
                <item.icon className={`mr-3 h-5 w-5 ${currentPage === item.id ? 'text-gold-500' : 'text-gray-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-navy-800 mt-auto">
          <button 
            onClick={onLogout}
            className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-navy-800 hover:text-red-300 rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen bg-gray-50">
        <header className="bg-white shadow-sm p-6 mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-navy-900">
            {menuItems.find(i => i.id === currentPage)?.label || 'Painel'}
          </h2>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>
        <div className="px-6 pb-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;