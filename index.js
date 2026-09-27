const express = require('express');
const app = express();
const { authMiddleware } = require("./middleware.js");
const jwt = require("jsonwebtoken");
const { userModel, organizationModel } = require("./models")
app.use(express.json());

let BOARD_ID = 1;
let ISSUE_ID = 1;

const BOARDS = [];
const ISSUES = [];
app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const userExists = await userModel.findOne({
        username: username
    })
    if (userExists) {
        res.status(403).send({
            message: "user already exists"
        })
        return;



    }
    const newuser = await userModel.create({
        username: username,
        password: password
    })
    res.send({
        id: newuser._id,
        message: "user signed up successfully"
    })


})
app.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const userExists = await userModel.findOne({
        username: username,
        password: password

    })
    if (!userExists) {
        res.status(401).send({
            message: "invalid credentials"
        })
        return;
    }
    const token = jwt.sign({
        userId: userExists._id

    }, "123attlasian")

    res.json({
        token
    })
})
//authenticated endpoint 
app.post("/organization", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const neworg = await organizationModel.create({

        title: req.body.title,
        description: req.body.description,
        admin: userId,
        members: []
    })

    res.json({
        message: " new organanization created successfully",
        id: neworg._id
    })

})


app.post("/add-member-to-organization", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const OrganizationId = req.body.OrganizationId;
    const memberusername = req.body.memberusername;
    const organization = await organizationModel.findOne({
        _id: OrganizationId,
    })
    if (!organization || organization.admin.toString() != userId) {
        res.status(403).json({
            message: "this org not created or you are not an amdmin of org"

        })
        return;
    }
    const memberuser = await userModel.findOne({
        username: memberusername

    });
    if (!memberuser) {
        res.status(403).json({
            message: "no user with this memeberusername"

        })
        return;

    }
    await organizationModel.updateOne({

        _id: OrganizationId
    }, {
        $push: {
            members: memberuser._id
        }
    })


    res.json({
        message: "new member added"
    })


})
app.get("/organization", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const organizationId = req.query.organizationId;
    const organization = await organizationModel.findOne({
        _id: organizationId
    })
    if (!organization || organization.admin.toString() != userId) {
        res.status(403).json({
            message: "this org not created or you are not an amdmin of org"

        })
        return;
    }
    const members=await userModel.find({
        _id:organization.members
    })
    res.json({
        organization:{
            title:organization.title,
            description:organization.description,
            members:members.map(m=>({
                username:m.username,
                id:m._id
            }))

        }
        

    })
})

    app.post("/board", (req, res) => {
    })
    app.post("/issue", (req, res) => {
    })
    app.get("/boards", (req, res) => {
    })
    app.get("/issues", (req, res) => {
    })
    app.get("/members", (req, res) => {
    })


    app.put("/issues", (req, res) => {

    })
    app.delete("/members", authMiddleware, async (req, res) => {
        const userId = req.userId;
        const OrganizationId = req.body.OrganizationId;
        const memberusername = req.body.memberusername;
        const organization = await organizationModel.findOne({
            _id:OrganizationId
        })
        if (!organization || organization.admin.toString() !== userId) {
            res.status(403).json({
                message: "this org not created or you are not an amdmin of org"

            })
            return;
        }
        const memberuser = await userModel.findOne({
            username:memberusername

        })
        if (!memberuser) {
            res.status(403).json({
                message: "no user with this memeberusername"

            })
            return;

        }
        await organizationModel.updateOne({
            _id:OrganizationId
        },{
            $pull:{
                members:memberuser._id

            }
        })

        res.json({
            message: "memeber delted"
        })


    })

    app.listen(3000);
