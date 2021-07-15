// import bodyParser from 'body-parser';
import express from 'express';
import {pool} from './db';
import cors from 'cors';
import Stripe from "stripe"
import {
    CartItem,
    // TicketData
} from "../src/features/cart/cartSlice"
import {CheckoutFormInfo} from "../src/components/CompleteOrderForm"

import passport from "passport"
import {Strategy as LocalStrategy} from "passport-local"
import bcrypt from "bcryptjs"
import cookieParser from "cookie-parser"
import session from "express-session"

let stripe = new Stripe(process.env.PRIVATE_STRIPE_KEY, {
  apiVersion: "2020-08-27",
});

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


// Endpoint to get the list of all events that are currently active
app.get("/api/event-list", async (req, res) => {
  try {
    const events = await pool.query(
        `select shwtm.id, plays.playname, plays.playdescription, plays.image_url,
        shwtm.eventdate, shwtm.starttime, shwtm.totalseats, shwtm.availableseats
        from showtimes as shwtm join plays on shwtm.playid = plays.id 
        where plays.active = true and shwtm.salestatus = true`);
    res.json(events.rows);
  } catch (err) {
    console.error(err.message);
  }
});

const formatResponse = rowdata => ({
    eventname: rowdata[0].playname,
    data: rowdata.map(datum => {
        const {custid, name, vip, donorbadge, seatingaccom, num_tickets, arrived } = datum
        return {id: custid, name, vip, donor: donorbadge, accomodations: seatingaccom, num_tickets, arrived }
    })
})
//TODO: find a way to hide api calls like this behind some kind of auth
app.get('/api/doorlist', isAuthenticated, async (req, res) => {
    try {
        const querystring = `select cust.id as "custid", cust.custname as "name", cust.vip, cust.donorbadge, cust.seatingaccom,
            plays.id as "playid", plays.playname, shwtm.id as "eventid", shwtm.eventdate, shwtm.starttime, tix.checkedin as "arrived", count(cust.id) as "num_tickets"
            from showtimes as shwtm left join plays on shwtm.playid = plays.id left join
            tickets as tix on shwtm.id = tix.eventid
            join customers as cust on tix.custid = cust.id
            where shwtm.id = $1
            group by cust.id, name ,plays.id, plays.playname, shwtm.id, shwtm.eventdate, shwtm.starttime, tix.checkedin
            order by name`;
        const values = [req.query.showid]
        const doorlist = await pool.query(querystring, values);
        res.json(formatResponse(doorlist.rows));
    }
    catch (err) {
        console.error(err.message);
    }
});

app.post('/api/newsletter/count', async (req, res) => {
    try
    {
        const emails = await pool.query("SELECT COUNT(*) FROM customers WHERE email = $1", [req.body.email]);
        res.json(emails.rows);
    }
    catch(err)
    {
        console.error(err.message);
    }
});

app.post('/api/newsletter/update', async (req, res) => {
    try
    {
        var body = req.body;
        var values = [body.news_opt, body.volunteer_opt, body.email];
        const rows = await pool.query(`UPDATE public.customers
            SET newsletter=$1, "volunteer list"=$2
            WHERE email = $3;`, values);
        res.json(rows.rows);
    }
    catch(err)
    {
        console.error(err.message);
    }
});

app.post('/api/newsletter/insert', async (req, res) => {
    try
    {
        var body = req.body;
        var values = [body.custname, body.email,
                      body.phone, body.custaddress, body.news_opt,
                      false, false, false, body.volunteer_opt];
        const emails = await pool.query(
            `INSERT INTO public.customers(
            custname, email, phone, custaddress, newsletter, donorbadge, seatingaccom, vip, "volunteer list")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
            values
        );
        res.json(emails.rows);
    }
    catch(err)
    {
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
    const data: CartItem[] = req.body.cartItems;
    
    // TODO: submit form data to DB
    // Adding a customer to the customer table based on form data:
    // I'm defaulting donor badge and seating accom columns to false, but I'm not sure
    // where else we would be asking for seating accommodations other than checkout...
    try {
        const addedCust = await pool.query(
        `INSERT INTO customers (custname, email, phone, custaddress, newsletter, donorbadge, seatingaccom) 
        values ($1, $2, $3, $4, $5, $6, $7)`,
        [req.body.formData["first-name"] + " " + req.body.formData["last-name"], req.body.formData.email,
         req.body.formData.phone, req.body.formData["street-address"], req.body.formData["opt-in"], false, false])
    } catch (error) {
        console.log(error);
    }
    // storing the customer id for later processing on succesful payments.
    // if we cant find the custid something went wrong
    var customerID = null;
    
    try {
            customerID = await pool.query(
            `SELECT id
            FROM customers
            WHERE custname = $1`,
            [req.body.formData["first-name"] + " " + req.body.formData["last-name"]]
        )
    } catch (error) {
        console.log(error);
    }
    customerID = customerID.rows[0].id;
    const formData: CheckoutFormInfo = req.body.formData;
    console.log(formData);
    const donation: number = req.body.donation
    const donationItem = {
      price_data: {
        currency: "usd",
        product_data: {
          name: "Donation",
          description: "A generous donation",
        },
        // the price here needs to be fetched from the DB instead
        unit_amount: donation * 100,
      },
      quantity: 1,
    };
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
            quantity: item.qty
        })).concat(donationItem),
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000",
    })
    const eventnum = req.body.cartItems[0].itemData.eventId;
    // inserting successful orders into tickets db
    // currently this isnt checking if the payment is successfully processed on the stripe page
    // we will eventually change this to process after a successful stripe payment
    // using payment_status = "unpaid" as a test. We will change this later.
    if((session.payment_status === "unpaid") || (session.payment_status === "paid")){
        try{
            const addedTicket = await pool.query(
            `INSERT INTO tickets(type, eventid, custid, paid, active) 
            values ($1,$2,$3,$4,$5)`,
            [0, eventnum, customerID, true, true])
        } catch (error) {
            console.log(error);
        }
    }
    res.json({id: session.id})
});

// End point for the create event page. 
app.post("/api/create-event", (req, res) => {
    console.log("Event Name", req.body.eventName);
});

// Updates salestatus in showtimes table when given an id, date, and time
app.post("/api/delete-event", async (req, res) => {
    try {
        let body = req.body;
        let values = [body.id, body.eventdate, body.starttime];
        const query = "update showtimes set salestatus = false where id = $1 and eventdate = $2 and starttime = $3";
        const remove_event = await pool.query(query, values);
        res.json(remove_event.rows)
    } catch (error) {
        console.error(error);
    }
})

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Listening on port ${port}`));
