"use strict";

let restify = require('restify');
let fs = require('fs');
let debug = require('debug')('tokenmail-api:server');
let _ = require('lodash');
const controllers = require('./controllers')
let Logger = require('bunyan');
let log = new Logger.createLogger({
    name: 'tokenmail-api:server',
    serializers: {
        req: Logger.stdSerializers.req
    }
});

let server = restify.createServer({
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


let envName = process.env.NODE_ENV || 'dev'
let isDev = envName === 'dev'
let basePath = isDev ? '/api' : ''

console.log('Node env is "%s"', envName)

server.use((req, res, next) => {
    if(isDev){
        res.set('Access-Control-Allow-Origin', '*')
    }
    next()
})


server.get({path: basePath + '/tokens', version: '1.0.0'}, controllers.tokens.index)
server.get({path: basePath + '/tokens/:token_id', version: '1.0.0'}, controllers.tokens.show)

function normalizePort(val) {
    let port = parseInt(val, 10);
    if (isNaN(port)) {
        return val; // named pipe
    }
    
    if (port >= 0) {
        return port; // port number
    }
    return false;
}

(function () {
    let port = normalizePort(process.env.PORT || '3003');
    
    
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
        let addr = server.address();
        let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
        debug('Listening on ' + bind);
    });
    
})();
