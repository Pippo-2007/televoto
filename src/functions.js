
async function caricaConcorrenti() {
    let id = leggiCookie("televoto");
    if(id != null){
        window.location.replace("/votato.html");
        return;
    }


    const container = document.getElementById("container");

    if (!container) {
        console.error("ERRORE: elemento #container non trovato");
        return;
    }

    try {
        const response = await fetch(
            "http://https://zinaweb.altervista.org/grest/getListaConcorrenti.php"
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const concorrenti = await response.json();

        container.innerHTML = "";

        concorrenti.forEach(concorrente => {
            const card = document.createElement("div");
            card.classList.add("concorrenti");

            card.innerHTML = `
                <h2 class="codice">
                    ${String(concorrente.codice).padStart(2, "0")}
                </h2>
                <h2 class="nome">${concorrente.nome}</h2>
            `;

            // Click sulla card
            card.addEventListener("click", async () => {
                try {
                    const formData = new FormData();
                    formData.append("idCandidato", concorrente.codice);

                    const responseVoto = await fetch(
                        "http://https://zinaweb.altervista.org/grest/invioVoto.php",
                        {
                            method: "POST",
                            body: formData
                        }
                    );

                    if (!responseVoto.ok) {
                        throw new Error(
                            `HTTP error: ${responseVoto.status}`
                        );
                    }

                    const risultato = await responseVoto.json();

                    console.log("Voto inserito:", risultato);
                    creaCookie("televoto",risultato.idVoto);

                } catch (error) {
                    console.error(
                        "Errore nell'inserimento del voto:",
                        error
                    );
                }
            });

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Errore nel fetch:", error);

        container.innerHTML = `
            <p>Impossibile caricare i concorrenti.</p>
        `;
    }
}



function creaCookie(nome, valore, giorni = 7) {
    const scadenza = new Date();
    scadenza.setTime(scadenza.getTime() + giorni * 24 * 60 * 60 * 1000);

    document.cookie = `${nome}=${encodeURIComponent(valore)}; expires=${scadenza.toUTCString()}; path=/`;
}

function leggiCookie(nome) {
    const cookies = document.cookie.split("; ");

    for (const cookie of cookies) {
        const [chiave, valore] = cookie.split("=");

        if (chiave === nome) {
            return decodeURIComponent(valore);
        }
    }

    return null;
}

async function caricaVotato() {
    const container1 = document.getElementById("voto");

    if (!container1) {
        console.error("ERRORE: elemento #voto non trovato");
        return;
    }

    // Legge l'id del voto dal cookie
    const idVoto = leggiCookie("televoto");

    if (!idVoto) {
        container1.innerHTML = `
            <p>Nessun voto effettuato.</p>
        `;
        return;
    }

    try {
        const response = await fetch(
            `http://https://zinaweb.altervista.org/grest/getVoto.php?idVoto=${encodeURIComponent(idVoto)}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const concorrente = await response.json();

        container1.innerHTML = "";

        const card = document.createElement("div");
        card.classList.add("concorrenti");

        card.innerHTML = `
            <h2 class="codice">
                ${String(concorrente.codice).padStart(2, "0")}
            </h2>

            <h2 class="nome">
                ${concorrente.nome}
            </h2>
        `;

        container1.appendChild(card);

    } catch (error) {
        console.error("Errore nel recupero del voto:", error);

        container1.innerHTML = `
            <p>Impossibile recuperare il voto.</p>
        `;
    }
}