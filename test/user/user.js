let crypto = require('crypto');
let bcrypt = require('bcrypt');

function getRandomString(len) {
    // if(!) len = 16;
    return crypto.randomBytes(Math.ceil(len/2).toString('hex'));
    
}

var should = require('should');
var app = require('../../app');
var mongoose = require('mongoose');
var User = require('../../app/models/user');

descripe('<Unit Test',()=>{
    descripe('Model User:',()=>{
        defore()
    })
})

