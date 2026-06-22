const API_URL = "http://localhost:5678/api";
const LOGIN_URL = `${API_URL}/users/login`;

async function connecterUtilisateur(email, password) {
    const response = await fetch(LOGIN_URL, { // envoie les identifiants au serveur
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    if (!response.ok) { // si le serveur répond avec un statut autre que 2xx (ex: 404, 401)
        throw new Error("Identifiants incorrects"); // on lève une erreur, attrapée plus loin par un catch
    }
    return response.json(); // sinon on retourne les données (userId, token)
}


function afficherErreur(message) {
    const errorMessage = document.getElementById("errorMessage"); // sélectionne la zone d'affichage des erreurs
    errorMessage.textContent = message; // affiche le message d'erreur sous les champs du formulaire
}

async function gererSoumissionLogin(event) {
    const emailInput = document.getElementById("email"); // sélectionne le champ email
    const passwordInput = document.getElementById("password"); // sélectionne le champ mot de passe
    event.preventDefault(); // empêche le rechargement de la page par défaut du formulaire
    try {
        const data = await connecterUtilisateur(emailInput.value, passwordInput.value); // tente la connexion
        localStorage.setItem("token", data.token); // stocke le token reçu pour les prochaines pages
        window.location.href = "index.html"; // redirige vers la page d'accueil une fois connecté
    } catch (error) {
        afficherErreur("Email ou mot de passe incorrect"); // affiche un message si la connexion échoue
    }
}

function main() {
    const loginForm = document.getElementById("loginForm"); // sélectionne le formulaire de connexion
    loginForm.addEventListener("submit", gererSoumissionLogin); // déclenche la connexion à la soumission du formulaire
}

document.addEventListener("DOMContentLoaded", main);
