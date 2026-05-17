alter table accounts
    add column address text null,
    add column job varchar(255) null,
    add column place_of_issue varchar(255) null,
    add column date_of_issue date null;
