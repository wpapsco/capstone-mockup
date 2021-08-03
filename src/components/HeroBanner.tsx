import { makeStyles } from "@material-ui/core"

const HeroBanner: React.FC<{imgUrl: string}> = ({imgUrl, children}) => {
    const classes = useStyles(imgUrl)()

    return (
        <section className={classes.hero}>
            <div className={classes.heroContent}>
                {children}
            </div>
        </section>
    )
}

export default HeroBanner

const useStyles = (imgUrl: string) => makeStyles((theme) => ({
    hero: {
        position: 'relative',
        left: '-27.5vw',
        width: '100vw',
        height: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imgUrl})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        '&:before': {
            height: '100%',
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
        }
    },
    heroContent: {
        position: 'relative',
        color: 'white',
    },
}))

/*
<Card className={classes.cardRoot}>
    <CardMedia
        className={classes.heroImage}
        image={image_url} />
    <CardContent className={classes.cardContents}>
        <Typography component="h1" variant="h3" align="center" gutterBottom>{titleCase(title)}</Typography>
        <Typography variant="body1"> {
            (selectedShowing)
                ? 'Selected showing: ' + format(selectedShowing.date, "MMM dd yyyy h:mm a")
                : `Please select a showing (${tickets.length} available)`
        } </Typography>
    </CardContent>
</Card>
*/