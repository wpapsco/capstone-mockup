// import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { titleCase, militaryToCivilian, dayMonthDate } from '../utils';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});

export interface ShowingProps {
    id: string,
    eventName: string,
    eventdate: string,
    starttime: string,
    desc?: string,
    image_url: string,
}
export default function ShowingCard(props: ShowingProps) {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={props.image_url}
                    title="Contemplative Reptile"
                />
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {titleCase(props.eventName)}
                    </Typography>
                    <Typography variant="body2" gutterBottom color="textPrimary" component="p">
                        {`${dayMonthDate(props.eventdate)}, ${militaryToCivilian(props.starttime)}`}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {(props.desc) ? props.desc : 'No description available'}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Link to={`/doorlist/${props.id}`}>
                    <Button size="small" variant="contained" color="primary">
                        Select
                    </Button>
                </Link>
            </CardActions>
        </Card>
    );
}
