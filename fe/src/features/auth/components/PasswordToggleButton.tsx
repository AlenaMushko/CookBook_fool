import { Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { InputGroupButton } from '@components/ui/input-group'

type PasswordToggleButtonProps = {
  visible: boolean
  onToggle: () => void
}

export const PasswordToggleButton = ({
  visible,
  onToggle,
}: PasswordToggleButtonProps) => {
  const { t } = useTranslation()

  return (
    <InputGroupButton
      type="button"
      variant="ghost"
      size="icon-xs"
      aria-label={
        visible ? t('auth.login.hidePassword') : t('auth.login.showPassword')
      }
      aria-pressed={visible}
      onClick={onToggle}
    >
      {visible ? (
        <EyeOff aria-hidden="true" className="size-4" strokeWidth={1.8} />
      ) : (
        <Eye aria-hidden="true" className="size-4" strokeWidth={1.8} />
      )}
    </InputGroupButton>
  )
}
