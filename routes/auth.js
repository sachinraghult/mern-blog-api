const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
    try {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        const user = await newUser.save();

        const {password, ...others} = user._doc;
        res.status(200).json(others);

    } catch(err) {
        res.status(500).json(err);
    }
});


// LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if(!user)
            return res.status(400).json("Wrong credentials!");

        const validated = await bcrypt.compare(req.body.password, user.password);
        if(!validated)
            return res.status(400).json("Wrong credentials!");

        const accessToken = jwt.sign({_id: user._id}, process.env.SECRET_TOKEN, {
            expiresIn: process.env.EXPIRES_IN,
        });
        
        res.setHeader("authorization", accessToken);

        const {password, ...others} = user._doc;
        res.status(200).json(others);

    } catch(err) {
        res.status(500).json(err);
    }
})


module.exports = router;