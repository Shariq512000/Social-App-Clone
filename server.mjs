import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import {
    stringToHash,
    varifyHash,
} from "bcrypt-inzi";
import authApis from "./apis/auth.mjs";
import postApis from "./apis/post.mjs";
import { userModel } from './dbRepo/models.mjs';

const SECRET = process.env.SECRET || "topsecret";

const app = express()
const port = process.env.PORT || 5001;

app.use(cookieParser());
app.use(express.json());


app.use(cors({
    origin: ['http://localhost:3000', "*"],
    credentials: true
}));

// let products = []; // TODO: connect with mongodb instead


app.use('/api/v1' , authApis)

app.use('/api/v1' , (req, res, next) => {

    console.log("req.cookies: ", req.cookies);

    if (!req?.cookies?.Token) {
        res.status(401).send({
            message: "include http-only credentials with every request"
        })
        return;
    }

    jwt.verify(req.cookies.Token, SECRET, function (err, decodedData) {
        if (!err) {

            console.log("decodedData: ", decodedData);

            const nowDate = new Date().getTime() / 1000;

            if (decodedData.exp < nowDate) {

                res.status(401);
                res.cookie('Token', '', {
                    maxAge: 1,
                    httpOnly: true,
                    sameSite: "none",
                    secure: true
                });
                res.send({ message: "token expired" })

            } else {

                console.log("token approved");

                req.body.token = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
});

const getUser = async (req,res) => {
    let _id = "";
    console.log("profile===");


    if(req.params.id){
        _id = req.params.id
    }
    else{
        _id = req.body.token._id
    }

    try{
        const user = await userModel.findOne({ _id: _id }, "firstName lastName email -_id").exec()
        if(!user){
            res.status(404).send({})
            return;
        }
        else{
            res.status(200).send(user);
            console.log("profile");
        }
    } catch(error){
        console.log("error" , error)
        res.status(500).send({ message: "something went wrong"})
    }
} 

app.get('/api/v1/profile' , getUser);
app.get('/api/v1/profile/:id' , getUser);

app.post('/api/v1/change-password' , async(req , res) => {
 try{
    const _id = req.body.token._id
    const currentPassword = req.body.currentPassword
    const newPassword = req.body.newPassword

    const user = await userModel.findOne( {_id:_id} , "password", ).exec()

    if(!user) throw new Error("User Not Found")

    const isMatch = await varifyHash(currentPassword , user.password)

    if(!isMatch) throw new Error("Current Password is not Match to your Password")

    const newHash = await stringToHash(newPassword);

    await userModel.updateOne({_id:_id}, {password: newHash}).exec()

    res.send({
        message: "Password Change Successful"
    })



 }catch(error){

    console.log("Error :" , error);
    res.status(500).send({})

 }
}
)

app.use( '/api/v1' , postApis )

const __dirname = path.resolve();
app.use('/', express.static(path.join(__dirname, './web/build')))
app.use('*', express.static(path.join(__dirname, './web/build')))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

