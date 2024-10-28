const router = require('express').Router();

const userRoutes = require('./userRoutes');

router.use('/users', userRoutes);

router.get('/test', (req, res) => {
    res.send('Hello World!');
});

module.exports = router;
