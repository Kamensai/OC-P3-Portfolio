/*********************************************************************************
 * 
 * Ce fichier contient toutes les fonctions nécessaires à l'affichage des projets. 
 * 
 *********************************************************************************/

// Récupération des projets (works) depuis l'api
const reponseWorks = await fetch('http://localhost:5678/api/works');
const works = await reponseWorks.json();

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
const reponseCategories = await fetch('http://localhost:5678/api/categories');
const categories = await reponseCategories.json();

function generateCategories(categories){
    // Récupération de l'élément du DOM qui accueillera les Catégories
    const divCategories = document.querySelector(".categories");
    const firstbuttonNameElement = document.createElement("button");
    //Création de la Catégorie "Tous"
        firstbuttonNameElement.innerText = "Tous";
        divCategories.appendChild(firstbuttonNameElement);

    for (let i = 0; i < categories.length; i++) {
        
        const button = categories[i];
        
        // Création d’une balise dédiée à une catégorie
        const buttonNameElement = document.createElement("button");
        buttonNameElement.innerText = button.name;
        
        // On rattache la balise figure à la section Catégories
        divCategories.appendChild(buttonNameElement);
        //buttonNameElement.appendChild(categoryElement);
     }
}

generateCategories(categories);