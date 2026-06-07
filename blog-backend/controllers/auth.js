const bcrypt =require("bcrypt");
const user= require("../models/user")
const jwt = require("jsonwebtoken");
const signup=async(req,res)=>{
    try{
        const{email,password}=req.body;
        const hashedPassword=await bcrypt.hash(password,10);
        user.createuser(
            email,
            hashedPassword,
            (err,resutl)=>{
                if(err){
                    return res.status(500).json(err)
                }            
                res.status(201).json({
                    message:"user created successfully"
                });
            }
        )
    }catch(error){
        res.status(500).json(error);
    }
}
const login = (req, res) => {
    const { email, password } = req.body;

    user.findUserByEmail(email, async (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const existingUser = results[0];

        const isMatch = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: existingUser.id
            },
            process.env.JWT_SECRET
        );

        res.json({
            token
        });
    });
};
module.exports={
    signup,
    login
}