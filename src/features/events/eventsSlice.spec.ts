import { Event, selectAllEvents, aggregateShowings } from "./eventsSlice";
import { titleCase, militaryToCivilian, dayMonthDate } from '../../utils'

// const testEventData: Event[] = [
//     {
//         id: 1,
//         playname: 'foo Bar baz',
//         playdescription: 'desc1',
//         eventdate: "2021-01-07T08:00:00.000Z",
//         starttime: "19:00:00",
//         totalseats: 1,
//         availableseats: 1,
//         image_url: 'https://i.guim.co.uk/img/media/b5df93588386c0565177648cf41f3aff72c63400/0_217_5657_3395/master/5657.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=a917ce8d52959d36bb08ad29184e2701',
//     },
//     {
//         id: 2,
//         playname: 'foo Bar baz',
//         playdescription: 'desc1',
//         eventdate: "2021-01-08T08:00:00.000Z",
//         starttime: "22:00:00",
//         totalseats: 3,
//         availableseats: 3,
//         image_url: 'https://i.guim.co.uk/img/media/b5df93588386c0565177648cf41f3aff72c63400/0_217_5657_3395/master/5657.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=a917ce8d52959d36bb08ad29184e2701',
//     },
//     {
//         id: 3,
//         playname: 'test 2',
//         playdescription: 'desc1',
//         eventdate: "2021-01-08T08:00:00.000Z",
//         starttime: "22:00:00",
//         totalseats: 3,
//         availableseats: 3,
//         image_url: 'https://i.guim.co.uk/img/media/b5df93588386c0565177648cf41f3aff72c63400/0_217_5657_3395/master/5657.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=a917ce8d52959d36bb08ad29184e2701',
//     },
// ]

const Plays = {
    foo_Bar_baz: {
        playname: 'foo Bar baz',
        playdescription: 'desc1',
        image_url: 'https://i.guim.co.uk/img/media/b5df93588386c0565177648cf41f3aff72c63400/0_217_5657_3395/master/5657.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=a917ce8d52959d36bb08ad29184e2701',
        showings: [
            {
                id: 1,
                eventdate: "2021-01-07T08:00:00.000Z",
                starttime: "19:00:00",
                totalseats: 1,
                availableseats: 1,
            },
            {
                id: 2,
                eventdate: "2021-01-08T08:00:00.000Z",
                starttime: "22:00:00",
                totalseats: 3,
                availableseats: 3,
            },
        ]
    },
    test_2: {
        playname: 'test 2',
        playdescription: 'desc1',
        image_url: 'https://i.guim.co.uk/img/media/b5df93588386c0565177648cf41f3aff72c63400/0_217_5657_3395/master/5657.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=a917ce8d52959d36bb08ad29184e2701',
        showings: [
            {
                id: 3,
                eventdate: "2021-01-08T08:00:00.000Z",
                starttime: "22:00:00",
                totalseats: 3,
                availableseats: 3,
            },
        ]
    }
}

describe('Event slice utils', () => {

    it('aggregateShowings', () => {
        // expect(aggregateShowings(testEventData)).toEqual(Plays)
    })

})

describe('Event slice selectors', () => {
    it('selectAllEvents', () => {})
    // const InitState = {
    //     events: {
    //         data: Plays,
    //         status: 'idle' as 'idle',
    //     },
    //     shop: { cart: [], donation: 0, },
    //     snackbar: {message: '', shown: false}
    // }

    // it('selectAllEvents', () => {
    //     const plays = [
    //         { playname: 'foo Bar baz', playdescription: 'desc1', image_url: 'https://i.guim.co.uk/img/media/b5df93588386c0565177648cf41f3aff72c63400/0_217_5657_3395/master/5657.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=a917ce8d52959d36bb08ad29184e2701' },
    //         { playname: 'test 2', playdescription: 'desc1', image_url: 'https://i.guim.co.uk/img/media/b5df93588386c0565177648cf41f3aff72c63400/0_217_5657_3395/master/5657.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=a917ce8d52959d36bb08ad29184e2701' },
    //     ]
    //     expect(selectAllEvents(InitState)).toEqual(plays)
    // })
})