import { useTranslation } from 'react-i18next'

import { ProfileForm } from '@features/profile/components/ProfileForm'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export const ProfilePage = () => {
  const { t } = useTranslation()
  const { user, isLoading, isError, refetch } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 text-body text-muted-foreground">
        {t('profilePage.loading')}
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-10">
        <p className="text-body text-muted-foreground">
          {t('profilePage.loadError')}
        </p>
        <button
          type="button"
          className="text-body font-medium text-brand underline-offset-4 hover:underline"
          onClick={() => void refetch()}
        >
          {t('user.tryAgain')}
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 py-8 md:py-12">
      <ProfileForm key={user.id} profile={user} />
    </div>
  )
}
