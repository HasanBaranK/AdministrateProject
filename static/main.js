$(document).ready(function () {

    //currently selected organization or contact in table
    let currentSelected = "";
    //currently selected organization
    let currentOrganisation = "";
    //currently selected organizations Id
    let organizationId = "";
    //start from organizations
    let inContacts = false;

    let mainTable = $('#organizationTable');

    //load the table of organizations
    let table = mainTable.DataTable({

        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        ajax: {
            url: '/getAllOrganizations',
            type: "POST",
            data: {}
        },
        columns: [
            {"data": "organizationName"},

        ],

        responsive: true,
        select: 'single'
    });
    //select when table is clicked
    mainTable.find('tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            //Clicked on already selected selection is deleted
            currentSelected = "";
            //disable buttons
            enableDisableButtons(true);
        } else {


            let $columns = $(this).find('td');
            try {
                if (inContacts) {
                    //if we are in contacts get the id of contact which is in the second row
                    currentSelected = $columns[1].innerText;
                } else {
                    //if we are in organizations get the name of organizations which is in the first row
                    currentSelected = $columns[0].innerText;
                }
                //enable buttons
                enableDisableButtons(false);
            } catch {
                currentSelected = "";
            }
        }
    });

    //---------------------------------------------------------------------------
    //                             Organization Buttons
    //---------------------------------------------------------------------------

    //When user clicks the delete, delete the organization with ajax call
    $('#deleteButton').click(function () {
        //ajax call for deleting
        $.ajax({
            url: "/deleteOrganization",
            type: 'POST',
            data: {
                OrganizationName: currentSelected
            },
        }).done(function () {
            //remove from table if succesfull
            table.row('.selected').remove().draw(false);
            //disable the buttons
            enableDisableButtons(true);
        });


    });
    //When user clicks the details, gets the details with an ajax call and fills the modal with html generated
    $('#detailsButton').click(function () {
        //ajax call fill the details Modal
        $.ajax({
            url: "/detailsOfOrganization",
            type: 'POST',
            data: {
                OrganizationName: currentSelected
            },
        }).done(function (response) {
            let obj = JSON.parse(JSON.stringify(response));
            $("#detailsTitle").text("Details of " + obj.data[0].organizationName);
            let html = "<ul class=\"list-group\">";
            html = html + "<li class=\"list-group-item\"> Organization Name: " + obj.data[0].organizationName + "</li>";
            html = html + "<li class=\"list-group-item\"> Phone: " + obj.data[0].Phone + "</li>";
            html = html + "<li class=\"list-group-item\"> E-mail: " + obj.data[0].Email + "</li>";
            html = html + "<li class=\"list-group-item\"> Address: " + obj.data[0].Address + "</li>";
            html = html + "<li class=\"list-group-item\"> City: " + obj.data[0].City + "</li>";
            html = html + "<li class=\"list-group-item\"> Country: " + obj.data[0].Country + "</li>";
            html = html + "<li class=\"list-group-item\"> PostCode: " + obj.data[0].PostCode + "</li>";
            html = html + "</ul>";
            $("#addDetailsHere").empty();
            $("#addDetailsHere").append(html);
        });

    });
    //When user clicks the edit, gets the details with ajax call and fills the edit modal with values
    $('#editButton').click(function () {
        //ajax call fill the edit Modal
        $.ajax({
            url: "/detailsOfOrganization",
            type: 'POST',
            data: {
                OrganizationName: currentSelected
            },
        }).done(function (response) {
            let obj = JSON.parse(JSON.stringify(response));
            $("#addOrganizationTitle").text("Edit " + obj.data[0].organizationName);
            $("#OrganizationId").val(obj.data[0].id);
            $("#OrganizationName").val(obj.data[0].organizationName);
            $("#Phone").val(obj.data[0].Phone);
            $("#Email").val(obj.data[0].Email);
            $("#Address").val(obj.data[0].Address);
            $("#City").val(obj.data[0].City);
            $("#Country").val(obj.data[0].Country);
            $("#PostCode").val(obj.data[0].PostCode);

        });

    })
    //When user clicks the add organization, ready the modal by clearing the values and setting the title
    $('#addOrganizationButton').click(function () {

        $("#addOrganizationTitle").text("Add Organization");

        $("#OrganizationId").val("");
        $("#OrganizationName").val("");
        $("#Phone").val("");
        $("#Email").val("");
        $("#Address").val("");
        $("#City").val("");
        $("#Country").val("");
        $("#PostCode").val("");

    });
    //When user clicks the go to contacts, refresh the table with a new ajax call and set the title and table
    $('#goToContactsButton').click(function () {

        currentOrganisation = currentSelected;
        inContacts = true;
        getOrganizationId();

        //Change Buttons and Title
        $('#mainTitle').text("Contacts of " + currentSelected);
        $('#OrganizationButtons').hide();
        $('#ContactsButtons').show();
        //disable buttons
        enableDisableButtons(true);
        //destroy the table
        mainTable.dataTable().fnDestroy();
        //add new row for id to the table
        mainTable.find('th').eq(0).after('<th>id</td>');
        mainTable.find('tfoot').find('th').eq(0).after('<th>id</td>');
        mainTable.find('tr').each(function () {
            $(this).find('td').eq(0).after('<td></td>');

        });
        //ajax call to refill table
        table = mainTable.DataTable({
            rowReorder: {
                selector: 'td:nth-child(2)'
            },
            ajax: {
                url: '/getContacts',
                type: "POST",
                data: {
                    "OrganizationName": currentSelected
                }
            },
            columns: [{
                "data": "Name"
            },
                {
                    "data": "id"
                },

            ],

            responsive: true,
            select: 'single'
        })
    });
    //---------------------------------------------------------------------------
    //                             Contact Buttons
    //---------------------------------------------------------------------------
    //When user clicks the add contacts, Makes the modal ready for adding contact by cleaning and changing the title
    $('#addContactButton').click(function () {

        $("#organizationIdContact").val(organizationId);
        $("#idContact").val("addContact");
        $("#addContactTitle").text("Add Contact to " + currentOrganisation);

        $("#OrganizationId").val("");
        $("#NameContact").val("");
        $("#SurnameContact").val("");
        $("#PhoneContact").val("");
        $("#EmailContact").val("");
        $("#AddressContact").val("");
        $("#CityContact").val("");
        $("#CountryContact").val("");
        $("#PostCodeContact").val("");
    });
    //When user clicks go back, refresh the page
    $('#goBackButton').click(function () {
        location.reload();
    });
    //When user clicks the details, gets the details with an ajax call and fills the modal with html generated
    $('#detailsContactButton').click(function () {
        //ajax call fill the details Modal
        $.ajax({
            url: "/getContactDetails",
            type: 'POST',
            data: {
                id: currentSelected
            },
        }).done(function (response) {
            let obj = JSON.parse(JSON.stringify(response));
            $("#detailsTitle").text("Details of " + obj.data[0].Name + " " + obj.data[0].Surname);
            let html = "<ul class=\"list-group\">";
            html = html + "<li class=\"list-group-item\"> Id: " + obj.data[0].id + "</li>";
            html = html + "<li class=\"list-group-item\"> Name: " + obj.data[0].Name + "</li>";
            html = html + "<li class=\"list-group-item\"> Surname: " + obj.data[0].Surname + "</li>";
            html = html + "<li class=\"list-group-item\"> Phone: " + obj.data[0].Phone + "</li>";
            html = html + "<li class=\"list-group-item\"> E-mail: " + obj.data[0].Email + "</li>";
            html = html + "<li class=\"list-group-item\"> Address: " + obj.data[0].Address + "</li>";
            html = html + "<li class=\"list-group-item\"> City: " + obj.data[0].City + "</li>";
            html = html + "<li class=\"list-group-item\"> Country: " + obj.data[0].Country + "</li>";
            html = html + "<li class=\"list-group-item\"> PostCode: " + obj.data[0].PostCode + "</li>";
            html = html + "<li class=\"list-group-item\"> Organization Id: " + obj.data[0].organizationId + "</li>";
            html = html + "</ul>";
            $("#addDetailsHere").empty();
            $("#addDetailsHere").append(html);
        });
        //delete from table if succesfull

    });
    //When user clicks the edit, gets the details with ajax call and fills the edit modal with values
    $('#editContactButton').click(function () {
        //ajax call fill the details Modal
        $.ajax({
            url: "/getContactDetails",
            type: 'POST',
            data: {
                id: currentSelected
            },
        }).done(function (response) {
            let obj = JSON.parse(JSON.stringify(response));
            console.log(obj.data[0].Name);
            $("#addContactTitle").text("Edit " + obj.data[0].Name + " " + obj.data[0].Surname);
            $("#NameContact").val(obj.data[0].Name);
            $("#idContact").val(obj.data[0].id);
            $("#organizationIdContact").val(obj.data[0].organizationId);
            $("#SurnameContact").val(obj.data[0].Surname);
            $("#PhoneContact").val(obj.data[0].Phone);
            $("#EmailContact").val(obj.data[0].Email);
            $("#AddressContact").val(obj.data[0].Address);
            $("#CityContact").val(obj.data[0].City);
            $("#CountryContact").val(obj.data[0].Country);
            $("#PostCodeContact").val(obj.data[0].PostCode);

        });
        //delete from table if succesfull

    });
    //When user clicks the delete, delete the contact with ajax call
    $('#deleteContactButton').click(function () {
        $.ajax({
            url: "/deleteContact",
            type: 'POST',
            data: {
                id: currentSelected
            },
        }).done(function () {
            table.row('.selected').remove().draw(false);
            //disable the buttons
            enableDisableButtons(true);
        });
    });
    //When the contact form submitted prevent submission through form, serialize the form and send it through ajax request
    $('#contactForm').submit(function (e) {
        //prevent submitting through form
        e.preventDefault();
        //check if the name is empty
        let name = $("#NameContact").val();
        if (name.trim() !== "") {
            //ajax request to add the contact
            $.ajax({
                url: '/addContact',
                type: 'post',
                data: $('#contactForm').serialize(),
                success: function () {
                    mainTable.DataTable().ajax.reload();
                    $("#closeContact").click()
                }
            });

        }
    });
    //if true disables the buttons if false enables the buttons
    function enableDisableButtons(disable) {

        $("#deleteButton").prop('disabled', disable);
        $("#editButton").prop('disabled', disable);
        $("#detailsButton").prop('disabled', disable);
        $("#goToContactsButton").prop('disabled', disable);

        $("#deleteContactButton").prop('disabled', disable);
        $("#editContactButton").prop('disabled', disable);
        $("#detailsContactButton").prop('disabled', disable);
    }
    //sets the Id of the organization with an ajax call
    function getOrganizationId() {
        $.ajax({
            url: "/getIdOfOrganization",
            type: 'POST',
            data: {
                OrganizationName: currentSelected
            },
        }).done(function (response) {
            organizationId = response.id;

        });
    }

});