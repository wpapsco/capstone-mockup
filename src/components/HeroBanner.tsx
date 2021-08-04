import { makeStyles } from "@material-ui/core"

const HeroBanner: React.FC<{imgUrl: string}> = ({imgUrl, children}) => {
    const classes = useStyles(imgUrl)()

    return (
        <section className={classes.hero}>
            <img className={classes.heroImage} src={imgUrl} alt='people singing on stage' />
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
        textAlign: 'center',
        left: '-25.5vw',
        width: '110vw',
        height: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'clip',
        '&:before': {
            height: '100%',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url(${imgUrl})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            filter: 'blur(10px)',
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: 'scale(1.2)'
        },
        '& h1': {
            fontWeight: 800
        }
    },
    heroContent: {
        position: 'absolute',
        color: 'white',
    },
    heroImage: {
        position: 'absolute',
        width: '55%',
        // height: '100%',
        filter: 'brightness(0.6)',
    }
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