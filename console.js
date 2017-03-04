/**
 * Created by anthony on 28/02/2016.
 */
let repl = require('repl')
let replHistory = require('repl.history')
// environment configuration
let epa = require('epa')

// database
let moment = require('moment')

let envName = process.env.NODE_ENV || 'dev'

let fs = require('fs')
const path = require('path')
const _ = require('lodash')
const Promise = require('bluebird')


// open the repl session
let replServer = repl.start({
    prompt: "TokenMail (" + envName + ") > "
})
replHistory(replServer, process.env.HOME + '/.node_history')

// attach my modules to the repl context
replServer.context.epa = epa;
replServer.context.moment = moment;
replServer.context.fs = fs;
replServer.context.path = path;
replServer.context.lo = _;
replServer.context.Promise = Promise;
replServer.context.__dirname = __dirname;

