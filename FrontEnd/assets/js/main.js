fetch("http://localhost:5678/api/works") // envoie une requête HTTP GET à l'URL de l'API
    .then(response => response.json()) // convertit la réponse brute du serveur en objet JavaScript lisible
    .then(works => {
        const gallery = document.querySelector(".gallery")
        works.forEach(work => { 
            const figure = document.createElement("figure") // crée un élément HTML <figure> pour chaque projet
            figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}"><figcaption>${work.title}</figcaption>` // ajoute une image et une légende à chaque figure en utilisant les données du projet
            gallery.appendChild(figure) // ajoute chaque figure à la galerie sur la page HTML
        })
    }); // works = le tableau contenant les 11 projets récupérés


