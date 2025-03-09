// 🚀 Verifica se a extensão e o proxy estão ativos antes de liberar o acesso
document.addEventListener("DOMContentLoaded", () => {
    chrome.runtime.sendMessage({ checkProxy: true }, (response) => {
        if (!response || !response.proxyActive) {
            alert("⚠️ O proxy está desativado! Ative a extensão para acessar os sites.");
            window.location.href = "https://sua-extensao.com/ativar"; // Pode redirecionar para um aviso
        } else {
            console.log("✅ Proxy ativo! Acesso permitido.");
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    let userEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");

    if (!userEmail || userEmail.trim() === "") {
        console.warn("⚠️ Usuário não autenticado. Redirecionando para login...");
        window.location.href = "/login.html"; // 🔹 Caminho absoluto para evitar erro 404
        return;
    }

    console.log("✅ Usuário autenticado:", userEmail);
    document.getElementById("userEmail").innerText = userEmail;

    const services = [
        { name: "Adobe Stock", url: "https://stock.adobe.com" },
        { name: "Envato", url: "https://elements.envato.com" },
        { name: "Creative Fabrica", url: "https://www.creativefabrica.com" },
        { name: "Pacdora", url: "https://www.pacdora.com" },
        { name: "Vecteezy", url: "https://www.vecteezy.com" },
        { name: "Design Bundles", url: "https://designbundles.net" }
    ];

    const buttonsContainer = document.getElementById("buttons");
    services.forEach(service => {
        const button = document.createElement("button");
        button.innerText = service.name;
        button.onclick = () => {
            chrome.runtime.sendMessage({ openWithProxy: service.url }, (response) => {
                if (!response || !response.success) {
                    alert("⚠️ Erro ao abrir o site pelo proxy. Verifique sua conexão!");
                }
            });
        };
        buttonsContainer.appendChild(button);
    });  
});

// 🔒 Bloqueia Inspecionar Elemento
document.addEventListener("contextmenu", event => event.preventDefault());
document.addEventListener("keydown", event => {
    if (
        event.key === "F12" || 
        (event.ctrlKey && event.shiftKey && event.key === "I") || 
        (event.ctrlKey && event.shiftKey && event.key === "J") || 
        (event.ctrlKey && event.key === "U")
    ) {
        event.preventDefault();
        console.warn("🔒 Tentativa de abrir DevTools bloqueada!");
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const iframes = document.getElementsByTagName("iframe");

    for (let iframe of iframes) {
        iframe.onload = function () {
            // Remove qualquer botão de logout que apareça dentro de um iframe
            const logoutButtons = iframe.contentWindow.document.querySelectorAll("a[href*='logout'], button.logout");
            logoutButtons.forEach(button => button.remove());
        };
    }
});