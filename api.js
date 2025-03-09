const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'E-mail é obrigatório' });
    }

    // Simulação de autenticação (substitua pelo seu login real)
    if (email === 'teste@email.com') {
        return res.json({ success: true, cookies: "COOKIE_FAKE" });
    } else {
        return res.status(401).json({ success: false, message: 'E-mail não autorizado' });
    }
});

// Endpoint para verificar se a API está rodando
app.get('/', (req, res) => {
    res.send('API do Vercel rodando! 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
