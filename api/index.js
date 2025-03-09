const axios = require('axios');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Método não permitido" });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "E-mail é obrigatório" });
    }

    try {
        // 🔹 URL da sua planilha no Google Apps Script
        const PLANILHA_URL = "https://script.google.com/macros/s/AKfycbwXffK8RENIPzD72YRE1vag79fk8JAeaD56L8Ol8s9ML9ZPH522nvWt22NL_uvoU4sI/exec";

        // 🔹 Busca os usuários na planilha
        const response = await axios.get(PLANILHA_URL);
        console.log("🔍 Dados recebidos da planilha:", response.data); // Log para depuração

        const usuarios = response.data;

        // 🔹 Verifica se o e-mail está na lista e "Em Dia"
        if (usuarios[email] && usuarios[email] === "Em Dia") {
            return res.status(200).json({ success: true, message: "✅ Acesso liberado!" });
        } else {
            console.log("❌ E-mail não encontrado ou bloqueado:", email);
            return res.status(403).json({ success: false, message: "⛔ Acesso negado! Usuário não encontrado ou bloqueado." });
        }
    } catch (error) {
        console.error("🔥 Erro ao conectar com a planilha:", error);
        return res.status(500).json({ error: "Erro ao conectar com a planilha.", details: error.message });
    }
};
