import { useRef } from 'react'

import { useDebounced } from '@/hooks/useDebounced'

import { RECIPE_SEARCH_DELAY_MS, activeRecipeSearch } from '../lib/recipe-search'

export const useRecipeSearch = (value: string) => {
  const settled = useDebounced(value.trim(), RECIPE_SEARCH_DELAY_MS)
  return activeRecipeSearch(settled) ?? ''
}

export const usePageForSearch = (
  activeSearch: string,
  page: number,
  setPage: (page: number) => void,
) => {
  const seen = useRef(activeSearch)
  if (seen.current === activeSearch) return page
  seen.current = activeSearch
  if (page !== 1) setPage(1)
  return 1
}
