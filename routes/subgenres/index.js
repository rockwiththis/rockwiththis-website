const express = require('express');
const router = express.Router();
const database = require('../../db');

router.get('/', (req, res) => {
  database.query('SELECT * FROM subgenres')
    .then(results => {
      res.json(results.rows);
      console.log("results.rows-subgenres");
      console.log(results.rows);
    });
});

module.exports = router;
