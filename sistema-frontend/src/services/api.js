const API_URL = import.meta.env.VITE_API_URL

class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

function buildUrl(endpoint) {
  if (!API_URL) {
    throw new Error(
      'A variável VITE_API_URL não foi configurada. Crie um arquivo .env.local com base no .env.example.',
    )
  }

  const baseUrl = API_URL.replace(/\/$/, '')
  const normalizedEndpoint = endpoint.replace(/^\//, '')

  return `${baseUrl}/${normalizedEndpoint}`
}

async function parseResponse(response) {
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

async function request(endpoint, { body, headers, ...options } = {}) {
  const requestHeaders = new Headers(headers)
  const isFormData = body instanceof FormData

  if (body !== undefined && !isFormData && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  const response = await fetch(buildUrl(endpoint), {
    ...options,
    headers: requestHeaders,
    body: body !== undefined && !isFormData ? JSON.stringify(body) : body,
  })

  const data = await parseResponse(response)

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && data.message
        ? data.message
        : 'Não foi possível concluir a requisição.'

    throw new ApiError(message, response.status, data)
  }

  return data
}

const api = {
  get: (endpoint, options = {}) =>
    request(endpoint, { ...options, method: 'GET' }),

  post: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: 'POST', body }),

  put: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: 'PUT', body }),

  patch: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: 'PATCH', body }),

  delete: (endpoint, options = {}) =>
    request(endpoint, { ...options, method: 'DELETE' }),
}

export { ApiError, request }
export default api
