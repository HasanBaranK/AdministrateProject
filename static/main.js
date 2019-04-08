$(document).ready(function() {

    var table = $('#organizationTable').DataTable( {
        rowReorder: {
            selector: 'td:nth-child(2)'
        },
        responsive: true,
        select: 'single'
    } );

    var table = $('#contactTable').DataTable( {
            rowReorder: {
                selector: 'td:nth-child(2)'
            },
            responsive: true
        } );

} );