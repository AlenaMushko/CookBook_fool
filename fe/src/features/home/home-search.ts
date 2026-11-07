export type HomeSearch = {
  q?: string
  category?: string
}

export type HomeListState = {
  q: string
  category?: string
}

export function parseHomeSearch(search: Record<string, unknown>): HomeSearch {
  return toHomeSearch({
    q: typeof search.q === 'string' ? search.q : '',
    category: typeof search.category === 'string' ? search.category : undefined,
  })
}

export function homeStateFromSearch(search: HomeSearch): HomeListState {
  return {
    q: search.q ?? '',
    category: search.category,
  }
}

export function toHomeSearch(state: HomeListState): HomeSearch {
  const search: HomeSearch = {}
  if (state.q) search.q = state.q
  if (state.category) search.category = state.category
  return search
}
