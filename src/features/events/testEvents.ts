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
        name: 'Hamilton',
        shortDesc: 'This is the best thing you will ever see in your life.',
        address: '123 Fake St, Portland, OR',
        imgUrl: 'https://i.guim.co.uk/img/media/b5df93588386c0565177648cf41f3aff72c63400/0_217_5657_3395/master/5657.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=a917ce8d52959d36bb08ad29184e2701',
        date: new Date('2021-05-21'),
        pageSections: [
            { heading: 'Details', contents: `“HISTORIC. HAMILTON is brewing up a revolution. This is a show that aims impossibly high and hits its target. It's probably not possible to top the adrenaline rush. A MARVEL." – Ben Brantley, The New York Times
            “BRILLIANT. HAMILTON is one of the most exhilarating experiences I’ve had in a theater. Bold, rousing, sexy, tear-jerking and historically respectful — the sort of production that asks you to think afresh about your country and your life.”- David Brooks, The New York Times
            “HAMILTON is the most exciting and significant musical of the decade. Sensationally potent and theatrically vital, it is plugged straight into the wall socket of contemporary music. This show makes me feel hopeful for the future of musical theater.” - The Wall Street Journal`},
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