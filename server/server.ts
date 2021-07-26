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
        `select shwtm.id, shwtm.playid, plays.playname, plays.playdescription, plays.image_url,
        shwtm.eventdate, shwtm.starttime, shwtm.totalseats, shwtm.availableseats
        from showtimes as shwtm join plays on shwtm.playid = plays.id 
        where plays.active = true and shwtm.salestatus = true`);
    res.json(events.rows);
  } catch (err) {
    console.error(err.message);
  }
});

const formatDoorlistResponse = rowdata => ({
    eventname: rowdata[0].playname,
    eventdate: rowdata[0].eventdate,
    starttime: rowdata[0].starttime,
    data: rowdata.map(datum => {
        const {custid, name, vip, donorbadge, seatingaccom, num_tickets, checkedin, ticketno } = datum
        return {id: custid, name, vip, donorbadge, accomodations: seatingaccom, num_tickets, checkedin, ticketno }
    })
})

app.get('/api/doorlist', isAuthenticated, async (req, res) => {
    try {
        const querystring = `select cust.id as "custid", cust.custname as "name", cust.vip, cust.donorbadge, cust.seatingaccom,
            plays.id as "playid", plays.playname, shwtm.id as "eventid", shwtm.eventdate, shwtm.starttime, tix.checkedin, tix.ticketno, count(cust.id) as "num_tickets"
            from showtimes as shwtm left join plays on shwtm.playid = plays.id left join
            tickets as tix on shwtm.id = tix.eventid
            join customers as cust on tix.custid = cust.id
            where shwtm.id = $1
            group by cust.id, name ,plays.id, plays.playname, shwtm.id, shwtm.eventdate, shwtm.starttime, tix.checkedin, tix.ticketno
            order by name`;
        const values = [req.query.showid]
        const doorlist = await pool.query(querystring, values);
        res.json(formatDoorlistResponse(doorlist.rows));
    }
    catch (err) {
        console.error(err.message);
    }
});

// TODO: Check that provided ticket ID is valid
app.put('/api/checkin', isAuthenticated, async (req, res) => {
    try {
        const querystring = `UPDATE tickets SET checkedin=$1 WHERE ticketno=$2`
        const values = [req.body.isCheckedIn, req.body.ticketID]
        const queryRes = await pool.query(querystring, values)
        res.json(queryRes.rows)
    }
    catch (err) {
        console.error(err.message);
        throw new Error('check in failed');
    }
})

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
    const donation: number = req.body.donation;
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
    const cartSize = req.body.cartItems.length;
    var orders = [];

    for(let i = 0; i<cartSize;++i){
        let newOrder = {
            id: req.body.cartItems[i].id.toString(),
            quantity: req.body.cartItems[i].qty.toString(),

        };
        orders.push(newOrder);
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
            quantity: item.qty
        })).concat(donationItem),
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000",
        metadata: {
            orders: JSON.stringify(orders),
            custid: customerID
        }
    })
    console.log(session);
    res.json({id: session.id})
});

// End point for the create event page. 
app.post("/api/create-event", async (req, res) => {
    try {
        let body = req.body;
        const values = [body.eventName, body.eventDate, body.eventTime, body.eventTickets, null];
        console.log(values);
        // const query = "insert into showtimes (playid, eventdate, starttime, totalseats, availableseats, purchaseuri)\
        // values ($1, $2, $3, $4, $4, $5);"
        // const create_event = await pool.query(query, values);
        // res.json(create_event);
    } catch (error) {
        console.error(error);
    }
});

// Updates salestatus in showtimes table when given an id, date, and time
app.post("/api/delete-event", async (req, res) => {
    try {
        let body = req.body;
        const values = [body.id, body.eventdate, body.starttime];
        const query = "update showtimes set salestatus = false where id = $1 and eventdate = $2 and starttime = $3";
        const remove_event = await pool.query(query, values);
        res.json(remove_event.rows)
    } catch (error) {
        console.error(error);
    }
})

// Get all ticket types
app.get("/api/tickets/type", async (req, res) => {
    try{
        const query = "select * from tickettype";
        const get_all_tickets = await pool.query(query);
        res.json(get_all_tickets.rows);
    } catch (error) {
        console.error(error);
    }
})

// Set which tickets can be sold for an event
app.post("/api/set-tickets", async (req, res) => {
    try {
        let body = req.body;
        const values = [body.showid, body.ticket_type];
        const query = "insert into linkedtickets (showid, type) values ($1, $2)";
        const set_tickets = await pool.query(query, values);
        res.json(set_tickets);
    } catch (error) {
        console.error(error);
    }
})

// Get list of which tickets can be purchased for the show along with its prices
app.get("/api/show-tickets", async (req, res) => {
    try {
        const query = 
            `SELECT pl.id as play_id, sh.id as show_id, playname, playdescription, eventdate, starttime, availableseats, price, concessions
            FROM plays pl
                LEFT JOIN showtimes sh ON pl.id=sh.playid
                JOIN linkedtickets lt ON lt.showid=sh.id
                JOIN tickettype tt ON lt.ticket_type=tt.id
            WHERE pl.id=$1 AND isseason=false;`;
        const values = [req.query.play];
        const available_tickets = await pool.query(query, values);
        res.json(available_tickets);
        console.log(available_tickets.rows);
        return available_tickets.rows;
    } catch (error) {
        console.error(error);
    }
})

app.get('/api/email_subscriptions/newsletter', isAuthenticated, async (req, res) =>
{
    try
    {
        const emails = await pool.query("Select email from customers where newsletter = True");
        res.json(emails.rows);
    }
    catch(err)
    {
        console.error(err.message);
    }
});

app.get('/api/email_subscriptions/volunteers', isAuthenticated, async (req, res) =>
{
    try
    {
        const emails = await pool.query("Select email from customers where \"volunteer list\" = True");
        res.json(emails.rows);
    }
    catch(err)
    {
        console.error(err.message);
    }
});
const fulfillOrder = (session) => {
    // TODO: fill me in
    console.log("Fulfilling order", session);
  }

app.post("/webhook", async(req, res) =>{
    const event = req.body;
    console.log(event);
    switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log('PaymentIntent was successful');
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    
      // Return a 200 response to acknowledge receipt of the event
      res.json({received: true});
})
// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Listening on port ${port}`));
