export interface Obra {
  id: number
  idStatusObra?: number
  nomeStatusObra?: string
  idResponsavel?: number
  chaveResponsavel?: string
  nomeResponsavel?: string
  codigo?: string
  nome: string
  descricao?: string
  dataInicio?: string
  dataFim?: string
  // Endereço (ViaCEP)
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  localidade?: string
  uf?: string
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

export interface Fornecedor {
  id: number
  idsObras?: number[]
  codigo: string
  nome: string
  telefone?: string
  ativo: boolean
}

export interface CategoriaMaterial {
  id: number
  codigo: string
  nome: string
}

export interface Material {
  id: number
  codigo: string
  nome: string
  idCategoria: number
  nomeCategoria?: string
  idFornecedor: number
  nomeFornecedor?: string
  idsObras?: number[]
}
