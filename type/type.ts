export type TypeBlog = {
    reduce(arg0: (prev: any, current: any) => any): any
    findIndex(arg0: (item: any) => boolean): unknown
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