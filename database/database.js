const Sequelize = require("sequelize");

const connection = new Sequelize("blogcomcrud", "root","123456", {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    timezone: '-03:00'
});

module.exports = connection;