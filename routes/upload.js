const express = require('express');
const router = express.Router();
const path = require('path');
const Sharp = require('sharp');
const multer = require('multer');
const mkdirp = require('mkdirp');

const config = require('../config');

const rs = () =>
  Math.random()
    .toString(36)
    .slice(-3);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = '/' + rs() + '/' + rs();
    mkdirp(config.DESTINATION + dir, console.log('its false'));
    // cd(null, config.DESTINATION + dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      const err = new Error('Extention');
      err.code = 'EXTENTION';
      return cb(err);
    }
    cb(null, true);
  }
}).single('file');

// POST is add
router.post('/image', (req, res) => {
  upload(req, res, err => {
    let error = '';
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        error = 'Картинка не более 1mb!';
      }
      if (err.code === 'EXTENTION') {
        error = 'Только jpeg и png!';
      }
    }

    res.json({
      ok: !error,
      error
    });
  });
});

module.exports = router;