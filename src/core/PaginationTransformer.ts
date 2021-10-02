import BaseTransformer from './BaseTransformer'
import { hasOwnProperty } from '../util'

export interface PaginationOptions {
  perPage: number
  totalPages: number
  totalCount: number
  limit: number
  currentPage: number
  total: number
  links?: string | number
  count: number
  page: number
  itemsPerPage?: number
  pageCount: number
  itemsLength: number
  pageStart?: number
  pageStop?: number
  include?: string | string[]
}
export interface MetaOptions {
  pagination?: PaginationOptions
  include?: string | string[]
}

class PaginationTransformer extends BaseTransformer {
  static fetch(meta: MetaOptions | Record<string, any>) {
    if (!meta) {
      meta = Object.assign({}, meta, { pagination: {}, include: [] })
    }
    if (!hasOwnProperty(meta, 'pagination')) {
      return super.fetch(meta, true)
    }
    const { pagination, include } = meta
    const payload: PaginationOptions = Object.assign({}, pagination, {
      perPage: pagination.per_page,
      totalPages: pagination.total_pages,
      currentPage: pagination.current_page || 1,
      total: pagination.total,
      links: pagination.links,
      count: pagination.count || 0,
      page: pagination.current_page,
      itemsPerPage: pagination.per_page,
      pageCount: pagination.total_pages,
      itemsLength: pagination.total,
      pageStart: 0,
      pageStop: pagination.count,
      include,
    })

    return super.fetch(payload, true)
  }
}

export default PaginationTransformer
