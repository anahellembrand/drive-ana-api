const { app, BrowserWindow, session, ipcMain } = require('electron');
const axios = require('axios');

let mainWindow;
let loginWindow;
const VERCEL_API_URL = "api-js-git-main-ana-hellembrands-projects.vercel.app"; // URL da API no Vercel
const PROXY_URL = "http://45.140.192.234:3129";

async function obterSessao(email) {
    try {
        const response = await axios.post(VERCEL_API_URL, { email });
        if (response.data.success) {
            return response.data.cookies;
        } else {
            return null;
        }
    } catch (error) {
        console.error("❌ Erro ao obter sessão do Vercel:", error);
        return null;
    }
}

function criarJanelaLogin() {
    loginWindow = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    loginWindow.loadURL(`data:text/html,
        <html>
        <body style="text-align:center; font-family:Arial;">
            <h2>Login</h2>
            <p>Digite seu e-mail para acessar:</p>
            <input type="email" id="email" placeholder="Seu e-mail" style="padding:5px; width:80%"><br><br>
            <button onclick="enviarEmail()" style="padding:10px;">Entrar</button>
            <script>
                const { ipcRenderer } = require('electron');
                function enviarEmail() {
                    const email = document.getElementById('email').value;
                    ipcRenderer.send('verificar-email', email);
