const User = require("../models/User");
const jwt = require("jsonwebtoken");

const register = async (request, response) => {
                try {
                const { name, email, password } = request.body;

                if (!name) {
                    return response.status(400).send("Name is required");
                }

                if (!email) {
                    return response.status(400).send("Email is required");
                }

                if (!password) {
                    return response.status(400).send("Password is required");
                }
                
                const existingUser = await User.findOne({ email });

                if (existingUser) {
                    return response.status(400).send("Email already exists");
                }

                const user = new User({
                name,
                email,
                password
            });

                await user.save();

            response.status(201).send("User Registered Successfully!");
            } 
            catch (error) {
                console.error(error);
                response.status(500).send("Internal Server Error");
            }
};

const login = async (request, response) => {
     try {
        const { email, password } = request.body;

        const user = await User.findOne({ email });
        if (!user) {
            return response.status(400).send("User doesn't exist");
        }

        if (user.password !== password) {
            return response.status(400).send("Invalid password");
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            "crackint"
        );
        console.log(token);

        response.status(200).json({
            message: "Login Successful!",
            token
        });

    } catch (error) {
        console.log(error);
        response.status(500).send("Internal Server Error");
    }

};

module.exports = {
    register,
    login,
};