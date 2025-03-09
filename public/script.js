// 🚀 Verifica se a extensão e o proxy estão ativos antes de liberar o acesso
document.addEventListener("DOMContentLoaded", () => {
    chrome.runtime.sendMessage({ checkProxy: true }, (response) => {
        if (!response || !response.proxyActive) {
            alert("⚠️ O proxy está desativado! Ative a extensão para acessar os sites.");
            window.location.href = "https://sua-extensao.com/ativar"; // 🔹 Pode ser uma página de instrução
        } else {
            console.log("✅ Proxy ativo! Acesso permitido.");
        }
    });

    // 🔹 Verifica se o usuário está autenticado
    let userEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");

    if (!userEmail || userEmail.trim() === "") {
        console.warn("⚠️ Usuário não autenticado. Redirecionando para login...");
        window.location.href = "/login.html"; // 🔹 Caminho absoluto para evitar erro 404
        return;
    }

    console.log("✅ Usuário autenticado:", userEmail);
    document.getElementById("userEmail").innerText = userEmail;

    // 🔹 Definição dos serviços disponíveis
    const services = [
        { name: "Adobe Stock", url: "https://stock.adobe.com" },
        { name: "Envato", url: "https://elements.envato.com" },
        { name: "Creative Fabrica", url: "https://www.creativefabrica.com" },
        { name: "Pacdora", url: "https://www.pacdora.com" },
        { name: "Vecteezy", url: "https://www.vecteezy.com" },
        { name: "Design Bundles", url: "https://designbundles.net" }
    ];

    // 🔹 Cria os botões dinamicamente e ativa o proxy apenas ao clicar
    const buttonsContainer = document.getElementById("buttons");
    services.forEach(service => {
        const button = document.createElement("button");
        button.innerText = service.name;
        button.onclick = () => {
            chrome.runtime.sendMessage({ activateProxy: true }, (response) => {
                if (!response || !response.success) {
                    alert("⚠️ Erro ao ativar o proxy. Verifique sua conexão!");
                    return;
                }

                console.log(`🌍 Acessando ${service.name} via Proxy.`);
                window.open(service.url, "_blank");

                // 🔹 Desativar o proxy após 3 minutos para economizar banda
                setTimeout(() => {
                    chrome.runtime.sendMessage({ deactivateProxy: true });
                }, 180000); // 3 minutos
            });
        };
        buttonsContainer.appendChild(button);
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

    // 🔐 Remove botões de logout dentro dos iframes para impedir saída das contas
    const observer = new MutationObserver(() => {
        const iframes = document.getElementsByTagName("iframe");
        for (let iframe of iframes) {
            try {
                const logoutButtons = iframe.contentWindow.document.querySelectorAll("a[href*='logout'], button.logout");
                logoutButtons.forEach(button => button.remove());
            } catch (e) {
                console.warn("⚠️ Não foi possível acessar um iframe para remover logout.");
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});
