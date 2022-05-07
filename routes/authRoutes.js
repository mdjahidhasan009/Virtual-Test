import express from 'express';
import { check } from "express-validator";

import { loginUser, registerNewUser } from "../controllers/authControllers.js";

const router = express.Router();

// base url: api/auth

router.route('/login')
    //@route  POST api/auth/login
    //@desc   Login user
    //@access Public
    .post(
      [
        check('email', 'Enter a valid email')
          .isEmail(),
        check('password', 'Enter a password of 6 or more character')
          .isLength({ min: 6 })
      ],
      loginUser
    );

router.route('/register')
    //@route  POST api/auth/register
    //@desc   Resister new user
    //@access Public
    .post(
      [
        check('name', 'Name is required') //Checking is name field empty
          .not()
          .isEmpty(),
        check('email', 'Enter a valid email') //Checking validity of given email
          .isEmail(),
        check('username', 'Username is required')
          .not()
          .isEmpty(),
        check('password', 'Enter a password of 6 or more character')
          .isLength({ min: 6 })
      ],
        registerNewUser
    );

export default router;
