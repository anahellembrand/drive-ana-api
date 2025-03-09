document.addEventListener("DOMContentLoaded", async () => {
    const userEmail = sessionStorage.getItem("userEmail"); // Obtém o email salvo

    if (!userEmail) {
        alert("❌ Você precisa estar logado para acessar!");
        window.location.href = "/"; // Redireciona se não estiver logado
        return;
    }

    document.getElementById("userEmail").innerText = userEmail; // Mostra o e-mail do usuário

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
});
