const express = require('express');
const { exportRecipeToPdf } = require('../controllers/pdfController');
const router = express.Router();

router.get('/:id/pdf', exportRecipeToPdf);

module.exports = router;
