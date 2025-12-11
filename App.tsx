import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { 
  FinanceModule, 
  LegalNewsModule, 
  ProcessesModule, 
  ClientDashboard,
  ClientsModule,
  ClientFinanceModule,
  ClientAgendaModule,
  PartnerContractModule,
  PartnerDashboard,
  PartnerManagementModule,
  AccountingModule,
  ClientAccountingModule,
  InternalNewsFeed,
  DocumentsModule,
  PeopleModule,
  ProviderArea,
  MyHoldingModule,
  StoreModule,
  ServicesModule,
  ChatModule,
  HearingLawyerModule,
  InternalHearingManagement
} from './components/Modules';
import { MOCK_USERS, MOCK_INTERNAL_NEWS, MOCK_MEETINGS, MOCK_CLIENT_INVOICES, MOCK_FINANCE, MOCK_TAX_GUIDES, MOCK_IRPF_REQUESTS, MOCK_CLIENTS, MOCK_CLIENT_DOCS, MOCK_PARTNER_CONTRACTS, MOCK_PROCESSES, MOCK_DEADLINES } from './services/mockService';
import { User, UserRole, NewsItem, Meeting, ClientInvoice, FinancialRecord, MeetingRequest, TaxGuide, IrpfRequest, Client, ClientDocument, Process, ProcessDeadline } from './types';
import { 
  Calendar, CheckCircle, Video, Upload, File, FileText, Lock, UserCheck, Filter, Plus, X, Play, Link, Image as ImageIcon, Clock
} from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  
  // --- LIFTED STATE FOR PERSISTENCE DURING SESSION ---
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [internalNews, setInternalNews] = useState<NewsItem[]>(MOCK_INTERNAL_NEWS);
  const [documents, setDocuments] = useState<ClientDocument[]>(MOCK_CLIENT_DOCS);
  const [internalFinance, setInternalFinance] = useState<FinancialRecord[]>(MOCK_FINANCE);
  const [meetings, setMeetings] = useState<Meeting[]>(MOCK_MEETINGS);
  const [processes, setProcesses] = useState<Process[]>(MOCK_PROCESSES);
  const [deadlines, setDeadlines] = useState<ProcessDeadline[]>(MOCK_DEADLINES);

  // Other State
  const [clientInvoices, setClientInvoices] = useState<ClientInvoice[]>(MOCK_CLIENT_INVOICES);
  const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>([]);
  const [taxGuides, setTaxGuides] = useState<TaxGuide[]>(MOCK_TAX_GUIDES);
  const [irpfRequests, setIrpfRequests] = useState<IrpfRequest[]>(MOCK_IRPF_REQUESTS);

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setLoginError('');
      // Default redirections
      if (user.role === UserRole.HEARING_LAWYER) {
         setCurrentPage('hearing-panel');
      } else {
         setCurrentPage('dashboard');
      }
    } else {
      setLoginError('Credenciais inválidas. Tente um dos emails de teste.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setCurrentPage('dashboard');
  };

  const handleAvatarUpdate = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setCurrentUser(prev => prev ? ({ ...prev, avatar: reader.result as string }) : null);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- HANDLERS FOR NEW FEATURES ---

  const handleAddClient = (client: Client) => {
    setClients(prev => [...prev, client]);
  };

  const handleDeleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const handleAddUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const handleAddNews = (news: NewsItem) => {
    setInternalNews(prev => [news, ...prev]);
  };

  const handleMarkNewsRead = (newsId: string) => {
    if (!currentUser) return;
    setInternalNews(prev => prev.map(n => {
      if (n.id === newsId) {
        return { 
          ...n, 
          readBy: [...n.readBy, { userId: currentUser.id, name: currentUser.name, date: new Date().toISOString() }] 
        };
      }
      return n;
    }));
  };

  const handleAddFinancialRecord = (record: FinancialRecord) => {
    setInternalFinance(prev => [record, ...prev]);
  };

  const handleDeleteFinancialRecord = (id: string) => {
    setInternalFinance(prev => prev.filter(f => f.id !== id));
  };

  const handleAddDocument = (doc: ClientDocument) => {
    setDocuments(prev => [doc, ...prev]);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const handleRequestMeeting = (req: Omit<MeetingRequest, 'id' | 'status'>) => {
    const newRequest: MeetingRequest = { ...req, id: `req-${Date.now()}`, status: 'PENDING' };
    setMeetingRequests([newRequest, ...meetingRequests]);
    alert("Solicitação enviada!");
  };

  const handlePayInvoice = (id: string) => {
    setClientInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'PAID' } : inv));
    alert("Simulação: Pagamento Aprovado!");
  };

  const handlePayTaxGuide = (id: string) => {
    setTaxGuides(prev => prev.map(g => g.id === id ? { ...g, status: 'PAGO' } : g));
    alert('Simulação: Guia paga com sucesso!');
  };

  const handleRequestIrpf = () => {
    alert('Solicitação IRPF enviada!');
  };
  
  const handleAddDeadline = (deadline: ProcessDeadline) => {
     setDeadlines(prev => [...prev, deadline]);
  };

  // --- SUB-PAGES COMPONENTS ---

  const InternalDashboard = () => (
    <div className="space-y-6">
      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-gold-500">
          <p className="text-xs text-gray-500 uppercase">Processos Ativos</p>
          <p className="text-2xl font-bold text-navy-900">142</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-navy-500">
          <p className="text-xs text-gray-500 uppercase">Prazos Hoje</p>
          <p className="text-2xl font-bold text-red-500">3</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
          <p className="text-xs text-gray-500 uppercase">Reuniões</p>
          <p className="text-2xl font-bold text-navy-900">5</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
          <p className="text-xs text-gray-500 uppercase">Docs Pendentes</p>
          <p className="text-2xl font-bold text-navy-900">12</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col - News */}
        <div className="lg:col-span-2">
           <h3 className="font-serif font-bold text-navy-900 mb-4">Mural Interno</h3>
           {/* Reuse Component but limit items */}
           <InternalNewsFeed 
             user={currentUser!} 
             news={internalNews.slice(0,3)} 
             onMarkAsRead={handleMarkNewsRead} 
             onAddNews={handleAddNews} 
           />
           <button onClick={() => setCurrentPage('internal-news')} className="text-sm text-gold-600 font-semibold w-full text-center mt-2 hover:underline">
             Ver Mural Completo
           </button>
        </div>

        {/* Right Col - Shortcuts */}
        <div className="space-y-4">
          <div className="bg-navy-900 text-white p-4 rounded-lg shadow">
            <h4 className="font-serif font-bold text-gold-500 mb-2">Acesso Rápido</h4>
            <div className="space-y-2">
              <button onClick={() => setCurrentPage('clients')} className="w-full text-left p-2 hover:bg-navy-800 rounded text-sm flex items-center gap-2 transition">
                 <UserCheck size={16} /> Consultar Clientes
              </button>
              <button onClick={() => setCurrentPage('processes')} className="w-full text-left p-2 hover:bg-navy-800 rounded text-sm flex items-center gap-2 transition">
                 <FileText size={16} /> Consultar Processo
              </button>
              <button onClick={() => setCurrentPage('meetings')} className="w-full text-left p-2 hover:bg-navy-800 rounded text-sm flex items-center gap-2 transition">
                 <Calendar size={16} /> Minha Agenda
              </button>
              <button onClick={() => window.open('https://drive.google.com/drive/folders/1PgXyXUN12zakG8P5Md7sE8Oz70a4dici?usp=drive_link', '_blank')} className="w-full text-left p-2 hover:bg-navy-800 rounded text-sm flex items-center gap-2 transition">
                 <Upload size={16} /> Acessar Google Drive
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SendDocumentsPage = () => (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
      <h3 className="text-xl font-serif font-bold text-navy-900 mb-6 flex items-center gap-2">
        <Upload className="w-6 h-6 text-gold-500" /> Enviar Documentos
      </h3>
      <p className="text-gray-600 mb-6 text-sm">
        Envie cópias digitalizadas de seus documentos (RG, CPF, Comprovante de Residência, etc). 
        Formatos aceitos: PDF, JPG, PNG.
      </p>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:bg-gray-50 transition cursor-pointer">
        <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
          <Upload className="w-6 h-6" />
        </div>
        <p className="font-medium text-gray-900">Clique para selecionar ou arraste o arquivo aqui</p>
        <p className="text-xs text-gray-500 mt-1">Máximo 10MB por arquivo</p>
      </div>
    </div>
  );

  // --- RENDER CONTENT BASED ON PAGE ---
  const renderContent = () => {
    if (!currentUser) return null;

    switch (currentPage) {
      case 'dashboard':
        if (currentUser.role === UserRole.CLIENT) return <ClientDashboard user={currentUser} />;
        if (currentUser.role === UserRole.EXTERNAL_PARTNER) return <PartnerDashboard user={currentUser} onNavigate={setCurrentPage} />;
        if (currentUser.role === UserRole.ACCOUNTING) return <AccountingModule user={currentUser} />;
        if (currentUser.role === UserRole.HEARING_LAWYER) return <HearingLawyerModule user={currentUser} />;
        return <InternalDashboard />;
      
      // Modules
      case 'internal-news':
        return <InternalNewsFeed user={currentUser} news={internalNews} onMarkAsRead={handleMarkNewsRead} onAddNews={handleAddNews} />;
      case 'legal-news':
        return <LegalNewsModule />;
      case 'clients':
        return <ClientsModule user={currentUser} clients={clients} partners={users.filter(u => u.role === UserRole.EXTERNAL_PARTNER)} onAddClient={handleAddClient} onDeleteClient={handleDeleteClient} />;
      case 'processes':
        return <ProcessesModule user={currentUser} processes={processes} deadlines={deadlines} users={users} onAddDeadline={handleAddDeadline} onAddFinancialRecord={handleAddFinancialRecord} />;
      case 'finance':
        return <FinanceModule user={currentUser} financialRecords={internalFinance} onAddRecord={handleAddFinancialRecord} onDeleteRecord={handleDeleteFinancialRecord} />;
      case 'meetings':
        return <ClientAgendaModule user={currentUser} meetings={meetings} requests={meetingRequests} onRequestMeeting={handleRequestMeeting} />;
      case 'documents':
        return <DocumentsModule user={currentUser} documents={documents} onAddDocument={handleAddDocument} onDeleteDocument={handleDeleteDocument} />;
      
      // Client/Partner Specific
      case 'send-documents':
        return <SendDocumentsPage />;
      case 'client-finance':
        return <ClientFinanceModule invoices={clientInvoices} onPay={handlePayInvoice} />;
      case 'client-agenda':
        return <ClientAgendaModule user={currentUser} meetings={meetings.filter(m => m.participants.includes(currentUser.name))} requests={meetingRequests} onRequestMeeting={handleRequestMeeting} />;
      case 'client-accounting':
        return <ClientAccountingModule user={currentUser} guides={taxGuides} irpfRequests={irpfRequests} onPayGuide={handlePayTaxGuide} onRequestIrpf={handleRequestIrpf} />;
      case 'my-documents':
        return <ClientDashboard user={currentUser} />;
      
      // Partner Specific
      case 'partners-management':
        return <PartnerManagementModule partners={users} contracts={MOCK_PARTNER_CONTRACTS} onAddPartner={handleAddUser} />;
      case 'partner-agenda':
        return <ClientAgendaModule user={currentUser} meetings={meetings.filter(m => m.participants.includes(currentUser.name))} requests={meetingRequests} onRequestMeeting={handleRequestMeeting} />;
      case 'partner-contract':
        return <PartnerContractModule user={currentUser} />;

      // New Modules
      case 'my-holding':
         return <MyHoldingModule />;
      case 'store':
      case 'store-admin':
         return <StoreModule />;
      case 'services':
         return <ServicesModule />;
      case 'chat':
         return <ChatModule />;
      case 'hearing-panel':
         return <HearingLawyerModule user={currentUser} />;
      case 'hearings-manage':
         return <InternalHearingManagement />;

      case 'people':
        return <PeopleModule user={currentUser} users={users} onAddUser={handleAddUser} />;
      case 'my-profile':
        return <ProviderArea />;

      default:
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-serif text-gray-400">Em desenvolvimento...</h2>
            <p className="text-gray-500 mt-2">O módulo "{currentPage}" será implementado em breve.</p>
          </div>
        );
    }
  };

  // --- LOGIN PAGE RENDER ---
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden flex flex-col">
           <div className="bg-navy-900 p-8 flex flex-col items-center justify-center border-b border-navy-800 min-h-[200px]">
             {/* Logo Image - Expects 'logo.png' in public folder */}
             <img 
                src="/logo.png" 
                alt="Alcides & Mosinho" 
                className="w-48 h-auto object-contain mb-2"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  document.getElementById('fallback-logo')!.style.display = 'block';
                }}
             />
             {/* Fallback */}
             <div id="fallback-logo" style={{ display: 'none' }} className="text-center animate-fade-in">
                <span className="text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-gold-400 to-gold-600 font-bold">AM</span>
             </div>

             <h2 className="text-gold-500 text-lg uppercase tracking-widest font-serif mt-2 border-t border-gold-600/30 pt-2">Alcides & Mosinho</h2>
             <p className="text-gold-600/60 text-[10px] uppercase tracking-[0.3em] mt-1 font-sans">Escritório de Advocacia</p>
           </div>
           
           <div className="p-8">
             <form onSubmit={handleLogin} className="space-y-6">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                 <input 
                    type="email" 
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-900 focus:border-transparent outline-none"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                 <input 
                    type="password" 
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-900 focus:border-transparent outline-none"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                 />
               </div>

               {loginError && (
                 <div className="text-red-500 text-sm bg-red-50 p-3 rounded text-center">
                   {loginError}
                 </div>
               )}

               <button 
                type="submit"
                className="w-full bg-navy-900 text-gold-500 font-bold py-3 rounded-md hover:bg-navy-800 transition-colors shadow-lg"
               >
                 ACESSAR SISTEMA
               </button>
             </form>

             <div className="mt-8 text-center border-t pt-6">
               <p className="text-xs text-gray-400 mb-3">Acesso rápido para demonstração:</p>
               <div className="flex flex-wrap justify-center gap-2">
                 <button onClick={() => { setEmail('gustavomosinho@alcidesemosinho.com'); setPassword('123'); }} className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">Sócio</button>
                 <button onClick={() => { setEmail('financeiro@alcidesemosinho.com'); setPassword('123'); }} className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">Financeiro</button>
                 <button onClick={() => { setEmail('biancaporto@alcidesemosinho.com'); setPassword('123'); }} className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">Colaborador</button>
                 <button onClick={() => { setEmail('cliente@gmail.com'); setPassword('123'); }} className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">Cliente</button>
                 <button onClick={() => { setEmail('parceiro@externo.com'); setPassword('123'); }} className="text-xs bg-gold-100 hover:bg-gold-200 text-gold-800 px-2 py-1 rounded border border-gold-300">Parceiro</button>
                 <button onClick={() => { setEmail('contabil@alcidesemosinho.com'); setPassword('123'); }} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded border border-blue-300">Contábil</button>
                 <button onClick={() => { setEmail('audiencia@adv.com'); setPassword('123'); }} className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded border border-green-300">Audiencista</button>
               </div>
             </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      user={currentUser} 
      onLogout={handleLogout} 
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onUpdateAvatar={handleAvatarUpdate}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;