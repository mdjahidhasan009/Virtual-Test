//@route  POST api/auth/register
//@desc   Resister new user
//@access Public
import { validationResult } from "express-validator";
import User from "../models/userModel.js";
import generateToken from "../utills/generateToken.js";

const editUserDetails = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const {name, email, username, userRole} = req.body;
  try {
    let user = await User.findOne({ username: req.params.username });
    if(!user) return res.status(404).json({ 'error': 'User not found with this username.' });

    //username and email must have to be unique.

    let anotherUser;
    if(user.email != email) { //Want to change email
      console.log(user)
      console.log(user.email)
      console.log(email)
      //Check is already another user(with different username) exits with same email.
      anotherUser = await User.find({ username: { $ne: req.params.username }, email });
      if (anotherUser) {
        return res.status(400).json({'error': 'Another user already exits with this email. Please choose another email'});
      }
    }
    if(user.username != req.params.username) { //Want to change username
      //Check is already another user(with different email) exits with same new given username(case-insensitive).
      anotherUser = await User.find({
        username: { $regex: new RexExp(`^${username}$`), $options: 'i'},
        email: { $ne: email }
      });
      if (anotherUser) {
        return res.status(400).json({'error': 'Username already exits. Choose another one'});
      }
    }

    //updating user
    user.name = name;
    user.username = username;
    user.email = email;
    user.userRole = userRole;

    //Updating user
    await user.save();
    res.status(201).json({ message: "User updated successfully"})
  } catch (e) {
    console.error(e);
  }
}

const deleteUser = async(req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if(user) {
      await user.remove();
      res.status(201).json({ message: 'User removed' });
    } else {
      res.status(404).json({ 'error': 'User not found.' });
    }
  } catch(e) {
    console.error(e);

  }
}

export { editUserDetails, deleteUser };
