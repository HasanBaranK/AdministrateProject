
let express = require('express');
let bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

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

//body parser middleware o handle HTTP POST request
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
    res.send("<script> window.location.replace('../');</script>");
});
//Request for deleting contact
app.post('/deleteContact', function (req, res) {
    contact.deleteContact(db, req.body.id);
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
    organization.addOrganization(db, req.body.OrganizationName, req.body.Phone, req.body.Email, req.body.Address, req.body.City, req.body.Country, req.body.PostCode);
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

//-----------------------------------------------------------------------------
//                            Old Code for Database
//-----------------------------------------------------------------------------

// function createOrganizationTable() {
//   const sql = `
//     CREATE TABLE IF NOT EXISTS organizationTable (
//       id INTEGER PRIMARY KEY,
//       organizationName VARCHAR(50) NOT NULL UNIQUE,
//       Phone VARCHAR(15) DEFAULT "",
//       Email VARCHAR(50) DEFAULT "",
//       Address VARCHAR(100) DEFAULT "",
//       City VARCHAR(50) DEFAULT "",
//       Country VARCHAR(50) DEFAULT "",
//       PostCode VARCHAR(25) DEFAULT ""
//     )`
//   return db.run(sql);
// }
//
// function createContactTable() {
//   const sql = `
//     CREATE TABLE IF NOT EXISTS contactTable (
//         id INTEGER PRIMARY KEY,
//         organizationId INTEGER NOT NULL,
//         Name VARCHAR(50) DEFAULT "",
//         Surname VARCHAR(50) DEFAULT "",
//         Phone VARCHAR(15) DEFAULT "",
//         Email VARCHAR(50) DEFAULT "",
//         Address VARCHAR(100) DEFAULT "",
//         City VARCHAR(50) DEFAULT "",
//         Country VARCHAR(50) DEFAULT "",
//         PostCode VARCHAR(25) DEFAULT ""
//     )`
//   return db.run(sql);
// }
//
//
// function addContact(OrganizationId, Name, Surname, Phone, Email, Address, City, Country, PostCode) {
//   console.log(OrganizationId);
//   return db.run(
//     `INSERT OR REPLACE INTO contactTable (OrganizationId,Name ,Surname ,Phone ,Email ,Address,City ,Country ,PostCode)
//             VALUES (?,?, ?, ?, ?, ?, ?, ?, ?)`,
//     [OrganizationId, Name, Surname, Phone, Email, Address, City, Country, PostCode])
// }
//
// function deleteContact(Id) {
//   return db.run(
//     `DELETE FROM contactTable WHERE id = ?`,
//     [Id]);
// }
//
// function editContact(Id,OrganizationId, Name, Surname, Phone, Email, Address, City, Country, PostCode) {
//   return db.run(
//     `UPDATE contactTable SET OrganizationId = ?, Name = ? ,Surname = ?,Phone = ? ,Email = ? ,Address = ?,City = ? ,Country = ? ,PostCode = ? WHERE id = ?`,
//     [OrganizationId, Name, Surname, Phone, Email, Address, City, Country, PostCode,Id])
// }
//
// async function returnContactDetails(id) {
//   var obj = {};
//   var data = []
//   obj.data = data;
//   return new Promise(function(resolve, reject) {
//     // Async function expression
//     let sql = `SELECT id Id,OrganizationId organizationId, Name name, Surname surname, Phone phone, Email email, Address address, City city, Country country, PostCode postCode FROM contactTable
//                WHERE id = ?`;
//
//     db.all(sql, [id], (err, rows) => {
//       if (err) {
//         throw err;
//       }
//       rows.forEach((row) => {
//         var contact = {};
//         contact.id = row.Id;
//         contact.organizationId = row.organizationId;
//         contact.Name = row.name;
//         contact.Surname = row.surname;
//         contact.Phone = row.phone;
//         contact.Email = row.email;
//         contact.Address = row.address;
//         contact.City = row.city;
//         contact.Country = row.country;
//         contact.PostCode = row.postCode;
//         obj.data.push(contact);
//       });
//       resolve(obj);
//     });
//
//   })
// }
//
//
// function addOrganization(OrganizationName, Phone, Email, Address, City, Country, PostCode) {
//   return db.run(
//     `INSERT OR REPLACE INTO organizationTable (OrganizationName ,Phone ,Email ,Address ,City ,Country ,PostCode)
//           VALUES (?, ?, ?, ?, ?, ?, ?)`,
//     [OrganizationName, Phone, Email, Address, City, Country, PostCode])
// }
//
// function deleteOrganization(OrganizationName) {
//   let id = returnIdOfOrganization(OrganizationName);
//   id.then(function(value) {
//     deleteAllContactsOfOrganization(value);
//     return db.run(
//       `DELETE FROM organizationTable WHERE OrganizationName = ?`,
//       [OrganizationName]);
//   }, function(error) {
//     console.error('uh oh: ', error); // 'uh oh: something bad happened’
//   });
//
//
// }
//
// function deleteAllContactsOfOrganization(OrganizationId) {
//   return db.run(
//     `DELETE FROM contactTable WHERE OrganizationId = ?`,
//     [OrganizationId]);
// }
//
// async function returnContactsOfOrganization(name) {
//   return new Promise(function(resolve, reject) {
//     // Async function expression
//     let id = returnIdOfOrganization(name);
//     id.then(function(value) {
//       let jsonResult = returnContactsOfOrganizationId(value);
//       jsonResult.then(function(value) {
//         //console.log(value.contacts);
//         resolve(value);
//       }, function(error) {
//         console.error('uh oh: ', error); // 'uh oh: something bad happened’
//       });
//     }, function(error) {
//       console.error('uh oh: ', error); // 'uh oh: something bad happened’
//     });
//   })
// }
//
// async function returnIdOfOrganization(name) {
//   return new Promise(function(resolve, reject) {
//     let sql = `SELECT id Id,organizationName name FROM organizationTable
//                   WHERE name = ?`;
//
//     db.get(sql, [name], (err, row) => {
//       if (err) {
//         return console.error(err.message);
//       }
//       console.log(row.Id);
//       return resolve(row.Id);
//
//     })
//     //;)
//   })
//
//
// }
//
// async function returnContactsOfOrganizationId(id) {
//   var obj = {};
//   var data = []
//   obj.data = data;
//   return new Promise(function(resolve, reject) {
//     // Async function expression
//     let sql = `SELECT id Id,OrganizationId organizationId, Name name, Surname surname, Phone phone, Email email, Address address, City city, Country country, PostCode postCode FROM contactTable
//                WHERE organizationId = ?`;
//
//     db.all(sql, [id], (err, rows) => {
//       if (err) {
//         throw err;
//       }
//       rows.forEach((row) => {
//         var contact = {};
//         contact.id = row.Id;
//         contact.organizationId = row.organizationId;
//         contact.Name = row.name;
//         contact.Surname = row.surname;
//         contact.Phone = row.phone;
//         contact.Email = row.email;
//         contact.Address = row.address;
//         contact.City = row.city;
//         contact.Country = row.country;
//         contact.PostCode = row.postCode;
//         obj.data.push(contact);
//       });
//       resolve(obj);
//     });
//
//   })
// }
//
// async function returnAllOrganizations() {
//   var obj = {};
//   var data = []
//   obj.data = data;
//   return new Promise(function(resolve, reject) {
//     // Async function expression
//     let sql = `SELECT OrganizationName organizationName, Phone phone, Email email, Address address, City city, Country country, PostCode postCode FROM organizationTable`;
//
//     db.all(sql, [], (err, rows) => {
//       if (err) {
//         throw err;
//       }
//       rows.forEach((row) => {
//         var contact = {};
//         contact.organizationName = row.organizationName;
//         contact.Phone = row.phone;
//         contact.Email = row.email;
//         contact.Address = row.address;
//         contact.City = row.city;
//         contact.Country = row.country;
//         contact.PostCode = row.postCode;
//         obj.data.push(contact);
//       });
//       resolve(obj);
//     });
//
//   })
// }
//
// async function detailsOfOrganization(name) {
//   var obj = {};
//   var data = []
//   obj.data = data;
//   return new Promise(function(resolve, reject) {
//     // Async function expression
//     let sql = `SELECT OrganizationName organizationName, Phone phone, Email email, Address address, City city, Country country, PostCode postCode FROM organizationTable WHERE OrganizationName = ?`;
//
//     db.all(sql, [name], (err, rows) => {
//       if (err) {
//         throw err;
//       }
//       rows.forEach((row) => {
//         var contact = {};
//         contact.organizationName = row.organizationName;
//         contact.Phone = row.phone;
//         contact.Email = row.email;
//         contact.Address = row.address;
//         contact.City = row.city;
//         contact.Country = row.country;
//         contact.PostCode = row.postCode;
//         obj.data.push(contact);
//       });
//       resolve(obj);
//     });
//
//   })
// }
