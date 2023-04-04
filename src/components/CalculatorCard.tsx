interface CalculatorCardProps {
  children: React.ReactNode
  onClick?: () => void
}

export const CalculatorCard = ({ children, onClick }: CalculatorCardProps) => {
  return (
    <div
      className="flex h-fit w-full flex-col rounded-lg border-[4px] border-slate-400 bg-gray-50 p-4 drop-shadow-lg"
      onClick={onClick}
    >
      {children}
    </div>
  )
}
