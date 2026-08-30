import { useAuthSession } from '@/hooks/useAuthSession'
import { cn } from '@/lib/utils'

export const Footer = () => {
  const { isAuthenticated } = useAuthSession()
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={cn(
        'border-t-[0.75px] border-secondary-border bg-card px-7 py-5 text-center ',
        isAuthenticated && 'hidden md:block',
      )}
    >
      <p className="type-caption text-accent-foreground">
        © {currentYear} Cookbook. All rights reserved.
      </p>
    </footer>
  )
}
