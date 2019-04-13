$(document).ready(function() {

  var currentSelected = "";
  var currentOrganisation = "";
  var organizationId = "";
  var inContacts = false;

  var table = $('#organizationTable').DataTable({

    rowReorder: {
      selector: 'td:nth-child(2)'
    },
    ajax: {
      url: '/getAllOrganizations',
      type: "POST",
      data: {}
    },
    columns: [{
      "data": "organizationName"
    }, ],

    responsive: true,
    select: 'single'
  });

  $('#organizationTable tbody').on('click', 'tr', function() {
    if ($(this).hasClass('selected')) {
      console.log("Selection deleted");
      //disable buttons
      enableDisableButtons(true);
    } else {
      //enable buttons
      enableDisableButtons(false);
      var $columns = $(this).find('td');
      var values = "";
      if (inContacts) {
        currentSelected = $columns[1].innerHTML;
      } else {
        currentSelected = $columns[0].innerHTML;
      }
    }
  })

  //---------------------------------------------------------------------------
  //                             Organization Buttons
  //---------------------------------------------------------------------------
  $('#deleteButton').click(function() {
    //ajax call
    $.ajax({
      url: "/deleteOrganization",
      type: 'POST',
      data: {
        OrganizationName: currentSelected
      },
    }).done(function() {
      table.row('.selected').remove().draw(false);
    });
    //delete from table if succesfull

  });
  $('#detailsButton').click(function() {
    //ajax call fill the details Modal
    $.ajax({
      url: "/detailsOfOrganization",
      type: 'POST',
      data: {
        OrganizationName: currentSelected
      },
    }).done(function(response) {
      var obj = JSON.parse(JSON.stringify(response));
      $("#detailsTitle").text("Details of " + obj.data[0].organizationName);
      var html = "<ul class=\"list-group\">"
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
    //delete from table if succesfull

  });
  $('#editButton').click(function() {
    //ajax call fill the details Modal
    $.ajax({
      url: "/detailsOfOrganization",
      type: 'POST',
      data: {
        OrganizationName: currentSelected
      },
    }).done(function(response) {
      var obj = JSON.parse(JSON.stringify(response));
      $("#addOrganizationTitle").text("Edit " + obj.data[0].organizationName);
      $("#OrganizationName").val(obj.data[0].organizationName);
      $("#Phone").val(obj.data[0].Phone);
      $("#Email").val(obj.data[0].Email);
      $("#Address").val(obj.data[0].Address);
      $("#City").val(obj.data[0].City);
      $("#Country").val(obj.data[0].Country);
      $("#PostCode").val(obj.data[0].PostCode);

    });
    //delete from table if succesfull

  });
  $('#addOrganizationButton').click(function() {
    //ajax call fill the details Modal
    $("#addOrganizationTitle").text("Add Organization");

    $("#OrganizationName").val("");
    $("#Phone").val("");
    $("#Email").val("");
    $("#Address").val("");
    $("#City").val("");
    $("#Country").val("");
    $("#PostCode").val("");

  });
  $('#addContactButton').click(function() {
    $("#organizationIdContact").val(organizationId);
    $("#idContact").val("addContact");
  });
  $('#goToContactsButton').click(function() {
    currentOrganisation = currentSelected;
    inContacts = true;
    getOrganizationId();
    //Change Buttons and Title
    $('#mainTitle').text("Contacts of " + currentSelected);
    $('#OrganizationButtons').hide();
    $('#ContactsButtons').show();
    //disable buttons
    enableDisableButtons(true);
    //ajax call to refill table
    $('#organizationTable').dataTable().fnDestroy();
    $('#organizationTable').find('th').eq(0).after('<th>id</td>');
    $('#organizationTable tfoot').find('th').eq(0).after('<th>id</td>');
    $('#organizationTable').find('tr').each(function() {
      $(this).find('td').eq(0).after('<td>new cell added</td>');

    });

    table = $('#organizationTable').DataTable({
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
  $('#goBackButton').click(function() {
    location.reload();
  });
  $('#detailsContactButton').click(function() {
    //ajax call fill the details Modal
    $.ajax({
      url: "/getContactDetails",
      type: 'POST',
      data: {
        id: currentSelected
      },
    }).done(function(response) {
      var obj = JSON.parse(JSON.stringify(response));
      $("#detailsTitle").text("Details of " + obj.data[0].Name+" " +obj.data[0].Surname);
      var html = "<ul class=\"list-group\">"
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
  $('#editContactButton').click(function() {
    //ajax call fill the details Modal
    console.log("hello");
    $.ajax({
      url: "/getContactDetails",
      type: 'POST',
      data: {
        id: currentSelected
      },
    }).done(function(response) {
      var obj = JSON.parse(JSON.stringify(response));
      console.log(obj.data[0].Name);
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
  $('#deleteContactButton').click(function() {
    $.ajax({
      url: "/deleteContact",
      type: 'POST',
      data: {
        id: currentSelected
      },
    }).done(function() {
      table.row('.selected').remove().draw(false);
    });
  });

  function enableDisableButtons(disable) {

    $("#deleteButton").prop('disabled', disable);
    $("#editButton").prop('disabled', disable);
    $("#detailsButton").prop('disabled', disable);
    $("#goToContactsButton").prop('disabled', disable);

    $("#deleteContactButton").prop('disabled', disable);
    $("#editContactButton").prop('disabled', disable);
    $("#detailsContactButton").prop('disabled', disable);
  }

  function getOrganizationId() {
    $.ajax({
      url: "/getIdOfOrganization",
      type: 'POST',
      data: {
        OrganizationName: currentSelected
      },
    }).done(function(response) {
      organizationId = response.id;

    });
  }

});
function addContact() {
  $.ajax({
    url: '/addContact',
    type: 'post',
    data: $('#contactForm').serialize(),
    success: function() {
      $('#organizationTable').DataTable().ajax.reload();
    }
  });
}
