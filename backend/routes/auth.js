const express = require('express');
const User = require('../models/User');
const router = express.Router();

var fetchuser = require('../middleware/fetchuser');


// For validation of input values 
const { body, validationResult } = require('express-validator');

//for password protection generates salt ,pepper 
const bcrypt = require('bcryptjs');

// for token handling 
var jwt = require('jsonwebtoken');

// Keep this string safe and not to disclose it to anyone and with this we will sign our web token
const JWT_SECRET = 'Samirisagoodb$oy'


// ROUTE 1 :
// Create a user using : POST "/api/auth/createUser".Doesnt require authentication.No login required
router.post('/createUser', [
    // We will insert all our validation in this which  are required 
    body('name', 'Enter a valid name min 3 letters').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be alteast 5 characters ').isLength({ min: 5 })

], async (req, res) => {
    let success = false;
    // If there are errors than return bad request and the errors .Here we are checking the validity of the req
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If errors isnt empty than go inside if statement 
        return res.status(400).json({success, errors: errors.array() });
    }
    try {
        // Check whether the user with this email exist already or not 
        let user = await User.findOne({success, email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exist " })
        }

        // Ruk jao await ka matlab :ruk jao pehle ye resolve ho jai phir is ki value leke jao aur baad me aage ka execute karo 

        // Generates a salt 
        const salt = await bcrypt.genSalt(10);
        // It returns a promise 
        const secPass = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });

        const data = {
            // We are signing with id as it has index so retriving would be easy  
            user: {
                id: user.id
            }
        }

        // Signing with the data and a secret   
        const authToken = jwt.sign(data, JWT_SECRET);
        success=true;
        res.json({success, authToken })
        
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})



// ROUTE 2 :
// Another endpoint 
//  Authenticate a user  using : POST "/api/auth/login".Doesnt require authentication.No login required(login karne ke liye bhi login required thodi na hoga )
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),

], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        // fetch the user whose (email)=(incoming email )
        let user = await User.findOne({ email })
        if (!user) {
            success = false;

            return res.status(400).json({ success, error: "Please try to login with correct credentials  " });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({ success, error: "Please try to login with correct credentials  " });
        }

        //  data of user which we will send 
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})



// ROUTE 3 : Get logged-in  user details using : POST "/api/auth/getuser". require authentication. login required,so we have to send the token jwt
//Second argument is middleware and then the async function runs 
router.post('/getuser', fetchuser, async (req, res) => {
    //and then in req we will get the user .jaha jaha ese routes milege jaha par hame login ki jarurat padegi wah par ham fetchuser parameter dal dege
    try {
        userId = req.user.id
        //With select we can get all the fiels except the password 
        const user = await User.findById(userId).select("-password");
        res.send(user)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})





module.exports = router