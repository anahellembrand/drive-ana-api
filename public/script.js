document.addEventListener("DOMContentLoaded", async () => {
    const userEmail = sessionStorage.getItem("userEmail");

    if (!userEmail) {
        window.location.href = "login.html"; // Redireciona para login se não estiver autenticado
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
});

// Bloqueia inspecionar elemento
document.addEventListener("contextmenu", event => event.preventDefault());
document.addEventListener("keydown", event => {
    if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) {
        event.preventDefault();
    }
});
