const { Client } = require('pg');
require('dotenv').config(); // <--- penting

const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

client.connect()
  .then(() => console.log('✅ PostgreSQL connected'))
  .catch(err => console.error('❌ Connection error', err.stack));

module.exports = {
    query: (text, params) => client.query(text, params),
};

// run this files and uncomment code below and comment the above code on line 12 - 18 for testing
// client.connect();

// client.query(`Select * from users`, (err, res) => {
//     if (!err) {
//         console.log(res.rows);
//     }else{
//         console.log(err.message);
//     }
//     client.end;
// })