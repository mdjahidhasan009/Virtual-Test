import express from 'express';
import { check } from 'express-validator';
import {isAdmin, isAuthenticated, isMentorOrAdmin, isStudent, isStudentOrAdmin} from "../middleware/authMiddleware.js";
import {
  addNewAssignment,
  deleteAssignment,
  editAssignment,
  viewAssignment
} from "../controllers/assignmentControllers.js";
import upload from "../middleware/multerMiddleware.js";
import {
  addNewSubmission,
  deleteSubmission,
  editSubmission,
  getStudentSubmission
} from "../controllers/submissionControllers.js";
import {addGrade, deleteGrade, editGrade} from "../controllers/gradeControllers.js";

const router = express.Router();
//base url:api/assignment

router.route('/')
  //@route  POST api/assignment
  //@desc   Adding new assignment
  //@access Private(only by admin or mentor)
  .post(
    isAuthenticated,
    isMentorOrAdmin,
    [
      check('title', 'Please enter a title')
        .not()
        .isEmpty(),
      check('description', 'Please enter description of the assignment')
        .not()
        .isEmpty(),
      check('mentor', 'Please enter mentor\'s username')
        .not()
        .isEmpty(),
      check('createdAt', 'Please enter description of the assignment')
        .isDate(),
      check('deadline', 'Please enter deadline of the assignment')
        .isDate()
    ],
      addNewAssignment
  )

router.route('/:assignmentId')
  //@route  GET api/assignment/:assignmentId
  //@desc   Viewing an assignment
  //@access Private
  .get(
    isAuthenticated,
    viewAssignment
  )

  //@route  PUT api/assignment/:assignmentId
  //@desc   Editing an assignment
  //@access Private(only by admin)
  .put(
    isAuthenticated,
    isAdmin,
    [
      check('title', 'Please enter a title')
          .not()
          .isEmpty(),
      check('description', 'Please enter description of the assignment')
          .not()
          .isEmpty(),
      check('mentor', 'Please enter mentor\'s username')
          .not()
          .isEmpty(),
      check('createdAt', 'Please enter description of the assignment')
          .isDate(),
      check('deadline', 'Please enter deadline of the assignment')
          .isDate()
    ],
    editAssignment
  )

  //@route  DELETE api/assignment/:assignmentId
  //@desc   Deleting an assignment
  //@access Private(only for admin)
  .delete(
    isAuthenticated,
    isAdmin,
    deleteAssignment
  )



//                            Submission
router.route('/:assignmentId/submission')
  //@route  GET api/assignment/:assignmentId/submission/
  //@desc   Submission of a user
  //@access Private(for student only)
  .get(
      isAuthenticated,
      isStudent,
      getStudentSubmission
  )
  //@route  POST api/assignment/:assignmentId/submission
  //@desc   Add a submission in an assignment
  //@access Private(only for admin or student)
  .post(
    isAuthenticated,
    isStudentOrAdmin,
    upload.single('file'),
    addNewSubmission
  )

router.route('/:assignmentId/submission/:submissionId')
  //@route  PUT api/assignment/:assignmentId/submission/:submissionId
  //@desc   Edit a submission in an assignment
  //@access Private(only for admin)
  .put(
    isAuthenticated,
    isAdmin,
    upload.single('file'),
    editSubmission
  )
  //@route  DELETE api/assignment/:assignmentId/submission/:submissionId
  //@desc   Delete a submission in an assignment
  //@access Private(only for admin)
  .delete(
      isAuthenticated,
      isAdmin,
      deleteSubmission
  )





//    Grades
router.route('/:assignmentId/submission/:submissionId/grade')
  //@route  POST api/assignment/:assignmentId/submission/:submissionId/grade
  //@desc   Add a grade in submission in an assignment
  //@access Private(only for admin or mentor)
  .post(
    isAuthenticated,
    isMentorOrAdmin,
    [
      check('mark', 'Please enter a grade')
        .not()
        .isEmpty(),
      check('remarks', 'Please enter your remark about this grade.')
        .not()
        .isEmpty()
    ],
    addGrade
  )
router.route('/:assignmentId/submission/:submissionId/grade/:gradeId')
  //@route  POST api/assignment/:assignmentId/submission/:submissionId/grade
  //@desc   Add a grade in submission in an assignment
  //@access Private(only for admin)
  .put(
    isAuthenticated,
    isAdmin,
    [
      check('mark', 'Please enter a grade')
        .not()
        .isEmpty(),
      check('remarks', 'Please enter your remark about this grade.')
        .not()
        .isEmpty()
    ],
    editGrade
  )
  //@route  DELETE api/assignment/:assignmentId/submission/:submissionId/grade
  //@desc   Delete a grade in submission in an assignment
  //@access Private(only for admin)
  .delete(
    isAuthenticated,
    isAdmin,
    deleteGrade
  )
export default router;
