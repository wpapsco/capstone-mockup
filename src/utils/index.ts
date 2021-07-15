import { capitalize } from '@material-ui/core'

export const urlFriendly = (s: string) => s.replace(/ /g, '_')

export const titleCase = (s: string) => s.split(' ').map(w => capitalize(w)).join(' ')
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