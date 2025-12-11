
import { User, UserRole, NewsItem, LegalNews, FinancialRecord, Process, ClientDocument, Client, Meeting, ClientInvoice, ProcessDeadline, TaxGuide, IrpfRequest, Product, ServiceItem, HearingRequest } from '../types';

// --- MOCK USERS ---
export const MOCK_USERS: User[] = [
  { id: '1', name: 'Gustavo Mosinho', email: 'gustavomosinho@alcidesemosinho.com', role: UserRole.PARTNER },
  { id: '2', name: 'Matheus Mosinho', email: 'matheusmosinho@alcidesemosinho.com', role: UserRole.PARTNER },
  { id: '3', name: 'Vitor Mosinho', email: 'vitormosinho@alcidesemosinho.com', role: UserRole.PARTNER },
  { id: '4', name: 'Alex Borchevski', email: 'alexborchevski@alcidesemosinho.com', role: UserRole.PARTNER },
  { id: '5', name: 'Bianca Porto', email: 'biancaporto@alcidesemosinho.com', role: UserRole.LAWYER },
  { id: '6', name: 'Larissa Bittencourt', email: 'larissabitencourt@alcidesemosinho.com', role: UserRole.LAWYER },
  { id: '7', name: 'Rodrigo Bafica', email: 'rodrigobafica@alcidesemosinho.com', role: UserRole.LAWYER },
  { id: '8', name: 'Financeiro', email: 'financeiro@alcidesemosinho.com', role: UserRole.FINANCE },
  { id: '9', name: 'Secretaria', email: 'secretaria@alcidesemosinho.com', role: UserRole.SECRETARY },
  { id: '10', name: 'João Cliente', email: 'cliente@gmail.com', role: UserRole.CLIENT },
  { id: '11', name: 'Dr. Parceiro Externo', email: 'parceiro@externo.com', role: UserRole.EXTERNAL_PARTNER },
  { id: '12', name: 'Setor Contábil', email: 'contabil@alcidesemosinho.com', role: UserRole.ACCOUNTING },
  // Novo Usuário Audiencista
  { id: '13', name: 'Dr. João Audiencista', email: 'audiencia@adv.com', role: UserRole.HEARING_LAWYER, oab: '123456', ufOab: 'RJ', whatsapp: '21988887777' },
];

// --- MOCK CLIENTS ---
export const MOCK_CLIENTS: Client[] = [
  {
    id: '10',
    type: 'PF',
    name: 'João Cliente',
    document: '123.456.789-00',
    email: 'cliente@gmail.com',
    phone: '(21) 99999-9999',
    address: 'Rua das Flores, 123, Centro - RJ',
    rg: '12.345.678-9',
    birthDate: '1985-05-20',
    status: 'ATIVO',
    partnerId: '11'
  },
  {
    id: '99',
    type: 'PJ',
    name: 'Construtora XYZ Ltda',
    document: '12.345.678/0001-99',
    email: 'contato@construtoraxyz.com.br',
    phone: '(21) 3333-4444',
    address: 'Av. das Américas, 5000, Barra - RJ',
    representative: 'Carlos Construtor',
    status: 'ATIVO'
  }
];

// --- MOCK MEETINGS ---
export const MOCK_MEETINGS: Meeting[] = [
  {
    id: 'm1',
    title: 'Reunião de Sócios',
    date: '2024-05-25',
    time: '14:00',
    type: 'INTERNAL',
    participants: ['Gustavo', 'Matheus', 'Vitor'],
    link: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: 'm2',
    title: 'Atendimento: João Cliente',
    date: '2024-05-26',
    time: '10:00',
    type: 'CLIENT',
    participants: ['Bianca', 'João Cliente'],
    link: 'https://meet.google.com/xyz-wdwd-wed'
  },
  {
    id: 'm3',
    title: 'Alinhamento com Parceiro',
    date: '2024-05-27',
    time: '15:00',
    type: 'CLIENT', 
    participants: ['Gustavo', 'Dr. Parceiro Externo'],
    link: 'https://meet.google.com/parceiro-link'
  }
];

// --- MOCK INTERNAL NEWS ---
export const MOCK_INTERNAL_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Nova Política de Honorários',
    summary: 'Atualização na tabela de honorários mínimos para 2024.',
    content: 'Caros colaboradores, a tabela de honorários foi reajustada conforme a OAB/RJ...',
    date: '2024-05-20',
    author: 'Dr. Gustavo Mosinho',
    audience: [UserRole.PARTNER, UserRole.LAWYER, UserRole.FINANCE, UserRole.ACCOUNTING],
    readBy: [],
    mediaType: 'TEXT'
  },
  {
    id: 'n2',
    title: 'Tutorial do Novo Sistema',
    summary: 'Vídeo explicativo sobre o cadastro de processos.',
    content: 'Assistam o vídeo abaixo para entender as mudanças.',
    date: '2024-05-22',
    author: 'TI',
    audience: [UserRole.PARTNER, UserRole.LAWYER, UserRole.ADMIN, UserRole.SECRETARY],
    readBy: [],
    mediaType: 'VIDEO',
    mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' 
  }
];

// --- MOCK LEGAL NEWS ---
export const MOCK_LEGAL_NEWS: LegalNews[] = [
  {
    id: 'ln1',
    tribunal: 'STF',
    title: 'STF valida regime de separação de bens para maiores de 70 anos',
    summary: 'Decisão tem repercussão geral e afeta sucessões e divórcios.',
    date: '2024-05-21',
    url: '#'
  },
  {
    id: 'ln2',
    tribunal: 'STJ',
    title: 'Terceira Turma define competência para julgar dissolução de sociedade',
    summary: 'Entendimento pacifica conflitos entre juízos cíveis e empresariais.',
    date: '2024-05-20',
    url: '#'
  },
  {
    id: 'ln3',
    tribunal: 'TST',
    title: 'Empresa é condenada por exigir certidão de antecedentes criminais',
    summary: 'Prática foi considerada discriminatória pela corte trabalhista.',
    date: '2024-05-19',
    url: '#'
  }
];

// --- MOCK FINANCE ---
export const MOCK_FINANCE: FinancialRecord[] = [
  { id: 'f1', type: 'INCOME', category: 'Honorários', amount: 15000, date: '2024-05-01', description: 'Cliente João Silva - Inicial', status: 'PAID' },
  { id: 'f2', type: 'EXPENSE', category: 'Aluguel', amount: 4500, date: '2024-05-05', description: 'Aluguel Escritório Centro', status: 'PAID' },
  { id: 'f3', type: 'INCOME', category: 'Sucumbência', amount: 8200, date: '2024-05-10', description: 'Proc. 00234-99', status: 'PENDING' },
  { id: 'f4', type: 'EXPENSE', category: 'Software', amount: 1200, date: '2024-05-15', description: 'Licença Sistema Jurídico', status: 'PAID' },
  { id: 'f5', type: 'EXPENSE', category: 'Folha', amount: 25000, date: '2024-05-30', description: 'Pagamento Colaboradores', status: 'PENDING' },
];

// --- MOCK CLIENT INVOICES ---
export const MOCK_CLIENT_INVOICES: ClientInvoice[] = [
  { id: 'inv1', clientId: '10', description: 'Honorários Mensais - 05/2024', amount: 2500.00, dueDate: '2024-05-10', status: 'PENDING' },
  { id: 'inv2', clientId: '10', description: 'Diligência Processual', amount: 350.00, dueDate: '2024-05-15', status: 'PENDING' },
  { id: 'inv3', clientId: '10', description: 'Honorários Iniciais', amount: 5000.00, dueDate: '2024-04-10', status: 'PAID' },
];

// --- MOCK PROCESSES ---
export const MOCK_PROCESSES: Process[] = [
  {
    id: 'p1',
    cnj: '0012345-88.2024.5.01.0001',
    clientName: 'João Cliente',
    clientId: '10',
    type: 'Trabalhista',
    status: 'Aguardando Audiência',
    driveFolderId: 'folder_abc_123',
    nextDeadline: '2024-06-15',
    events: [
      { id: 'e1', date: '2024-01-10', title: 'Distribuição', description: 'Processo distribuído para 1ª VT/RJ' },
      { id: 'e2', date: '2024-02-15', title: 'Notificação', description: 'Reclamada notificada' }
    ]
  },
  {
    id: 'p2',
    cnj: '0098765-11.2023.8.19.0001',
    clientName: 'Construtora XYZ',
    clientId: '99',
    type: 'Cível',
    status: 'Concluso para Sentença',
    driveFolderId: 'folder_xyz_999',
    events: []
  }
];

// --- MOCK DEADLINES ---
export const MOCK_DEADLINES: ProcessDeadline[] = [
  {
    id: 'dl1',
    processId: 'p1',
    cnj: '0012345-88.2024.5.01.0001',
    title: 'Réplica à Contestação',
    description: 'Apresentar réplica referente à defesa da reclamada.',
    dueDate: '2024-06-15',
    assignees: ['5'],
    assigneeNames: ['Bianca Porto'],
    status: 'PENDING'
  }
];

// --- MOCK CLIENT DOCUMENTS ---
export const MOCK_CLIENT_DOCS: ClientDocument[] = [
  { id: 'd1', title: 'Contrato de Honorários', type: 'CONTRATO', date: '2024-01-05', url: '#', visibleToClient: true, status: 'VALIDADO' },
  { id: 'd2', title: 'Procuração Ad Judicia', type: 'PROCURACAO', date: '2024-01-05', url: '#', visibleToClient: true, status: 'VALIDADO' },
  { id: 'd3', title: 'Petição Inicial', type: 'PETICAO', date: '2024-01-10', url: '#', visibleToClient: false, status: 'VALIDADO' },
];

// --- MOCK PARTNER CONTRACTS ---
export const MOCK_PARTNER_CONTRACTS = [
  { id: 'pc1', partnerId: '11', title: 'Contrato de Parceria Jurídica - 2024', date: '2024-01-15', url: '#' }
];

// --- MOCK ACCOUNTING DATA ---
export const MOCK_TAX_GUIDES: TaxGuide[] = [
  { id: 'g1', clientId: '99', type: 'DAS', description: 'Simples Nacional - 05/2024', value: 1250.00, dueDate: '2024-05-20', status: 'PENDENTE' },
  { id: 'g2', clientId: '99', type: 'FGTS', description: 'FGTS Folha 04/2024', value: 890.00, dueDate: '2024-05-07', status: 'PAGO' },
  { id: 'g3', clientId: '10', type: 'DARF', description: 'Carnê Leão', value: 150.00, dueDate: '2024-05-30', status: 'ENVIADO' },
];

export const MOCK_IRPF_REQUESTS: IrpfRequest[] = [
  { id: 'ir1', clientId: '10', year: 2024, status: 'EM_ANALISE', requestDate: '2024-03-15' },
];

// --- PRODUCTS ---
export const MOCK_PRODUCTS: Product[] = [
  { id: 'prod1', type: 'EBOOK', title: 'Guia de Proteção Patrimonial', description: 'Aprenda como blindar seu patrimônio.', price: 97.00 },
  { id: 'prod2', type: 'VIDEO', title: 'Curso de Holding Familiar', description: 'Aulas completas sobre constituição de holding.', price: 497.00 },
  { id: 'prod3', type: 'SEGURO', title: 'Seguro de Responsabilidade Civil', description: 'Proteção para profissionais liberais.', price: 1500.00 },
];

// --- SERVICES ---
export const MOCK_SERVICES: ServiceItem[] = [
  { id: 's1', name: 'Direito Tributário', description: 'Defesa em execuções e planejamento tributário.' },
  { id: 's2', name: 'Holding Familiar', description: 'Planejamento sucessório e proteção de bens.' },
  { id: 's3', name: 'Compliance Empresarial', description: 'Adequação legal para sua empresa.' },
  { id: 's4', name: 'Recuperação de Crédito Tributário', description: 'Análise de impostos pagos a maior.' },
  { id: 's5', name: 'Revisão de Contrato Bancário', description: 'Reduza juros abusivos de financiamentos.' },
  { id: 's6', name: 'Perícia Grafotécnica', description: 'Análise de autenticidade de assinaturas.' },
  { id: 's7', name: 'Audiencista', description: 'Advogado correspondente para audiências.' },
  { id: 's8', name: 'Investimento', description: 'Fale com um parceiro especializado.' },
];

export const getFinancialSummary = () => {
  const income = MOCK_FINANCE.filter(f => f.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
  const expense = MOCK_FINANCE.filter(f => f.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);
  return { income, expense, balance: income - expense };
};
