const {Conflict, Unauthorized}=require("http-errors");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const { ctrlWrapper } = require("../helpers");
const {User}=require("../models/user");
const {SECRET_KEY}=process.env;


const register = async(req,res)=>{
    const {email, password}=req.body;
    const user = await User.findOne({email});
    if(user){
    throw new Conflict(`Email ${email} in use`)
    }
    const hashPassword=bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    await User.create({email, password: hashPassword});
    res.status(201).json({ user: {email, password: hashPassword} });
}

const login = async(req,res)=>{
    const {email, password}=req.body;
    const user = await User.findOne({email});
    if (!user){
        throw new Unauthorized("Email is wrong")
        }
    const passCompare = bcrypt.compareSync(password, user.password)
    if ( !passCompare){
    throw new Unauthorized("Password is wrong")
    }
    const payload={id:user._id};
    const token=jwt.sign(payload, SECRET_KEY);
    res.json({data:{token}});
}

const logout = async(req,res)=>{}

const current = async(req,res)=>{}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    current: ctrlWrapper(current)
}