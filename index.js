var restify = require('restify');
var fs = require('fs');
var debug = require('debug')('store-locator-api:server');
var _ = require('lodash');
const controllers = require('./controllers')
var Logger = require('bunyan');
var log = new Logger.createLogger({
    name: 'tokenmail-api:server',
    serializers: {
        req: Logger.stdSerializers.req
    }
});

var server = restify.createServer({
    name: 'TokenMail',
    log: log
});

server.pre(function (req, res, next) {
    req.log.info({req: req}, 'REQUEST');
    next();
});

server.use(restify.queryParser());
server.use(restify.bodyParser({mapParams: false}));
server.use(restify.gzipResponse());
server.use(restify.authorizationParser());

server.get({path: '/', version: '1.0.0'}, (req, res) => {
    "use strict";
    return res.json({hello: "tokenmail"})
})

server.get({path: '/tokens', version: '1.0.0'}, controllers.tokens.index);

function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val; // named pipe
    }
    
    if (port >= 0) {
        return port; // port number
    }
    return false;
}

(function () {
    var port = normalizePort(process.env.PORT || '3003');
    
    
    console.log('creating at port : ' + port);
    server.listen(port);
    
    server.on('error', function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        
        var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
        
        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    });
    
    server.on('listening', function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
        debug('Listening on ' + bind);
    });
    
})();
