
let express = require('express');
let bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
let favicon = require('serve-favicon');

//models
let contact = require('./models/contact.js');
let organization = require('./models/organization.js');

//port to go
const http = require('http');
let port = 12345;

//----------------------------------------------------------------------------
//                              HTTP Server
//----------------------------------------------------------------------------

const app = express();

//Directory of static files
const static_dir = 'static';
app.use(express.static(static_dir));

//body parser middleware handles HTTP POST request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const httpServer = http.createServer(app);

//start server
httpServer.listen(port, function () {
    console.log('Listening for HTTP requests on localhost, port ' + port);
});

// open database in memory if does not exist create
let db = new sqlite3.Database('AddressBook.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

// create organization table if not exist
organization.createOrganizationTable(db);
// create contact table if not exist
contact.createContactTable(db);

//Favicon
app.use(favicon(__dirname + '/AddressBookIcon.ico'));

//-----------------------------------------------------------------------------
//                             AJAX REQUESTS
//-----------------------------------------------------------------------------

//Request for adding contact
app.post('/addContact', function (req, res) {
    if (req.body.id === "addContact") {
        contact.addContact(db, req.body.OrganizationId, req.body.Name, req.body.Surname, req.body.Phone, req.body.Email, req.body.Address, req.body.City, req.body.Country, req.body.PostCode);
    } else {
        contact.editContact(db, req.body.id, req.body.OrganizationId, req.body.Name, req.body.Surname, req.body.Phone, req.body.Email, req.body.Address, req.body.City, req.body.Country, req.body.PostCode);
    }
    //We need to send something back
    res.send("<script> window.location.replace('../');</script>");
});
//Request for deleting contact
app.post('/deleteContact', function (req, res) {
    contact.deleteContact(db, req.body.id);
    //We need to send something back
    res.send("<script> window.location.replace('../');</script>");
});
//Request for getting all contact of an organization
app.post('/getContacts', function (req, res) {

    let id = organization.returnIdOfOrganization(db, req.body.OrganizationName);
    id.then(function (Id) {
        let promise = organization.returnContactsOfOrganization(db, Id);
        promise.then(function (value) {
            res.send(value);
        }, function (error) {
            console.error('uh oh: ', error); // 'uh oh: something bad happened’
        });
    }, function (error) {
        console.error('uh oh: ', error); // 'uh oh: something bad happened’
    });
});
//Request for getting contact details
app.post('/getContactDetails', function (req, res) {

    let promise = contact.returnContactDetails(db, req.body.id);
    promise.then(function (value) {
        res.send(value);
    }, function (error) {
        console.error('uh oh: ', error); // 'uh oh: something bad happened’
    });
});


//Request for adding organization
app.post('/addOrganization', function (req, res) {
    organization.addOrganization(db,req.body.id ,req.body.OrganizationName, req.body.Phone, req.body.Email, req.body.Address, req.body.City, req.body.Country, req.body.PostCode);
    //We need to send something back
    res.send("<script> window.location.replace('../');</script>");
});
//Request for deleting organization
app.post('/deleteOrganization', function (req, res) {
    let id = organization.returnIdOfOrganization(db, req.body.OrganizationName);
    id.then(function (Id) {
        organization.deleteOrganization(db, req.body.OrganizationName);
        organization.deleteAllContactsOfOrganization(db, Id);

        res.send("<script> window.location.replace('../');</script>");
    }, function (error) {
        console.error('uh oh: ', error); // 'uh oh: something bad happened’
    });
});
//Request for getting the details of an organization
app.post('/detailsOfOrganization', function (req, res) {
    let promise = organization.detailsOfOrganization(db, req.body.OrganizationName);
    promise.then(function (value) {
        res.send(value);
    }, function (error) {
        console.error('uh oh: ', error); // 'uh oh: something bad happened’
    });
});
//Request for getting the id of an organization
app.post('/getIdOfOrganization', function (req, res) {
    let promise = organization.returnIdOfOrganization(db, req.body.OrganizationName);
    promise.then(function (value) {
        let obj = {};
        obj.id = value;
        res.send(obj);
    }, function (error) {
        console.error('uh oh: ', error); // 'uh oh: something bad happened’
    });
});
//Request for getting all organizations
app.post('/getAllOrganizations', function (req, res) {
    let promise = organization.returnAllOrganizations(db);
    promise.then(function (value) {
        res.send(value);
    }, function (error) {
        console.error('uh oh: ', error); // 'uh oh: something bad happened’
    });
});
