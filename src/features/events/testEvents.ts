import { Event } from './eventsSlice'

const TestData: Event[] = [
    {
        id: '1',
        name: 'Fundraiser BBQ',
        description: 'We are hosting a BBQ beause we want your money!',
        img_url: 'https://www.google.com',
        date: new Date('2021-05-23')
    },
    {
        id: '2',
        name: 'Play 1',
        description: 'Wow. There were tears, then laughter, then the anger.',
        img_url: 'https://www.google.com',
        date: new Date('2021-05-24')
    },
    {
        id: '3',
        name: 'Play 2',
        description: 'This is the best thing you will ever see in your life.',
        img_url: 'https://www.google.com',
        date: new Date('2021-05-21')
    },
]

export default TestData