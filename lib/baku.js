/**
 * Created by anthony on 03/03/2017.
 */
"use strict";

const Event = {created: Symbol('created'), deleted: Symbol('deleted'), updated:Symbol('updated')}
let EventEmiter = require('events')
const path = require('path')
const Promise = require('bluebird')

const consts = {DB_SYM:Symbol('db'), MASTER_SYM:Symbol('master')}

class BakuDb extends EventEmiter {
    
    constructor(client, options){
        super()
        this.client = client
    }
    
    create(modelCls, path, kwargs){
        return new modelCls(this, kwargs || {})
    }
    
    static get default(){
        return this[consts.DB_SYM]
    }
}

const _ = require('lodash')

class BakuDbModel {
    constructor(db, kwargs){
        this[consts.DB_SYM] = db || BakuDb.default
        this.constructor.master.emit(Event.created, this)
        this.data  = kwargs
    }
    
    destroy(options){
        this.constructor.emit(Event.deleted, this)
    }
    
    setValue(key, value){
        this.constructor.emit(Event.updated, this)
    }
    
    getValue(key){
        
    }
    
    get db() { return this[consts.DB_SYM] }
    
    get path() { return this.constructor.BASE_PATH }
    get meta() { return this._meta }
    
    save(){
        
    }
    
    static get basePath(){
        return '/'
    }
    
    static all(db){
        let basePath = this.basePath
        db = db || BakuDb.default
        let self = this
        
        let ref = db.client.database().ref(basePath);
        
        return new Promise((resolve, reject) => {
            ref.once("value", function(snapshot) {
                //console.log(snapshot.val());
                let res = snapshot.val()
                let vals = []
                for(let [key, value] of _.entries(res)){
                    let v = db.create(self, path.join(basePath, key), value)
                    v.id = key
                    v.name = value.name
                    vals.push(v)
                }
                
                return resolve(vals)
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
                return reject(errorObject)
            });
        })
        
// Attach an asynchronous callback to read the data at our posts reference
        
    }
    
    static findOneById(modelId){
        return this.all().then((models) => {
            return _.find(models, {id: modelId})
        })
    }
    
    get master(){
        return this.constructor.master
    }
    
    static get schema(){
        return null
    }
    
    static get root(){
        if(this === BakuDbModel) return null
        return BakuDbModel.master
    }
    
    static get master(){
        let cached = this[consts.MASTER_SYM]
        if(cached) {
            return cached
        }
        
        console.log('%s creating new master', this.name)
        
        cached = new EventEmiter()
        if(this.root === null) {
            this[consts.MASTER_SYM] = cached
            console.log('%s: no root', this.name)
            return cached
        }
        
        let emitterRedirect = (event) => {
            cached.emit.apply(cached, arguments)
            //console.log('%s redirecting to root', this.name, arguments)
            this.root.emit.apply(this.root, arguments)
        }
        
        let eProxy = new Proxy(cached, {
            get: function(target, name) {
                //console.log('%s: proxy get', name)
                if (name === 'emit') return emitterRedirect
                return target[name]
            }
        })
        
        this[consts.MASTER_SYM] = eProxy
        cached.val = this.name
        return eProxy
    }
}

let util = require('util')
class User extends BakuDbModel {
    
}

class Token extends BakuDbModel {
    
    static get basePath(){
        return '/tokens'
    }
}

if(!module.parent){
    
    console.log('hello node')
    let c = new BakuDb('CLIENT!!')
    
    // User.master.once(Event.created, ()=>{
    //     console.log('user created!')
    // })
    
    let m = c.create(User)
    console.log('M1:', User.master)
    //console.log('M2:', BakuDbModel.master.val)
    
    
    
    // let admin = require('firebase-admin')
    //
    // console.warn('firebase client is initialising in admin mode');
    // let app = admin.initializeApp({
    //     credential: admin.credential.cert(Path.join(__dirname, '/../serviceAccountKey.json')),
    //     databaseURL: 'https://web-domain-sellers.firebaseio.com'
    // });
}
exports.initdb = () => {
    let admin = require('firebase-admin')
    
    let fn = path.join(__dirname, '/../serviceAccountKey.json')
    
    if(!require('fs').existsSync(fn)){
        fn = path.join(__dirname, '/../../../../serviceAccountKey.json')
        console.log('using alth cert path: %s', fn)
    }
    
    console.warn('firebase client is initialising in admin mode');
    let app = admin.initializeApp({
        credential: admin.credential.cert(fn),
        databaseURL: 'https://web-domain-sellers.firebaseio.com'
    });
    
    BakuDb[consts.DB_SYM] = new BakuDb(app)
}

exports.BakuDb = BakuDb
exports.BakuDbModel = BakuDbModel


exports.models = {Token, User}


