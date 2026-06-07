require("./config/db");
const express=require("express")
const cors = require("cors");
const authMiddleware = require("./middleware/authmiddleware");
const app=express()
const PORT = process.env.PORT || 4000;
app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.json())
const authRoutes=require("./routes/authroute")
app.use("/api/auth",authRoutes)
const postRoutes=require("./routes/postroute")
app.use("/api/posts", postRoutes);
app.get('/',(req,res)=>{
    res.send("api node running")
})
app.get(
    "/profile",
    authMiddleware,
    (req, res) => {
        res.json({
            message: "Protected Route",
            user: req.user
        });
    }
);
app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})
