import Paper from '@material-ui/core/Paper';
import YourOrder from '../features/ticketing/cart/YourOrder'
import { selectCartContents } from '../features/ticketing/ticketingSlice'
import { appSelector } from '../app/hooks'
import { loadStripe } from '@stripe/stripe-js';
import { useState } from "react";
import DonationPage from "./DonationPage"
import CompleteOrderForm, { CheckoutFormInfo } from "./CompleteOrderForm"
import {makeStyles, Typography} from '@material-ui/core';
import {selectDonation} from '../features/donationSlice';

//FYI this is ok to stay here; it's the public key so other people can't do anything with it anyway.
const stripePromise = loadStripe("pk_test_51J5bpwGEweatMRnmGFUKgE6Q3wn7GmOJDAJ3Zag8DIhZjh324DdDUCFiEOLa0HQZFonkf2pc6lAOpPuheQs9N8AC00zNa4xALV")

const useStyles = makeStyles({
    paper: {
        height: "100%",
        margin: "10px",
        paddingLeft: "30px",
        paddingTop: "30px",
        paddingRight: "30px",
    },
    root: {
        display: "flex",
        height: "100vh",
        width: "100%"
    },
    pageTitle: {
        marginBottom: "0.5em"
    },
})

export default function CheckoutPage() {
    const cartItems = appSelector(selectCartContents)
    const donation = appSelector(selectDonation)
    const [checkoutStep, setCheckoutStep] = useState<"donation" | "form">("donation");
    const classes = useStyles()

    const doCheckout = async (formData: CheckoutFormInfo) => {
        const stripe = await stripePromise;
        if (!stripe) return;
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({cartItems, formData, donation})
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
        <div className={classes.root}>
            <YourOrder />
            <Paper className={classes.paper} variant="outlined">
                <Typography variant="h3" className={classes.pageTitle}>Complete Order</Typography>
                {checkoutStep === "donation" && <DonationPage onNext={() => setCheckoutStep("form")}/>}
                {checkoutStep === "form" && <CompleteOrderForm disabled={cartItems.length === 0} onSubmit={doCheckout} onBack={() => setCheckoutStep("donation")}/>}
            </Paper>
        </div>
    )
}
