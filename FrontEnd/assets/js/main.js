// Je pourrait stocker "works" dans une variable globale (let works = []),
// mais je préfère la passer en paramètre aux fonctions qui en ont besoin pour éviter une variable globale mutable.

const gallery = document.querySelector(".gallery") // sélectionne l'élément HTML de la galerie pour y ajouter les projets
const filters = document.querySelector("#filters"); // sélectionne l'élément HTML pour les filtres de catégories
const modal = document.getElementById("modal"); // sélectionne l'élément HTML du modal pour l'affichage des projets
const editIcon = document.getElementById("editIcon"); // sélectionne l'élément HTML de l'icône d'édition pour ouvrir le modal  
const modalClose = document.getElementById("modalClose"); // sélectionne l'élément HTML du bouton de fermeture du modal 


function recupererDonnees(url) {
    return fetch(url)
        .then(response => response.json())
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
    viderGallery();
    const figures = projets.map(work => creerFigure(work));
    gallery.append(...figures);
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
        const projetsFiltres = works.filter(work => work.categoryId === category.id);
        afficherProjets(projetsFiltres);
    })
}
function afficherFiltres(categories, works) {
    creerBoutonTous(works); // crée le bouton "Tous" pour afficher tous les projets
    categories.forEach(category => { // pour chaque catégorie récupérée
        creerBoutonsCategories(category, works); // crée un bouton pour la catégorie
    })
}
function ouvrirModale() {
    modal.classList.add("active");
}
function fermerModale() {
    modal.classList.remove("active");
}
function gererModale() {
    editIcon.addEventListener("click", ouvrirModale);
    modalClose.addEventListener("click", fermerModale);
}
function main() {
    gererModale();
    Promise.all([
        recupererDonnees("http://localhost:5678/api/works"),
        recupererDonnees("http://localhost:5678/api/categories")
    ]).then(([works, categories]) => {
        afficherProjets(works);
        afficherFiltres(categories, works);
    })
}
document.addEventListener("DOMContentLoaded", main)
