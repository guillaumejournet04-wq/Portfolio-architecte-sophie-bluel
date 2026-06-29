// Je pourrait stocker "works" dans une variable globale (let works = []),
// mais je préfère la passer en paramètre aux fonctions qui en ont besoin pour éviter une variable globale mutable.

const gallery = document.querySelector(".gallery") // sélectionne l'élément HTML de la galerie pour y ajouter les projets
const filters = document.querySelector("#filters"); // sélectionne l'élément HTML pour les filtres de catégories
const modal = document.getElementById("modal"); // sélectionne l'élément HTML du modal pour l'affichage des projets
const editIcon = document.getElementById("editIcon"); // sélectionne l'élément HTML de l'icône d'édition pour ouvrir le modal  
const contactForm = document.getElementById("contactForm"); // sélectionne le formulaire de contact
const contactError = document.getElementById("contactError"); // sélectionne le message d'erreur du formulaire de contact

async function fetchData(url) {
    const response = await fetch(url); // attend la réponse du serveur
    return response.json(); // convertit la réponse en JSON
}

function createFigure(work) {
    const figure = document.createElement("figure") // crée un élément HTML <figure> pour chaque projet
    figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}"><figcaption>${work.title}</figcaption>` // ajoute une image et une légende à chaque figure en utilisant les données du projet
    return figure; // retourne l'élément <figure> créé pour le projet
}

function clearGallery() {
    gallery.innerHTML = ""; // vide le contenu de la galerie en supprimant tous les éléments enfants
}

function displayWorks(works) {
    clearGallery(); // on repart d'une galerie vide avant d'afficher la nouvelle liste
    const figures = works.map(work => createFigure(work)); // crée une <figure> par projet
    gallery.append(...figures); // ajoute toutes les figures dans la galerie en une fois
}

function createAllButton(works) {
    const allButton = document.createElement("button"); // crée un bouton pour afficher tous les projets
    allButton.textContent = "Tous"; // définit le texte du bouton "Tous"
    filters.appendChild(allButton); // ajoute le bouton "Tous" à la section des filtres
    allButton.addEventListener("click", () => {
        displayWorks(works); // ajoute un écouteur d'événement pour le clic sur le bouton "Tous" pour afficher tous les projets
    })
}

function createCategoryButtons(category, works) {
    const categoryButton = document.createElement("button"); // crée un bouton pour chaque catégorie
    categoryButton.textContent = category.name; // définit le texte du bouton avec le nom de la catégorie
    filters.appendChild(categoryButton); // ajoute le bouton de la catégorie à la section des filtres  
    categoryButton.addEventListener("click", () => {
        const filteredWorks = works.filter(work => work.categoryId === category.id); // garde uniquement les projets de cette catégorie
        displayWorks(filteredWorks); // affiche cette sélection
    })
}
function displayFilters(categories, works) {
    createAllButton(works); // crée le bouton "Tous" pour afficher tous les projets
    categories.forEach(category => { // pour chaque catégorie récupérée
        createCategoryButtons(category, works); // crée un bouton pour la catégorie
    })
}

function isUserLoggedIn() {
    return localStorage.getItem("token") !== null; // true si un token est stocké, false sinon
}

function logoutUser(event) {
    event.preventDefault(); // empêche le lien de naviguer vers login.html
    localStorage.removeItem("token"); // supprime le token : l'utilisateur n'est plus considéré comme connecté
    window.location.href = "index.html"; // recharge la page en mode visiteur
}
function enableEditMode() {
    const loginLink = document.getElementById("loginLink"); // sélectionne le lien "login"/"logout" du menu
    const editBanner = document.getElementById("editBanner"); // sélectionne la bannière "Mode édition"
    editIcon.removeAttribute("hidden"); // affiche l'icône "modifier"
    loginLink.textContent = "logout"; // remplace le texte "login" par "logout"
    loginLink.addEventListener("click", logoutUser); // déconnecte l'utilisateur au clic
    editBanner.removeAttribute("hidden"); // affiche la bannière "Mode édition"
}

function handleLogin() {
    if (isUserLoggedIn()) { // si un token est présent
        enableEditMode(); // on active l'affichage du mode édition
    }
}

function openModal() {
    modal.classList.add("active"); // affiche la modale en lui ajoutant la classe "active"
}

function closeModal() {
    modal.classList.remove("active"); // cache la modale en lui retirant la classe "active"
}

function setupModal() {
    const modalClose = document.getElementById("modalClose"); // sélectionne l'élément HTML du bouton de fermeture du modal 
    editIcon.addEventListener("click", openModal); // ouvre la modale au clic sur l'icône "modifier"
    modalClose.addEventListener("click", closeModal); // ferme la modale au clic sur la croix
    modal.addEventListener("click", closeOutsideModalClick); // ferme la modale au clic en dehors d'elle
}

function closeOutsideModalClick(event) {
    if (event.target === modal) { // si le clic a eu lieu sur le fond et non sur le contenu de la modale
        closeModal();
    }
}

function showConfirmation() {
    const confirmationMessage = document.getElementById("confirmationMessage"); // sélectionne le message de confirmation d'envoi
    confirmationMessage.removeAttribute("hidden"); // affiche le message "Votre message a bien été envoyé."
}

function handleContactSubmit(event) {
    event.preventDefault(); // empêche toujours la navigation, quel que soit le résultat
    if (!isFormValid()) { // si un champ est vide, ne contient que des espaces, ou l'email est mal formé
        toggleFormError(true); // affiche le message d'erreur en bas du formulaire
        return; // on arrête là, pas de confirmation
    }
    toggleFormError(false); // au cas où une précédente tentative avait affiché une erreur
    contactForm.reset(); // vide les champs du formulaire
    showConfirmation(); // affiche le message de confirmation
}

function toggleFormError(show) {
    if (show) {
        contactError.removeAttribute("hidden");
    } else {
        contactError.setAttribute("hidden", "");
    }
}

function isFormValid() {
    const nameInput = document.getElementById("name"); // sélectionne le champ nom
    const emailInput = document.getElementById("email"); // sélectionne le champ email
    const messageInput = document.getElementById("message"); // sélectionne le champ message
    return nameInput.value.trim() !== ""
        && emailInput.value.trim() !== ""
        && messageInput.value.trim() !== ""
        && contactForm.checkValidity(); // garde la vérification native du format de l'email
}

async function main() {
    const apiUrl = "http://localhost:5678/api"; // base commune à toutes les routes de l'API
    const worksUrl = `${apiUrl}/works`; // route pour récupérer/ajouter/supprimer des projets
    const categoriesUrl = `${apiUrl}/categories`; // route pour récupérer les catégories
    handleLogin(); // affiche le mode édition si un token est présent
    setupModal(); // met en place les écouteurs de la modale, sans attendre les données
    setupContactForm(); // met en place l'écouteur du formulaire de contact
    const [works, categories] = await Promise.all([
        fetchData(worksUrl), // récupère la liste des projets
        fetchData(categoriesUrl) // récupère la liste des catégories
    ]); // attend que les deux requêtes soient terminées
    displayWorks(works); // affiche les projets dans la galerie
    displayFilters(categories, works); // crée les boutons de filtre par catégorie
}

document.addEventListener("DOMContentLoaded", main) // lance main() une fois le HTML chargé
