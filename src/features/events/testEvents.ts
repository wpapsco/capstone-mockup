import { EventDetails } from './eventsSlice'

const TestData: EventDetails[] = [
    {
        id: '1',
        name: 'Fundraiser BBQ',
        imgUrl: 'https://www.google.com',
        shortDesc: 'Barbecque Fundraiser',
        address: '123 Fake St, Portland, OR',
        date: new Date('2021-05-23'),
        pageSections: [
            { heading: "It's BBQ Time!", contents: 'We are hosting a BBQ beause we want your money!' },
            { heading: 'Concessions Tickets', contents: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam unde iure modi nisi, culpa alias aliquid dicta, quas voluptate placeat dolor. Unde, quis! Sit suscipit illo quos, quasi officia nostrum.' },
        ]
    },
    {
        id: '2',
        name: 'This is a Play!',
        shortDesc: 'Friday night showing of "This is a Play!"',
        imgUrl: 'https://www.tripsavvy.com/thmb/WaV9kZkbvvia0SQ1pd4PN7qgb3k=/1500x1000/filters:no_upscale():max_bytes(150000):strip_icc()/Lakewood-Theatre-Company-Godspell-5942d71e5f9b58d58a85bda5.jpg',
        address: '123 Fake St, Portland, OR',
        date: new Date('2021-05-24'),
        pageSections: [
            { heading: 'About "This is a Play!"', contents: "Lorem ipsum donor"},
            { heading: 'Concessions Tickets', contents: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam unde iure modi nisi, culpa alias aliquid dicta, quas voluptate placeat dolor. Unde, quis! Sit suscipit illo quos, quasi officia nostrum.' },
        ],
    },
    {
        id: '3',
        name: 'Play 2',
        shortDesc: 'This is the best thing you will ever see in your life.',
        address: '123 Fake St, Portland, OR',
        imgUrl: 'https://www.google.com',
        date: new Date('2021-05-21'),
        pageSections: [
            { heading: 'About this play', contents: 'This is the best thing you will ever see in your life'},
            { heading: 'Concessions Tickets', contents: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam unde iure modi nisi, culpa alias aliquid dicta, quas voluptate placeat dolor. Unde, quis! Sit suscipit illo quos, quasi officia nostrum.' },
        ],
    },
    {
        id: '4',
        name: 'The Nutcracker',
        shortDesc: 'Friday night showing of The Nutcracker',
        date: new Date('2021-03-07'),
        address: '123 Fake St, Portland, OR',
        imgUrl: 'https://www.tripsavvy.com/thmb/WaV9kZkbvvia0SQ1pd4PN7qgb3k=/1500x1000/filters:no_upscale():max_bytes(150000):strip_icc()/Lakewood-Theatre-Company-Godspell-5942d71e5f9b58d58a85bda5.jpg',
        pageSections: [
            { heading: 'Show Description', contents: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam unde iure modi nisi, culpa alias aliquid dicta, quas voluptate placeat dolor. Unde, quis! Sit suscipit illo quos, quasi officia nostrum.' },
            { heading: 'Concessions Tickets', contents: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam unde iure modi nisi, culpa alias aliquid dicta, quas voluptate placeat dolor. Unde, quis! Sit suscipit illo quos, quasi officia nostrum.' },
            { heading: 'Contacting Us', contents: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam unde iure modi nisi, culpa alias aliquid dicta, quas voluptate placeat dolor. Unde, quis!' },
        ]
    }
]

export default TestData