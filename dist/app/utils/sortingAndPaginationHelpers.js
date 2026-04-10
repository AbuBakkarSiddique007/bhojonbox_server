const paginationAndSortingHelper = (options) => {
    const page = options.page ? parseInt(options.page) : 1;
    const limit = options.limit ? parseInt(options.limit) : 10;
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || "createdAt";
    const sortOrder = options.sortOrder === "asc" ? "asc" : "desc";
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    };
};
export default paginationAndSortingHelper;
//# sourceMappingURL=sortingAndPaginationHelpers.js.map