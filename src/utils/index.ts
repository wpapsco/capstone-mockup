export const urlFriendly = (s: string) => s.replace(/ /g, '_')

export const capitalize = (s: string) =>
    s.split(' ')
        .map((word: string) => word.slice(0,1).toUpperCase() + word.slice(1))
        .join(' ')

interface Item<T = any> {
    [key: string]: T
}
export interface ItemGroup<T> {
    [key: string]: T[]
}        

export function groupByKey<T extends Item>(arr: any[], key: keyof T, keyTransformer?: (s: string) => string): ItemGroup<T> {
    return arr.reduce<ItemGroup<T>>((map, item) => {
        const itemKey = (keyTransformer) ? keyTransformer(item[key]) : item[key]
        if(map[itemKey]) {
                map[itemKey].push(item)
        } else {
            map[itemKey] = [item]
        }
        return map
    }, {})
}