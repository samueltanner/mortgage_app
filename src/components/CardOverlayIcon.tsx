import Image from 'next/image'

interface CardOverlayIconProps {
  src: string
  alt: string
}

export const CardOverlayIcon = ({ src, alt }: CardOverlayIconProps) => {
  return (
    <>
      {src && (
        <span className="p-30 flex h-[104px] w-[104px] items-center justify-center rounded-full bg-gray-50 ring-8 ring-teal-400  ">
          <Image src={src} alt={alt} fill />
        </span>
      )}
    </>
  )
}
