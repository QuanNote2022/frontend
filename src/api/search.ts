import request from './index'
import type { ApiResponse, SearchResult } from '@/types/api'

export function searchApi(keyword: string) {
  return request.get<any, ApiResponse<SearchResult>>('/search', { params: { keyword } })
}
