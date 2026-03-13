const {Pool} = require("pg");


// pool makes a reusable connection to the database, 
// which is more efficient than creating a new connection for each query
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 30000,
})

pool.connect((err) => {
    if(err){
        console.error("Error connecting to the database:", err);
    }else{
        console.log("Connected to the database successfully.");
    }
})

module.exports = {
    query: (text, params) => pool.query(text, params),
}