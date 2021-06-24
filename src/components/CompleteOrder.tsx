import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
import { TextField, Checkboxes } from 'mui-rff';
import Grid, { GridProps } from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import YourOrder from '../features/cart/YourOrder'
import { selectCartItems } from '../features/cart/cartSlice'
import { appSelector } from '../app/hooks'
import { loadStripe } from '@stripe/stripe-js';
import { Field, Form } from 'react-final-form'

const stripePromise = loadStripe("pk_test_51J5bpwGEweatMRnmGFUKgE6Q3wn7GmOJDAJ3Zag8DIhZjh324DdDUCFiEOLa0HQZFonkf2pc6lAOpPuheQs9N8AC00zNa4xALV")

export default function CompleteOrder() {
    const cartItems = appSelector(selectCartItems)
    const doCheckout = async (formData: {}) => {
        const stripe = await stripePromise;
        if (!stripe) return;

        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({cartItems, formData})
        })

        const session = await response.json()

        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        })

        if (result.error) {
            console.log(result.error.message)
        }
    }

    return (
        <div style={{display: "flex", height: "100vh", width: "100%"}}>
            <YourOrder />
            <Paper style={{flexGrow: 8, height: "100%", margin: "10px", paddingLeft: "5%", paddingTop: "50px", paddingRight: "10%"}} variant="outlined">
                <Typography variant="h3">Complete Order</Typography>
                <Typography variant="h4">Contact</Typography>
                <Form 
                    onSubmit={doCheckout}
                    initialValues={{"opt-in": false}}
                    render={({ handleSubmit, values }) => (
                        <form onSubmit={handleSubmit} noValidate>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <TextField name="first-name" label="First Name" variant="outlined" fullWidth/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField name="last-name" label="Last Name" variant="outlined" fullWidth/>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField name="street-address" label="Street Address" variant="outlined" fullWidth/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField name="postal-code" label="Postal Code" variant="outlined" fullWidth/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField name="country" label="Country" variant="outlined" fullWidth/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField name="phone" label="Phone" variant="outlined" fullWidth/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField name="email" label="Email" variant="outlined" fullWidth/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField name="visit-source" label="How did you hear about us?" variant="outlined" fullWidth/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Checkboxes name="opt-in" data={{ label: 'Email opt-in', value: true }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField name="comments" label="Comments" variant="outlined" fullWidth multiline/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="contained" style={{width: "100%"}}>Back</Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button type="submit" variant="contained" color="primary" style={{width: "100%"}}>Next</Button>
                                </Grid>
                            </Grid>
                            {JSON.stringify(values)}
                        </form>
                    )}
                />
            </Paper>
        </div>
    )
}
