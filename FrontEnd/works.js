import {createLoginLink, createLogoutBtn, clickLogout} from "./login.js";

/*********************************************************************************
 * 
 * Ce fichier contient toutes les fonctions nécessaires à l'affichage des projets. 
 * 
 *********************************************************************************/

//Récupération du token stockés dans le localStorage
let token = window.localStorage.getItem("token");

if (token == null) {
    // Create Login link
    createLoginLink();
} else {
    token = JSON.parse(token);
    // Création de l'icone de modification des projets
    addModifBtn();
    // Create Logout button
    createLogoutBtn();
    clickLogout();
}



// Récupération des projets (works) depuis l'api
const responseWorks = await fetch("http://localhost:5678/api/works");
const works = await responseWorks.json();

function generateWorks(works){
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
        btnNameElement.id = button.id;
        
        // On rattache la balise figure à la section Catégories
        divCategories.appendChild(btnNameElement);
     }
}

generateCategories(categories);

// Filtrer au click sur une catégorie
const btnList = document.querySelectorAll(".categories button");
const btnFilterAll = document.querySelector("#Tous");
const btnFilterObjects = document.getElementById("1");
const btnFilterApartments = document.getElementById("2");
const btnFilterHotelsAndRestaurants = document.getElementById("3");

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

function addModifBtn(){
    //Création du l'élément cliquable pour des modifications de projets
    const divTitleProjects = document.querySelector(".title-projects");
    const divModif = document.createElement("div");
    const aModifLink = document.createElement("a");
    aModifLink.classList.add("js-modal");
    aModifLink.href = "#modal1";

    const iconModifElement = document.createElement("i");
    iconModifElement.classList.add("fa-regular");
    iconModifElement.classList.add("fa-pen-to-square");
    const textModifElement = document.createElement("p");
    textModifElement.innerText = "modifier";

    aModifLink.appendChild(iconModifElement);
    aModifLink.appendChild(textModifElement);
    divModif.appendChild(aModifLink)
    divTitleProjects.appendChild(divModif);

    // déplacer le titre au centre
    document.getElementById("title-project").style.marginLeft = "100px" ;
}