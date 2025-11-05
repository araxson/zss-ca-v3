'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface NavUserAvatarProps {
  avatar?: string
  name: string
  initials: string
}

export function NavUserAvatar({ avatar, name, initials }: NavUserAvatarProps) {
  return (
    <Avatar className="size-8 rounded-lg">
      {avatar && <AvatarImage src={avatar} alt={name} />}
      <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
    </Avatar>
  )
}
