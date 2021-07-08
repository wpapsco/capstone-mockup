import {
    groupPlays,
    Event,
    Play,
} from "./eventsSlice";

const testEventData: Event[] = [
    {
        id: 1,
        playname: 'test1',
        playdescription: 'desc1',
        eventdate: "2021-01-07T08:00:00.000Z",
        starttime: "19:00:00",
        totalseats: 1,
        availableseats: 1,
    },
    {
        id: 2,
        playname: 'test1',
        playdescription: 'desc1',
        eventdate: "2021-01-08T08:00:00.000Z",
        starttime: "22:00:00",
        totalseats: 3,
        availableseats: 3,
    },
    {
        id: 3,
        playname: 'test2',
        playdescription: 'desc1',
        eventdate: "2021-01-08T08:00:00.000Z",
        starttime: "22:00:00",
        totalseats: 3,
        availableseats: 3,
    },
]

const combinedPlays: Play[] = [
    {
        playname: 'test1',
        playdescription: 'desc1',
        showings: [
            { id: 1, eventdate: "2021-01-07T08:00:00.000Z", starttime: "19:00:00", totalseats: 1, availableseats: 1 },
            { id: 2, eventdate: "2021-01-08T08:00:00.000Z", starttime: "22:00:00", totalseats: 3, availableseats: 3 },
        ]
    },
    {
        playname: 'test2',
        playdescription: 'desc1',
        showings: [
            {id: 3, eventdate: "2021-01-08T08:00:00.000Z", starttime: "22:00:00", totalseats: 3, availableseats: 3 },
        ]
    },
]

describe('Event slice utils', () => {
    it('groupPlays', () => {
        const res = groupPlays(testEventData)
        console.log(res)
        expect(res).toEqual(combinedPlays)
    })
})