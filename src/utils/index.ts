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

type time = {hours: number, minutes: number, ampm?: 'AM'|'PM'}

const serializeTime = (datestr: string): time => {
    const hours_minutes = datestr.split(':')
    return {
        hours: parseInt(hours_minutes[0]),
        minutes: parseInt(hours_minutes[1]),
    }
}

const appendAMPM = (time: time): time => ({
    ...time,
    ampm: (time.hours >= 12) ? 'PM': 'AM',
})

const toCivilianHours = (time: time): time => ({
    ...time,
    hours: (time.hours > 12) ?
        time.hours - 12 : time.hours,
})

const formatTime = (time: time, template='hh:mm tt') =>
    template
        .replace('hh', time.hours.toString())
        .replace('mm', (time.minutes < 10) ?
            '0'+time.minutes.toString() :
            time.minutes.toString())
        .replace('tt', time.ampm!)

// Input=19:00:00 => Output=7:00 PM
export const militaryToCivilian = (mil_t: string) =>
    formatTime(toCivilianHours(appendAMPM(serializeTime(mil_t))))

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const serializeDate = (datestr: string): Date => new Date(datestr)
const getMonth = (d: Date) => MONTHS[d.getMonth()]
const getDay = (d: Date) => DAYS[d.getDay()]
const getDate = (d: Date) => d.getDate().toString()
const formatDate = (d: Date, template='dy, mm dt') =>
    template
        .replace('dy', getDay(d))
        .replace('mm', getMonth(d))
        .replace('dt', getDate(d))

export const dayMonthDate = (datestr: string) =>
    formatDate(serializeDate(datestr))


