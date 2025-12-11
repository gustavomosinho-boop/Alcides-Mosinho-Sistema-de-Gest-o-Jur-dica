
export enum UserRole {
  PARTNER = 'SOCIO',
  FINANCE = 'FINANCEIRO',
  ADMIN = 'ADMINISTRATIVO',
  LAWYER = 'ADVOGADO',
  SECRETARY = 'SECRETARIO',
  ANALYST = 'ANALISTA',
  CLIENT = 'CLIENTE',
  EXTERNAL_PARTNER = 'PARCEIRO',
  ACCOUNTING = 'CONTABIL',
  HEARING_LAWYER = 'AUDIENCISTA', // Novo perfil
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  // Campos específicos para audiencista
  oab?: string;
  ufOab?: string;
  whatsapp?: string;
}

export interface Client {
  id: string;
  type: 'PF' | 'PJ';
  name: string; // Nome ou Razão Social
  document: string; // CPF ou CNPJ
  email: string;
  phone: string;
  address: string;
  // Campos PF
  rg?: string;
  birthDate?: string;
  // Campos PJ
  representative?: string;
  status: 'ATIVO' | 'INATIVO';
  partnerId?: string; // ID do Parceiro vinculado
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  audience: UserRole[]; 
  readBy: { userId: string; name: string; date: string }[];
  mediaType?: 'TEXT' | 'VIDEO' | 'LINK' | 'FILE';
  mediaUrl?: string; 
}

export interface LegalNews {
  id: string;
  tribunal: 'STF' | 'STJ' | 'TST' | 'TRT-1' | 'TJRJ';
  title: string;
  summary: string;
  date: string;
  url: string;
}

export interface FinancialRecord {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  date: string;
  description: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'BLOCKED'; // BLOCKED para audiencista antes do retorno
  // Novos campos
  bank?: string;
  paymentMethod?: string;
  isRecurring?: boolean;
  recurringEndDate?: string;
  installments?: number;
  feeType?: 'CONTRATUAL' | 'SUCUMBENCIAL' | 'INICIAL' | 'OUTROS';
  relatedHearingId?: string; // Link financeiro com audiencia
}

export interface Process {
  id: string;
  cnj: string;
  clientName: string;
  clientId: string;
  type: 'Trabalhista' | 'Cível' | 'Previdenciário' | 'Tributário';
  status: string;
  driveFolderId: string;
  nextDeadline?: string;
  events: ProcessEvent[];
}

export interface ProcessEvent {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface ProcessDeadline {
  id: string;
  processId: string; // ID do processo vinculado (agora obrigatório na criação)
  cnj?: string; 
  title: string; // Assunto
  description: string;
  dueDate: string;
  assignees: string[]; // Lista de IDs de usuários destinatários
  assigneeNames: string[]; // Nomes para display
  status: 'PENDING' | 'DONE' | 'OVERDUE';
}

export interface ClientDocument {
  id: string;
  title: string;
  type: 'CONTRATO' | 'PROCURACAO' | 'PETICAO' | 'OUTROS' | 'IRPF' | 'FISCAL' | 'TRABALHISTA' | 'FINANCEIRO'; 
  date: string;
  url: string;
  visibleToClient: boolean;
  status?: 'VALIDADO' | 'PENDENTE';
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'INTERNAL' | 'CLIENT';
  participants: string[];
  link?: string;
  minutes?: {
    content: string;
    attachment?: string;
  }
}

export interface ClientInvoice {
  id: string;
  clientId: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  asaasUrl?: string; 
}

export interface MeetingRequest {
  id: string;
  clientId: string;
  targetPartnerId?: string; 
  subject: string;
  reason: string;
  preferredDate: string;
  preferredTime: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface TaxGuide {
  id: string;
  clientId: string;
  type: 'DARF' | 'DAS' | 'GPS' | 'ISS' | 'FGTS' | 'FOLHA' | 'HONORARIOS' | 'OUTROS';
  description: string;
  value: number;
  dueDate: string;
  status: 'PENDENTE' | 'ENVIADO' | 'PAGO';
  fileUrl?: string;
}

export interface IrpfRequest {
  id: string;
  clientId: string;
  year: number;
  status: 'RECEBIDO' | 'EM_ANALISE' | 'CONCLUIDO';
  requestDate: string;
  finalDocumentUrl?: string;
}

// --- NOVOS TIPOS PARA NOVAS FUNCIONALIDADES ---

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'EBOOK' | 'VIDEO' | 'MATERIAL' | 'SEGURO';
  imageUrl?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSystem?: boolean; // Para mensagens automáticas
}

export interface HoldingData {
  clientId: string;
  assetsValueBrl: number;
  assetsValueUsd: number; // Será calculado
  investments: { type: string; value: number }[];
  dreUrl: string;
}

export interface HearingRequest {
  id: string;
  processId: string;
  requesterId: string; // Colaborador que pediu
  audiencistaId?: string; // Quem aceitou ou foi designado
  date: string;
  time: string;
  location: string;
  mode: 'PRESENCIAL' | 'VIRTUAL';
  type: 'INSTRUCAO' | 'CONCILIACAO' | 'INICIAL';
  value: number; // Valor a ser pago
  status: 'SOLICITADA' | 'AGENDADA' | 'CONCLUIDA' | 'CANCELADA';
  minutesUrl?: string; // Ata de audiencia
  returnForm?: {
    summary: string;
    outcome: string;
  };
}
