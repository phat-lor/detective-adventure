interface Pagination {
	total: number;
	lastPage: number;
	currentPage: number;
	perPage: number;
	prev: number | null;
	next: number | null;
}

export type { Pagination };
