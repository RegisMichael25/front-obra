export interface Obra {
  id: number
  idStatusObra?: number
  nomeStatusObra?: string
  idResponsavel?: number
  chaveResponsavel?: string
  codigo?: string
  nome: string
  descricao?: string
  dataInicio?: string
  dataFim?: string
}

export interface EstoqueItem {
  id: number
  idObra: number
  nomeObra?: string
  idMaterial: number
  nomeMaterial: string
  idFornecedor?: number
  nomeFornecedor?: string
  quantidadeAtual: number
  quantidadeMinima: number
}

export interface PerfilUsuario {
  id?: number
  chave?: string
  nome: string
  cargo: string
  empresa: string
  iniciais: string
}
