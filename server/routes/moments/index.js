const express = require('express');
const router = express.Router();
const database = require('../../db');

router.get('/', (req, res) => {
  database.query('SELECT * FROM moments')
    .then(results => {
      res.json(results.rows);
    });
});

module.exports = router;
