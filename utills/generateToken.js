import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

const generateToken = (_id) => {
  console.log(process.env.JWT_SECRET);
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

export default generateToken;
