import {createLoginLink, createLogoutBtn, clickLogout} from "./login.js";
import {initializeModal} from "./modale.js";
import {linkApi, token} from "./const.js";
import {works as initialWorks, categories} from "./worksAPI.js";

/*********************************************************************************
 * 
 * Ce fichier contient toutes les fonctions nécessaires à l'affichage des projets. 
 * 
 *********************************************************************************/

// Cache le bouton "modifier" si l'utilisateur n'est pas connecté
let modifBtn = document.getElementById("modif-link");
modifBtn.style.display = "none";
let categoryChosen = "Tous";
let currentWorks = initialWorks;

function tokenExist() {
    if (token == null) {
        // Create Login link
        createLoginLink();
        // Affichage des projets (works)
        generateWorks(currentWorks);
        // Affichage des catégories
        generateCategories(categories);
    } else {
        const valueToken = JSON.parse(token);
        // Create Logout button
        createLogoutBtn();
        clickLogout();
        // Création de l'icone de modification des projets
        addModifBtn();
        //  Création de la modale
        initializeModal();
        // Affichage des projets (works)
        generateWorks(currentWorks);
        // Affichage des catégories
        generateCategories(categories);
        // Affichage des travaux dans la modale
        generateWorksInModal(currentWorks);
    }
}

tokenExist();

// Affichage des projets (works)
export function generateWorks(currentWorks){
    for (let i = 0; i < currentWorks.length; i++) {

        const figure = currentWorks[i];
        // Récupération de l'élément du DOM qui accueillera les Projets
        const divGallery = document.querySelector(".gallery");
        // Création d’une balise dédiée à un projet
        const workElement = document.createElement("figure");
        workElement.dataset.id = figure.id;
        workElement.dataset.category = figure.category.id;

        // Création des balises dans le projet
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


//  Affichage des travaux dans la modale
function generateWorksInModal(currentWorks){
    for (let i = 0; i < currentWorks.length; i++) {

        const figure = currentWorks[i];
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

// Affichage des catégories
function generateCategories(categories){
    // Récupération de l'élément du DOM qui accueillera les Catégories
    const divCategories = document.querySelector(".categories");
    const firstBtnNameElement = document.createElement("button");

    //Création de la Catégorie "Tous"
    firstBtnNameElement.innerText = "Tous";
    firstBtnNameElement.classList.add("btnClicked");
    firstBtnNameElement.dataset.id = "Tous";
    //Ajour AddEventlistener au click sur le bouton
    btnClicked(firstBtnNameElement);
    // On rattache la balise bouton "Tous" à la section Catégories
    divCategories.appendChild(firstBtnNameElement);  

    for (let i = 0; i < categories.length; i++) {
        
        const button = categories[i];
        
        // Création d’une balise dédiée à une catégorie
        const btnNameElement = document.createElement("button");
        btnNameElement.innerText = button.name;
        btnNameElement.id = "category-" + button.id;
        btnNameElement.dataset.id = button.id;

        btnClicked(btnNameElement);
        
        // On rattache la balise bouton à la section Catégories
        divCategories.appendChild(btnNameElement);
     }
}

// Mets à jour la liste Works
export async function updateWorks() {
    try {
        // Récupérer les données mises à jour depuis le backend
        const responseWorks = await fetch(`${linkApi}works`);
        if (!responseWorks.ok) {
            throw new Error("Erreur lors de la récupération des travaux.");
        }
        const updatedWorks = await responseWorks.json();

        // Mettre à jour la variable works
        currentWorks = updatedWorks;  
        document.querySelector(".gallery").innerHTML = "";
        generateWorks(currentWorks);
        filterWorksbyCategory(categoryChosen);
    } catch (error) {
        console.error("Erreur lors de la mise à jour des travaux :", error);
    }
}

export function updateModalPresentation() {
    const modalPresentation = document.querySelector("#modal-presentation");
    if (modalPresentation) {
        modalPresentation.innerHTML = "";
        generateWorksInModal(currentWorks);        
    }
}

function btnClicked(btn) {
    btn.addEventListener("click", () => {
        document.querySelector(".btnClicked")?.classList.remove("btnClicked");
        btn.classList.add("btnClicked");
        categoryChosen = btn.dataset.id;
        filterWorksbyCategory(categoryChosen);
    })
}

function filterWorksbyCategory(categoryChosen){
    const listWorks = document.querySelectorAll(".gallery figure");
    if (categoryChosen === "Tous") {
        listWorks.forEach(work => work.classList.remove("hidden"));
    } else {
        listWorks.forEach(work => {
            if (work.dataset.category !== categoryChosen && work.classList.contains("hidden") == false) {
                work.classList.add("hidden");
            } else if (work.dataset.category === categoryChosen && work.classList.contains("hidden") == true) {
                work.classList.remove("hidden");
            }
        })
    }
} 

// Ajoute le bouton "modifier" si l'utilisateur est connecté
function addModifBtn(){
    modifBtn.style.display = null;

    // déplacer le titre au centre
    document.getElementById("title-project").style.marginLeft = "100px" ;
    
}

// Affiche le custom alert si le token est expiré
export function showCustomAlertToken(message) {
    const alertBox = document.getElementById("custom-alert");
    const alertMessage = document.getElementById("alert-message");
    const alertOkBtn = document.getElementById("alert-ok-btn");

    // Set the message
    alertMessage.textContent = message;

    // Show the alert box
    alertBox.classList.remove("hidden");

    // Add an event listener to the OK button
    alertOkBtn.addEventListener("click", function handleOkClick() {
        // Hide the alert box
        alertBox.classList.add("hidden");

        // Remove the event listener to avoid duplicate handlers
        alertOkBtn.removeEventListener("click", handleOkClick);

        window.localStorage.removeItem("token");
        document.location.href = "login.html";
  });
}