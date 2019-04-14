module.exports = {

    createOrganizationTable: function (db) {
        try {
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
        } catch (e) {
            console.log(e);
        }
    },

    addOrganization: function (db, id, OrganizationName, Phone, Email, Address, City, Country, PostCode) {
        try {
            OrganizationName = OrganizationName.trim();
            if(OrganizationName !== "") {
                if (id.trim() === "") {
                    return db.run(
                        `INSERT OR REPLACE INTO organizationTable (OrganizationName ,Phone ,Email ,Address ,City ,Country ,PostCode)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [OrganizationName, Phone, Email, Address, City, Country, PostCode])
                } else {
                    return db.run(
                        `INSERT OR REPLACE INTO organizationTable (id,OrganizationName ,Phone ,Email ,Address ,City ,Country ,PostCode)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [id, OrganizationName, Phone, Email, Address, City, Country, PostCode])
                }
            }
        } catch (e) {
            console.log(e);
        }
    },

    deleteOrganization: function (db, OrganizationName) {
        try {
            return db.run(
                `DELETE FROM organizationTable WHERE OrganizationName = ?`,
                [OrganizationName]);
        } catch (e) {
            console.log(e);
        }
    },

    deleteAllContactsOfOrganization: function (db, OrganizationId) {
        try {
            return db.run(
                `DELETE FROM contactTable WHERE OrganizationId = ?`,
                [OrganizationId]);

        } catch (e) {
            console.log(e);
        }
    },

    returnIdOfOrganization: async function (db, name) {
        return new Promise(function (resolve, reject) {
            let sql = `SELECT id Id,organizationName name FROM organizationTable
                  WHERE name = ?`;

            db.get(sql, [name], (err, row) => {
                if (err) {
                    return console.error(err.message);
                }
                if (row === undefined) {
                    reject();
                } else {
                    return resolve(row.Id);
                }
            })
            //;)
        })

    },

    returnContactsOfOrganization: async function (db, id) {
        try {
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
        } catch (e) {
            console.log(e);
        }
    },

    returnAllOrganizations: async function (db) {
        try {
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
        } catch (e) {
            console.log(e);
        }
    },

    detailsOfOrganization: async function (db, name) {
        try {
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

            });
        } catch (e) {
            console.log(e);
        }
    }

};
