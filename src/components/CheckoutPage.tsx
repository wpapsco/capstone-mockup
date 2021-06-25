import Paper from '@material-ui/core/Paper';
import YourOrder from '../features/cart/YourOrder'
import { selectCartItems, selectDonation } from '../features/cart/cartSlice'
import { appSelector } from '../app/hooks'
import { loadStripe } from '@stripe/stripe-js';
import { useState } from "react";
import DonationPage from "./DonationPage"
import CompleteOrderForm, { CheckoutFormInfo } from "./CompleteOrderForm"

const stripePromise = loadStripe("pk_test_51J5bpwGEweatMRnmGFUKgE6Q3wn7GmOJDAJ3Zag8DIhZjh324DdDUCFiEOLa0HQZFonkf2pc6lAOpPuheQs9N8AC00zNa4xALV")

export default function CheckoutPage() {
    const cartItems = appSelector(selectCartItems)
    const donation = appSelector(selectDonation)
    const [checkoutStep, setCheckoutStep] = useState("donation");

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
        <div style={{display: "flex", height: "100vh", width: "100%"}}>
            <YourOrder />
            <Paper style={{flexGrow: 8, height: "100%", margin: "10px", paddingLeft: "5%", paddingTop: "50px", paddingRight: "10%"}} variant="outlined">
                {checkoutStep == "donation" && <DonationPage onNext={() => setCheckoutStep("form")}/>}
                {checkoutStep == "form" && <CompleteOrderForm onSubmit={doCheckout} onBack={() => setCheckoutStep("donation")}/>}
            </Paper>
        </div>
    )
}
