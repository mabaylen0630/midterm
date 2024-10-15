const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAllStudent = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT student_id, first_name, mid_name, last_name, created_at, updated_at FROM students');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });  0
  }
};

const getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT student_id, first_name, mid_name, last_name, user_id, course_id created_at, updated_at FROM students WHERE student_id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createStudent = async (req, res) => {
  const { first_name, mid_name, last_name, user_id, course_id} = req.body;

  try {
    const [result] = await pool.query('INSERT INTO student (first_name, mid_name, last_name, user_id, course_id) VALUES (?, ?, ?, ?, ?)', [first_name, mid_name, last_name, user_id, course_id]);
    res.status(201).json({ message: 'Student Selected' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { first_name, mid_name, last_name, user_id, course_id } = req.body;

  try {
    const [result] = await pool.query('UPDATE student SET first_name = ?, mid_name = ?, last_name =?, user_id = ? course_id =? WHERE student_id = ?', [first_name, mid_name, last_name, user_id, course_id, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student data updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM students WHERE student_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student data deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllStudent, getStudentById, createStudent, updateStudent, deleteStudent };
