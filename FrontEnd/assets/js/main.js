fetch("http://localhost:5678/api/works") // envoie une requête HTTP GET à l'URL de l'API
    .then(response => response.json()) // convertit la réponse brute du serveur en objet JavaScript lisible
    .then(works => console.log(works)); // works = le tableau contenant les 11 projets récupérés
