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
        const PLANILHA_URL = "https://script.google.com/macros/s/AKfycbwXffK8RENIPzD72YRE1vag79fk8JAeaD56L8Ol8s9ML9ZPH522nvWt22NL_uvoU4sI/exec";

        // 🔹 Faz a requisição para a planilha
        const response = await axios.get(PLANILHA_URL);
        let usuarios = response.data;

        // 🔹 Log para verificar se os dados retornados são corretos
        console.log("🔎 Resposta bruta da planilha:", usuarios);

        // 🔹 Normaliza o e-mail recebido no POST
        const emailFormatado = email.trim().toLowerCase();

        // 🔹 Verifica se os dados da planilha são um array ou objeto válido
        if (!usuarios || typeof usuarios !== 'object') {
            console.error("❌ Erro: Estrutura de resposta da planilha inválida.");
            return res.status(500).json({ error: "Erro na estrutura da planilha." });
        }

        // 🔹 Converte resposta para um formato adequado (caso necessário)
        if (Array.isArray(usuarios)) {
            usuarios = usuarios.reduce((acc, email) => {
                acc[email.trim().toLowerCase()] = "Em Dia";
                return acc;
            }, {});
        }

        console.log("📄 E-mails normalizados da planilha:", Object.keys(usuarios));

        // 🔹 Verifica se o e-mail está "Em Dia"
        if (usuarios[emailFormatado] && usuarios[emailFormatado] === "Em Dia") {
            return res.status(200).json({ success: true, message: "✅ Acesso liberado!" });
        } else {
            console.error(❌ Acesso negado para: ${emailFormatado});
            return res.status(403).json({ success: false, message: "⛔ Acesso negado! Usuário não encontrado ou bloqueado." });
        }
    } catch (error) {
        console.error("❌ Erro ao conectar com a planilha:", error);
        return res.status(500).json({ error: "Erro ao conectar com a planilha.", details: error.message });
    }
};