/* * * * * * * * EVENT PAGE DATA * * * * * * * * 
 *
 * How pretty can I get away with making this page?
 * 
 * HEADER DATA
 * - Title
 * - Show day, date & time
 * - Address
 * - Main Image
 * 
 * MAIN BODY
 * - Description
 * - Concessions description
 * - Location Map
 * - Contact Information
 * - Optional Additional Images
 * 
 * * * * * * * * * * * * * * * * * * * * * * * */ 
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/styles'
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

type Props = {
    title: string,
    showdate: Date,
    address: string,
    headerImageUrl: string,
    bodySections: { heading: string, contents: string }[]
}

const days = ['sun','mon','tue','wed','thu','fri','sat']
const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']

const useStyles = makeStyles((theme) => ({
    cardRoot: {
        display: 'flex',
        height: '400px',
    },
    cardContents: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    heroImage: {
        width: '500px',
    },
    cardActions: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center',
    },  
    qtyField: {
        maxWidth: '100px',
    }
}))

export default function(data: Props) {
    const classes = useStyles()
    const {title, showdate, address, bodySections, headerImageUrl} = data
    const showtime = `${days[showdate.getDay()]} ${months[showdate.getMonth()]}, ${showdate.getDate()+1}`

    const sections = bodySections.map(d => {
        return (
            <section>
                <Typography component="h2" variant="h4" gutterBottom>{d.heading}</Typography>
                <Typography variant="body1" paragraph>{d.contents}</Typography>
            </section>
        )
    })

    return (
        <article>
            <Card className={classes.cardRoot}>
                <CardMedia className={classes.heroImage} image={headerImageUrl}/>
                <CardContent className={classes.cardContents}>
                    <Typography component="h1" variant="h3" align="center" gutterBottom>{title}</Typography>
                    <Typography variant="subtitle1" align="center">{showtime}</Typography>
                    <Typography variant="subtitle2" align="center">{address}</Typography>
                    <CardActions className={classes.cardActions}>
                        <TextField
                            className={classes.qtyField}
                            required
                            label="Quantity"
                            type="number"
                        />
                        <Button color="primary" variant="contained">Get Tickets</Button>
                    </CardActions>
                </CardContent>
            </Card>
            <main> {sections} </main>
        </article>
    )
}