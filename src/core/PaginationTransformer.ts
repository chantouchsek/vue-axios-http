import BaseTransformer from './BaseTransformer'
import snakecaseKeys from 'snakecase-keys'

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
  static fetch(meta: MetaOptions | any) {
    if (!Object.prototype.hasOwnProperty.call(meta, 'pagination')) {
      return snakecaseKeys(meta, { deep: true })
    }
    const { pagination = {}, include } = meta
    return {
      perPage: pagination.per_page,
      totalPages: pagination.total_pages,
      currentPage: pagination.current_page,
      total: pagination.total,
      links: pagination.links,
      count: pagination.count,
      page: pagination.current_page,
      itemsPerPage: pagination.per_page,
      pageCount: pagination.total_pages,
      itemsLength: pagination.total,
      pageStart: 0,
      pageStop: pagination.count,
      include,
    }
  }
}

export default PaginationTransformer
