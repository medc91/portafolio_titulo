const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generarSala } = require('../controllers/videoController');

router.post('/', auth, generarSala);

module.exports = router;