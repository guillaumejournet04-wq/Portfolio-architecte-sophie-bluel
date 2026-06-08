let works = [] // crée une variable globale pour stocker les projets récupérés de l'API
let gallery = document.querySelector(".gallery") // sélectionne l'élément HTML de la galerie pour y ajouter les projets

fetch("http://localhost:5678/api/works") // envoie une requête HTTP GET à l'URL de l'API
    .then(response => response.json()) // convertit la réponse brute du serveur en objet JavaScript lisible
    .then(data => {
        works = data; // stocke les projets récupérés dans la variable globale "works"
        works.forEach(work => {
            const figure = document.createElement("figure") // crée un élément HTML <figure> pour chaque projet
            figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}"><figcaption>${work.title}</figcaption>` // ajoute une image et une légende à chaque figure en utilisant les données du projet
            gallery.appendChild(figure) // ajoute chaque figure à la galerie sur la page HTML
        })
    }); // works = le tableau contenant les 11 projets récupérés

fetch("http://localhost:5678/api/categories") // envoie une requête HTTP GET à l'URL de l'API pour récupérer les catégories
    .then(response => response.json()) // convertit la réponse brute du serveur en objet JavaScript lisible
    .then(categories => {
        const filters = document.querySelector("#filters"); // crée un élément HTML <div> pour les filtres de catégories")
        const btnTous = document.createElement("button"); // crée un bouton pour afficher tous les projets
        btnTous.textContent = "Tous"; // définit le texte du bouton "Tous"
        filters.appendChild(btnTous); // ajoute le bouton "Tous" à la section des filtres
        btnTous.addEventListener("click", () => {
            gallery.innerHTML = ""; // ajoute un écouteur d'événement pour le clic sur le bouton "Tous"
            works.forEach(work => { // pour chaque projet dans la variable globale "works"
                const figure = document.createElement("figure"); // crée un élément HTML <figure> pour chaque projet
                figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}"><figcaption>${work.title}</figcaption>`; // ajoute une image et une légende à chaque figure en utilisant les données du projet
                gallery.appendChild(figure); // ajoute chaque figure à la galerie sur la page HTML
            })
        })
        categories.forEach(category => { // pour chaque catégorie récupérée
            const btn = document.createElement("button"); // crée un bouton pour la catégorie
            btn.textContent = category.name; // définit le texte du bouton avec le nom de la catégorie
            filters.appendChild(btn); // ajoute le bouton de la catégorie à la section des filtres  
            btn.addEventListener("click", () => {
                gallery.innerHTML = ""; // ajoute un écouteur d'événement pour le clic sur le bouton de la catégorie
                works.forEach(work => {
                    if (work.categoryId === category.id) {
                        const figure = document.createElement("figure");
                        figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}"><figcaption>${work.title}</figcaption>`;
                        gallery.appendChild(figure);
                    }
                })
            })
        })
    }); // categories = le tableau contenant les 3 catégories récupérées + le boutton "Tous" ajouté pour afficher tous les projets