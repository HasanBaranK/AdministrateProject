
module.exports = {

createContactTable: function(db) {
  const sql = `
    CREATE TABLE IF NOT EXISTS contactTable (
        id INTEGER PRIMARY KEY,
        organizationId INTEGER NOT NULL,
        Name VARCHAR(50) DEFAULT "",
        Surname VARCHAR(50) DEFAULT "",
        Phone VARCHAR(15) DEFAULT "",
        Email VARCHAR(50) DEFAULT "",
        Address VARCHAR(100) DEFAULT "",
        City VARCHAR(50) DEFAULT "",
        Country VARCHAR(50) DEFAULT "",
        PostCode VARCHAR(25) DEFAULT ""
    )`
  return db.run(sql);
},

addContact:function (db,OrganizationId, Name, Surname, Phone, Email, Address, City, Country, PostCode) {
  console.log(OrganizationId);
  return db.run(
    `INSERT OR REPLACE INTO contactTable (OrganizationId,Name ,Surname ,Phone ,Email ,Address,City ,Country ,PostCode)
            VALUES (?,?, ?, ?, ?, ?, ?, ?, ?)`,
    [OrganizationId, Name, Surname, Phone, Email, Address, City, Country, PostCode])
},

deleteContact: function (db,Id) {
  return db.run(
    `DELETE FROM contactTable WHERE id = ?`,
    [Id]);
},

editContact: function (db,Id,OrganizationId, Name, Surname, Phone, Email, Address, City, Country, PostCode) {
  return db.run(
    `UPDATE contactTable SET OrganizationId = ?, Name = ? ,Surname = ?,Phone = ? ,Email = ? ,Address = ?,City = ? ,Country = ? ,PostCode = ? WHERE id = ?`,
    [OrganizationId, Name, Surname, Phone, Email, Address, City, Country, PostCode,Id])
},

returnContactDetails: async function (db,id) {
  var obj = {};
  var data = []
  obj.data = data;
  return new Promise(function(resolve, reject) {
    // Async function expression
    let sql = `SELECT id Id,OrganizationId organizationId, Name name, Surname surname, Phone phone, Email email, Address address, City city, Country country, PostCode postCode FROM contactTable
               WHERE id = ?`;

    db.all(sql, [id], (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        var contact = {};
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
}

};
