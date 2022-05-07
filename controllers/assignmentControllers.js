import { validationResult } from "express-validator";

import Assignment from "../models/assignmentModel.js";

const addNewAssignment = async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ "error": "Server Error" });
  const { title, description, mentor, createdAt, deadline } = req.body;
  try {
    const newAssignment = new Assignment({
      title,
      description,
      mentor,
      createdAt,
      deadline
    });
    let assignment = await newAssignment.save();
    await res.status(201).json({ message: "Assignment is created."});
  } catch(e) {
    console.error(e);
    return res.status(400).json({ 'error': "Server Error" });
  }
}

const viewAssignment = async(req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if(!assignment) return res.status(404).json({ 'error': 'Can not find the assignment.'});
    return res.status(201).json({ assignment });
  } catch(e) {
    console.error(e);
    return res.status(400).json({ 'error': "Server Error" });
  }
}

const editAssignment = async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ "error": "Server Error" });
  const { title, description, mentor, createdAt, deadline } = req.body;
  try {
    const assignmentId = req.params.assignmentId;
    const assignment = await Assignment.findById(assignmentId);
    if(!assignment) return res.status(404).json({ 'error': 'Can not find the assignment.'});
    if(assignment) {
      assignment.title = title;
      assignment.description = description;
      assignment.mentor = mentor;
      assignment.createdAt = createdAt;
      assignment.deadline = deadline;
    }
    await assignment.save();
    return res.status(201).json({ message: "Assignment updated successfully."})
  } catch (e) {
    console.error(e);
    return res.status(400).json({ 'error': "Server Error" });
  }
}

const deleteAssignment = async(req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if(!assignment) return res.status(404).json({ 'error': 'Can not find the assignment.'});
    await assignment.remove();
    return res.status(201).json({ 'message': 'Assignment removed successfully.' });
  } catch(e) {
    console.error(e);
    return res.status(400).json({ 'error': "Server Error" });
  }
}

export { addNewAssignment, editAssignment, viewAssignment, deleteAssignment };
