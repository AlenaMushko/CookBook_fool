import { ApiRoutes } from '@api/apiRoutes'
import { apiJson } from '@api/client'

export const feedbackApi = {
  send(message: string) {
    return apiJson<void>(ApiRoutes.feedback, {
      method: 'POST',
      body: JSON.stringify({ message }),
    })
  },
}
