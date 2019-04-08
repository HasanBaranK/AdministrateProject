var express  = require('express');
const http = require('http');
let port = 12345;
var session = require('express-session');

//----------------------------------------------------------------------------
//                              HTTP Server
//----------------------------------------------------------------------------

const app = express();
const static_dir = 'static';

app.use(express.static(static_dir));

const httpServer = http.createServer(app);

//Do not delete
httpServer.listen(port, function () {
    console.log('Listening for HTTP requests on localhost, port ' + port);
});
