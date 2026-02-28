type IOptions = {
    page?: number | string;
    limit?: number | string;
    sortOrder?: "asc" | "desc";
    sortBy?: string;
};
type IOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
};
declare const paginationAndSortingHelper: (options: IOptions) => IOptionsResult;
export default paginationAndSortingHelper;
