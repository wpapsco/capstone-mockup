-----TENTATIVE SQL QUERIES (NOT FINALIZED)-----

--Query to pull a doorlist for a specific event name and date
SELECT Customer.name, Customer.seatingAccom, Reservation.NumTickets
FROM Customer INNER JOIN Reservation ON Reservation.CustID=Customer.ID
WHERE Reservation.eventDate="date" AND Reservation.eventName="name";

--Query to find all the emails of customers signed up for the newsletter
SELECT email
FROM Customer
WHERE newsletter = true;

--Query to find donors to give badges to customers (excludes anonymous people)
----@threshold is a filler variable for a parameter fed in by user
select cust.name, cust.email, cust.phone, dono.amount
from Customer as cust join Donations as dono on cust.ID = dono.DonorID
where @threshold < (select DonorID, sum(amount) from donations group by DonorID);

--Query to find donations made on current day
----CURRENT_DATE should be a pgsql function that returns the current date
----See: https://www.postgresql.org/docs/8.2/functions-datetime.html
select *
from Donations
where donoDate = CURRENT_DATE;

--Query to find donations made on current day modified to show customer information if non anonymous donation
----Not 100% sure if this works how I think it does. Should return empty columns for customer information
----if the anon field is set to true.
select dono.*,
(case when anon = false then cust.name end) as customer,
(case when anon = false then cust.email end) as email,
(case when anon = false then cust.phone end) as phone,
(case when anon = false then cust.address end) as 'address'
from Donations as dono join Customer as cust on donorID = cust.ID
where donoDate = CURRENT_DATE;

--Query for tickets sold by show between a given date range
----@day1 and @day2 are placeholders for parameters fed in by user
----BETWEEN then should work for a range of dates, but can change to "<" or ">" if it doesn't
select play.name, count(tix.TicketNo)
from Ticket as tix join Showtime as shwtm on tix.eventID = shwtm.ID
join Plays as play on shwtm.playID = play.ID
where play.active = true and shwtm.eventDate between @day1 and @day2;