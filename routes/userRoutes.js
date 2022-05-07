import express from 'express';
import { check } from "express-validator";

import { isAdmin, isAuthenticated } from "../middleware/authMiddleware.js";
import { registerNewUser } from "../controllers/authControllers.js";
import { deleteUser, editUserDetails } from "../controllers/userControllers.js";

const router = express.Router();
//base url:api/user

router.route('/')
  //@route  POST api/user
  //@desc   Add new user
  //@access Private(only for admin)
  .post(
    isAuthenticated,
    isAdmin,
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
  )

router.route('/:username')
  //@route  PUT api/user/:username
  //@desc   Edit user details
  //@access Private(only for admin)
  .put(
    isAuthenticated,
    isAdmin,
    [
      check('name', 'Name is required') //Checking is name field empty
          .not()
          .isEmpty(),
      check('email', 'Enter a valid email') //Checking validity of given email
          .isEmail(),
      check('username', 'Username is required')
          .not()
          .isEmpty()
    ],
    editUserDetails
  )
  //@route  DELETE api/user/:username
  //@desc   Delete a user
  //@access Private(only for admin)
  .delete(
    isAuthenticated,
    isAdmin,
    deleteUser
  )

export default router;
