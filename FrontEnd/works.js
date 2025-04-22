import {createLoginLink, createLogoutBtn, clickLogout} from "./login.js";
import {initializeModal} from "./modale.js";

/*********************************************************************************
 * 
 * Ce fichier contient toutes les fonctions nécessaires à l'affichage des projets. 
 * 
 *********************************************************************************/

//Récupération du token stockés dans le localStorage
export let token = window.localStorage.getItem("token");
// Cache le lien "modifier" si l'utilisateur n'est pas connecté
let modifBtn = document.getElementById("modif-link");
modifBtn.style.display = "none";

if (token == null) {
    // Create Login link
    createLoginLink();
} else {
    const valueToken = JSON.parse(token);
    console.log("ValueToken : " + valueToken);
    // Create Logout button
    createLogoutBtn();
    clickLogout();
    // Création de l'icone de modification des projets
    addModifBtn();
}



// Récupération des projets (works) depuis l'api
const responseWorks = await fetch("http://localhost:5678/api/works");
export let works = await responseWorks.json();

export function generateWorks(works){
    for (let i = 0; i < works.length; i++) {

        const figure = works[i];
        // Récupération de l'élément du DOM qui accueillera les Projets
        const divGallery = document.querySelector(".gallery");
        // Création d’une balise dédiée à un projet
        const workElement = document.createElement("figure");
        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = figure.title;
        
        // On rattache la balise figure à la section Gallery
        divGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(titleElement);
     }
}

generateWorks(works);

//  Récupération et affichage des travaux dans la modale
export function generateWorksInModal(works){
    for (let i = 0; i < works.length; i++) {

        const figure = works[i];
        // Récupération de l'élément du DOM qui accueillera les Projets
        const divModalPresentation = document.querySelector("#modal-presentation");
        // Création d’une balise dédiée à un projet
        const workElement = document.createElement("div");
        workElement.classList.add("picture");
        
        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const iconTrashElement = document.createElement("i");
        iconTrashElement.id = figure.id;
        iconTrashElement.classList.add("fa-regular");
        iconTrashElement.classList.add("fa-trash-can");
        
        // On rattache la balise figure à la div modal-presentation 
        workElement.appendChild(imageElement);     
        workElement.appendChild(iconTrashElement);  
        divModalPresentation.appendChild(workElement);
     }
}

generateWorksInModal(works);

// Affichage des catégories
const responseCategories = await fetch('http://localhost:5678/api/categories');
const categories = await responseCategories.json();

function generateCategories(categories){
    // Récupération de l'élément du DOM qui accueillera les Catégories
    const divCategories = document.querySelector(".categories");
    const firstBtnNameElement = document.createElement("button");

    //Création de la Catégorie "Tous"
        firstBtnNameElement.innerText = "Tous";
        firstBtnNameElement.classList.add("btnClicked");
        firstBtnNameElement.id = "Tous";
        divCategories.appendChild(firstBtnNameElement);  

    for (let i = 0; i < categories.length; i++) {
        
        const button = categories[i];
        
        // Création d’une balise dédiée à une catégorie
        const btnNameElement = document.createElement("button");
        btnNameElement.innerText = button.name;
        btnNameElement.classList.add("btnUnClicked");
        btnNameElement.id = "category-" + button.id;
        
        // On rattache la balise figure à la section Catégories
        divCategories.appendChild(btnNameElement);
     }
}

generateCategories(categories);

// Mets à jour la liste Works
export async function updateWorks() {
    try {
        // Récupérer les données mises à jour depuis le backend
        const responseWorks = await fetch("http://localhost:5678/api/works");
        if (!responseWorks.ok) {
            throw new Error("Erreur lors de la récupération des travaux.");
        }
        const updatedWorks = await responseWorks.json();

        // Mettre à jour la variable works
        works = updatedWorks;

        // Réinitialiser et régénérer l'affichage
        document.querySelector(".gallery").innerHTML = "";
        generateWorks(works);

        console.log("Liste des travaux mise à jour :", works);
    } catch (error) {
        console.error("Erreur lors de la mise à jour des travaux :", error);
    }
}

export function updateModalPresentation() {
    const modalPresentation = document.querySelector("#modal-presentation");
    if (modalPresentation) {
        modalPresentation.innerHTML = "";
        generateWorksInModal(works);
    }
}

// Filtrer au click sur une catégorie
const btnList = document.querySelectorAll(".categories button");
const btnFilterAll = document.querySelector("#Tous");
const btnFilterObjects = document.querySelector(".categories #category-1");
const btnFilterApartments = document.querySelector(".categories #category-2");
const btnFilterHotelsAndRestaurants = document.querySelector(".categories #category-3");

btnList.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".btnClicked")?.classList.remove("btnClicked");
        document.querySelector(".categories button").classList.add("btnUnClicked");
        btn.classList.add("btnClicked");
    })
})

btnFilterAll.addEventListener("click", function () {
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(works);
});

btnFilterObjects.addEventListener("click", function () {
    const WorksFiltered = works.filter(function (work) {
        return work.category.id === 1;
    });
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(WorksFiltered);
});

btnFilterApartments.addEventListener("click", function () {
    const WorksFiltered = works.filter(function (work) {
        return work.category.id === 2;
    });
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(WorksFiltered);
});

btnFilterHotelsAndRestaurants.addEventListener("click", function () {
    const WorksFiltered = works.filter(function (work) {
        return work.category.id === 3;
    });
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(WorksFiltered);
});

//  Création de la modale
initializeModal();

function addModifBtn(){
    //Création du l'élément cliquable pour des modifications de projets
    /*const divTitleProjects = document.querySelector(".title-projects");
    const divModif = document.createElement("div");
    const aModifLink = document.createElement("a");
    aModifLink.href = "#modal1";
    aModifLink.classList.add("js-modal");
    

    const iconModifElement = document.createElement("i");
    iconModifElement.classList.add("fa-regular");
    iconModifElement.classList.add("fa-pen-to-square");
    const textModifElement = document.createElement("p");
    textModifElement.innerText = "modifier";

    aModifLink.appendChild(iconModifElement);
    aModifLink.appendChild(textModifElement);
    divModif.appendChild(aModifLink)
    divTitleProjects.appendChild(divModif);
    */
    
    modifBtn.style.display = null;

    // déplacer le titre au centre
    document.getElementById("title-project").style.marginLeft = "100px" ;
    
}