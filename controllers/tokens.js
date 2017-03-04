/**
 * Created by anthony on 22/02/2017.
 */
"use strict";
const baku = require('../lib/baku')
const models = baku.models
baku.initdb()


exports.index = function (req, res) {
    
    return models.Token.all().then((tokens) => res.json(tokens))
}

exports.show = function (req, res) {
    return models.Token.findOneById(req.params.token_id).then((tokens) => res.json(tokens))
}