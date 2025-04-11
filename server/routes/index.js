const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const campRoutes = require('./camps');
const reviewRoutes = require('./reviews');
const userRoutes = require('./users');
const bookmarkRoutes = require('./bookmarks');
const mapRoutes = require('./maps');
const aiRoutes = require('./ai');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Use route modules
router.use('/auth', authRoutes);
router.use('/camps', campRoutes);
router.use('/reviews', reviewRoutes);
router.use('/users', userRoutes);
router.use('/bookmarks', bookmarkRoutes);
router.use('/maps', mapRoutes);
router.use('/ai', aiRoutes);

module.exports = router;
