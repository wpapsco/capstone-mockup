# Wonder Tix
Wonder Tix is an in-progress ticket sales software developed in collaboration with Portland Playhouse. 

## Project setup
1. `git clone` the repo
2. `npm install`
3. Create the PostgreSQL DB using the create statements in [`sql-scripts/create_tables.sql`](/sql-scripts/create_tables.sql)
4. Download the [stripe cli](https://stripe.com/docs/stripe-cli) to the project root directory 
	(change the `stripe` script in [package.json](/package.json) if using linux/mac)
5. Create a `.env` file in the root directory and fill out the appropriate fields:
```
PRIVATE_STRIPE_KEY = ...
PUBLIC_STRIPE_KEY = ...
PGHOST = ...
PGPORT = ...
PGUSER = ...
PGPASSWORD = ...
PGDATABASE = ...
```
You can find your Stripe API keys in the [developers section on the stripe website](https://dashboard.stripe.com/test/apikeys)

6. Insert an admin into the `users` table using [bcrypt](https://bcrypt-generator.com/) to generate a password hash
7. `npm run start`

Base project structure from [here](https://medium.com/@anwesha_das/a-strongly-typed-create-react-app-with-an-express-api-server-44e2334ccc71)

## Connecting Stripe to hosted version of the app: 

If this project is being hosted and has a working endpoint url, you can set up webhooks directly in your stripe account on the stripe website.
Go to the [webhook section on the Stripe site](https://dashboard.stripe.com/test/webhooks/create) and fill out the requested information to have requests sent to the server whenever a selected event occurs.
While testing, we listened for the events "payment_intent.succeeded" and "charge.refunded" for adding tickets to the db and initiating refunds.

## License

Copyright © 2021 Aditya Sharoff, Gregory Hairfeld, Jesse Coyle, Francis Phan, William Papsco, Jack Sherman, Geoffrey Corvera

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
