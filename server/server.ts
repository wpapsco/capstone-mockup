// import bodyParser from 'body-parser';
import express from 'express';
import {Request, Response} from 'express';
import {pool} from './db';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// function getUser(req: Request, res: Response) {
//     const id = req.params.id;
//     res.send({express: `Requested data for user ID: ${id}`});
// };

// app.get('/api/users/:id', getUser);

// function postMessages(req: Request, res: Response) {
//     console.log(`I received your POST request. This is what you sent me: ${req.body.post}`)
//     res.send(
//         `I received your POST request. This is what you sent me: ${req.body.post}`
//     );
// };
// app.post('/api/messages', postMessages);

app.get('/api/doorlist', async (req, res) => {
    try{
        const doorlist = await pool.query("SELECT * FROM exdoorlist");
        res.json(doorlist.rows);
    }
    catch(err) {
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
        const rows = await pool.query("UPDATE public.customers\
            SET newsletter=$1, \"volunteer list\"=$2\
            WHERE email = $3;", values);
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
                      body.donorbadge, body.seatingaccom, body.vip, body.volunteer_opt];
        const emails = await pool.query("INSERT INTO public.customers(\
            custname, email, phone, custaddress, newsletter, donorbadge, seatingaccom, vip, \"volunteer list\")\
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);", values);
        res.json(emails.rows);
    }
    catch(err)
    {
        console.error(err.message);
    }
});

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Listening on port ${port}`));
