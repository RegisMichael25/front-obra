import type { Obra, EstoqueItem, Transacao, PerfilUsuario } from '../types'

export const initialPerfil: PerfilUsuario = {
  nome: 'Gabriel Silva',
  cargo: 'Engenheiro Civil & Gestor',
  empresa: 'Gabriel Construções Ltda',
  iniciais: 'GS'
}

export const initialObras: Obra[] = [
  {
    id: '1',
    nome: 'Residencial Villa Verde',
    endereco: 'Av. das Flores, 450 - São Paulo, SP',
    progresso: 68,
    orcamentoTotal: 1250000,
    orcamentoGasto: 850000,
    dataInicio: '15/01/2025',
    dataFim: '20/12/2026',
    status: 'Andamento',
    responsavel: 'Eng. Marcos Silva'
  },
  {
    id: '2',
    nome: 'Edifício Belle Vue',
    endereco: 'Rua Bela Cintra, 1020 - São Paulo, SP',
    progresso: 35,
    orcamentoTotal: 3800000,
    orcamentoGasto: 1330000,
    dataInicio: '10/06/2025',
    dataFim: '15/08/2027',
    status: 'Andamento',
    responsavel: 'Engª. Sofia Costa'
  },
  {
    id: '3',
    nome: 'Galpão Logístico Express',
    endereco: 'Rodovia Anhanguera, Km 42 - Jundiaí, SP',
    progresso: 100,
    orcamentoTotal: 2200000,
    orcamentoGasto: 2150000,
    dataInicio: '03/02/2024',
    dataFim: '30/04/2026',
    status: 'Concluido',
    responsavel: 'Eng. Roberto Azevedo'
  },
  {
    id: '4',
    nome: 'Reforma Clínica Vanguarda',
    endereco: 'Av. Paulista, 1500 - São Paulo, SP',
    progresso: 12,
    orcamentoTotal: 450000,
    orcamentoGasto: 35000,
    dataInicio: '01/05/2026',
    dataFim: '15/10/2026',
    status: 'Planejamento',
    responsavel: 'Engª. Sofia Costa'
  }
]

export const initialEstoque: EstoqueItem[] = [
  { id: '1', item: 'Cimento CP II Votoran', quantidade: 280, unidade: 'sacos', estoqueMinimo: 100, categoria: 'Básico', status: 'Adequado' },
  { id: '2', item: 'Aço CA-50 10.0mm', quantidade: 45, unidade: 'barras', estoqueMinimo: 80, categoria: 'Estrutura', status: 'Crítico' },
  { id: '3', item: 'Areia Lavada Média', quantidade: 18, unidade: 'm³', estoqueMinimo: 10, categoria: 'Básico', status: 'Adequado' },
  { id: '4', item: 'Tijolo Cerâmico 8 Furos', quantidade: 0, unidade: 'milheiros', estoqueMinimo: 5, categoria: 'Básico', status: 'Esgotado' },
  { id: '5', item: 'Tinta Acrílica Premium Branca', quantidade: 32, unidade: 'galões', estoqueMinimo: 15, categoria: 'Acabamento', status: 'Adequado' },
  { id: '6', item: 'Argamassa AC-III 20kg', quantidade: 140, unidade: 'sacos', estoqueMinimo: 50, categoria: 'Acabamento', status: 'Adequado' }
]

export const initialTransacoes: Transacao[] = [
  { id: 't1', descricao: 'Compra de 100 sacos de cimento', obraNome: 'Residencial Villa Verde', valor: 3200, tipo: 'Despesa', categoria: 'Material', data: '28/05/2026', status: 'Pago' },
  { id: 't2', descricao: 'Medição de Mão de Obra Alvenaria', obraNome: 'Edifício Belle Vue', valor: 45000, tipo: 'Despesa', categoria: 'Mão de Obra', data: '26/05/2026', status: 'Pago' },
  { id: 't3', descricao: 'Locação de Betoneira Mensal', obraNome: 'Residencial Villa Verde', valor: 1800, tipo: 'Despesa', categoria: 'Equipamentos', data: '25/05/2026', status: 'Pago' },
  { id: 't4', descricao: 'Aporte de Investidor Bloco A', obraNome: 'Edifício Belle Vue', valor: 150000, tipo: 'Receita', categoria: 'Administrativo', data: '22/05/2026', status: 'Pago' },
  { id: 't5', descricao: 'Compra de ferragens estruturais', obraNome: 'Reforma Clínica Vanguarda', valor: 12400, tipo: 'Despesa', categoria: 'Material', data: '20/05/2026', status: 'Pendente' },
  { id: 't6', descricao: 'Taxa de Alvará Prefeitura', obraNome: 'Reforma Clínica Vanguarda', valor: 4800, tipo: 'Despesa', categoria: 'Administrativo', data: '18/05/2026', status: 'Pago' }
]


