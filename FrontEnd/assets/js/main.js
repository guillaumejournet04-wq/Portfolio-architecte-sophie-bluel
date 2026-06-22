// Je pourrait stocker "works" dans une variable globale (let works = []),
// mais je préfère la passer en paramètre aux fonctions qui en ont besoin pour éviter une variable globale mutable.

const gallery = document.querySelector(".gallery") // sélectionne l'élément HTML de la galerie pour y ajouter les projets
const filters = document.querySelector("#filters"); // sélectionne l'élément HTML pour les filtres de catégories
const modal = document.getElementById("modal"); // sélectionne l'élément HTML du modal pour l'affichage des projets
const editIcon = document.getElementById("editIcon"); // sélectionne l'élément HTML de l'icône d'édition pour ouvrir le modal  
const contactForm = document.getElementById("contactForm"); // sélectionne le formulaire de contact
const contactError = document.getElementById("contactError"); // sélectionne le message d'erreur du formulaire de contact
const API_URL = "http://localhost:5678/api"; // base commune à toutes les routes de l'API
const WORKS_URL = `${API_URL}/works`; // route pour récupérer/ajouter/supprimer des projets
const CATEGORIES_URL = `${API_URL}/categories`; // route pour récupérer les catégories
    

async function recupererDonnees(url) {
    const response = await fetch(url); // attend la réponse du serveur
    return response.json(); // convertit la réponse en JSON
}

function creerFigure(work) {
    const figure = document.createElement("figure") // crée un élément HTML <figure> pour chaque projet
    figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}"><figcaption>${work.title}</figcaption>` // ajoute une image et une légende à chaque figure en utilisant les données du projet
    return figure; // retourne l'élément <figure> créé pour le projet
}

function viderGallery() {
    gallery.innerHTML = ""; // vide le contenu de la galerie en supprimant tous les éléments enfants
}

function afficherProjets(projets) {
    viderGallery(); // on repart d'une galerie vide avant d'afficher la nouvelle liste
    const figures = projets.map(work => creerFigure(work)); // crée une <figure> par projet
    gallery.append(...figures); // ajoute toutes les figures dans la galerie en une fois
}

function creerBoutonTous(works) {
    const btnTous = document.createElement("button"); // crée un bouton pour afficher tous les projets
    btnTous.textContent = "Tous"; // définit le texte du bouton "Tous"
    filters.appendChild(btnTous); // ajoute le bouton "Tous" à la section des filtres
    btnTous.addEventListener("click", () => {
        afficherProjets(works); // ajoute un écouteur d'événement pour le clic sur le bouton "Tous" pour afficher tous les projets
    })
}

function creerBoutonsCategories(category, works) {
    const btn = document.createElement("button"); // crée un bouton pour chaque catégorie
    btn.textContent = category.name; // définit le texte du bouton avec le nom de la catégorie
    filters.appendChild(btn); // ajoute le bouton de la catégorie à la section des filtres  
    btn.addEventListener("click", () => {
        const projetsFiltres = works.filter(work => work.categoryId === category.id); // garde uniquement les projets de cette catégorie
        afficherProjets(projetsFiltres); // affiche cette sélection
    })
}
function afficherFiltres(categories, works) {
    creerBoutonTous(works); // crée le bouton "Tous" pour afficher tous les projets
    categories.forEach(category => { // pour chaque catégorie récupérée
        creerBoutonsCategories(category, works); // crée un bouton pour la catégorie
    })
}

function utilisateurConnecte() {
    return localStorage.getItem("token") !== null; // true si un token est stocké, false sinon
}

function deconnecterUtilisateur(event) {
    event.preventDefault(); // empêche le lien de naviguer vers login.html
    localStorage.removeItem("token"); // supprime le token : l'utilisateur n'est plus considéré comme connecté
    window.location.href = "index.html"; // recharge la page en mode visiteur
}
function activerModeEdition() {
    const loginLink = document.getElementById("loginLink"); // sélectionne le lien "login"/"logout" du menu
    const editBanner = document.getElementById("editBanner"); // sélectionne la bannière "Mode édition"
    editIcon.removeAttribute("hidden"); // affiche l'icône "modifier"
    loginLink.textContent = "logout"; // remplace le texte "login" par "logout"
    loginLink.addEventListener("click", deconnecterUtilisateur); // déconnecte l'utilisateur au clic
    editBanner.removeAttribute("hidden"); // affiche la bannière "Mode édition"
}

function gererConnexion() {
    if (utilisateurConnecte()) { // si un token est présent
        activerModeEdition(); // on active l'affichage du mode édition
    }
}

function ouvrirModale() {
    modal.classList.add("active"); // affiche la modale en lui ajoutant la classe "active"
}

function fermerModale() {
    modal.classList.remove("active"); // cache la modale en lui retirant la classe "active"
}

function gererModale() {
    const modalClose = document.getElementById("modalClose"); // sélectionne l'élément HTML du bouton de fermeture du modal 
    editIcon.addEventListener("click", ouvrirModale); // ouvre la modale au clic sur l'icône "modifier"
    modalClose.addEventListener("click", fermerModale); // ferme la modale au clic sur la croix
    modal.addEventListener("click", fermerModaleExterieur); // ferme la modale au clic en dehors d'elle
}

function fermerModaleExterieur(event) {
    if (event.target === modal) { // si le clic a eu lieu sur le fond et non sur le contenu de la modale
        fermerModale();
    }
}

function afficherConfirmation() {
    const confirmationMessage = document.getElementById("confirmationMessage"); // sélectionne le message de confirmation d'envoi
    confirmationMessage.removeAttribute("hidden"); // affiche le message "Votre message a bien été envoyé."
}

function gererSoumissionContact(event) {
    event.preventDefault(); // empêche toujours la navigation, quel que soit le résultat
    if (!formulaireValide()) { // si un champ est vide, ne contient que des espaces, ou l'email est mal formé
        afficherErreurFormulaire(); // affiche le message d'erreur en bas du formulaire
        return; // on arrête là, pas de confirmation
    }
    masquerErreurFormulaire(); // au cas où une précédente tentative avait affiché une erreur
    contactForm.reset(); // vide les champs du formulaire
    afficherConfirmation(); // affiche le message de confirmation
}

function afficherErreurFormulaire() {
    contactError.removeAttribute("hidden"); // affiche le message d'erreur
}
function masquerErreurFormulaire() {
    contactError.setAttribute("hidden", ""); // cache le message d'erreur
}

function gererFormulaireContact() {
    contactForm.addEventListener("submit", gererSoumissionContact); // intercepte la soumission du formulaire
}

function formulaireValide() {
    const nameInput = document.getElementById("name"); // sélectionne le champ nom
    const emailInput = document.getElementById("email"); // sélectionne le champ email
    const messageInput = document.getElementById("message"); // sélectionne le champ message
    return nameInput.value.trim() !== ""
        && emailInput.value.trim() !== ""
        && messageInput.value.trim() !== ""
        && contactForm.checkValidity(); // garde la vérification native du format de l'email
}

async function main() {
    gererConnexion(); // affiche le mode édition si un token est présent
    gererModale(); // met en place les écouteurs de la modale, sans attendre les données
    gererFormulaireContact(); // met en place l'écouteur du formulaire de contact
    const [works, categories] = await Promise.all([
        recupererDonnees(WORKS_URL), // récupère la liste des projets
        recupererDonnees(CATEGORIES_URL) // récupère la liste des catégories
    ]); // attend que les deux requêtes soient terminées
    afficherProjets(works); // affiche les projets dans la galerie
    afficherFiltres(categories, works); // crée les boutons de filtre par catégorie
}

document.addEventListener("DOMContentLoaded", main) // lance main() une fois le HTML chargé
