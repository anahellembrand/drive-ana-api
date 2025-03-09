async function login() {
    const email = document.getElementById("emailInput").value.trim().toLowerCase();

    if (!email) {
        alert("⚠️ Por favor, insira um e-mail válido!");
        return;
    }

    try {
        const response = await fetch("/api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (data.success) {
            console.log("✅ Login bem-sucedido:", email);
            localStorage.setItem("userEmail", email); // Agora salva corretamente
            window.location.href = "index.html"; // Redireciona para a página de acesso
        } else {
            alert("⛔ Acesso negado! Verifique se seu e-mail está correto.");
        }
    } catch (error) {
        alert("❌ Erro ao conectar com o servidor. Tente novamente.");
        console.error("Erro no login:", error);
    }
}
