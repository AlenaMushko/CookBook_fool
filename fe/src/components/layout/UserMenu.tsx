import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import defaultAvatar from '@/assets/icons/avatar.png'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Routes } from '@constants/routes'
import type { Profile } from '@/features/profile/types/profile.types'
import { resolveMediaUrl } from '@/lib/media-url'
import { getUserDisplayName, getUserInitials } from '@/lib/user-display'
import { cn } from '@/lib/utils'

type UserMenuProps = {
  user: Profile | null
  isLoading?: boolean
  onSignOut?: () => void
  className?: string
}

function UserAvatarTrigger({
  label,
  initials,
  avatarUrl,
  isLoading,
  className,
}: {
  label: string
  initials: string
  avatarUrl?: string | null
  isLoading?: boolean
  className?: string
}) {
  const imageSrc = avatarUrl || (!isLoading && !initials ? defaultAvatar : null)

  return (
    <Avatar size="default" className={cn('size-9 md:size-8', className)}>
      {imageSrc ? <AvatarImage src={imageSrc} alt={label || 'User'} /> : null}
      <AvatarFallback className="bg-secondary font-sans text-btn font-semibold text-foreground">
        {isLoading ? '…' : initials}
      </AvatarFallback>
    </Avatar>
  )
}

export const UserMenu = ({
  user,
  isLoading = false,
  className,
}: UserMenuProps) => {
  const { t } = useTranslation()

  const name = user ? getUserDisplayName(user) || user.email : ''
  const initials = user ? getUserInitials(user) : ''
  const avatarUrl = user
    ? resolveMediaUrl(user.image, user.imageUrl)
    : null

  if (!user) {
    return (
      <UserAvatarTrigger
        label=""
        initials=""
        isLoading={isLoading}
        className={className}
      />
    )
  }

  return (
    <Link
      to={Routes.PROFILE}
      aria-label={t('profile')}
      className={cn(
        'rounded-full outline-none',
        'focus-visible:ring-[3px] focus-visible:ring-ring/35',
        className,
      )}
    >
      <UserAvatarTrigger
        label={name}
        initials={initials}
        avatarUrl={avatarUrl}
      />
    </Link>
  )
}
