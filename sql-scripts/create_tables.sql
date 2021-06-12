-- Create Customers table
----Note that this will have to have a prefilled row for anonymous
create table customers (
    id serial,
    custName varchar(255) not null,
    email varchar(100),
    phone varchar(15),
    custAddress varchar(255),
    newsletter boolean default false,
    donorBadge varchar(100),
    seatingAccom varchar(100),
    vip boolean default false,
    primary key(id)
)

-- Create Donations table
create type freq as enum('one-time', 'weekly', 'monthly', 'yearly');
create table donations (
    donationId serial,
    donorId integer,
    isAnonymous boolean default false,
    amount money,
    donoName varchar(255),
    frequency freq,
    comments varchar(255),
    donoDate date,
    primary key(donationId),
    foreign key(donorId) references customers(id)
)

-- Create Discounts
create table discounts (
    id serial,
    code varchar(255),
    amount money,
    primary key(id)
)

-- Create Reservation table
create table reservation (
    transNo serial,
    custId integer,
    eventId integer,
    eventName varchar(255),
    eventDate date,
    showTime time,
    numTickets integer,
    primary key(transNo),
    foreign key(custId) references customers(id)
)

-- Create TicketLevel
create table ticketLevel (
    typeID integer,
    nameType varchar(100),
    price money,
    fees money,
    primary key(typeID)
)

-- Create TicketList table
create table ticketList (
    ticketNo serial,
    ticketType integer,
    eventId integer,
    custId integer,
    paid boolean,
    active boolean,
    primary key(ticketNo),
    foreign key(ticketType) references ticketLevel(typeID),
    foreign key(eventId) references showtimes(id),
    foreign key(custId) references customers(id)
)

-- Create Seasons table
create table seasons (
    id serial,
    ticketType integer,
    startDate datetime,
    endDate datetime,
    active boolean,
    primary key(id),
    foreign key(ticketType) references ticketLevel(typeID)
)

-- Create Plays table
create table plays (
    id serial,
    seasonId integer,
    playName varchar(255) not null,
    playDescription varchar(255),
    active boolean,
    primary key(id),
    foreign key(seasonId) references seasons(id)
)

-- Create Showtime table
create table showtimes (
    id serial,
    playId integer,
    eventDate date,
    startTime time,
    saleStatus boolean,
    totalSeats integer,
    availableSeats integer,
    purchaseURI varchar(255),
    primary key(id),
    foreign key(playId) references plays(id)
)