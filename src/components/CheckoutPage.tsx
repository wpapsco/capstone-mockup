import Paper from '@material-ui/core/Paper';
import YourOrder from '../features/cart/YourOrder'
import { selectCartContents, selectDonation } from '../features/cart/cartSlice'
import { appSelector } from '../app/hooks'
import { loadStripe } from '@stripe/stripe-js';
import { useState } from "react";
import DonationPage from "./DonationPage"
import CompleteOrderForm, { CheckoutFormInfo } from "./CompleteOrderForm"
import {makeStyles} from '@material-ui/core';

const stripePromise = loadStripe("pk_test_51J5bpwGEweatMRnmGFUKgE6Q3wn7GmOJDAJ3Zag8DIhZjh324DdDUCFiEOLa0HQZFonkf2pc6lAOpPuheQs9N8AC00zNa4xALV")

const useStyles = makeStyles({
    paper: {
        height: "100%",
        margin: "10px",
        paddingLeft: "30px",
        paddingTop: "30px",
        paddingRight: "30px"
    },
    root: {
        display: "flex",
        height: "100vh",
        width: "100%"
    }
})

export default function CheckoutPage() {
    const cartItems = appSelector(selectCartContents)
    const donation = appSelector(selectDonation)
    const [checkoutStep, setCheckoutStep] = useState("donation");
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
                {checkoutStep === "donation" && <DonationPage onNext={() => setCheckoutStep("form")}/>}
                {checkoutStep === "form" && <CompleteOrderForm disabled={cartItems.length == 0} onSubmit={doCheckout} onBack={() => setCheckoutStep("donation")}/>}
            </Paper>
        </div>
    )
}
