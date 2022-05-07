import { validationResult } from "express-validator";
import Assignment from "../models/assignmentModel.js";

const  addGrade = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ "error": "Server Error" });
  const { mark, remarks } = req.body;
  try {
    let assignment = await Assignment.findById(req.params.assignmentId);
    if(!assignment) return res.status(404).json({ 'error': 'Can not find the assignment.'});
    const newGrade = {
      mark,
      remarks
    };
    await Assignment.updateOne(
      { '_id': req.params.assignmentId, 'submissions._id': req.params.submissionId },
      {
        $push: {
          'submissions.$.grades': newGrade
        }
      }
    );
    assignment = await Assignment.findById(req.params.assignmentId);
    return res.status(201).json(assignment);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ 'error': "Server Error" });
  }
}

const editGrade = async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ "error": "Server Error" });
  const { mark, remarks } = req.body;
  try {
    let assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) return res.status(404).json({'error': 'Can not find the assignment.'});
    await Assignment.updateOne(
      { _id: req.params.assignmentId },
      {
        "$set": {
          "submissions.$[i].grades.$[j].mark": mark,
          "submissions.$[i].grades.$[j].remarks": remarks
        }
      }, {
        arrayFilters: [
          { "i._id": req.params.submissionId },
          { "j._id": req.params.gradeId }
        ]
      }
    );
    assignment = await Assignment.findById(req.params.assignmentId);
    return res.status(201).json(assignment);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ 'error': "Server Error" });
  }
}

const deleteGrade = async(req, res) => {
  try {
    let assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) return res.status(404).json({'error': 'Can not find the assignment.'});
    await Assignment.updateOne(
        { _id: req.params.assignmentId },
        {
          "$pull": {
            "submissions.$[i].grades": { "_id": req.params.gradeId }
          }
        }, {
          arrayFilters: [
            { "i._id": req.params.submissionId }
          ]
        }
    );
    assignment = await Assignment.findById(req.params.assignmentId);
    return res.status(201).json(assignment);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ 'error': "Server Error" });
  }
}

export { addGrade, editGrade, deleteGrade };
