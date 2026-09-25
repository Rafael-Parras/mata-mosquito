const express = require('express');

const router = express.Router();

const rankingController = require('../controllers/rankingController');

router.get('/', rankingController.listarRanking);

router.post('/', rankingController.salvarPontuacao);

module.exports = router;