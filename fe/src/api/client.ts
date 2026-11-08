import { CONFIG } from '@config'
import { ApiRoutes } from '@api/apiRoutes'
import i18n from '@/i18n'
import { clearAuthSessionCookie, hasAuthSession } from '@/lib/auth-session'
import { sessionEpoch, trackRequest } from '@/lib/inflight'
import { alignSessionWithCookie, clearSessionUser } from '@/lib/session-user'

type ApiErrorBody = {
  message?: string | string[]
  errorCode?: string
  code?: string
}

export class ApiError extends Error {
  status: number
  code?: string

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

function parseErrorMessage(data: ApiErrorBody | null, fallback: string) {
  if (!data) return fallback
  if (Array.isArray(data.message)) return data.message.join(', ')
  if (data.message) return data.message
  return fallback
}

async function readError(response: Response): Promise<ApiError> {
  let body: ApiErrorBody | null = null
  try {
    body = (await response.json()) as ApiErrorBody
  } catch {
    // ignore
  }
  if (response.status === 429) {
    return new ApiError(
      429,
      i18n.t('error.rateLimited', {
        defaultValue: 'Too many requests. Wait a minute and try again',
      }),
      body?.code ?? 'RATE_LIMITED',
    )
  }

  return new ApiError(
    response.status,
    parseErrorMessage(body, 'Request failed'),
    body?.code ?? body?.errorCode,
  )
}

let refreshPromise: Promise<boolean> | null = null
let refreshEpoch = -1

async function refreshSession(epoch: number): Promise<boolean> {
  if (refreshPromise && refreshEpoch === epoch) return refreshPromise

  refreshEpoch = epoch
  const promise = (async () => {
    const controller = new AbortController()
    const release = trackRequest(controller)
    try {
      const response = await fetch(`${CONFIG.API_URL}${ApiRoutes.auth.refresh}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
        signal: controller.signal,
      })
      if (sessionEpoch() !== epoch) return false
      return response.ok
    } catch {
      return false
    } finally {
      release()
    }
  })()

  refreshPromise = promise
  void promise.finally(() => {
    if (refreshPromise === promise) refreshPromise = null
  })

  return promise
}

function sessionChanged(epoch: number): boolean {
  return sessionEpoch() !== epoch
}

type ApiFetchOptions = RequestInit & {
  skipAuthRefresh?: boolean
}

export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {},
): Promise<Response> {
  const { skipAuthRefresh = false, ...init } = options
  alignSessionWithCookie()
  const epoch = sessionEpoch()
  const controller = new AbortController()
  const release = trackRequest(controller)

  try {
    const response = await fetch(`${CONFIG.API_URL}${path}`, {
      ...init,
      credentials: 'include',
      headers: buildHeaders(init),
      signal: controller.signal,
    })

    if (sessionChanged(epoch)) {
      throw new DOMException('Account changed', 'AbortError')
    }

    if (response.status !== 401 || skipAuthRefresh) {
      return response
    }

    const refreshed = await refreshSession(epoch)
    if (sessionChanged(epoch)) {
      throw new DOMException('Account changed', 'AbortError')
    }
    if (!refreshed) {
      const hadSession = hasAuthSession()
      clearAuthSessionCookie()
      clearSessionUser()
      if (hadSession) window.location.assign('/')
      return response
    }

    if (sessionChanged(epoch)) {
      throw new DOMException('Account changed', 'AbortError')
    }

    const retried = await fetch(`${CONFIG.API_URL}${path}`, {
      ...init,
      credentials: 'include',
      headers: buildHeaders(init),
      signal: controller.signal,
    })
    if (sessionChanged(epoch)) {
      throw new DOMException('Account changed', 'AbortError')
    }
    return retried
  } finally {
    release()
  }
}

function buildHeaders(init: RequestInit): HeadersInit {
  const isFormData =
    typeof FormData !== 'undefined' && init.body instanceof FormData

  return {
    ...(!isFormData && init.body ? { 'Content-Type': 'application/json' } : {}),
    ...init.headers,
  }
}

export async function apiJson<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const response = await apiFetch(path, options)

  if (!response.ok) {
    throw await readError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}
