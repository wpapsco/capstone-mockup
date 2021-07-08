// import bodyParser from 'body-parser';
import express from 'express';
import {pool} from './db';
import cors from 'cors';
import Stripe from "stripe"
import {CartItem, TicketData} from "../src/features/cart/cartSlice"
import {CheckoutFormInfo} from "../src/components/CompleteOrderForm"

import passport from "passport"
import {Strategy as LocalStrategy} from "passport-local"
import bcrypt from "bcryptjs"
import cookieParser from "cookie-parser"
import session from "express-session"

let stripe = new Stripe(process.env.PRIVATE_STRIPE_KEY, {apiVersion: "2020-08-27"})

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: "sessionsecret",
    resave: true,
    saveUninitialized: true
}))
app.use(cookieParser("sessionsecret"))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(async (username, password, done) => {
    const users = await pool.query("SELECT * FROM users WHERE username = $1;", [username]);
    if (users.rows.length <= 0) return done(null, false);
    const user = users.rows[0];
    const validated = await bcrypt.compare(password, user.pass_hash);
    if (validated) {
        return done(null, user);
    } else {
        return done(null, false);
    }
}))

declare global {
    namespace Express {
        interface User {
            username: string;
            id: number;
        }
    }
}

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    const users = await pool.query("SELECT * FROM users WHERE id = $1;", [id]);
    if (users.rows.length <= 0) return done("no such user", false);
    return done(null, users.rows[0]);
})

const isAuthenticated = function (req, res, next) {
    if (req.user)
        return next();
    else
        return res.sendStatus(401)
}

app.get('/api/user', isAuthenticated, (req, res) => {
    return res.send(req.user);
})

app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.sendStatus(200);
})

//TODO: find a way to hide api calls like this behind some kind of auth
app.get('/api/doorlist', isAuthenticated, async (req, res) => {
    try {
        const doorlist = await pool.query("SELECT * FROM exdoorlist");
        res.json(doorlist.rows);
    }
    catch (err) {
        console.error(err.message);
    }
});

// TODO: when we add confirmation emails we can do it like this:
// https://stripe.com/docs/payments/checkout/custom-success-page
app.post('/api/checkout', async (req, res) => {
    // TODO: NOT DO IT THIS WAY!!!
    // right now it gets the price info from the request made by the client.
    // THIS IS WRONG it needs to look up the price in the database given
    // the id of the show/event/whatever. PRICES CANNOT COME FROM CLIENTS!!
    const data: CartItem<TicketData>[] = req.body.cartItems;
    // TODO: submit form data to DB
    const formData: CheckoutFormInfo = req.body.formData;
    console.log(formData);
    const donation: number = req.body.donation
    const donationItem = {
        price_data: {
            currency: "usd",
            product_data: {
                name: "Donation",
                description: "A generous donation"
            },
            // the price here needs to be fetched from the DB instead
            unit_amount: donation * 100
        },
        quantity: 1
    }
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        //this is the offending area all this stuff needs to be replaced by info from DB based on play ID or something
        line_items: data.map(item => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                    description: item.description
                },
                // the price here needs to be fetched from the DB instead
                unit_amount: item.unitPrice * 100
            },
            quantity: item.quantity
        })).concat(donationItem),
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000",
    })
    res.json({id: session.id})
});

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Listening on port ${port}`));
