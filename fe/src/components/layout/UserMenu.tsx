import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import defaultAvatar from '@/assets/icons/avatar.png'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  onSignOut,
  className,
}: UserMenuProps) => {
  const { t } = useTranslation()

  const name = user ? getUserDisplayName(user) || user.email : ''
  const initials = user ? getUserInitials(user) : ''
  const avatarUrl = user ? resolveMediaUrl(user.image) : null

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
    <DropdownMenu>
      <DropdownMenuTrigger
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
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-[200px]">
        <DropdownMenuLabel className="px-3.5 py-3 font-normal text-foreground">
          <span className="block font-sans text-btn font-semibold text-foreground">
            {name}
          </span>
          <span className="mt-0.5 block font-sans text-[12px] leading-[18px] font-normal text-subtle">
            {user.email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link to={Routes.MY_COOKBOOK} />}>
          {t('nav.myCookbook')}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link to={Routes.PROFILE} />}>
          {t('profile')}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={onSignOut}>
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
