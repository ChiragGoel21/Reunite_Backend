const {validationResult} = require('express-validator');
const User = require('../model/userModel');
const bcrypt= require('bcrypt');
const jwt=require('jsonwebtoken');
const nodemailer=require('nodemailer');
const crypto=require('crypto');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'reunite.noreply@gmail.com',
      pass: 'ulbouhycwyawlmrb'
    }
  });

exports.getUserInfo=(req,res,next)=>{
    User.isUser(req.userId).then(result=>{
        if(result)
        {
            return res.json({
                name:result.name,
                profileImage:result.profileImage,
                email:result.email,
                userid:result._id
            });
        }
        const err= new Error("No user persent");
        err.statusCode=401;
        throw err;
    }).catch(err=>{
        next(err);
    })
}


exports.getUserIntrest=(req,res,next)=>{
    User.fetchUserIntrest(req.userId).then(result=>{
        if(result)
        {
            return res.status(200).json({
                status:'200',
                message:'fetched sucessfully',
                intrest:result,
            });
        }
        const err=new Error('you dont choose your intrest at time of registration');
        err.statusCode=422;
        throw err;
    }).catch(err=>{next(err)});
}

exports.postIsUserEmailVerified=(req,res,next)=>{
    const email=req.body.email;
    User.isUserEmailVerified(email).then(verified=>{
        if(verified.verified)
        {
            return res.status(200).json({
                status:200,
                message:'email is verified'
            })
        }

        User.FinishLoginSession(verified.id).then(result=>{
            return res.status(200).json({
                status:404,
                message:'please verifiy your email before login'
            })
        })
    }).catch(err=>{next(err)});
}







exports.postValidateEmail=(req,res,next)=>{
    const error=validationResult(req);
    if(!error.isEmpty())
    {
        const errInput=error.errors[0].param;
        let err;
        if(errInput==='email')
            err= new Error("Enter valid E-mail address");
            
        err.statusCode=422;
        throw err;
    }
    const email=req.body.email;
    if(email===req.userEmail)
    {
        let err= new Error('Sorry! you can not send invitation to yourself');
        err.statusCode=422;
        throw err;
    }
    User.fetchUserByEmail(email).then(user=>{
        if(user)
        {
            return res.status(200).json({
                status:200,
                message:'Valid Email',
                _id:user._id
            });
        }
        const error= new Error('Email is not register in reunite');
        error.statusCode=422;
        throw error;
    }).catch(err=>{
        next(err);
    })
}


exports.postRegsitration=(req,res,next)=>{

    const error=validationResult(req);
    if(!error.isEmpty())
    {
        const errInput=error.errors[0].param;
        let err;
        if(errInput==='name')
            err= new Error('Name length should be greater then 2');
        else if(errInput==='password')
            err= new Error('Weak_Password, it should be minimum 6 charachter'); 
        else if(errInput==='email')
            err= new Error(error.errors[0].msg);
            
        err.statusCode=422;
        throw err;
    }

    const name=req.body.name;
    const email=req.body.email;
    const password= req.body.password;

    bcrypt.hash(password,12).then(hashPassword=>{

        if(!hashPassword)
        {
            const err= new Error('Server Error');
            throw err;
        }
        const user= new User(name,email,hashPassword);
        user.save().then(result=>{
            if(!result)
            {
                let err= new Error('Server Error');
                throw err;
            }
            crypto.randomBytes(32,(err,buffer)=>{
                if(err)
                {
                    return;
                }
                const token=buffer.toString('hex');
                const time=Date.now() + 3600000;
                User.verificationToken(token,time,user._id).then(promise=>{

                    var confirmAccountMail={
                        from:'reunite.noreply@gmail.com',
                        to:user.email,
                        subject:'Verify your email',
                        html:`
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <meta http-equiv="X-UA-Compatible" content="ie=edge">
                            <title>Login</title>
                            <style>
                                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');
                                * {
                                    margin: 0;
                                    padding: 0;
                                    box-sizing: border-box;
                                    font-family: 'Poppins', sans-serif;
                                }
                                body {
                                    min-height: 100vh;
                                    width: 100%;
                                    font-size: 20px;
                                    background: black;
                                }
                                .myimage {
                                    text-align: center;
                                }
                                .btn{
                                    color: #fff;
                                    background: black;
                                    font-size: 1.2rem;
                                    text-align: center;
                                    font-weight: 500;
                                    border: 1px solid #31676a;
                                    padding:5px 0px;
                                    background-color:#31676a;
                                    border-radius: 6px;
                                    letter-spacing: 1px;
                                    margin-top: 1.7rem;
                                    cursor: pointer;
                                    transition: 0.4s;
                                }
                                .button{
                                    color: #fff;
                                    background: black;
                                    font-size: 1.2rem;
                                    text-align: center;
                                    font-weight: 500;
                                    letter-spacing: 1px;
                                    margin-top: 1.4rem;
                                    cursor: pointer;
                                    transition: 0.4s;
                                }
                                .container {
                                    position: absolute;
                                    padding: 40px;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                    max-width: 100%;
                                    max-height: 80%;
                                    width: 100%;
                                    color: #fff;
                                    background: black;
                                    border: 1px solid#fff;
                                    border-radius: 7px;
                                    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
                                }
                                a, a:hover{
                                    text-decoration:none;
                                    color:white;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h1> <header> <center>Confirm your Account!</center> </header> </h1><br>
                                <div class="myimage"> <img src="https://firebasestorage.googleapis.com/v0/b/reunite-9214d.appspot.com/o/reunite.png?alt=media&token=757d15df-2c0a-4e76-b1ac-56877a6dbfd4" width="200px" height="200px"><br><br></div>
                                <h4>Thankyou for choosing Virtual Meet. <br>
                                    You've successfully created your account. We're excited to get you started. Please confirm your account by clicking on the button below. </h4><br>
                                    <a href='https://reuniteserverr.onrender.com/auth/verifyEmail/${token}'><div class='btn'>Verify</div></a>
                            </div>
                        </body>
                        </html>
                        `
                    }

                    transporter.sendMail(confirmAccountMail, function(error, info){
                        if (error) {
                          console.log(error);
                        }
                    });
                })
            })

            return res.status(201).json({
                _id:result.insertedId,
                "message":"Registration Sucessfull",
                "status":201,
            })
        }).catch(err=>{
            if(!err.statusCode)
            {
                err.statusCode=500;
            }
            next(err);
        });
    }).catch(err=>{
        if(!err.statusCode)
        {
                err.statusCode=500;
        }
        next(err);
    }) 
}

exports.postIntrestofUser=(req,res,next)=>{
    const id=req.body.id;
    const intrest=req.body.intrest;

    User.updateIntrest(id,intrest).then(ok=>{
            if(ok)
            {
                return res.json({
                    "status":201,
                    "message":'Intrest send sucessfully'
                });
            }
            const err= new Error("Server Error");
            throw err;
    }).catch(err=>{
        if(!err.statusCode)
        {
            err.statusCode=500;
        }
        next(err);
    });
}

exports.postLogin=(req,res,next)=>{
    const error=validationResult(req);
    const email=req.body.email;
    const password=req.body.password;
    if(!error.isEmpty())
    {
        const errInput=error.errors[0].param;
        let err;
        if(errInput==='password')
            err= new Error('password is empty'); 
        else if(errInput==='email')
            err= new Error("Email is not valid");           
        err.statusCode=422;
        throw err;
    }

    User.fetchUserByEmail(email).then(user=>{
       // console.log(user);
        if(!user)
        {
            let error= new Error("Email is not registered");
            error.statusCode=404;
            throw error;
        }

        bcrypt.compare(password,user.password).then(match=>{
            if(!match)
            {
                let err=new Error("Password is incorrect");
                err.statusCode=422;
                throw err;
            }

            const token=jwt.sign({
                email:user.email,
                user_id:user._id
            },'reunitesecretkey(@Reunite0207)withTeamLeaderDeepanshuKamboj',{expiresIn:'4h'});
            
            if(user.loginSession)
            {
                let error=new Error('You are alreagy login with diffrent IP Address');
                error.statusCode=422;
                throw error;
            }

            User.startLoginSession(user._id).then(start=>{
                return res.status(200).json({
                    status:200,
                    message:"Login Sucessfully",
                    token:token,
                    user_id:user._id,
                    email:user.email,
                    username:user.name,
                    profileImage:user.profileImage,
                })
            }).catch(err=>{
                next(err);
            })

        }).catch(err=>{
            if(!err.statusCode)
            {
                err.statusCode=500;
            }
            next(err);
        })
    }).catch(err=>{
        if(!err.statusCode)
        {
            err.statusCode=500;
        }
        next(err);
    })
}

exports.postLogout=(req,res,next)=>{
    const id=req.body.userid;
    User.FinishLoginSession(id).then(result=>{
        if(result)
        {
            return res.status(200).json({
                status:200,
                message:'Logout Sucessfully'
            })
        }
        const err= new Error('server error');
        throw err;
    }).catch(err=>{
        next(err);
    })
}

exports.postValidateUser=(req,res,next)=>{
    const id=req.body.userid;
    User.isUser(id).then(result=>{
        if(result)
        {
            return res.status(200).json({
                status:200,
                message:'user is valid'
            });
        }
        return res.status(200).json({
            status:404,
            message:'user is not valid'
        });
    })
}

exports.postUpdateProfileImage=(req,res,next)=>{
    const updateImage=req.body.updateImage;
    if(updateImage)
    {
        User.updateProfileImage(req.userId,updateImage).then(update=>{
            if(update)
            {
                return res.status(200).json({
                    status:200,
                    message:'profile image updated sucessfully'
                });
            }
            const err= new Error('Server Error');
            throw err;
        }).catch(err=>{
            next(err);
        })
    }
}

exports.verifyEmailPost=(req,res,next)=>{
    const tokenID=req.params.token;
    User.findUserByEmailToken(tokenID).then(result=>{
        //console.log(result);
        if(result!=null && result?.result)
        {
           var mailOptions = {
                from: 'reunite.noreply@gmail.com',
                to: result.user.email,
                subject: 'account created sucessfully',
                html:`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title>Login</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');
                
                        * {
                            width:100%;
                            height:100%;
                            box-sizing: border-box;
                            font-family: 'Poppins', sans-serif;
                        }
                        body {
                            min-height: 100vh;
                            width: 100vh;
                            font-size: 20px;
                            background: black;
                        }
                        .myimage {
                            text-align: center;
                        }
                        .container {
                            position: absolute;
                            padding: 40px;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            max-width: 100%;
                            max-height: 80%;
                            width: 100%;
                            color: #fff;
                            background: black;
                            border: 1px solid#fff;
                            border-radius: 7px;
                            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <header><h2 style="text-align: center;">Welcome! Dear ${result.user.name}</h2></header><br>
                        <div class="myimage"> <img src="https://firebasestorage.googleapis.com/v0/b/reunite-9214d.appspot.com/o/reunite.png?alt=media&token=757d15df-2c0a-4e76-b1ac-56877a6dbfd4" width="40px" height="40px"><br><br></div>
                        <h3>Congratulations! You've successfully created your account. We're excited to get you started. Let's
                            connect in the Virtual World together.</h3><br>
                    </div>
                </body>
                </html>
                `
              };



            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                }
            });
           return res.redirect('https://reunite.onrender.com');
        }
        else{
            return res.status(404).send('<h3 style="text-align:center;"> Your Email is already verified <h3>')
        }
    }).catch(err=>{console.log(err)});
}