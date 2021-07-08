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
    seatingAccom boolean,
    vip boolean default false,
    primary key(id)
);

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
);

-- Create Discounts
create table discounts (
    id serial,
    code varchar(255),
    amount money,
    primary key(id)
);

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
);

-- Create Seasons table
create table seasons (
    id serial,
    name varchar(100),
    startDate timestamp,
    endDate timestamp,
    primary key(id)
);

-- Create TicketType
create table ticketType (
    id integer,
    name varchar(100),
    isSeason boolean,
    seasonId integer,
    price money,
    concessions money,
    primary key(id),
    foreign key(seasonId) references seasons(id)
);

-- Create Plays table
create table plays (
    id serial,
    seasonId integer,
    playName varchar(255) not null,
    playDescription varchar(255),
    active boolean,
    primary key(id),
    foreign key(seasonId) references seasons(id)
);

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
);
-- Create Tickets table
create table tickets (
    ticketNo serial,
    type integer,
    eventId integer,
    custId integer,
    paid boolean,
    active boolean,
    primary key(ticketNo),
    foreign key(type) references ticketType(id),
    foreign key(eventId) references showtimes(id),
    foreign key(custId) references customers(id)
);

create table users (
    id serial primary key,
    username varchar(255),
    pass_hash varchar(255)
);
