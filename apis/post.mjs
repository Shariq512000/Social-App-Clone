import express from "express";
import { postModel } from "../dbRepo/models.mjs";
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import {
    stringToHash,
    varifyHash,
} from "bcrypt-inzi";
import mongoose from "mongoose";



const router = express.Router()



router.post('/post', (req, res) => {

    const body = req.body;

    if ( // validation
        !body.text
    ) {
        res.status(400).send({
            message: "required parameters missing",
        });
        return;
    }

    console.log(body.text)


    postModel.create({
        text: body.text,
        owner: new mongoose.Types.ObjectId(body.token._id),
    },
        (err, saved) => {
            if (!err) {
                console.log(saved);

                res.send({
                    message: "post added successfully"
                });
            } else {
                res.status(500).send({
                    message: "server error"
                })
            }
        })
})

router.get('/posts', (req, res) => {

    const userId = new mongoose.Types.ObjectId(req.body.token._id);

    postModel.find({ owner: userId, isDeleted: false },{}, {
        sort: { "_id": -1 },
        limit: 100,
        skip: 0
    }, (err, data) => {
        if (!err) {
            res.send({
                message: "got all posts successfully",
                data: data
            })
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})

router.get('/postFeed', (req, res) => {

    postModel.find({ isDeleted: false },{}, {
        sort: { "_id": -1 },
        limit: 100,
        skip: 0,
        populate: {
            path: "owner",
            match: 'firstName lastName'
        }
    }, (err, data) => {
        if (!err) {
            res.send({
                message: "got all posts successfully",
                data: data
            })
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})

router.get('/post/:id', (req, res) => {

    const id = req.params.id;

    postModel.findOne({ _id: id }, (err, data) => {
        if (!err) {
            if (data) {
                res.send({
                    message: `get post by id: ${data._id} success`,
                    data: data
                });
            } else {
                res.status(404).send({
                    message: "post not found",
                })
            }
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})

router.delete('/post/:id', (req, res) => {
    const id = req.params.id;

    postModel.deleteOne({ _id: id, owner: new mongoose.Types.ObjectId(req.body.token._id) }, (err, deletedData) => {
        console.log("deleted: ", deletedData);
        if (!err) {

            if (deletedData.deletedCount !== 0) {
                res.send({
                    message: "Post has been deleted successfully",
                })
            } else {
                res.status(404);
                res.send({
                    message: "No Post found with this id: " + id,
                });
            }
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });








})

router.put('/post/:id', async (req, res) => {

    const body = req.body;
    const id = req.params.id;

    if (
        !body.text
    ) {
        res.status(400).send(` required parameter missing. example request body:
        {
            "text": "value"
        }`)
        return;
    }

    try {
        let data = await postModel.findOneAndUpdate({
            _id: id,
            owner: new mongoose.Types.ObjectId(body.token._id)
        },
            {
                text: body.text,
            },
            { new: true }
        ).exec();

        console.log('updated: ', data);

        res.send({
            message: "post modified successfully"
        });

    } catch (error) {
        res.status(500).send({
            message: "server error"
        })
    }
})

export default router;
