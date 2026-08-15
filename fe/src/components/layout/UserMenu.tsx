import { Link } from "@tanstack/react-router"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type UserMenuProps = {
  name?: string
  email?: string
  avatarUrl?: string | null
  onSignOut?: () => void
  className?: string
}

function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export const UserMenu = ({
  name = "Olena Kovalenko",
  email = "olena@example.com",
  avatarUrl,
  onSignOut,
  className,
}: UserMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "rounded-full outline-none",
          "focus-visible:ring-[3px] focus-visible:ring-ring/35",
          className
        )}
      >
        <Avatar size="default" className="size-9 md:size-8">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
          <AvatarFallback className="bg-secondary font-sans text-btn font-semibold text-foreground">
            {initialsFromName(name) || "?"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-[200px]">
        <DropdownMenuLabel className="px-3.5 py-3 font-normal text-foreground">
          <span className="block font-sans text-btn font-semibold text-foreground">
            {name}
          </span>
          <span className="mt-0.5 block font-sans text-[12px] leading-[18px] font-normal text-subtle">
            {email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link to="/my-cookbook" />}>
          My Cookbook
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link to="/profile" />}>
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={onSignOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
