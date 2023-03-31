import { CardOverlayIcon } from './CardOverlayIcon'
interface TutorialCardProps {
  children: React.ReactNode
}
export const TutorialCard = ({ children }: TutorialCardProps) => {
  return (
    <>
      <div className="flex h-fit w-3/4 flex-col gap-4 rounded-lg border-[4px] border-slate-400 bg-gray-50 p-6 drop-shadow-lg">
        <span className="absolute -top-10 -right-10">
          <CardOverlayIcon src="/images/sam.png" alt="sam" />
        </span>
        {children}
      </div>
    </>
  )
}
