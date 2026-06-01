import { CheckCircle2 } from 'lucide-react'

interface ToastProps {
  message: string
}

export function Toast({ message }: ToastProps) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-brand-green text-brand-green-dark font-medium px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 border border-brand-green-hover animate-bounce">
      <CheckCircle2 size={18} />
      <span>{message}</span>
    </div>
  )
}

