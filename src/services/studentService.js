const Student = require('../models/Student');
const { AppError } = require('../middleware/errors');

async function createStudent(data) { return Student.create(data); }

async function getStudent(regNo) {
  const student = await Student.findOne({ regNo: String(regNo).toUpperCase() });
  if (!student) throw new AppError(404, 'Student not found');
  return student;
}

module.exports = { createStudent, getStudent };
