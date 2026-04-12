   function openTab(tabId) {
            // Ukryj wszystkie zawartości
            let contents = document.getElementsByClassName("tab-content");
            for (let i = 0; i < contents.length; i++) {
                contents[i].classList.remove("active");
            }
            
            // Odznacz wszystkie przyciski
            let buttons = document.getElementsByClassName("tab-button");
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove("active");
            }

            // Pokaż wybraną zakładkę
            document.getElementById(tabId).classList.add("active");
            
            // Zaznacz kliknięty przycisk (szukamy po event.target)
            event.currentTarget.classList.add("active");
        }

        const btnWejdz = document.getElementById('btn-wejdz');
        const inputNick = document.getElementById('input-nick');

        const ekranLogowania = document.getElementById("ekran-logowania");
        const ekranCzatu = document.getElementById("ekran-czatu");

        btnWejdz.addEventListener("click", () => {
            const nick = inputNick.value;
            if (nick) {
                localStorage.setItem("shoutboxNick", nick);
                
                ekranLogowania.style.display = "none";
                ekranCzatu.style.display = "block";
            }
        });

        async function pobierzWiadomosci() {
            const request = await fetch("https://apichat.m89.pl/api/messages")
            const data = await request.json();

            const oknoCzatu = document.getElementById("okno-czatu");
            oknoCzatu.innerHTML = "";

            data.forEach(msg => {
                const div = document.createElement("div");
                div.classList.add("msg");

                // informacje o wiadomości
                const data = new Date(msg.timestamp);
                const godzina = data.toLocaleTimeString("pl-PL", {
                    hour: "2-digit",
                    minute: '2-digit'
                });

                  div.innerHTML = `
            <span class="msg-author">${msg.author}</span>
            <span>${msg.text}</span>
            <span style="float:right; opacity:0.6; font-size:12px;">
                ${godzina}
            </span>`;
            
                oknoCzatu.appendChild(div);
            });
        }

        setInterval(pobierzWiadomosci, 3000)

        const formularzWiadomosci = document.getElementById("formularz-wiadomosci");
        const poleTekstowe = document.getElementById("input-wiadomosc");

        formularzWiadomosci.addEventListener("submit", async (event) => {
            event.preventDefault();

            const nowaWiadomosc = {
                author: localStorage.getItem("shoutboxNick"),
                text: document.getElementById("input-wiadomosc").value,
            };

            await fetch ("https://apichat.m89.pl/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nowaWiadomosc)
            });

            poleTekstowe.value = "";
            pobierzWiadomosci();
        });


