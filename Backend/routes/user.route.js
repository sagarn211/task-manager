const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/user.controller');
const { authUser } = require('../middlewares/auth.middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authUser, logoutUser);

module.exports = router;

