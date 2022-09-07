export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export class PaginatedResult<T> {
  result: T;
  pagination: Pagination;
}

// export class PaginatedMultiResult<T> {
//   result: T;
//   towns: [];
//   pagination: Pagination;
// }

export class pageSize {
  id: number;
  display: string;
}
