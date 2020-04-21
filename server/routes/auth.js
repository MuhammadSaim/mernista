const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');

// signup route
router.post('/signup', (req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(422).json({
            error: "Please fill all the fields."
        });
    }
    User.findOne({email: email})
        .then(user => {
            if(user){
                return res.status(422).json({
                    error: "User is already exists try another one."
                });
            }else{
                bcrypt.hash(password, 12)
                    .then(password => {
                        const user = new User({
                            name,
                            email,
                            password
                        });
                        user.save()
                            .then(user => {
                                return res.json({
                                    message: "Your account is created successfully."
                                });
                            })
                            .catch(err=>{
                                return res.status(422).json({
                                    error: "Something went wrong please try again."
                                });
                            });
                });
            }
        })
        .catch(err=>{
            return res.status(422).json({
                error: "Something went wrong please try again."
            });
        });

});

// signin route
router.post('/signin', (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(422).json({
            error: "Please fill all the fields."
        });
    }
    User.findOne({email: email})
        .then(user => {
            if(user){
                bcrypt.compare(password, user.password)
                    .then(authenticatedUser => {
                        if(authenticatedUser){
                           return res.json(user);
                        }else{
                            return res.status(422).json({
                                error: "Email or password is incorrect."
                            });
                        }
                    })
                    .catch(err => {
                        return res.status(422).json({
                            error: "Something went wrong please try again."
                        });
                    })
            }else{
                return res.status(422).json({
                    error: "Account is not exists in our system."
                });
            }
        })
        .catch(err => {
            return res.status(422).json({
                error: "Something went wrong please try again."
            });
        })

});


module.exports = router;
