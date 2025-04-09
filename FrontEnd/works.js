/*********************************************************************************
 * 
 * Ce fichier contient toutes les fonctions nécessaires à l'affichage des projets. 
 * 
 *********************************************************************************/

// Récupération des projets (works) depuis l'api
const reponse = await fetch('http://localhost:5678/api/works');
const works = await reponse.json();

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
        
        // On rattache la balise figure a la section Gallery
        divGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(titleElement);
     }
}

generateWorks(works);