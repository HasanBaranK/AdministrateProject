module.exports = {

    createOrganizationTable: function (db) {
        const sql = `
    CREATE TABLE IF NOT EXISTS organizationTable (
      id INTEGER PRIMARY KEY,
      organizationName VARCHAR(50) NOT NULL UNIQUE,
      Phone VARCHAR(15) DEFAULT "",
      Email VARCHAR(50) DEFAULT "",
      Address VARCHAR(100) DEFAULT "",
      City VARCHAR(50) DEFAULT "",
      Country VARCHAR(50) DEFAULT "",
      PostCode VARCHAR(25) DEFAULT ""
    )`;
        return db.run(sql);
    },

    addOrganization: function (db,id, OrganizationName, Phone, Email, Address, City, Country, PostCode) {
        if(id.trim() === ""){
            return db.run(
                `INSERT OR REPLACE INTO organizationTable (OrganizationName ,Phone ,Email ,Address ,City ,Country ,PostCode)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [OrganizationName, Phone, Email, Address, City, Country, PostCode])
        }else {
            return db.run(
                `INSERT OR REPLACE INTO organizationTable (id,OrganizationName ,Phone ,Email ,Address ,City ,Country ,PostCode)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, OrganizationName, Phone, Email, Address, City, Country, PostCode])
        }
    },

    deleteOrganization: function (db, OrganizationName) {
        return db.run(
            `DELETE FROM organizationTable WHERE OrganizationName = ?`,
            [OrganizationName]);
    },

    deleteAllContactsOfOrganization: function (db, OrganizationId) {
        return db.run(
            `DELETE FROM contactTable WHERE OrganizationId = ?`,
            [OrganizationId]);
    },

    returnIdOfOrganization: async function (db, name) {
        return new Promise(function (resolve, reject) {
            let sql = `SELECT id Id,organizationName name FROM organizationTable
                  WHERE name = ?`;

            db.get(sql, [name], (err, row) => {
                if (err) {
                    return console.error(err.message);
                }
                return resolve(row.Id);

            })
            //;)
        })


    },

    returnContactsOfOrganization: async function (db, id) {
        let obj = {};
        obj.data = [];
        return new Promise(function (resolve, reject) {
            // Async function expression
            let sql = `SELECT id Id,OrganizationId organizationId, Name name, Surname surname, Phone phone, Email email, Address address, City city, Country country, PostCode postCode FROM contactTable
               WHERE organizationId = ?`;

            db.all(sql, [id], (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    let contact = {};
                    contact.id = row.Id;
                    contact.organizationId = row.organizationId;
                    contact.Name = row.name;
                    contact.Surname = row.surname;
                    contact.Phone = row.phone;
                    contact.Email = row.email;
                    contact.Address = row.address;
                    contact.City = row.city;
                    contact.Country = row.country;
                    contact.PostCode = row.postCode;
                    obj.data.push(contact);
                });

                resolve(obj);
            });

        })
    },

    returnAllOrganizations: async function (db) {
        let obj = {};
        obj.data = [];
        return new Promise(function (resolve, reject) {
            // Async function expression
            let sql = `SELECT id Id, OrganizationName organizationName, Phone phone, Email email, Address address, City city, Country country, PostCode postCode FROM organizationTable`;

            db.all(sql, [], (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    var contact = {};
                    contact.id = row.Id;
                    contact.organizationName = row.organizationName;
                    contact.Phone = row.phone;
                    contact.Email = row.email;
                    contact.Address = row.address;
                    contact.City = row.city;
                    contact.Country = row.country;
                    contact.PostCode = row.postCode;
                    obj.data.push(contact);
                });
                console.log(obj);
                resolve(obj);
            });

        })
    },

    detailsOfOrganization: async function (db, name) {
        let obj = {};
        obj.data = [];
        return new Promise(function (resolve, reject) {
            // Async function expression
            let sql = `SELECT id Id, OrganizationName organizationName, Phone phone, Email email, Address address, City city, Country country, PostCode postCode FROM organizationTable WHERE OrganizationName = ?`;

            db.all(sql, [name], (err, rows) => {
                if (err) {
                    throw err;
                }
                rows.forEach((row) => {
                    let contact = {};
                    contact.id = row.Id;
                    contact.organizationName = row.organizationName;
                    contact.Phone = row.phone;
                    contact.Email = row.email;
                    contact.Address = row.address;
                    contact.City = row.city;
                    contact.Country = row.country;
                    contact.PostCode = row.postCode;
                    obj.data.push(contact);
                });
                resolve(obj);
            });

        })
    }

};
