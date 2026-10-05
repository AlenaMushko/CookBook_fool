import { CONFIG } from '@config'
import { ApiRoutes } from '@api/apiRoutes'
import { clearAuthSessionCookie } from '@/lib/auth-session'

type ApiErrorBody = {
  message?: string | string[]
  errorCode?: string
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
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
  return new ApiError(response.status, parseErrorMessage(body, 'Request failed'))
}

let refreshPromise: Promise<boolean> | null = null

async function refreshSession(): Promise<boolean> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${CONFIG.API_URL}${ApiRoutes.auth.refresh}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      })
      return response.ok
    } catch {
      return false
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

type ApiFetchOptions = RequestInit & {
  skipAuthRefresh?: boolean
}

export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {},
): Promise<Response> {
  const { skipAuthRefresh = false, ...init } = options

  const response = await fetch(`${CONFIG.API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  })

  if (response.status !== 401 || skipAuthRefresh) {
    return response
  }

  const refreshed = await refreshSession()
  if (!refreshed) {
    clearAuthSessionCookie()
    return response
  }

  return fetch(`${CONFIG.API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  })
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
