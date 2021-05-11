// import bodyParser from 'body-parser';
import express from 'express';
import {Request, Response} from 'express';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

function getUser(req: Request, res: Response) {
    const id = req.params.id;
    res.send({express: `Requested data for user ID: ${id}`});
};
app.get('/api/users/:id', getUser);

function postMessages(req: Request, res: Response) {
    console.log(`I received your POST request. This is what you sent me: ${req.body.post}`)
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`
    );
};
app.post('/api/messages', postMessages);

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Listening on port ${port}`));
