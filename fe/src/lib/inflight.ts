const controllers = new Set<AbortController>()

let epoch = 0

export function sessionEpoch(): number {
  return epoch
}

export function bumpSessionEpoch(): void {
  epoch += 1
}

export function trackRequest(controller: AbortController): () => void {
  controllers.add(controller)
  return () => {
    controllers.delete(controller)
  }
}

export function abortInflightRequests(): void {
  for (const controller of controllers) controller.abort()
  controllers.clear()
}
