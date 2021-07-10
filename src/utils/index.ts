export const urlFriendly = (s: string) => s.replace(/ /g, '_')

export const capitalize = (s: string) =>
    s.split(' ')
        .map((word: string) => word.slice(0,1).toUpperCase() + word.slice(1))
        .join(' ')