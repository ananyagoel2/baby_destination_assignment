/**
 * Created by ananyagoel on 21/04/18.
 */

var knexile = require('../knexfile');

var knex = require('knex')(knexile.development);

var bookshelf = require('bookshelf')(knex);

var validator = require('validator');
var securePassword = require('bookshelf-secure-password')


validator.isRequired = function (val) {
    return val != null;
}

bookshelf.plugin('registry');
bookshelf.plugin('visibility');
bookshelf.plugin('bookshelf-validate',{
    validator: validator,
    validateOnSave: true
});

bookshelf.plugin(securePassword)


module.exports= bookshelf;