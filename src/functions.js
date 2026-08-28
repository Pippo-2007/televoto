async function caricaConcorrenti() {
    const container = document.getElementById("container");

    try {
        const response = await fetch("getListaConcorrenti.php");

        if (!response.ok) {
            throw new Error("Errore nella richiesta");
        }

        const concorrenti = await response.json();

        container.innerHTML = "";

        concorrenti.forEach(concorrente => {

            const card = document.createElement("div");
            card.classList.add("card-concorrente");

            card.innerHTML = `
                <h3>${concorrente.nome}</h3>
                <p>Codice: ${concorrente.codice}</p>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error(error);

        container.innerHTML = `
            <p>Impossibile caricare i concorrenti.</p>
        `;
    }
}