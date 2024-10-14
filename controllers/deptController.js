const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAllDept = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT dept_id, dept_code, dept_name, created_at, updated_at FROM departments');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDeptById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT dept_id, dept_code, dept_name, created_at, updated_at FROM departments WHERE dept_id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Dept not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createDept = async (req, res) => {
  const { dept_code, dept_name, user_id} = req.body;

  try {
    const [result] = await pool.query('INSERT INTO departments (dept_code, dept_name, user_id) VALUES (?, ?, ?)', [dept_code, dept_name, user_id]);
    res.status(201).json({ message: 'Department Selected' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateDept = async (req, res) => {
  const { id } = req.params;
  const { dept_code, dept_name, user_id } = req.body;

  try {
    const [result] = await pool.query('UPDATE departments SET dept_code = ?, dept_name = ?, user_id = ? WHERE dept_id = ?', [dept_code, dept_name, user_id, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json({ message: 'Department updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteDept = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM departments WHERE dept_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllDept, getDeptById, createDept, updateDept, deleteDept };
