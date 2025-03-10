const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());  // Permite que os sites acessem a API

// Base de credenciais (pode ser melhorada com um banco de dados)
const credenciais = {
    "stock.adobe.com": { login: "admin@drivedaana.com", senha: "!!Senhaviva123!!" },
    "elements.envato.com": { login: "user@exemplo.com", senha: "MinhaSenha123" }
};

// Endpoint para buscar credenciais
app.post('/get-credentials', (req, res) => {
    const { site } = req.body;
    if (credenciais[site]) {
        res.json(credenciais[site]);
    } else {
        res.status(404).json({ error: "Credenciais não encontradas!" });
    }
});

// Inicia o servidor
app.listen(3000, () => {
    console.log("🔄 Servidor rodando na porta 3000 - Monitorando acessos!");
});
