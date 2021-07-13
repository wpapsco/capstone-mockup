// This implementation should replace the EventRow component in the EventsList
import { capitalize } from '../../utils'
import { Card, CardContent, CardMedia, Button } from '@material-ui/core'
import { Theme, makeStyles, useTheme } from '@material-ui/core/styles'



// TODO: add image URL
const EventCard = (props: {
    playname: string,
    playdescription: string,
}) => {
    const useStyles = makeStyles((theme: Theme) => ({
        root: {
            margin: '1em',
            display: 'flex',
            justifyContent: 'space-between',
            height: '300px',
            width: '100%',
            flexDirection: 'row',
            [theme.breakpoints.down('sm')]: {
                flexDirection: 'column',
            },
            [theme.breakpoints.up('md')]: {
                flexDirection: 'row',
            }
        },
        cardMedia: {
            // height: '100%',
            width: '300px',
            justifySelf: 'end',
        },
        cardContent: {
            display: 'flex',
            flexDirection: 'column',
        },
        callToAction: {
            alignSelf: 'center',
            justifySelf: 'end',
        },
    }))

    const classes = useStyles(useTheme())

    return (
        <Card className={classes.root}>
            <CardContent className={classes.cardContent}>
                <h2>{capitalize(props.playname)}</h2>
                <p>{(props.playdescription) ?
                    props.playdescription :
                    'No description available.'
                }</p>
                <Button
                    className={classes.callToAction}
                    variant="contained"
                    color="primary"
                >
                    See Showings
                </Button>
            </CardContent>
            <CardMedia
                className={classes.cardMedia}
                image="https://i.guim.co.uk/img/media/b5df93588386c0565177648cf41f3aff72c63400/0_217_5657_3395/master/5657.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=a917ce8d52959d36bb08ad29184e2701"
                title={`Photo of ${props.playname} performance`}
                // alt={`Photo of ${props.playname} performance`}
            />
        </Card>
    )
}

export default EventCard