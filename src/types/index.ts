export interface Obra {
  id: string
  nome: string
  endereco: string
  progresso: number
  orcamentoTotal: number
  orcamentoGasto: number
  dataInicio: string
  dataFim: string
  status: 'Andamento' | 'Planejamento' | 'Concluido'
  responsavel: string
}

export interface EstoqueItem {
  id: string
  item: string
  quantidade: number
  unidade: string
  estoqueMinimo: number
  categoria: 'Básico' | 'Estrutura' | 'Acabamento'
  status: 'Adequado' | 'Crítico' | 'Esgotado'
}

export interface Transacao {
  id: string
  descricao: string
  obraNome: string
  valor: number
  tipo: 'Despesa' | 'Receita'
  categoria: 'Material' | 'Mão de Obra' | 'Equipamentos' | 'Administrativo'
  data: string
  status: 'Pago' | 'Pendente'
}

export interface PerfilUsuario {
  nome: string
  cargo: string
  empresa: string
  iniciais: string
}

