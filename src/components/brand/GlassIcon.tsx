import Image from 'next/image'
import glass from '../../../public/brand/glass.webp'

type Props = { className?: string; float?: boolean; priority?: boolean; sizes?: string }

/** The 3D glass rendering of the mark (hero, 404). Decorative. */
export function GlassIcon({ className, float = false, priority = false, sizes = '(min-width: 1024px) 560px, 80vw' }: Props) {
  return (
    <div className={className}>
      <Image
        src={glass}
        alt=""
        priority={priority}
        sizes={sizes}
        className={`h-auto w-full select-none ${float ? 'animate-float' : ''}`}
        draggable={false}
      />
    </div>
  )
}
