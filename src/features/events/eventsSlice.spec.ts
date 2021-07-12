import { groupPlays, Event, selectAllEvents, } from "./eventsSlice";
import { urlFriendly, capitalize, } from '../../utils'

const testEventData: Event[] = [
    {
        id: 1,
        playname: 'foo Bar baz',
        playdescription: 'desc1',
        eventdate: "2021-01-07T08:00:00.000Z",
        starttime: "19:00:00",
        totalseats: 1,
        availableseats: 1,
    },
    {
        id: 2,
        playname: 'foo Bar baz',
        playdescription: 'desc1',
        eventdate: "2021-01-08T08:00:00.000Z",
        starttime: "22:00:00",
        totalseats: 3,
        availableseats: 3,
    },
    {
        id: 3,
        playname: 'test 2',
        playdescription: 'desc1',
        eventdate: "2021-01-08T08:00:00.000Z",
        starttime: "22:00:00",
        totalseats: 3,
        availableseats: 3,
    },
]

const Plays = {
    foo_Bar_baz: [
        {
            id: 1,
            playname: 'foo Bar baz',
            playdescription: 'desc1',
            eventdate: "2021-01-07T08:00:00.000Z",
            starttime: "19:00:00",
            totalseats: 1,
            availableseats: 1,
        },
        {
            id: 2,
            playname: 'foo Bar baz',
            playdescription: 'desc1',
            eventdate: "2021-01-08T08:00:00.000Z",
            starttime: "22:00:00",
            totalseats: 3,
            availableseats: 3,
        },
    ],
    test_2: [
        {
            id: 3,
            playname: 'test 2',
            playdescription: 'desc1',
            eventdate: "2021-01-08T08:00:00.000Z",
            starttime: "22:00:00",
            totalseats: 3,
            availableseats: 3,
        },
    ]
}

describe('Event slice utils', () => {
    it('groupPlays', () => {
        const groupedByPlays = groupPlays(testEventData)
        expect(groupedByPlays).toEqual(Plays)
    })

    it('urlFriendly', () => {
        expect(urlFriendly('foo bar baz')).toEqual('foo_bar_baz')
    })

    it('capitalize', () => {
        expect(capitalize('lower Case title')).toEqual('Lower Case Title')
    })
})

describe('Event slice selectors', () => {
    const InitState = {
        events: {
            data: Plays,
            status: 'idle' as 'idle',
        },
        shop: { cart: [], donation: 0, },
        snackbar: {message: '', shown: false}
    }

    it('selectAllEvents', () => {
        const plays = [
            { playname: 'foo Bar baz', playdescription: 'desc1' },
            { playname: 'test 2', playdescription: 'desc1' },
        ]
        expect(selectAllEvents(InitState)).toEqual(plays)
    })
})