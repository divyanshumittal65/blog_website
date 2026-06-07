const db = require('../config/db');
const createuser=(email,password,callback)=>{
        const query="INSERT INTO users (email,password) VALUES(?,?)"
        db.query(query, [email,password],callback);
};
const findUserByEmail = (email, callback) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], callback);
};
module.exports={
    createuser,
    findUserByEmail
}