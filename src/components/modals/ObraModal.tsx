import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, HardHat, MapPin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import type { Obra } from '../../types'
import { api } from '../../services/api'

interface ObraModalProps {
  obraToEdit?: Obra | null
  onClose: () => void
  onSave: (obra: Partial<Obra>) => void
}

interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

type CepStatus = 'idle' | 'loading' | 'success' | 'error'

export function ObraModal({ obraToEdit, onClose, onSave }: ObraModalProps) {
  // Dados da obra
  const [nome, setNome] = useState(obraToEdit?.nome || '')
  const [codigo, setCodigo] = useState(obraToEdit?.codigo || '')
  const [descricao, setDescricao] = useState(obraToEdit?.descricao || '')
  const [dataInicio, setDataInicio] = useState(obraToEdit?.dataInicio ? obraToEdit.dataInicio.split('T')[0] : '')
  const [dataFim, setDataFim] = useState(obraToEdit?.dataFim ? obraToEdit.dataFim.split('T')[0] : '')
  const [idStatusObra, setIdStatusObra] = useState<number | ''>(obraToEdit?.idStatusObra || '')
  const [idResponsavel, setIdResponsavel] = useState<number | ''>(obraToEdit?.idResponsavel || '')

  // Endereço
  const [cep, setCep] = useState(obraToEdit?.cep || '')
  const [logradouro, setLogradouro] = useState(obraToEdit?.logradouro || '')
  const [numero, setNumero] = useState(obraToEdit?.numero || '')
  const [complemento, setComplemento] = useState(obraToEdit?.complemento || '')
  const [bairro, setBairro] = useState(obraToEdit?.bairro || '')
  const [localidade, setLocalidade] = useState(obraToEdit?.localidade || '')
  const [uf, setUf] = useState(obraToEdit?.uf || '')
  const [cepStatus, setCepStatus] = useState<CepStatus>('idle')

  const [statusOptions, setStatusOptions] = useState<any[]>([])
  const [mestreOptions, setMestreOptions] = useState<any[]>([])
  const numeroRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    api.get<any[]>('/obra/status')
      .then(res => {
        setStatusOptions(res)
        if (res.length > 0 && !obraToEdit) setIdStatusObra(res[0].id)
      })
      .catch(() => {})

    api.get<any[]>('/obra/mestres')
      .then(res => {
        setMestreOptions(res)
      })
      .catch(() => {})
  }, [])

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8)
    return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value)
    setCep(formatted)
    if (formatted.replace(/\D/g, '').length === 8) {
      fetchCep(formatted)
    } else {
      setCepStatus('idle')
    }
  }

  const fetchCep = async (rawCep: string) => {
    const digits = rawCep.replace(/\D/g, '')
    if (digits.length !== 8) return
    setCepStatus('loading')
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data: ViaCepResponse = await res.json()
      if (data.erro) {
        setCepStatus('error')
        setLogradouro(''); setBairro(''); setLocalidade(''); setUf(''); setComplemento('')
      } else {
        setLogradouro(data.logradouro || '')
        setBairro(data.bairro || '')
        setLocalidade(data.localidade || '')
        setUf(data.uf || '')
        setComplemento(data.complemento || '')
        setCepStatus('success')
        setTimeout(() => numeroRef.current?.focus(), 50)
      }
    } catch {
      setCepStatus('error')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: obraToEdit?.id,
      nome,
      codigo,
      descricao,
      dataInicio: dataInicio ? new Date(dataInicio).toISOString() : undefined,
      dataFim: dataFim ? new Date(dataFim).toISOString() : undefined,
      idStatusObra: Number(idStatusObra),
      idResponsavel: idResponsavel ? Number(idResponsavel) : undefined,
      cep: cep || undefined,
      logradouro: logradouro || undefined,
      numero: numero || undefined,
      complemento: complemento || undefined,
      bairro: bairro || undefined,
      localidade: localidade || undefined,
      uf: uf || undefined,
    })
  }

  const inputClass = "w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100 transition-colors"
  const labelClass = "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 tracking-wide"

  return createPortal(
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm overflow-y-auto flex items-start justify-center p-4 pt-8">
      <div className="bg-white dark:bg-brand-card-dark border border-brand-border-light dark:border-brand-border-dark rounded-2xl w-full max-w-lg shadow-2xl p-6 mb-8 animate-scaleIn">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-brand-border-light dark:border-brand-border-dark">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HardHat className="text-brand-green" size={18} /> {obraToEdit ? 'Editar Obra' : 'Cadastrar Nova Obra'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* --- Dados da Obra --- */}
          <div>
            <label className={labelClass}>Nome do Projeto *</label>
            <input type="text" required value={nome} onChange={e => setNome(e.target.value)} className={inputClass} placeholder="Ex: Residencial Jardim das Palmeiras" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Código da Obra *</label>
              <input type="text" required value={codigo} onChange={e => setCodigo(e.target.value)} className={inputClass} placeholder="Ex: OBR-002" />
            </div>
            <div>
              <label className={labelClass}>Status da Obra *</label>
              <select required value={idStatusObra} onChange={e => setIdStatusObra(Number(e.target.value))} className={inputClass}>
                <option value="" disabled>Selecione...</option>
                {statusOptions.map(st => (
                  <option key={st.id} value={st.id}>{st.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Mestre de Obras Responsável *</label>
            <select required value={idResponsavel} onChange={e => setIdResponsavel(Number(e.target.value))} className={inputClass}>
              <option value="" disabled>Selecione o mestre de obras...</option>
              {mestreOptions.map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Descrição</label>
            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} rows={2} className={inputClass} placeholder="Descrição resumida da obra..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Data Início</label>
              <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Data Fim</label>
              <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* --- Divider Endereço --- */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex-1 h-px bg-brand-border-light dark:bg-brand-border-dark" />
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <MapPin size={12} className="text-brand-green" /> Endereço da Obra
            </span>
            <div className="flex-1 h-px bg-brand-border-light dark:bg-brand-border-dark" />
          </div>

          {/* CEP com busca ViaCEP */}
          <div>
            <label className={labelClass}>CEP</label>
            <div className="relative">
              <input
                type="text"
                value={cep}
                onChange={handleCepChange}
                placeholder="00000-000"
                maxLength={9}
                className={`${inputClass} pr-10`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {cepStatus === 'loading' && <Loader2 size={15} className="text-brand-green animate-spin" />}
                {cepStatus === 'success' && <CheckCircle2 size={15} className="text-emerald-500" />}
                {cepStatus === 'error' && <AlertCircle size={15} className="text-red-400" />}
              </div>
            </div>
            {cepStatus === 'error' && (
              <p className="text-xs text-red-400 mt-1">CEP não encontrado. Preencha o endereço manualmente.</p>
            )}
            {cepStatus === 'success' && (
              <p className="text-xs text-emerald-500 mt-1">Endereço preenchido automaticamente.</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>Logradouro</label>
              <input type="text" value={logradouro} onChange={e => setLogradouro(e.target.value)} className={inputClass} placeholder="Rua / Av." />
            </div>
            <div>
              <label className={labelClass}>Número</label>
              <input ref={numeroRef} type="text" value={numero} onChange={e => setNumero(e.target.value)} className={inputClass} placeholder="Ex: 100" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Complemento</label>
              <input type="text" value={complemento} onChange={e => setComplemento(e.target.value)} className={inputClass} placeholder="Apto, Bloco..." />
            </div>
            <div>
              <label className={labelClass}>Bairro</label>
              <input type="text" value={bairro} onChange={e => setBairro(e.target.value)} className={inputClass} placeholder="Bairro" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>Cidade</label>
              <input type="text" value={localidade} onChange={e => setLocalidade(e.target.value)} className={inputClass} placeholder="Cidade" />
            </div>
            <div>
              <label className={labelClass}>UF</label>
              <input type="text" value={uf} onChange={e => setUf(e.target.value)} maxLength={2} className={inputClass} placeholder="SP" />
            </div>
          </div>

          {/* --- Ações --- */}
          <div className="flex gap-3 pt-4 border-t border-brand-border-light dark:border-brand-border-dark justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:opacity-90 rounded-xl text-xs font-bold cursor-pointer transition-opacity"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-green hover:bg-brand-green-hover text-brand-green-dark font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-brand-green/10 transition-colors"
            >
              Salvar Obra
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
