/*
    path:/api/login

*/

const { Router, response } = require('express');
const { check } = require('express-validator');

const { newUser, LoginUser,renewToken } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validaitorLabel } = require('../middlewares/vallidar-label');
const router = Router();


router.post('/new', [
    check('name', 'El name es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validaitorLabel
], newUser)

router.post('/', [check('email', 'El email es obligatorio').isEmail(),
check('password', 'El password es obligatorio').not().isEmpty()
],validaitorLabel, LoginUser);
//ValidarJWT
router.get('/renew',validarJWT, renewToken)




module.exports = router;

