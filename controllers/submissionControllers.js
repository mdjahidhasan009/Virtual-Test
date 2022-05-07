import {validationResult} from "express-validator";
import Assignment from "../models/assignmentModel.js";

const addNewSubmission = async(req, res) => {
  const { dateOfSubmission, links } = req.body;
  const file = req?.file?.filename;
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if(!assignment) return res.status(404).json({ 'error': 'Can not find the assignment.' });
    let submissionObj;
    console.log('user daata')
    console.log(req.user)
    if(file) {
      submissionObj = {
        file,
        dateOfSubmission,
        username: req.user.username
      }
    } else {
      submissionObj = {
        links,
        dateOfSubmission,
        username: req.user.username
      }
    }

    assignment.submissions.push(submissionObj);
    await assignment.save();
    return res.status(201).json({ 'message': 'Submission added successfully.' });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ 'error': "Server Error" });
  }
}

const editSubmission = async(req, res) => {
  const { dateOfSubmission, links } = req.body;
  const file = req?.file?.filename;
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if(!assignment) return res.status(404).json({ 'error': 'Can not find the assignment.' });
    let updatedElements;
    if(file) {
      updatedElements = {
        'submissions.$.dateOfSubmission': dateOfSubmission,
        'submissions.$.file': file,
        'submissions.$.links': []
      }
    } else {
      updatedElements = {
        'submissions.$.dateOfSubmission': dateOfSubmission,
        'submissions.$.links': links,
        'submissions.$.file': ''
      }
    }

    await Assignment.updateOne(
      { _id: req.params.assignmentId, 'submissions._id': req.params.submissionId },
        {
          '$set': updatedElements
        }
    )

    return res.status(201).json({ 'message': 'Submission edited successfully.' });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ 'error': "Server Error" });
  }
}

const deleteSubmission = async(req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if(!assignment) return res.status(404).json({ 'error': 'Can not find the assignment.'});

    await Assignment.updateOne(
        { _id: req.params.assignmentId, 'submissions._id': req.params.submissionId },
        {
          '$pull': {
              'submissions': { _id: req.params.submissionId }
          }
        }
    )

    return res.status(201).json({ 'message': 'Submission deleted successfully.' });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ 'error': "Server Error" });
  }
}

const getStudentSubmission = async(req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if(!assignment) return res.status(404).json({ 'error': 'Can not find the assignment.'});
    let submissions = assignment.submissions;
    submissions = submissions.filter(item => item.username == req.user.username);
    return res.status(201).json(submissions);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ 'error': "Server Error" });
  }
}

export { addNewSubmission, editSubmission, deleteSubmission, getStudentSubmission };
