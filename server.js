const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const rankingRoutes = require('./routes/rankingRoutes');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/ranking', rankingRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
    console.log(`Acesse no navegador: http://localhost:${PORT}`);
});