import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  FileText, ExternalLink, Download, Upload, Plus, AlertTriangle, 
  CheckCircle, Clock, Calendar, Search, Filter, Folder,
  Scale, Briefcase, FolderOpen, ArrowLeft, User, Building, Save, DollarSign, Video, Check,
  FileSpreadsheet, File as FileIcon, XCircle, CheckSquare, Link, Handshake, Eye, UserCheck, TrendingUp, TrendingDown, UserCog,
  Calculator, Receipt, CheckCircle2, Trash2, Printer, Users, ShoppingBag, Shield, MessageSquare, Mic, MapPin
} from 'lucide-react';
import { 
  NewsItem, LegalNews, FinancialRecord, Process, ClientDocument, UserRole, User as UserType, Client, ClientInvoice, Meeting, MeetingRequest, ProcessDeadline, TaxGuide, IrpfRequest, Product, ServiceItem, ChatMessage, HearingRequest
} from '../types';
import { MOCK_INTERNAL_NEWS, MOCK_LEGAL_NEWS, MOCK_FINANCE, MOCK_PROCESSES, MOCK_CLIENT_DOCS, MOCK_CLIENTS, MOCK_DEADLINES, MOCK_USERS, MOCK_PARTNER_CONTRACTS, MOCK_TAX_GUIDES, MOCK_IRPF_REQUESTS, MOCK_PRODUCTS, MOCK_SERVICES, getFinancialSummary } from '../services/mockService';

// --- SHARED UTILS ---
const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR');

// --- INTERNAL NEWS FEED ---
interface InternalNewsFeedProps {
  user: UserType;
  news: NewsItem[];
  onMarkAsRead: (newsId: string) => void;
  onAddNews: (news: NewsItem) => void;
}

export const InternalNewsFeed: React.FC<InternalNewsFeedProps> = ({ user, news, onMarkAsRead, onAddNews }) => {
  const [isPosting, setIsPosting] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', mediaType: 'TEXT', mediaUrl: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNews({
      id: `n-${Date.now()}`,
      title: newPost.title,
      content: newPost.content,
      summary: newPost.content.substring(0, 50) + '...',
      date: new Date().toISOString(),
      author: user.name,
      audience: Object.values(UserRole),
      readBy: [],
      mediaType: newPost.mediaType as any,
      mediaUrl: newPost.mediaUrl
    });
    setIsPosting(false);
    setNewPost({ title: '', content: '', mediaType: 'TEXT', mediaUrl: '' });
  };

  const visibleNews = news
    .filter(n => !n.readBy.some(r => r.userId === user.id))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h3 className="text-xl font-serif font-bold text-navy-900">Mural Interno</h3>
         {[UserRole.PARTNER, UserRole.ADMIN].includes(user.role) && (
            <button 
              onClick={() => setIsPosting(!isPosting)}
              className="bg-gold-500 text-white px-4 py-2 rounded shadow hover:bg-gold-600 transition"
            >
              {isPosting ? 'Cancelar' : 'Nova Publicação'}
            </button>
         )}
       </div>

       {isPosting && (
          <div className="bg-white p-6 rounded-lg shadow border-2 border-gold-100 mb-6 animate-fade-in">
             <h4 className="font-bold text-navy-900 mb-4">Criar Publicação</h4>
             <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Título da Publicação" 
                  className="w-full border p-2 rounded" 
                  value={newPost.title} 
                  onChange={e => setNewPost({...newPost, title: e.target.value})}
                  required
                />
                <textarea 
                  placeholder="Conteúdo do texto..." 
                  className="w-full border p-2 rounded h-24"
                  value={newPost.content}
                  onChange={e => setNewPost({...newPost, content: e.target.value})}
                  required
                ></textarea>
                <div className="flex justify-end pt-2">
                   <button type="submit" className="bg-navy-900 text-white px-6 py-2 rounded font-bold">Publicar</button>
                </div>
             </form>
          </div>
       )}

       <div className="space-y-4">
         {visibleNews.length === 0 && <p className="text-gray-500 text-center py-10">Você leu todas as publicações.</p>}
         {visibleNews.map(n => (
           <div key={n.id} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-navy-900">
             <div className="flex justify-between mb-2">
                <span className="font-bold text-navy-800 text-lg">{n.title}</span>
                <span className="text-xs text-gray-500">{new Date(n.date).toLocaleDateString()}</span>
             </div>
             <p className="text-gray-600 mb-4 whitespace-pre-line">{n.content}</p>
             <div className="flex justify-between items-center text-sm border-t pt-3 mt-2">
                <span className="text-gold-600 font-medium">Autor: {n.author}</span>
                <button onClick={() => onMarkAsRead(n.id)} className="text-navy-900 flex items-center gap-1 hover:underline font-bold">
                  <CheckCircle className="w-4 h-4" /> Marcar como lido
                </button>
             </div>
             {user.role === UserRole.PARTNER && n.readBy.length > 0 && (
               <div className="mt-2 bg-gray-50 p-2 rounded text-xs text-gray-500">
                 <strong>Lido por:</strong> {n.readBy.map(r => r.name).join(', ')}
               </div>
             )}
           </div>
         ))}
       </div>
    </div>
  );
};

// --- LEGAL NEWS MODULE ---
export const LegalNewsModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-serif font-bold text-navy-900 flex items-center gap-2">
        <Scale className="text-gold-500" /> Notícias Jurídicas
      </h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_LEGAL_NEWS.map(news => (
          <div key={news.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition border-t-4 border-navy-900">
            <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-gray-100 text-navy-700 mb-2">
              {news.tribunal}
            </span>
            <h4 className="font-bold text-lg mb-2 text-gray-800 leading-tight">{news.title}</h4>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{news.summary}</p>
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
               <span className="text-xs text-gray-400">{formatDate(news.date)}</span>
               <a href={news.url} className="text-gold-600 text-sm font-bold hover:underline flex items-center gap-1">
                 Ler na íntegra <ExternalLink size={12} />
               </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- FINANCE MODULE ---
interface FinanceModuleProps {
  user: UserType;
  financialRecords: FinancialRecord[];
  onAddRecord: (record: FinancialRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({ user, financialRecords, onAddRecord, onDeleteRecord }) => {
  const summary = {
    income: financialRecords.filter(f => f.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0),
    expense: financialRecords.filter(f => f.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0),
  };
  const balance = summary.income - summary.expense;

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
             <p className="text-gray-500 text-sm uppercase">Receitas</p>
             <p className="text-2xl font-bold text-green-600">R$ {summary.income.toLocaleString('pt-BR')}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
             <p className="text-gray-500 text-sm uppercase">Despesas</p>
             <p className="text-2xl font-bold text-red-600">R$ {summary.expense.toLocaleString('pt-BR')}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
             <p className="text-gray-500 text-sm uppercase">Saldo</p>
             <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                R$ {balance.toLocaleString('pt-BR')}
             </p>
          </div>
       </div>

       <div className="bg-white rounded-lg shadow overflow-hidden">
         <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-navy-900">Extrato Financeiro</h3>
            <button className="text-sm bg-navy-900 text-white px-3 py-1 rounded">Novo Lançamento</button>
         </div>
         <table className="min-w-full text-sm">
           <thead className="bg-gray-50 text-gray-700">
             <tr>
               <th className="px-6 py-3 text-left">Data</th>
               <th className="px-6 py-3 text-left">Descrição</th>
               <th className="px-6 py-3 text-left">Categoria</th>
               <th className="px-6 py-3 text-right">Valor</th>
               <th className="px-6 py-3 text-center">Status</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
             {financialRecords.map(r => (
               <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{formatDate(r.date)}</td>
                  <td className="px-6 py-4 font-medium">{r.description}</td>
                  <td className="px-6 py-4 text-gray-500">{r.category}</td>
                  <td className={`px-6 py-4 text-right font-bold ${r.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                     {r.type === 'EXPENSE' ? '-' : '+'} R$ {r.amount.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-center">
                     <span className={`px-2 py-1 rounded text-xs ${r.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {r.status === 'PAID' ? 'Pago' : 'Pendente'}
                     </span>
                  </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );
};

// --- PROCESSES MODULE ---
interface ProcessesModuleProps {
  user: UserType;
  processes: Process[];
  deadlines: ProcessDeadline[];
  users: UserType[];
  onAddDeadline: (deadline: ProcessDeadline) => void;
  onAddFinancialRecord?: (record: FinancialRecord) => void;
}

export const ProcessesModule: React.FC<ProcessesModuleProps> = ({ user, processes, deadlines, users, onAddDeadline, onAddFinancialRecord }) => {
  const [showDeadlineForm, setShowDeadlineForm] = useState(false);
  const [newDeadline, setNewDeadline] = useState<Partial<ProcessDeadline>>({ 
    processId: '', title: '', description: '', dueDate: '', assignees: [] 
  });
  
  const canEdit = [UserRole.PARTNER, UserRole.FINANCE, UserRole.LAWYER].includes(user.role);

  const handleToggleAssignee = (userId: string) => {
    setNewDeadline(prev => {
      const current = prev.assignees || [];
      return {
        ...prev,
        assignees: current.includes(userId) ? current.filter(id => id !== userId) : [...current, userId]
      };
    });
  };

  const handleSelectAllAssignees = (role: UserRole) => {
    const roleUserIds = users.filter(u => u.role === role).map(u => u.id);
    setNewDeadline(prev => {
       const current = prev.assignees || [];
       const allSelected = roleUserIds.every(id => current.includes(id));
       if (allSelected) {
         return { ...prev, assignees: current.filter(id => !roleUserIds.includes(id)) };
       }
       return { ...prev, assignees: [...new Set([...current, ...roleUserIds])] };
    });
  };

  const handleSubmitDeadline = (e: React.FormEvent) => {
     e.preventDefault();
     if (!newDeadline.processId || !newDeadline.title || !newDeadline.dueDate || (newDeadline.assignees?.length === 0)) {
        return alert("Preencha todos os campos obrigatórios e selecione ao menos um destinatário.");
     }
     
     const process = processes.find(p => p.id === newDeadline.processId);
     const assigneeNames = users.filter(u => newDeadline.assignees?.includes(u.id)).map(u => u.name);

     onAddDeadline({
        id: `dl-${Date.now()}`,
        processId: newDeadline.processId,
        cnj: process?.cnj || 'N/A',
        title: newDeadline.title!,
        description: newDeadline.description || '',
        dueDate: newDeadline.dueDate!,
        assignees: newDeadline.assignees!,
        assigneeNames: assigneeNames,
        status: 'PENDING'
     });
     
     alert(`Prazo incluído para ${assigneeNames.length} destinatários! Notificação enviada.`);
     setShowDeadlineForm(false);
     setNewDeadline({ processId: '', title: '', description: '', dueDate: '', assignees: [] });
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h3 className="text-xl font-bold text-navy-900">Processos Judiciais</h3>
         {canEdit && (
            <button onClick={() => setShowDeadlineForm(!showDeadlineForm)} className="bg-navy-900 text-white px-4 py-2 rounded font-bold shadow flex items-center gap-2">
               <Clock size={16} /> Incluir Novo Prazo
            </button>
         )}
       </div>

       {showDeadlineForm && (
          <div className="bg-white p-6 rounded-lg shadow border-2 border-gold-100 animate-fade-in">
             <h4 className="font-bold text-navy-900 mb-4">Cadastro de Prazo</h4>
             <form onSubmit={handleSubmitDeadline} className="space-y-4">
                <div>
                   <label className="block text-sm font-bold text-gray-700">Vínculo com Processo (Obrigatório)</label>
                   <select className="w-full border p-2 rounded" value={newDeadline.processId} onChange={e => setNewDeadline({...newDeadline, processId: e.target.value})} required>
                      <option value="">Selecione um processo...</option>
                      {processes.map(p => <option key={p.id} value={p.id}>{p.cnj} - {p.clientName}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700">Assunto</label>
                   <input type="text" className="w-full border p-2 rounded" value={newDeadline.title} onChange={e => setNewDeadline({...newDeadline, title: e.target.value})} required />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700">Descrição Detalhada</label>
                   <textarea className="w-full border p-2 rounded" value={newDeadline.description} onChange={e => setNewDeadline({...newDeadline, description: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700">Data Limite</label>
                   <input type="date" className="w-full border p-2 rounded" value={newDeadline.dueDate} onChange={e => setNewDeadline({...newDeadline, dueDate: e.target.value})} required />
                </div>
                
                <div className="border-t pt-4">
                   <label className="block text-sm font-bold text-gray-700 mb-2">Destinatários</label>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-48 overflow-y-auto border p-2 rounded bg-gray-50">
                      {[UserRole.PARTNER, UserRole.LAWYER, UserRole.FINANCE].map(role => (
                         <div key={role} className="mb-2">
                            <div className="flex justify-between items-center mb-1">
                               <span className="text-xs font-bold text-gray-500">{role}</span>
                               <button type="button" onClick={() => handleSelectAllAssignees(role)} className="text-xs text-blue-600 hover:underline">Marcar Todos</button>
                            </div>
                            {users.filter(u => u.role === role).map(u => (
                               <label key={u.id} className="flex items-center gap-2 text-sm ml-2">
                                  <input 
                                    type="checkbox" 
                                    checked={newDeadline.assignees?.includes(u.id)}
                                    onChange={() => handleToggleAssignee(u.id)}
                                  />
                                  {u.name}
                               </label>
                            ))}
                         </div>
                      ))}
                   </div>
                </div>

                <div className="flex justify-end pt-2">
                   <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold">Salvar Prazo</button>
                </div>
             </form>
          </div>
       )}

       <div className="bg-white rounded-lg shadow overflow-hidden">
         <table className="min-w-full text-sm">
           <thead className="bg-gray-50 text-gray-700">
             <tr>
               <th className="px-6 py-3 text-left">CNJ / Cliente</th>
               <th className="px-6 py-3 text-left">Tipo</th>
               <th className="px-6 py-3 text-left">Status</th>
               <th className="px-6 py-3 text-left">Próx. Prazo</th>
               <th className="px-6 py-3 text-center">Drive</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
             {processes.map(proc => (
               <tr key={proc.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                   <div className="font-bold text-gray-900">{proc.cnj}</div>
                   <div className="text-xs text-gray-500">{proc.clientName}</div>
                 </td>
                 <td className="px-6 py-4 text-gray-600">{proc.type}</td>
                 <td className="px-6 py-4 text-gray-600">{proc.status}</td>
                 <td className="px-6 py-4 text-gray-600">{proc.nextDeadline ? formatDate(proc.nextDeadline) : '-'}</td>
                 <td className="px-6 py-4 text-center">
                    <a href={`https://drive.google.com/drive/u/0/folders/${proc.driveFolderId}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800">
                      <FolderOpen size={18} className="mx-auto" />
                    </a>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );
};

// --- CLIENTS MODULE ---
interface ClientsModuleProps {
  user: UserType;
  clients: Client[];
  partners: UserType[];
  onAddClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

export const ClientsModule: React.FC<ClientsModuleProps> = ({ user, clients, partners, onAddClient, onDeleteClient }) => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-navy-900">Carteira de Clientes</h3>
          <button className="bg-navy-900 text-white px-4 py-2 rounded shadow flex items-center gap-2">
             <Plus size={16} /> Novo Cliente
          </button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map(client => (
             <div key={client.id} className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-gold-500 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <h4 className="font-bold text-lg text-navy-900">{client.name}</h4>
                      <p className="text-xs text-gray-500">{client.type} • {client.document}</p>
                   </div>
                   <span className={`px-2 py-0.5 text-xs rounded ${client.status === 'ATIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {client.status}
                   </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600 flex-1">
                   <p className="flex items-center gap-2"><MessageSquare size={14}/> {client.email}</p>
                   <p className="flex items-center gap-2"><Briefcase size={14}/> {client.phone}</p>
                   {client.partnerId && <p className="text-xs bg-gray-100 p-1 rounded mt-2">Parceiro: {partners.find(p => p.id === client.partnerId)?.name || 'N/A'}</p>}
                </div>
                <div className="mt-4 pt-4 border-t flex gap-2">
                   <button className="flex-1 border border-navy-900 text-navy-900 py-1 rounded text-sm hover:bg-navy-50">Detalhes</button>
                   <button className="text-red-600 p-1 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

// --- CLIENT DASHBOARD ---
export const ClientDashboard: React.FC<{ user: UserType }> = ({ user }) => {
  return (
    <div className="space-y-6">
       <div className="bg-navy-900 text-white p-8 rounded-lg shadow-lg flex justify-between items-center">
          <div>
             <h2 className="text-3xl font-serif font-bold mb-2">Olá, {user.name}</h2>
             <p className="opacity-80">Bem-vindo à sua área exclusiva Alcides & Mosinho.</p>
          </div>
          <Shield size={64} className="text-gold-500 opacity-50" />
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-gold-500 cursor-pointer hover:shadow-md transition">
             <h4 className="font-bold text-navy-900 mb-2 flex items-center gap-2"><FolderOpen /> Meus Documentos</h4>
             <p className="text-sm text-gray-600">Acesse seus contratos, procurações e peças processuais.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-navy-900 cursor-pointer hover:shadow-md transition">
             <h4 className="font-bold text-navy-900 mb-2 flex items-center gap-2"><Briefcase /> Meus Processos</h4>
             <p className="text-sm text-gray-600">Acompanhe o andamento das suas ações em tempo real.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-gold-500 cursor-pointer hover:shadow-md transition">
             <h4 className="font-bold text-navy-900 mb-2 flex items-center gap-2"><DollarSign /> Financeiro</h4>
             <p className="text-sm text-gray-600">Visualize boletos, notas fiscais e histórico de pagamentos.</p>
          </div>
       </div>
       
       {/* Featured Service */}
       <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white p-6 rounded-lg shadow flex justify-between items-center">
          <div>
             <h3 className="font-bold text-xl mb-1">Proteção Patrimonial</h3>
             <p className="text-sm opacity-90 max-w-lg">Descubra como blindar seu patrimônio e garantir o futuro da sua família com nossas soluções de Holding.</p>
          </div>
          <button className="bg-white text-gold-600 px-6 py-2 rounded font-bold shadow hover:bg-gray-100">Saiba Mais</button>
       </div>
    </div>
  );
};

// --- CLIENT FINANCE MODULE ---
interface ClientFinanceModuleProps {
  invoices: ClientInvoice[];
  onPay: (id: string) => void;
}

export const ClientFinanceModule: React.FC<ClientFinanceModuleProps> = ({ invoices, onPay }) => {
   return (
      <div className="space-y-6">
         <h3 className="text-xl font-bold text-navy-900">Minhas Faturas</h3>
         <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full text-sm">
               <thead className="bg-gray-50 text-gray-700">
                  <tr>
                     <th className="px-6 py-3 text-left">Descrição</th>
                     <th className="px-6 py-3 text-left">Vencimento</th>
                     <th className="px-6 py-3 text-right">Valor</th>
                     <th className="px-6 py-3 text-center">Status</th>
                     <th className="px-6 py-3 text-center">Ação</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {invoices.map(inv => (
                     <tr key={inv.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{inv.description}</td>
                        <td className="px-6 py-4">{formatDate(inv.dueDate)}</td>
                        <td className="px-6 py-4 text-right">R$ {inv.amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                        <td className="px-6 py-4 text-center">
                           <span className={`px-2 py-1 rounded text-xs ${inv.status === 'PAID' ? 'bg-green-100 text-green-800' : inv.status === 'OVERDUE' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {inv.status === 'PAID' ? 'Pago' : inv.status === 'OVERDUE' ? 'Vencido' : 'Pendente'}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                           {inv.status !== 'PAID' && (
                              <button onClick={() => onPay(inv.id)} className="text-blue-600 hover:underline font-bold text-xs border border-blue-600 px-2 py-1 rounded">
                                 Pagar Agora
                              </button>
                           )}
                           {inv.status === 'PAID' && <span className="text-green-600 flex justify-center"><CheckCircle size={16}/></span>}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

// --- CLIENT AGENDA MODULE ---
interface ClientAgendaModuleProps {
  user: UserType;
  meetings: Meeting[];
  requests: MeetingRequest[];
  onRequestMeeting: (req: Omit<MeetingRequest, 'id' | 'status'>) => void;
}

export const ClientAgendaModule: React.FC<ClientAgendaModuleProps> = ({ user, meetings, requests, onRequestMeeting }) => {
   const [showRequestForm, setShowRequestForm] = useState(false);
   const [newReq, setNewReq] = useState({ subject: '', reason: '', preferredDate: '', preferredTime: '' });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onRequestMeeting({
         clientId: user.id,
         subject: newReq.subject,
         reason: newReq.reason,
         preferredDate: newReq.preferredDate,
         preferredTime: newReq.preferredTime
      });
      setShowRequestForm(false);
      setNewReq({ subject: '', reason: '', preferredDate: '', preferredTime: '' });
   };

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-navy-900">Minha Agenda</h3>
            <button onClick={() => setShowRequestForm(!showRequestForm)} className="bg-navy-900 text-white px-4 py-2 rounded shadow">
               Solicitar Reunião
            </button>
         </div>

         {showRequestForm && (
            <div className="bg-white p-6 rounded-lg shadow border-2 border-gold-100 animate-fade-in">
               <h4 className="font-bold text-navy-900 mb-4">Solicitação de Agendamento</h4>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <label className="block text-sm font-bold text-gray-700">Assunto</label>
                     <input type="text" required className="w-full border p-2 rounded" value={newReq.subject} onChange={e => setNewReq({...newReq, subject: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700">Motivo</label>
                     <textarea required className="w-full border p-2 rounded" value={newReq.reason} onChange={e => setNewReq({...newReq, reason: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-gray-700">Data Preferencial</label>
                        <input type="date" required className="w-full border p-2 rounded" value={newReq.preferredDate} onChange={e => setNewReq({...newReq, preferredDate: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700">Hora Preferencial</label>
                        <input type="time" required className="w-full border p-2 rounded" value={newReq.preferredTime} onChange={e => setNewReq({...newReq, preferredTime: e.target.value})} />
                     </div>
                  </div>
                  <button type="submit" className="bg-gold-500 text-white px-6 py-2 rounded font-bold w-full">Enviar Solicitação</button>
               </form>
            </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
               <h4 className="font-bold text-navy-900 mb-4 border-b pb-2">Próximas Reuniões</h4>
               {meetings.length === 0 && <p className="text-gray-500 text-sm">Nenhuma reunião agendada.</p>}
               {meetings.map(m => (
                  <div key={m.id} className="mb-4 border-l-4 border-blue-500 pl-3">
                     <p className="font-bold text-navy-900">{m.title}</p>
                     <p className="text-sm text-gray-600">{formatDate(m.date)} às {m.time}</p>
                     {m.link && <a href={m.link} target="_blank" rel="noreferrer" className="text-blue-600 text-xs hover:underline flex items-center gap-1 mt-1"><Video size={12}/> Link da Sala</a>}
                  </div>
               ))}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
               <h4 className="font-bold text-navy-900 mb-4 border-b pb-2">Minhas Solicitações</h4>
               {requests.length === 0 && <p className="text-gray-500 text-sm">Nenhuma solicitação pendente.</p>}
               {requests.map(r => (
                  <div key={r.id} className="mb-4 bg-gray-50 p-3 rounded">
                     <div className="flex justify-between">
                        <span className="font-bold text-sm">{r.subject}</span>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">{r.status}</span>
                     </div>
                     <p className="text-xs text-gray-500 mt-1">{formatDate(r.preferredDate)} - {r.preferredTime}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

// --- PARTNER DASHBOARD ---
export const PartnerDashboard: React.FC<{ user: UserType; onNavigate: (page: string) => void }> = ({ user, onNavigate }) => {
   return (
      <div className="space-y-6">
         <div className="bg-navy-900 text-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-serif font-bold">Portal do Parceiro</h2>
            <p className="opacity-80">Parceria Estratégica Alcides & Mosinho</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div onClick={() => onNavigate('clients')} className="bg-white p-6 rounded shadow hover:shadow-lg transition cursor-pointer border-t-4 border-gold-500">
               <h4 className="font-bold text-lg mb-2">Meus Indicados</h4>
               <p className="text-gray-600">Acompanhe os clientes que você indicou.</p>
            </div>
            <div onClick={() => onNavigate('processes')} className="bg-white p-6 rounded shadow hover:shadow-lg transition cursor-pointer border-t-4 border-navy-900">
               <h4 className="font-bold text-lg mb-2">Processos</h4>
               <p className="text-gray-600">Status dos processos vinculados a sua parceria.</p>
            </div>
            <div onClick={() => onNavigate('partner-contract')} className="bg-white p-6 rounded shadow hover:shadow-lg transition cursor-pointer border-t-4 border-gold-500">
               <h4 className="font-bold text-lg mb-2">Contrato & Comissões</h4>
               <p className="text-gray-600">Acesse seu contrato e regras de comissionamento.</p>
            </div>
         </div>
      </div>
   );
};

// --- PARTNER CONTRACT MODULE ---
export const PartnerContractModule: React.FC<{ user: UserType }> = ({ user }) => {
   const contract = MOCK_PARTNER_CONTRACTS.find(c => c.partnerId === user.id);
   return (
      <div className="bg-white p-8 rounded-lg shadow max-w-2xl mx-auto text-center">
         <Handshake size={64} className="mx-auto text-navy-900 mb-4" />
         <h3 className="text-2xl font-bold text-navy-900 mb-2">Seu Contrato de Parceria</h3>
         <p className="text-gray-600 mb-6">Mantenha-se atualizado com os termos da nossa parceria.</p>
         {contract ? (
            <div className="bg-gray-50 p-4 rounded border text-left flex justify-between items-center">
               <div>
                  <p className="font-bold text-navy-900">{contract.title}</p>
                  <p className="text-xs text-gray-500">Assinado em: {formatDate(contract.date)}</p>
               </div>
               <button className="text-blue-600 hover:underline flex items-center gap-1 font-bold">
                  <Download size={16} /> Baixar PDF
               </button>
            </div>
         ) : (
            <p className="text-red-500">Contrato não encontrado. Entre em contato com a administração.</p>
         )}
      </div>
   );
};

// --- PARTNER MANAGEMENT MODULE ---
export const PartnerManagementModule: React.FC<{ partners: UserType[]; contracts: any[]; onAddPartner: (u: UserType) => void }> = ({ partners, contracts, onAddPartner }) => {
   return (
      <div className="space-y-6">
         <h3 className="text-xl font-bold text-navy-900">Gestão de Parceiros</h3>
         <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full text-sm">
               <thead className="bg-gray-50">
                  <tr>
                     <th className="px-6 py-3 text-left">Nome</th>
                     <th className="px-6 py-3 text-left">Email</th>
                     <th className="px-6 py-3 text-center">Status Contrato</th>
                     <th className="px-6 py-3 text-center">Ações</th>
                  </tr>
               </thead>
               <tbody>
                  {partners.filter(p => p.role === UserRole.EXTERNAL_PARTNER).map(p => (
                     <tr key={p.id} className="border-t">
                        <td className="px-6 py-4 font-bold">{p.name}</td>
                        <td className="px-6 py-4">{p.email}</td>
                        <td className="px-6 py-4 text-center">
                           {contracts.some(c => c.partnerId === p.id) ? (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Vigente</span>
                           ) : (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Pendente</span>
                           )}
                        </td>
                        <td className="px-6 py-4 text-center">
                           <button className="text-navy-900 hover:underline text-xs font-bold">Gerenciar</button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

// --- ACCOUNTING MODULE ---
export const AccountingModule: React.FC<{ user: UserType }> = ({ user }) => {
   return (
      <div className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded shadow border-l-4 border-navy-900">
               <p className="text-gray-500 text-xs uppercase">Guias Emitidas</p>
               <p className="text-2xl font-bold">128</p>
            </div>
            <div className="bg-white p-4 rounded shadow border-l-4 border-gold-500">
               <p className="text-gray-500 text-xs uppercase">Pendências</p>
               <p className="text-2xl font-bold text-red-500">12</p>
            </div>
            <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">
               <p className="text-gray-500 text-xs uppercase">IRPF Solicitados</p>
               <p className="text-2xl font-bold">45</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded shadow">
            <h3 className="font-bold text-lg mb-4">Central de Obrigações</h3>
            <p className="text-gray-500">Selecione um cliente para gerenciar guias e declarações.</p>
            {/* Mock content for UI structure */}
            <div className="mt-4 border p-4 rounded bg-gray-50 text-center text-gray-400">
               Selecione um cliente na aba "Clientes Contábeis"
            </div>
         </div>
      </div>
   );
};

// --- CLIENT ACCOUNTING MODULE ---
interface ClientAccountingModuleProps {
  user: UserType;
  guides: TaxGuide[];
  irpfRequests: IrpfRequest[];
  onPayGuide: (id: string) => void;
  onRequestIrpf: () => void;
}

export const ClientAccountingModule: React.FC<ClientAccountingModuleProps> = ({ user, guides, irpfRequests, onPayGuide, onRequestIrpf }) => {
   return (
      <div className="space-y-8">
         {/* Guides Section */}
         <div>
            <h3 className="text-xl font-bold text-navy-900 mb-4">Minhas Guias de Impostos</h3>
            <div className="grid gap-4 md:grid-cols-2">
               {guides.map(guide => (
                  <div key={guide.id} className="bg-white p-4 rounded shadow border-l-4 border-navy-900 flex justify-between items-center">
                     <div>
                        <span className="text-xs font-bold bg-gray-200 px-2 py-0.5 rounded">{guide.type}</span>
                        <p className="font-bold mt-1">{guide.description}</p>
                        <p className="text-sm text-gray-600">Vence em: {formatDate(guide.dueDate)}</p>
                        <p className="text-lg font-bold text-navy-900 mt-1">R$ {guide.value.toLocaleString('pt-BR')}</p>
                     </div>
                     <div className="flex flex-col gap-2">
                        {guide.status === 'PENDENTE' ? (
                           <>
                              <button className="bg-white border border-navy-900 text-navy-900 px-3 py-1 rounded text-xs font-bold hover:bg-navy-50">
                                 Baixar PDF
                              </button>
                              <button onClick={() => onPayGuide(guide.id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700">
                                 Informar Pagamento
                              </button>
                           </>
                        ) : (
                           <span className="flex items-center gap-1 text-green-600 font-bold text-sm"><CheckCircle size={16}/> Pago</span>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* IRPF Section */}
         <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-navy-900">Imposto de Renda (IRPF)</h3>
               <button onClick={onRequestIrpf} className="bg-gold-500 text-white px-4 py-2 rounded shadow font-bold">Solicitar Declaração</button>
            </div>
            {irpfRequests.map(req => (
               <div key={req.id} className="bg-white p-4 rounded border flex justify-between items-center">
                  <div>
                     <p className="font-bold">Declaração Anual {req.year}</p>
                     <p className="text-xs text-gray-500">Solicitado em: {formatDate(req.requestDate)}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs font-bold">{req.status.replace('_', ' ')}</span>
               </div>
            ))}
         </div>
      </div>
   );
};

// --- DOCUMENTS MODULE ---
interface DocumentsModuleProps {
  user: UserType;
  documents: ClientDocument[];
  onAddDocument: (doc: ClientDocument) => void;
  onDeleteDocument: (id: string) => void;
}

export const DocumentsModule: React.FC<DocumentsModuleProps> = ({ user, documents, onAddDocument, onDeleteDocument }) => {
   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-navy-900">Gestão de Documentos</h3>
            <button className="bg-navy-900 text-white px-4 py-2 rounded shadow flex items-center gap-2">
               <Upload size={16} /> Novo Documento
            </button>
         </div>
         <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full text-sm">
               <thead className="bg-gray-50">
                  <tr>
                     <th className="px-6 py-3 text-left">Nome</th>
                     <th className="px-6 py-3 text-left">Tipo</th>
                     <th className="px-6 py-3 text-left">Data</th>
                     <th className="px-6 py-3 text-center">Visibilidade</th>
                     <th className="px-6 py-3 text-center">Ações</th>
                  </tr>
               </thead>
               <tbody>
                  {documents.map(doc => (
                     <tr key={doc.id} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium flex items-center gap-2">
                           <FileText size={16} className="text-blue-500" /> {doc.title}
                        </td>
                        <td className="px-6 py-4 text-gray-500">{doc.type}</td>
                        <td className="px-6 py-4">{formatDate(doc.date)}</td>
                        <td className="px-6 py-4 text-center">
                           <span className={`px-2 py-0.5 rounded text-xs ${doc.visibleToClient ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                              {doc.visibleToClient ? 'Cliente Vê' : 'Interno'}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <button className="text-blue-600 hover:underline mr-2"><Download size={16}/></button>
                           <button className="text-red-600 hover:underline"><Trash2 size={16}/></button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

// --- PEOPLE MODULE ---
export const PeopleModule: React.FC<{ user: UserType; users: UserType[]; onAddUser: (u: UserType) => void }> = ({ user, users, onAddUser }) => {
   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-navy-900">Cadastro de Pessoas & Usuários</h3>
            <button className="bg-navy-900 text-white px-4 py-2 rounded shadow flex items-center gap-2">
               <Plus size={16} /> Novo Usuário
            </button>
         </div>
         <div className="bg-white rounded-lg shadow overflow-hidden">
             {/* Simple list for demo */}
             <ul className="divide-y">
                {users.map(u => (
                   <li key={u.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-navy-100 text-navy-900 flex items-center justify-center font-bold">
                            {u.name.charAt(0)}
                         </div>
                         <div>
                            <p className="font-bold text-gray-900">{u.name}</p>
                            <p className="text-xs text-gray-500">{u.email} • {u.role}</p>
                         </div>
                      </div>
                      <button className="text-gray-400 hover:text-navy-900"><UserCog size={18}/></button>
                   </li>
                ))}
             </ul>
         </div>
      </div>
   );
};

// --- PROVIDER AREA ---
export const ProviderArea: React.FC = () => {
   return (
      <div className="space-y-6">
         <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
               <User size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">Minha Conta</h3>
            <p className="text-gray-500 mb-6">Gerencie seus dados e preferências.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
               <div className="border p-4 rounded">
                  <p className="text-xs text-gray-400 uppercase">Dados Pessoais</p>
                  <p className="font-bold text-navy-900 mt-1">Atualizar Perfil</p>
               </div>
               <div className="border p-4 rounded">
                  <p className="text-xs text-gray-400 uppercase">Segurança</p>
                  <p className="font-bold text-navy-900 mt-1">Alterar Senha</p>
               </div>
            </div>
         </div>
      </div>
   );
};

// --- MY HOLDING MODULE ---
export const MyHoldingModule: React.FC = () => {
  const [usdRate, setUsdRate] = useState<number | null>(null);

  useEffect(() => {
    // Attempt to fetch from public API to avoid CORS from BCB direct
    fetch('https://economia.awesomeapi.com.br/last/USD-BRL')
      .then(res => res.json())
      .then(data => {
        if(data.USDBRL) setUsdRate(parseFloat(data.USDBRL.bid));
      })
      .catch(() => setUsdRate(5.20)); // Fallback mock
  }, []);

  const totalAssetsBrl = 5000000; // Mock assets
  const totalAssetsUsd = usdRate ? totalAssetsBrl / usdRate : 0;

  return (
    <div className="space-y-6">
       <div className="bg-navy-900 text-white p-8 rounded-lg shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <Building size={150} />
          </div>
          <h3 className="text-3xl font-serif font-bold text-gold-500 mb-2">My Holding Premium</h3>
          <p className="opacity-80 max-w-xl">Gestão patrimonial exclusiva, inteligência financeira e proteção de ativos.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 relative z-10">
             <div>
                <p className="text-gray-400 text-sm uppercase tracking-widest">Patrimônio Total (BRL)</p>
                <p className="text-4xl font-bold">R$ {totalAssetsBrl.toLocaleString('pt-BR')}</p>
             </div>
             <div>
                <p className="text-gray-400 text-sm uppercase tracking-widest">Patrimônio em Dólar (USD)</p>
                <p className="text-4xl font-bold text-gold-400">
                  {usdRate ? `$ ${totalAssetsUsd.toLocaleString('en-US', {maximumFractionDigits: 2})}` : 'Carregando...'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Cotação Atual: R$ {usdRate?.toFixed(2)} (Fonte: BCB/AwesomeAPI)</p>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-gold-500">
             <h4 className="font-bold text-navy-900 mb-4 flex items-center gap-2"><Briefcase size={20}/> Ativos & Investimentos</h4>
             <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b pb-1"><span>Imóveis</span> <span>R$ 3.5M</span></li>
                <li className="flex justify-between border-b pb-1"><span>Fundos de Inv.</span> <span>R$ 1.0M</span></li>
                <li className="flex justify-between border-b pb-1"><span>Exterior</span> <span>R$ 500k</span></li>
             </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-navy-900">
             <h4 className="font-bold text-navy-900 mb-4 flex items-center gap-2"><FileText size={20}/> Contábil & Guias</h4>
             <div className="space-y-2">
                <button className="w-full text-left p-2 hover:bg-gray-50 rounded border flex justify-between items-center text-sm">
                   <span>Emitir DARF</span> <Download size={14} />
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-50 rounded border flex justify-between items-center text-sm">
                   <span>Folha de Pagamento</span> <Download size={14} />
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-50 rounded border flex justify-between items-center text-sm">
                   <span>Baixar DRE Consolidada</span> <Download size={14} />
                </button>
             </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-gold-500">
             <h4 className="font-bold text-navy-900 mb-4 flex items-center gap-2"><MessageSquare size={20}/> Concierge VIP</h4>
             <p className="text-xs text-gray-500 mb-4">Atendimento prioritário com sócios.</p>
             <button className="w-full bg-gold-500 text-white py-2 rounded font-bold hover:bg-gold-600 mb-2">Solicitar Reunião</button>
             <button className="w-full bg-navy-900 text-white py-2 rounded font-bold hover:bg-navy-800">Chat VIP</button>
          </div>
       </div>
    </div>
  );
};

// --- STORE MODULE ---
export const StoreModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'INSURANCE'>('PRODUCTS');

  return (
    <div className="space-y-6">
       <div className="flex gap-4 border-b">
          <button onClick={() => setActiveTab('PRODUCTS')} className={`pb-2 px-4 ${activeTab === 'PRODUCTS' ? 'font-bold border-b-2 border-navy-900' : 'text-gray-500'}`}>Produtos A&M</button>
          <button onClick={() => setActiveTab('INSURANCE')} className={`pb-2 px-4 ${activeTab === 'INSURANCE' ? 'font-bold border-b-2 border-navy-900' : 'text-gray-500'}`}>Seguros</button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {MOCK_PRODUCTS.filter(p => activeTab === 'PRODUCTS' ? p.type !== 'SEGURO' : p.type === 'SEGURO').map(prod => (
            <div key={prod.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
               <div className="h-32 bg-gray-200 flex items-center justify-center">
                  {prod.type === 'EBOOK' && <FileText size={40} className="text-gray-400" />}
                  {prod.type === 'VIDEO' && <Video size={40} className="text-gray-400" />}
                  {prod.type === 'SEGURO' && <Shield size={40} className="text-gray-400" />}
               </div>
               <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-bold text-navy-900 mb-1">{prod.title}</h4>
                  <p className="text-sm text-gray-600 mb-4 flex-1">{prod.description}</p>
                  <div className="flex justify-between items-center mt-auto">
                     <span className="font-bold text-lg text-green-700">R$ {prod.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                     <button className="bg-navy-900 text-white px-3 py-1 rounded text-sm font-bold hover:bg-navy-800 flex items-center gap-1">
                        <ShoppingBag size={14} /> Comprar
                     </button>
                  </div>
               </div>
            </div>
         ))}
       </div>
    </div>
  );
};

// --- SERVICES MODULE ---
export const ServicesModule: React.FC = () => {
  return (
    <div className="space-y-6">
       <h3 className="text-xl font-bold text-navy-900">Contratação de Serviços</h3>
       <div className="bg-white rounded-lg shadow overflow-hidden">
          {MOCK_SERVICES.map((s, idx) => (
             <div key={s.id} className={`p-4 flex justify-between items-center ${idx !== MOCK_SERVICES.length -1 ? 'border-b' : ''} hover:bg-gray-50`}>
                <div>
                   <h4 className="font-bold text-navy-900">{s.name}</h4>
                   <p className="text-sm text-gray-500">{s.description}</p>
                </div>
                <button className="border border-navy-900 text-navy-900 px-4 py-1 rounded font-bold hover:bg-navy-900 hover:text-white transition">
                   Contratar
                </button>
             </div>
          ))}
       </div>
    </div>
  );
};

// --- CHAT MODULE ---
export const ChatModule: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', senderId: 'system', senderName: 'Atendente Virtual', text: 'Olá! Bem-vindo ao chat da Alcides & Mosinho. Como posso ajudar? Selecione um departamento para iniciar.', timestamp: new Date().toISOString(), isSystem: true }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  const handleSend = () => {
     if (!inputText.trim()) return;
     const newMsg: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'me',
        senderName: 'Eu',
        text: inputText,
        timestamp: new Date().toISOString()
     };
     setMessages([...messages, newMsg]);
     setInputText('');

     // Mock Auto Response
     setTimeout(() => {
        setMessages(prev => [...prev, {
           id: Date.now().toString(),
           senderId: 'system',
           senderName: 'Atendente Virtual',
           text: selectedDept ? `Aguarde um momento, estamos conectando você ao setor ${selectedDept}.` : 'Por favor, selecione quem você deseja contatar no filtro acima.',
           timestamp: new Date().toISOString(),
           isSystem: true
        }]);
     }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] bg-white rounded-lg shadow overflow-hidden">
       <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-navy-900 flex items-center gap-2"><MessageSquare /> Chat A&M</h3>
          <select 
            className="border p-1 rounded text-sm"
            value={selectedDept || ''}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
             <option value="">Falar com...</option>
             <option value="SOCIOS">Sócios</option>
             <option value="FINANCEIRO">Financeiro</option>
             <option value="CONTABIL">Contábil</option>
             <option value="COLABORADOR">Colaboradores</option>
          </select>
       </div>
       
       <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-100">
          {messages.map(msg => (
             <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.senderId === 'me' ? 'bg-navy-900 text-white' : 'bg-white text-gray-800 shadow'}`}>
                   {!msg.isSystem && <p className="text-xs opacity-70 mb-1">{msg.senderName}</p>}
                   <p>{msg.text}</p>
                </div>
             </div>
          ))}
       </div>

       <div className="p-4 bg-white border-t flex gap-2">
          <input 
            type="text" 
            className="flex-1 border p-2 rounded" 
            placeholder="Digite sua mensagem..." 
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="bg-gold-500 text-white px-4 py-2 rounded font-bold hover:bg-gold-600">Enviar</button>
       </div>
    </div>
  );
};

// --- HEARING LAWYER MODULE ---
interface HearingLawyerModuleProps {
  user: UserType;
}

export const HearingLawyerModule: React.FC<HearingLawyerModuleProps> = ({ user }) => {
  const [requests, setRequests] = useState<HearingRequest[]>([
     { id: 'h1', processId: 'p1', requesterId: '5', date: '2024-06-01', time: '14:00', location: '1ª VT/RJ', mode: 'PRESENCIAL', type: 'INSTRUCAO', value: 300.00, status: 'SOLICITADA' }
  ]);
  const [selectedRequest, setSelectedRequest] = useState<HearingRequest | null>(null);
  
  // Logic to accept/reject
  const handleAction = (id: string, action: 'ACCEPT' | 'REJECT') => {
    if (action === 'REJECT') {
       setRequests(prev => prev.filter(r => r.id !== id));
    } else {
       setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'AGENDADA', audiencistaId: user.id } : r));
       alert("Audiência aceita! Adicionada à sua agenda e informada ao financeiro.");
    }
  };

  const handleReturn = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'CONCLUIDA' } : r));
    alert("Retorno enviado! O pagamento será liberado pelo financeiro após validação.");
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
             <h4 className="font-bold text-navy-900 mb-4 border-b pb-2">Solicitações de Audiência</h4>
             {requests.filter(r => r.status === 'SOLICITADA').length === 0 && <p className="text-gray-500 text-sm">Nenhuma solicitação pendente.</p>}
             {requests.filter(r => r.status === 'SOLICITADA').map(r => (
                <div key={r.id} className="border p-3 rounded mb-2 bg-yellow-50">
                   <div className="flex justify-between">
                      <span className="font-bold text-sm">Processo ID: {r.processId}</span>
                      <span className="font-bold text-green-700">R$ {r.value}</span>
                   </div>
                   <p className="text-xs text-gray-600">{r.type} • {r.mode}</p>
                   <p className="text-xs text-gray-600 mb-2">{formatDate(r.date)} às {r.time} - {r.location}</p>
                   <div className="flex gap-2">
                      <button onClick={() => handleAction(r.id, 'ACCEPT')} className="flex-1 bg-green-600 text-white text-xs py-1 rounded">Aceitar</button>
                      <button onClick={() => handleAction(r.id, 'REJECT')} className="flex-1 bg-red-600 text-white text-xs py-1 rounded">Recusar</button>
                   </div>
                </div>
             ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
             <h4 className="font-bold text-navy-900 mb-4 border-b pb-2">Minha Agenda</h4>
             {requests.filter(r => r.status === 'AGENDADA').map(r => (
                <div key={r.id} className="border p-3 rounded mb-2 bg-blue-50">
                   <div className="flex justify-between">
                      <span className="font-bold text-sm">Agendada: {formatDate(r.date)}</span>
                      <span className="text-xs bg-blue-200 px-2 rounded">{r.time}</span>
                   </div>
                   <p className="text-xs text-gray-600 mb-2">{r.location}</p>
                   <button onClick={() => setSelectedRequest(r)} className="w-full bg-navy-900 text-white text-xs py-1 rounded flex justify-center items-center gap-2">
                      <CheckSquare size={12} /> Realizar Retorno
                   </button>
                </div>
             ))}
          </div>
       </div>

       {selectedRequest && (
          <div className="bg-white p-6 rounded-lg shadow border-2 border-gold-100 animate-fade-in">
             <h4 className="font-bold text-navy-900 mb-4">Retorno de Audiência</h4>
             <form onSubmit={(e) => { e.preventDefault(); handleReturn(selectedRequest.id); }} className="space-y-4">
                <p className="text-sm">Enviando retorno para a audiência do dia {formatDate(selectedRequest.date)}.</p>
                <div>
                   <label className="block text-sm font-bold text-gray-700">Resumo da Audiência</label>
                   <textarea className="w-full border p-2 rounded" required placeholder="O que aconteceu?"></textarea>
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700">Upload da Ata (PDF)</label>
                   <input type="file" accept=".pdf" className="w-full border p-2 rounded" required />
                </div>
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold">Enviar e Solicitar Pagamento</button>
                <button type="button" onClick={() => setSelectedRequest(null)} className="ml-2 px-4 py-2 border rounded">Cancelar</button>
             </form>
          </div>
       )}
    </div>
  );
};

// --- INTERNAL HEARING MANAGEMENT ---
export const InternalHearingManagement: React.FC = () => {
   return (
      <div className="bg-white p-6 rounded shadow">
         <h3 className="font-bold text-xl mb-4">Contratação de Audiencista</h3>
         <p className="text-gray-500">Módulo para solicitar advogados correspondentes.</p>
         <button className="bg-navy-900 text-white px-4 py-2 rounded font-bold mt-4">+ Nova Solicitação</button>
      </div>
   )
}