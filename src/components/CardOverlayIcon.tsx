import Image from 'next/image'
import {
  BiHomeAlt,
  BiDetail,
  BiDollarCircle,
  BiSortAlt2,
  BiMoneyWithdraw,
} from 'react-icons/bi'

interface CardOverlayIconProps {
  src?: string | undefined
  alt?: string
  size?: string
  icon?: string
}

export const CardOverlayIcon = ({
  src,
  alt,
  size,
  icon,
}: CardOverlayIconProps) => {
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 'h-8 w-8'
      case 'medium':
        return 'h-16 w-16'
      case 'large':
        return 'h-[104px] w-[104px]'
      default:
        return 'h-[104px] w-[104px]'
    }
  }

  return (
    <>
      <span
        className={`p-30 flex ${getIconSize()} items-center justify-center rounded-full bg-teal-400 text-slate-900 ring-8 ring-teal-400`}
      >
        {src && <Image src={src} alt={alt || ''} fill />}
        {icon && (
          <span>
            {icon === 'home' && <BiHomeAlt className="h-6 w-6" />}
            {icon === 'loan' && <BiDetail className="h-6 w-6" />}
            {icon === 'closing' && <BiMoneyWithdraw className="h-6 w-6" />}
            {icon === 'income' && <BiDollarCircle className="h-6 w-6" />}
          </span>
        )}
      </span>
    </>
  )
}
