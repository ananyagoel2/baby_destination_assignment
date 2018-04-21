/**
 * Created by ananyagoel on 21/04/18.
 */

var config = require('./config/config.json');

module.exports={
    development:{
        client:'pg',
        connection :{
            host:config.host,
            user: config.user,
            password:config.password,
            database: config.database},
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        },
        // debug: false
    }
};