import Showing, { ShowingProps } from "./Showing"
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import { useEffect, useState } from 'react'

export default function ShowingsPage(props: {showingSelected: () => void}) {

    const [showings, setShowings] = useState([])
    const getShowings = async () => {
        try {
            const res = await fetch('/api/event-list', {credentials: "include", method: "GET"})
            const jsonData = await res.json()
            setShowings(jsonData)
        } catch (error) {
            console.error(error.message)
        }
    }

    useEffect(() => {getShowings()}, [])

    const showingCards = showings.map((show: ShowingProps) => (
        <Grid item xs={12} sm={6} md={4}>
            <Showing
                key={show.id}
                {...show}
                onSelected={() => props.showingSelected()} />
        </Grid>
    ))

    return (
        <div>
            <Typography variant="h2">Select a Showing</Typography>
            <Grid container spacing={3}>
                {showingCards}
            </Grid>
        </div>
    )
}
