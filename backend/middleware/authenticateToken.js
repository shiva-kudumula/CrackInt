const jwt = require("jsonwebtoken");

const authenticateToken = (request, response, next) => {

    try {

        const authorization = request.headers.authorization;

        const jwtToken = authorization.split(" ")[1];

        const payload = jwt.verify(jwtToken, "crackint");

        request.user = payload;

        next();

    } catch (error) {

        response.status(401).send("Invalid Token");

    }

};

module.exports = authenticateToken;