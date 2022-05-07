import { validationResult } from "express-validator";

import User from '../models/userModel.js';
import generateToken from "../utills/generateToken.js";

//@route  POST api/auth/register
//@desc   Resister new user
//@access Public
const registerNewUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, username, password, userRole } = req.body;
  try {
    ////Check is already user exits with same email.
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({'error': 'User already exits with this email.'});
    //Check is already user exits with same username(case-insensitive).
    user = await User.findOne({username: {$regex: new RegExp(`^${username}$`), $options: 'i'}});
    if (user) return res.status(400).json({'error': 'Username already exits. Choose another one'});

    //Creating user
    user = await User.create({
      name,
      username,
      email,
      password,
      userRole
    });

    //Checking is admin creating new user or not
    if(req?.user?.userRole === 1) {
      res.status(201).json({ message: "User created successfully"})
    } else { //New user creating account for himself
      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          userRole: user.userRole,
          token: generateToken(user._id)
        })
      }
    }
  } catch (e) {
    console.error(e);
  }
}

const loginUser = async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if(!user) return res.status(401).json({ error: 'Invalid Credentials' });
    if(!(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid Credentials' });  //entered email or password or both was wrong.
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userRole: user.userRole,
      token: generateToken(user._id)
    })
  } catch (e) {
    console.error(e);
    res.status(500).send('Server Error');
  }
}

export { registerNewUser, loginUser };
