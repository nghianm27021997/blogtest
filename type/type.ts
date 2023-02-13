export type TypeBlog = {
    id: number,
    title: string,
    content: string,
    createdBy: string,
    createdAt: string | null,
}

export type SearchType = {
    item: TypeBlog,
    refIndex: number
}