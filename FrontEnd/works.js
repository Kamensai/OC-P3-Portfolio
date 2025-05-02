import {works, categories} from "./worksAPI.js";
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
let categoryChosen = "Tous";

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

let worksAPI = works;
let categoriesAPI = categories;    

function generateWorks(worksAPI){
    for (let i = 0; i < worksAPI.length; i++) {

        const figure = worksAPI[i];
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

generateWorks(worksAPI);

//  Récupération et affichage des travaux dans la modale
function generateWorksInModal(worksAPI){
    for (let i = 0; i < worksAPI.length; i++) {

        const figure = worksAPI[i];
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

generateWorksInModal(worksAPI);



function generateCategories(categoriesAPI){
    // Récupération de l'élément du DOM qui accueillera les Catégories
    const divCategories = document.querySelector(".categories");
    const firstBtnNameElement = document.createElement("button");

    //Création de la Catégorie "Tous"
        firstBtnNameElement.innerText = "Tous";
        firstBtnNameElement.classList.add("btnClicked");
        firstBtnNameElement.id = "Tous";
        divCategories.appendChild(firstBtnNameElement);  

    for (let i = 0; i < categoriesAPI.length; i++) {
        
        const button = categoriesAPI[i];
        
        // Création d’une balise dédiée à une catégorie
        const btnNameElement = document.createElement("button");
        btnNameElement.innerText = button.name;
        btnNameElement.classList.add("btnUnClicked");
        btnNameElement.id = "category-" + button.id;
        
        // On rattache la balise figure à la section Catégories
        divCategories.appendChild(btnNameElement);
     }
}

generateCategories(categoriesAPI);

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
        worksAPI = updatedWorks;  
        switch (categoryChosen) {
            case "category-1":
                filterObjectsFunction();
                break;
            case "category-2":
                filterApartmentsFunction();
                break;
            case "category-3":
                filterHotelAndRestaurantsFunction();
                break;
            default:
                filterAllFunction();
            }
        

        console.log("Liste des travaux mise à jour :", worksAPI);
    } catch (error) {
        console.error("Erreur lors de la mise à jour des travaux :", error);
    }
}

export function updateModalPresentation() {
    const modalPresentation = document.querySelector("#modal-presentation");
    if (modalPresentation) {
        modalPresentation.innerHTML = "";
        generateWorksInModal(worksAPI);
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

const filterAll = function () {
    categoryChosen = "Tous";
    console.log(categoryChosen);
    filterAllFunction();
}

const filterObjects = function () {
    categoryChosen = "category-1";
    console.log(categoryChosen);
    filterObjectsFunction();
}

const filterApartments = function () {
    categoryChosen = "category-2";
    console.log(categoryChosen);
    filterApartmentsFunction();
}

const filterHotelAndRestaurants = function () {
    categoryChosen = "category-3";
    console.log(categoryChosen);
    filterHotelAndRestaurantsFunction();
}

// Function filtres par catégories
function filterAllFunction(){
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(worksAPI);
}

function filterObjectsFunction(){
    const WorksFiltered = worksAPI.filter(function (work) {
        return work.category.id === 1;
    });
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(WorksFiltered);
}

function filterApartmentsFunction() {
    const WorksFiltered = worksAPI.filter(function (work) {
        return work.category.id === 2;
    });
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(WorksFiltered);
}

function filterHotelAndRestaurantsFunction() {
    const WorksFiltered = worksAPI.filter(function (work) {
        return work.category.id === 3;
    });
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(WorksFiltered);
}

// Filtrer lors du click sur le bouton d'une catégorie
function filterAllOnClick(){
    btnFilterAll.addEventListener("click", filterAll);
}

function filterObjectsOnClick(){
    btnFilterObjects.addEventListener("click", filterObjects);
}

function filterApartmentsOnClick() {
    btnFilterApartments.addEventListener("click", filterApartments);
}

function filterHotelAndRestaurantsOnClick() {
    btnFilterHotelsAndRestaurants.addEventListener("click", filterHotelAndRestaurants);
}


//  Création de la modale
initializeModal();

filterAllOnClick();
filterObjectsOnClick();
filterApartmentsOnClick();
filterHotelAndRestaurantsOnClick();

function addModifBtn(){
    modifBtn.style.display = null;

    // déplacer le titre au centre
    document.getElementById("title-project").style.marginLeft = "100px" ;
    
}