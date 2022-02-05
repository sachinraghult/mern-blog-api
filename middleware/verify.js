const jwt = require("jsonwebtoken");

const verify = async(req, res, next) => {
    const headerToken = req.header("authorization");
    const token = headerToken.split(" ")[1];

    if(!headerToken)
        return res.status(401).json("Access Denied!");
    try {
        const verified = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = verified;
        next();
    } catch {
        res.status(400).send("Invalid Token");
    }
};

module.exports = verify;