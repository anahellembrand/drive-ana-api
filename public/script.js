document.addEventListener("DOMContentLoaded", async () => {
    const userEmail = sessionStorage.getItem("userEmail");

    if (window.location.pathname.includes("index.html")) {
        // Se estiver na página de acesso, verifica login
        if (!userEmail) {
            alert("❌ Você precisa estar logado para acessar!");
            window.location.href = "login.html"; // Redireciona para login
            return;
        }

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
            button.onclick = () => window.open(service.url, "_blank");
            buttonsContainer.appendChild(button);
        });
    }

    if (window.location.pathname.includes("login.html")) {
        // Se estiver na tela de login
        document.getElementById("loginForm").addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value.trim().toLowerCase();
            if (!email) {
                alert("❌ Digite um e-mail válido!");
                return;
            }

            try {
                // Faz requisição à API de autenticação
                const response = await fetch("/api", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (data.success) {
                    sessionStorage.setItem("userEmail", email); // Salva sessão
                    window.location.href = "index.html"; // Redireciona após login
                } else {
                    alert("⛔ Acesso negado! Verifique seu e-mail.");
                }
            } catch (error) {
                alert("❌ Erro ao conectar com a API.");
            }
        });
    }
});

// 🔹 Bloqueia inspeção
document.addEventListener("contextmenu", event => event.preventDefault());
document.addEventListener("keydown", event => {
    if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) {
        event.preventDefault();
    }
});
