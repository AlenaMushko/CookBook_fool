import { useEffect, useState, type ImgHTMLAttributes } from 'react'

import recipePlaceholder from '@/assets/images/recipe.webp'
import { cn } from '@/lib/utils'

type RecipeImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  src?: string | null
  alt?: string
}

export const RecipeImage = ({
  src,
  alt = '',
  className,
  onError,
  ...props
}: RecipeImageProps) => {
  const [failed, setFailed] = useState(!src)

  useEffect(() => {
    setFailed(!src)
  }, [src])

  const placeholder = !src || failed

  return (
    <img
      {...props}
      src={placeholder ? recipePlaceholder : src}
      alt={alt}
      className={cn(className, placeholder && 'bg-background object-contain')}
      onError={(event) => {
        onError?.(event)
        if (!placeholder) setFailed(true)
      }}
    />
  )
}
