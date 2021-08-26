//import bodyParser from 'body-parser';
import express from 'express';
import {pool} from './db';
import cors from 'cors';
import Stripe from "stripe"
import {CheckoutFormInfo} from "../src/components/CompleteOrderForm"
import {CartItem, Ticket} from '../src/features/ticketing/ticketingSlice'

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
        delete user.pass_hash
        console.log(user)
        return done(null, user);
    } else {
        return done(null, false);
    }
}))


export interface User {
    username: string;
    id: number;
    is_superadmin: boolean;
}

declare global {
    namespace Express {
        export interface User {
            username: string;
            id: number;
            is_superadmin: boolean;
        }
    }
}

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    const users = await pool.query("SELECT * FROM users WHERE id = $1;", [id]);
    if (users.rows.length <= 0) return done("no such user", false);
    const user = users.rows[0]
    delete user.pass_hash
    return done(null, user);
})

const isAuthenticated = function (req, res, next) {
    if (req.user)
        return next();
    else
        return res.sendStatus(401)
}

const isSuperadmin = (req, res, next) => {
    if (req.user && req.user.is_superadmin)
        return next()
    else
        return res.sendStatus(401)
}

app.get('/api/user', isAuthenticated, (req, res) => {
    return res.send(req.user);
})

app.get('/api/users', isSuperadmin, async (req, res) => {
    console.log('getusers')
    const users = await pool.query('SELECT * FROM users;')
    users.rows.forEach(e => delete e.pass_hash);
    res.json(users.rows)
})

app.post('/api/newUser', isSuperadmin, async (req, res) => {
    const passHash = await bcrypt.hash(req.body.password, 10);
    try {
        await pool.query('INSERT INTO users (username, pass_hash) VALUES ($1, $2);', [req.body.username, passHash]);
    } catch (e) {
        res.json({error: "USER_EXISTS"})
        return
    }
    res.json({})
})

app.post('/api/changeUser', isSuperadmin, async (req, res) => {
    let sql = ''
    let vals = []
    if (req.body.username) {
        sql = 'UPDATE users SET username = $1 WHERE id = $2;'
        vals = [req.body.username, req.body.id]
    } else if (req.body.password) {
        const passHash = await bcrypt.hash(req.body.password, 10);
        sql = 'UPDATE users SET pass_hash = $1 WHERE id = $2;'
        vals = [passHash, req.body.id]
    } else
        res.sendStatus(200)
    await pool.query(sql, vals)
    res.sendStatus(200)
})

app.post('/api/deleteUser', isSuperadmin, async (req, res) => {
    await pool.query('DELETE FROM users WHERE id = $1;', [req.body.id])
    res.sendStatus(200)
})

app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.sendStatus(200);
})

//Endpont to get list of events
app.get("/api/event-list", async (req, res) =>{
    try {
        const events = await pool.query('select id, eventname from events where active = true')
        res.json(events.rows);
    } catch (error) {
        console.error(error.message);
    }
})

//Endpoint to get event id
app.get("/api/event-id", async (req, res) => {
    try {
        const values = [req.body.eventname];
        // let values =['united']
        const ids = await pool.query('select id, eventname from events where eventname = $1', values);
        if (ids.rowCount === 0) res.status(404).json('No event was found.');
        else res.json(ids.rows);
    }
    catch(error) {
        console.error(error);
    }
})

// Endpoint to get the list of all event instances that are currently active
app.get("/api/active-event-instance-list", async (req, res) => {
  try {
    const events = await pool.query(
        `select ei.id, ei.eventid, events.eventname, events.eventdescription, events.image_url,
        ei.eventdate, ei.starttime, ei.totalseats, ei.availableseats
        from event_instances as ei join events on ei.eventid = events.id 
        where events.active = true and ei.salestatus = true`);
    res.json(events.rows);
  } catch (err) {
    console.error(err.message);
  }
});

const formatDoorlistResponse = rowdata => ({
    eventname: rowdata[0].eventname,
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
            events.id as "eventid", events.eventname, event_instance.id as "event_instance_id", event_instance.eventdate, event_instance.starttime, tix.checkedin as "arrived", count(cust.id) as "num_tickets"
            from event_instances as event_instance left join events on event_instance.eventid = events.id left join
            tickets as tix on event_instance.id = tix.eventinstanceid
            join customers as cust on tix.custid = cust.id
            where event_instance.id = $1
            group by cust.id, name, events.id, events.eventname, event_instance.id, event_instance.eventdate, event_instance.starttime, tix.checkedin
            order by name`;
        const values = [req.query.eventinstanceid]
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
    
    var email_exists = false;
    try
    {
        const emails = await pool.query("SELECT COUNT(*) FROM customers WHERE email = $1", [req.body.formData.email]);
        email_exists = +emails.rows[0].count > 0;
    }
    catch(error)
    {
        console.error(error.message);
        // Todo(jesse): Handle error cases
    }
    if(email_exists === false)
    {
        try {
            const addedCust = await pool.query(
            `INSERT INTO customers (custname, email, phone, custaddress, newsletter, donorbadge, seatingaccom) 
            values ($1, $2, $3, $4, $5, $6, $7)`,
            [req.body.formData["first-name"] + " " + req.body.formData["last-name"], req.body.formData.email,
             req.body.formData.phone, req.body.formData["street-address"], req.body.formData["opt-in"], false, req.body.formData["seating-accommodation"]])
        } catch (error) {
            console.log(error);
        }
    }
    else
    {
        try
        {
            var body = req.body;
            var values =
            [
                body.formData.email,
                body.formData["first-name"] + " " + body.formData["last-name"],
                body.formData.phone,
                body.formData["street-address"],
                body.formData["opt-in"],
                body.formData["seating-accommodation"]
            ];
            const rows = await pool.query(`UPDATE public.customers
            SET custname=$2, phone=$3, custaddress=$4, newsletter=$5, seatingaccom=$6
            WHERE email=$1;`, values);
        } catch (error) {
            console.log(error);
        }
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

    let orders = req.body.cartItems.map(item => ({
        id: item.product_id,
        quantity: item.qty,
    }))

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        //this is the offending area all this stuff needs to be replaced by info from DB based on event ID or something
        line_items: data.map(item => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                    description: item.desc
                },
                // the price here needs to be fetched from the DB instead
                unit_amount: item.price * 100
            },
            quantity: item.qty
        })).concat(donationItem),
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000",
        payment_intent_data:{
            metadata: {
                orders: JSON.stringify(orders),
                custid: customerID,
                donation: donation
            }
        },
        metadata: {
            orders: JSON.stringify(orders),
            custid: customerID
        }
    })
    console.log(session);
    res.json({id: session.id})
});

//End point to create a new event
app.post("/api/create-event", isAuthenticated, async (req, res) => {
    try {
        const {eventname, eventdescription, image_url} = req.body;
        const query = 
            `INSERT INTO events (seasonid, eventname, eventdescription, active, image_url)
            values (0, $1, $2, true, $3) RETURNING *`;
        const { rows } = await pool.query(query, [eventname, eventdescription, image_url]);
        res.json({rows});
    } catch (error) {
        console.error(error);
    }
})

interface Showing {
    eventid: string,
    eventdate: string,
    starttime: string,
    totalseats: number,
    tickettype: number, // ticket type ID
}
const insertAllShowings = async (showings: Showing[]) => {
    const query =
        `INSERT INTO event_instances (eventid, eventdate, starttime, totalseats, availableseats, salestatus)
        VALUES ($1, $2, $3, $4, $4, true) RETURNING *;`
        
    const res = []
    for (const showing of showings) {
        const {eventid, eventdate, starttime, totalseats, tickettype} = showing
        if (tickettype === undefined) {
            throw new Error('No ticket type provided')
        }
        const {rows} = await pool.query(query, [eventid, eventdate, starttime, totalseats])
        res.push({...rows[0], tickettype})
    }
    return res
}

// End point to create a new showing
app.post("/api/create-event-instances", isAuthenticated, async (req, res) => {
    const {instances} = req.body;
    let newInstances;
    try {
        newInstances = await insertAllShowings(instances)
        // Link showtime to ticket type
        const linkingdata = newInstances.map(s => ({id: s.id, tickettype: s.tickettype}))
        const query2 = 'INSERT INTO linkedtickets (event_instance_id, ticket_type) VALUES ($1, $2)'
        for (const sh of linkingdata) {
            const {id, tickettype} = sh
            await pool.query(query2, [id, tickettype])
        }
        res.json({newInstances});
    }
    catch (err) {
        console.error(err)
        res.status(400)
        res.send(err)
    }
});

/*
* N: newly added property/element
* E: property/element was edited
* D: property/element was deleted
* A: Change occured within array
*/
interface Delta {
    kind: 'N'|'E'|'D'|'A',
    path: Array<string|number>,
    lhs?: any,
    rhs: any,
}

const isShowingChange = (d: Delta) => d.path.includes('showings')
const isEventChange = (d: Delta) => !isShowingChange(d) && d.kind==='E'
const eventFields = ['eventname','eventdescription','image_url']

const updateEvent = async (id: string, changes: Delta[]) => {
    const edits = changes.map(d => [d.path[0], d.rhs])
    let queryResults = []
    for (const edit of edits) {
        if (!eventFields.includes(edit[0])) {
            throw new Error('Invalid field provided')
        }
        const query = `UPDATE events SET ${edit[0]} = $1 WHERE id = $2;`
        const values = [edit[1], id]
        const res = await pool.query(query, values)
        queryResults.push(res.rows)
    }
    return queryResults
}

app.put('/api/edit-event', isAuthenticated, async (req, res) => {
    const { eventid, deltas }: { eventid: string, deltas: Delta[] } = req.body
    if (eventid===undefined || deltas===undefined || deltas.length===0) {
        res.status(400)
        res.send('No edits or event ID provided')
    }
    const eventChanges = deltas.filter(isEventChange)
    const showingChanges = deltas.filter(isShowingChange)

    try {
        let results = []
        if (eventChanges.length > 0) {
            const result = await updateEvent(eventid, eventChanges)
            results.push(result)
        }
        if (showingChanges.length > 0) {
            console.log('TODO: edit showings')
        }

        res.json({rows: results})
    }
    catch (err) {
        console.error(err.message)
        res.status(500)
        res.send('Edit event failed: ' + err.message)
    }
})

// Updates salestatus in showtimes table and active flag in plays table when given a play id
app.post("/api/delete-event", isAuthenticated, async (req, res) => {
    try {
        const {id} = req.body; // playid
        if (id === undefined) {
            throw new Error('No even id provided')
        }
        const archivePlay = 'UPDATE events SET active=false WHERE id=$1;'
        const archiveShowtimes = 'UPDATE event_instances SET salestatus=false WHERE eventid=$1;'

        const archivedPlay = await pool.query(archivePlay, [id])
        const archivedShowtimes = await pool.query(archiveShowtimes, [id])
        res.json({rows: [...archivedPlay.rows, ...archivedShowtimes.rows]})
    } catch (error) {
        console.error(error);
        res.status(400)
        res.send(error)
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
        const values = [body.event_instance_id, body.ticket_type];
        const query = "insert into linkedtickets (event_instance_id, type) values ($1, $2)";
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
            `SELECT ev.id as event_id, ei.id as event_instance_id, eventname, eventdescription, eventdate, starttime, totalseats, availableseats, price, concessions
            FROM events ev
                LEFT JOIN event_instances ei ON ev.id=ei.eventid
                JOIN linkedtickets lt ON lt.event_instance_id=ei.id
                JOIN tickettype tt ON lt.ticket_type=tt.id
            WHERE ev.id=$1 AND isseason=false;`;
        const values = [req.query.event];
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
const fulfillOrder = async (session) => {
    // TODO: fill me in
       // TODO: fill me in
    // gather the data from the session object and send it off to db
    // make this async function
    // added_stuff by Ad
    var custName;
    try {
            custName = await pool.query(
            `SELECT custname
            FROM customers
            WHERE id = $1`
            ,[session.data.object.metadata.custid])
    } catch (error) {
        console.log(error);
    }
    if(session.data.object.metadata.donation > 0){
        try {
            const addedDonation = await pool.query(
            `INSERT INTO donations (donorid, isanonymous, amount, dononame, payment_intent)
            values ($1,$2,$3,$4,$5)`
            ,[session.data.object.metadata.custid, false, session.data.object.metadata.donation, custName.rows[0].custname, session.data.object.id])
        } catch (error) {
            console.log(error);
        }
    }
    const stripe_meta_data = JSON.parse(session.data.object.metadata.orders);
    const temp = [];
    var counter = 0;
    while(counter < stripe_meta_data.length)
    {
        temp[counter] = stripe_meta_data[counter];
        counter = counter + 1;
    }
    counter = 0;

    while(counter < temp.length)
    {
        var other_counter = 0;
        while(other_counter < temp[counter].quantity)
        {
            try {
                const addedTicket = await pool.query(
                `INSERT INTO tickets (eventinstanceid, custid, paid, payment_intent) 
                values ($1, $2, $3, $4)`
                ,[temp[counter].id, session.data.object.metadata.custid, true, session.data.object.id])
            } catch (error) {
                console.log(error);
                other_counter = other_counter - 1;
            }
            other_counter = other_counter + 1;
        }
        counter = counter + 1;
  }
}

const refundOrder = async (session) => {
    try {
        const refundedTicket = await pool.query(
            `DELETE from tickets
            WHERE payment_intent = $1`,
            [session.data.object.payment_intent]
        )
    } catch (error) {
        console.log(error)
    }
    try {
        const refundedDonation = await pool.query(
            `DELETE from donations
            WHERE payment_intent = $1`,
            [session.data.object.payment_intent]
        )
    } catch (error) {
        console.log(error)
    }
}

app.post("/webhook", async(req, res) =>{
    // TESTING WIHT SOME SIGNATURE VERIFICATION
    // const payload = req.body;
    // console.log("PAYLOAD:   ");
    // console.log(payload);
    // const signature = req.headers['stripe-signature'];
    // console.log("SIGNATURE:   ");
    // console.log(signature);
    // let event;
    // try {
    //     event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    // } catch (error) {
    //     console.log(error);
    //     return;
    // }
    const event = req.body;

    switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log('PaymentIntent was successful');

          fulfillOrder(event);
          break;
        case 'charge.refunded':
            refundOrder(event);
            console.log("refund created");
            break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    
      // Return a 200 response to acknowledge receipt of the event
      res.json({received: true});
})

const propToString = prop => obj =>
    ({...obj, [prop]: obj[prop].toString()})
    
app.get('/api/events', async (req, res) => {
    try {
        const querystring = `
            SELECT id, eventname title, eventdescription description, image_url
            FROM events
            WHERE active=true;`
        const data = await pool.query(querystring)
        const events = data.rows.map(propToString('id'))
        res.json(events)
    }
    catch (err) {
        console.error(err.message);
    }
});

// remove $ and parse to float
const parseMoneyString = (s: string) => Number.parseFloat(s.slice(1))
const toTicket = (row): Ticket => {
    const {eventdate, starttime, ...rest} = row
    const [hour, min] = starttime.split(':')
    let date = new Date(eventdate)
    date.setHours(hour,min)
    return {
        ...rest,
        date: date.toJSON(),
        eventid: row.eventid.toString(),
        ticket_price: parseMoneyString(row.ticket_price),
        concession_price: parseMoneyString(row.concession_price),
    }
}

interface TicketState {byId: {[key: number]: Ticket}, allIds: number[]}
const reduceToTicketState = (res, t: Ticket) => {
    const id = t.event_instance_id
    const {byId, allIds} = res
    return (allIds.includes(id))
        ? res
        : {byId: {...byId, [id]: t}, allIds: [...allIds, id]}
}

// Responds with tickets subset of Redux state
app.get('/api/tickets', async (req, res) => {
    try {
        const qs =
            `SELECT
                ei.id AS event_instance_id,
                eventid,
                eventdate,
                starttime,
                totalseats,
                availableseats,
                tt.name AS admission_type,
                price AS ticket_price,
                concessions AS concession_price
            FROM event_instances ei
                JOIN linkedtickets lt ON ei.id=lt.event_instance_id
                JOIN tickettype tt ON lt.ticket_type=tt.id
            WHERE salestatus=true AND isseason=false AND availableseats > 0
            ORDER BY ei.id, event_instance_id;`
        const query_res = await pool.query(qs)
        res.json(
            query_res.rows
                .map(toTicket)
                .reduce(reduceToTicketState, {byId: {}, allIds: []} as TicketState)
        );
        console.log('# tickets:', query_res.rowCount)
    }
    catch (err) {
        console.error(err.message)
    }
})

app.get('/logout', (req, res) => {
    req.logout();
    res.sendStatus(200);
});

app.post('/api/passwordChange', passport.authenticate('local'), async (req, res) => {
    const newHash = await bcrypt.hash(req.body.newPassword, 10)
    const sql = "UPDATE users SET pass_hash = $1 WHERE id = $2;"
    await pool.query(sql, [newHash, req.user.id])
    res.sendStatus(200);
});

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Listening on port ${port}`));
