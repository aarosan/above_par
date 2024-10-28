// Router import from the express library
const router = require('express').Router();

const apiRoutes = require('./api');

router.get('/', (req, res) => {
  return res.send('Basic Test Works!');
});

router.use('/api', apiRoutes);

router.use((req, res) => {
  return res.send('Wrong route!');
});

module.exports = router;
