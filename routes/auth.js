const express = require('express');
const router=express.Router();
const authControler= require('../controlers/authControler');
const {body}= require('express-validator');
const User = require('../model/userModel');
const isAuth= require('../midalewere/is_auth');

router.get('/user_info',isAuth,authControler.getUserInfo);
router.get('/userIntrest',isAuth,authControler.getUserIntrest);
router.get('/verifyEmail/:token',authControler.verifyEmailPost)



router.post('/is-user-email-verified',authControler.postIsUserEmailVerified);

router.post('/validateEmail',isAuth,[
    body('email').trim().isEmail()
],
authControler.postValidateEmail);

router.post('/registration',[
    body('name').trim().isLength({min:3}),
    body('password').trim().isLength({min:6}),
    body('email').trim().isEmail().custom((value,{req})=>{
        return User.fetchUserByEmail(value).then(user=>{
            if(user)
            {
                return Promise.reject('Email is already exist');
            }
        })
    })
],authControler.postRegsitration);

router.post('/intrest',authControler.postIntrestofUser);

router.post('/login',[
    body('password').trim().isLength({min:'1'}),
    body('email').trim().isEmail()
],authControler.postLogin);

router.post('/logout',authControler.postLogout);

router.post('/validate-user',authControler.postValidateUser);

router.post('/updateProfileImage',isAuth,authControler.postUpdateProfileImage);


module.exports=router;