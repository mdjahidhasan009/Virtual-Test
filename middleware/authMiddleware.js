import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';

const isAuthenticated = async(req, res, next) => {
  let token = req.headers.authorization;
  if(token && !token.startsWith('Bearer')) {
    res.status(401);
    throw new Error('Please login again!');
  }

  try {
    token = token.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    req.user = await User.findById(decoded._id).select('-password');
  } catch (e) {
    console.error(e);
    res.status(401);
    throw new Error('Please login first');
  }
  next();
};

const isMentorOrAdmin = async (req, res, next) => {
  if(req?.user?.userRole === 2 || req?.user?.userRole === 1) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized, your are not admin nor mentor');
  }
};

const isStudentOrAdmin = async (req, res, next) => {
  if(req?.user?.userRole === 3 || req?.user?.userRole === 1) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized, your are not admin nor student');
  }
};

const isAdmin = async(req, res, next) => {
  if(req.user && req?.user?.userRole === 1) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized, you are not admin!');
  }
};

const isMentor = async(req, res, next) => {
  if(req.user && req.user?.userRole === 2) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized, you are not mentor!');
  }
};

const isStudent = async(req, res, next) => {
  if(req.user && req.user?.userRole === 3) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized, you are not student!');
  }
};

export { isAuthenticated, isAdmin, isMentor, isMentorOrAdmin, isStudentOrAdmin, isStudent };
