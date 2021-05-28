import Button from '@material-ui/core/Button';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Card from '@material-ui/core/Card';
import {makeStyles} from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { EventDetails } from './eventsSlice';
import Showtime from '../../components/Showtime';
import { findByLabelText } from '@testing-library/dom';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';

import { Link } from 'react-router-dom'


const useStyles = makeStyles({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
        height: '300px',
        margin: '15px 0px',
        textDecoration: 'none',
    },
    cardContents: {
        display: 'flex',
        paddingLeft: 20,
        flexDirection: 'column',
    },
    media: {
        width: 400,
        
    }
});

export default function EventRow(props: EventDetails) {
    const classes = useStyles();

    return (
            <Card className={classes.root}>
                <CardContent className={classes.cardContents}>
                    <Typography variant='h5' component='h2'>{props.name}</Typography>
                    <Showtime date={props.date} />
                    <Typography variant='body1'>{props.shortDesc}</Typography>
                    <Link to={`/events/${props.id}`}>View Event</Link>
                </CardContent>

                <CardMedia
                    className={classes.media}
                    image={props.imgUrl}
                />
            </Card>
    )
}

// return (
//     <Card className={classes.root}>
//         <div className={classes.sideActions}>
//             <AddShoppingCartIcon />
//             <BookmarkBorderIcon />
//         </div>

//         <div className={classes.details}>
//             <CardContent className={classes.content}>
//                 <Typography variant="h5" component="h2">
//                     {props.name}
//                 </Typography>
//                 <Showtime date={props.date}/>
//                 <Typography variant="body2" color="textSecondary" component="p">
//                     {props.shortDesc}
//                 </Typography>
//             </CardContent>
//         </div>
//         <CardMedia
//             className={classes.media}
//             image={props.imgUrl}
//             title="Contemplative Reptile"
//         />
//     </Card>
// );