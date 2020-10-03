import BaseTransformer from './BaseTransformer'

class PaginationTransformer extends BaseTransformer {
  static fetch(meta: MetaOptions) {
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

export interface PaginationOptions {
  per_page?: string | number
  total_pages?: string | number
  current_page?: string | number
  total?: string | number
  links?: string | number
  count?: string | number
  page?: string | number
  items_per_page?: string | number
  page_count?: string | number
  items_length?: string | number
  page_start?: string | number
  page_stop?: string | number
  include?: string | string[]
}

export interface MetaOptions {
  pagination?: PaginationOptions
  include?: string | string[]
}
