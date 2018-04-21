/**
 * Created by ananyagoel on 21/04/18.
 */

var db = require('../config/init');

var user_model = db.Model.extend({
    tableName: 'users',
    hasSecurePassword: true,
    idAttribute:'id',
    validations: {
        full_name: [
            'isRequired',
            { method: 'isLength', error: 'full name must be between 2 and 32 characters.', args: [2, 32] }
        ],
        email: [
            'isRequired',
            { method: 'isEmail', error: 'Not a valid email address' }
        ],
        password_digest:[
            'isRequired'
]
    }
});

var user = db.Collection.extend({
    model:user_model
});

module.exports = {
    user_model: db.model('user_model', user_model),
    user: db.collection('user', user)
};
