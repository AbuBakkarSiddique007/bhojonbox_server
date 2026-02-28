export declare const categoryService: {
    getAllCategories: () => Promise<any>;
    getCategoryById: (id: string) => Promise<any>;
    createCategory: (data: {
        name: string;
        image?: string;
    }) => Promise<any>;
    updateCategory: (id: string, data: {
        name?: string;
        image?: string;
    }) => Promise<any>;
    deleteCategory: (id: string) => Promise<any>;
};
