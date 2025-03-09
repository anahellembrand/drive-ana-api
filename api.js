const { app, BrowserWindow, session, ipcMain } = require('electron');
const axios = require('axios');

let mainWindow;
let loginWindow;
const VERCEL_API_URL = "https://seu-vercel-api.vercel.app/api"; // URL da API hospedada no Vercel
const PROXY_URL = "http://45.140.192.234:3129";

async function obterSessaoElectron(email) {
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
                }
            </script>
        </body>
        </html>`);
}

ipcMain.on('verificar-email', async (event, email) => {
    const cookies = await obterSessaoElectron(email);
    if (!cookies) {
        loginWindow.webContents.executeJavaScript("alert('Acesso negado! Seu e-mail não está autorizado ou já está logado em outro local.');");
        return;
    }
    loginWindow.close();
    iniciarNavegador(cookies);
});

function iniciarNavegador(cookies) {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    session.defaultSession.setProxy({ proxyRules: PROXY_URL }).then(() => {
        mainWindow.loadURL('https://stock.adobe.com');
    });

    // Aplica os cookies de sessão do Vercel
    session.defaultSession.cookies.set({
        url: 'https://stock.adobe.com',
        name: 'session',
        value: cookies
    }).then(() => {
        console.log("✅ Cookies de login aplicados com sucesso pelo Vercel!");
    }).catch(error => {
        console.error("❌ Erro ao definir cookies:", error);
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
}

app.whenReady().then(criarJanelaLogin);

