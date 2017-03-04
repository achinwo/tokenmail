/**
 * Created by anthony on 03/03/2017.
 */
"use strict";
let gulp = require('gulp')
let exec = require('child_process').exec
let Promise = require('bluebird')
const baku = require('./lib/baku')

gulp.task('publish', (cb) => {
    exec('cap push', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('publish:api', (cb) => {
    exec('cap push api', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('tokens:list', () => {
    baku.initdb()
    return baku.models.Token.all()
        .then((tokens) => {
            console.log(tokens)
        })
        .finally(() => baku.BakuDb.default.client.delete())
})