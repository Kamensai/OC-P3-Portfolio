import {generateWorks, generateWorksInModal, token, updateWorks, updateModalPresentation} from "./works.js";

/*********************************************************************************
 * 
 * Ce fichier contient toutes les fonctions nécessaires à l'utilisation de la modale. 
 * 
 *********************************************************************************/

let modal = null;
let addPhotoBtn = null;
let validPhotoBtn = null;
let returnIcon = null;
const btnModal = document.querySelector(".js-modal");
const focusableSelector= "button, a, input, textarea";
let focusablesElements =[];
let previouslyFocusedElement = null;


const openModal = function () {
    modal = document.querySelector(btnModal.getAttribute("href"));
    focusablesElements = Array.from(modal.querySelectorAll(focusableSelector));
    previouslyFocusedElement = document.querySelector(":focus");
    modal.classList.remove("hidden");
    modal.querySelector("#modal-presentation").classList.remove("hidden");
    addPhotoBtn = modal.querySelector(".modal-wrapper #add-picture-btn");
    addPhotoBtn.classList.remove("hidden");
    focusablesElements[0].focus();
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    modal.querySelector("#modal-top .fa-xmark").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
    clickOnDeleteIcon();
}

const closeModal = function () {
    if(modal === null) return;
    if(previouslyFocusedElement != null){
        previouslyFocusedElement.focus();
    }
    document.getElementById("form-add-photo").reset();
    modal.querySelector("#drop-container #previewImage").src = "";
    modal.querySelector("#drop-container #previewImage").classList.add("hidden");

    addPhotoBtn = modal.querySelector(".modal-wrapper #add-picture-btn");
    validPhotoBtn = modal.querySelector(".modal-wrapper #valid-picture-btn");
    returnIcon = modal.querySelector("#modal-top .fa-arrow-left");
    
    modal.setAttribute("aria-hidden", true);
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector("#modal-top .fa-xmark").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    const hideModal = function() {
        if(!addPhotoBtn.querySelector(".hidden")){
            addPhotoBtn.classList.add("hidden");
        };
        if(!validPhotoBtn.querySelector(".hidden")){
            validPhotoBtn.classList.add("hidden");
        };
        if(!returnIcon.querySelector(".hidden")){
            returnIcon.classList.add("hidden");
        };
        if(modal.querySelector("#title-modal").innerHTML === "Ajout photo"){
            modal.querySelector("#title-modal").innerHTML = "Galerie photo";
        }
        modal.classList.add("hidden");
        modal.querySelector("#modal-presentation").classList.add("hidden");
        modal.querySelector("#modal-add-photo").classList.add("hidden")
        modal.removeEventListener("animationend", hideModal);
        
    }
    modal.addEventListener("animationend", hideModal);
}

// Evite de fermer la modal lors de son utilisation
const stopPropagation = function (e){
    e.stopPropagation();
}

const showAddPhotoModal = function() {
    modal = document.querySelector(btnModal.getAttribute("href"));
    modal.querySelector("#title-modal").innerHTML = "Ajout photo";
    // Affiche la vue de modale pour ajouter un projet "work"
    modal.querySelector("#modal-presentation").classList.add("hidden");
    modal.querySelector("#modal-add-photo").classList.remove("hidden");

    // Affiche les éléments de #drop-container pour ajouter une photo
    modal.querySelector("#drop-container .fa-image").classList.remove("hidden");
    modal.querySelector("#drop-container .add-image-btn").classList.remove("hidden");
    modal.querySelector("#drop-container .add-image-txt").classList.remove("hidden");

    // Affiche le bouton retour et le bouton valider Et cache le bouton "ajouter Photo"
    addPhotoBtn = modal.querySelector(".modal-wrapper #add-picture-btn");
    validPhotoBtn = modal.querySelector(".modal-wrapper #valid-picture-btn");
    returnIcon = modal.querySelector("#modal-top .fa-arrow-left");

    returnIcon.classList.remove("hidden");
    addPhotoBtn.classList.add("hidden");
    validPhotoBtn.classList.remove("hidden");
    clickOnReturnIcon();
    clickOnAddPhoto();
    clickOnAddWork();
}

const previewImage = function(e) {
    const input = e.target;
    const image = document.getElementById("previewImage");
    const fileInput = document.getElementById("photoInput");
    const errorMessage = document.querySelector("#photo-input-error");
    modal = document.querySelector(btnModal.getAttribute("href"));
    

    console.log(input.files);

    if (input.files && input.files[0]) {
        // Cache les éléments de #drop-container pour ajouter une photo
        modal.querySelector("#drop-container .fa-image").classList.add("hidden");
        modal.querySelector("#drop-container .add-image-btn").classList.add("hidden");
        modal.querySelector("#drop-container .add-image-txt").classList.add("hidden");

        const reader = new FileReader();

        reader.onload = function (e) {
            image.src = e.target.result;
        }

        reader.readAsDataURL(input.files[0]);

        errorMessage.textContent = ""; // Réinitialise le message d'erreur
        errorMessage.classList.add("hidden");
    } 
    
    if(input.files.length == 0){
        // Affiche les éléments de #drop-container pour ajouter une photo
        modal.querySelector("#drop-container .fa-image").classList.remove("hidden");
        modal.querySelector("#drop-container .add-image-btn").classList.remove("hidden");
        modal.querySelector("#drop-container .add-image-txt").classList.remove("hidden");
        modal.querySelector("#drop-container #previewImage").src = "";
        modal.querySelector("#drop-container #previewImage").classList.add("hidden");
        fileInput.classList.remove("hidden");
    } else {
        modal.querySelector("#drop-container #previewImage").classList.remove("hidden");
        fileInput.classList.add("hidden");
    }
}


const showPresentationModal = function() {
    modal = document.querySelector(btnModal.getAttribute("href"));
    const fileInput = document.getElementById("photoInput");
    // Réinitialiser le formulaire
    document.getElementById("form-add-photo").reset();
    fileInput.classList.remove("hidden");
    modal.querySelector("#drop-container #previewImage").src = "";
    modal.querySelector("#drop-container #previewImage").classList.add("hidden");
    
    modal.querySelector("#title-modal").innerHTML = "Galerie photo";
    modal.querySelector("#modal-add-photo").classList.add("hidden");
    modal.querySelector("#modal-presentation").classList.remove("hidden");

    addPhotoBtn = modal.querySelector(".modal-wrapper #add-picture-btn");
    validPhotoBtn = modal.querySelector(".modal-wrapper #valid-picture-btn");
    validPhotoBtn.classList.add("hidden");
    addPhotoBtn.classList.remove("hidden");

    returnIcon = modal.querySelector("#modal-top .fa-arrow-left");
    returnIcon.classList.add("hidden");
    clickOnDeleteIcon();
}

const deleteWorkInModal = async function (e){
    e.preventDefault();
    const pictureId = e.target.id;
    console.log(pictureId);
    if (!pictureId) {
        console.error("L'ID de l'image n'a pas été trouvé.");
        return;
    }

    // Afficher une boîte de confirmation
    /*const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
    if (!confirmation) {
        console.log("Suppression annulée par l'utilisateur.");
        return; // Annuler la suppression si l'utilisateur clique sur "Annuler"
    }*/

    // Afficher la modale de confirmation
    const confirmationModal = document.getElementById("confirmation-modal");
    confirmationModal.classList.remove("hidden");
    confirmationModal.setAttribute("aria-hidden", "false");

    // Gérer les boutons de la modale
    const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
    const cancelDeleteBtn = document.getElementById("cancel-delete-btn");

    // Si l'utilisateur confirme la suppression
    confirmDeleteBtn.onclick = async function () {
        confirmationModal.classList.add("hidden");
        confirmationModal.setAttribute("aria-hidden", "true");

        const valueToken = JSON.parse(token);
        const urlAPI = `http://localhost:5678/api/works/${pictureId}`;

        try {
            // Supprimer l'objet côté backend
            const responseDelete = await fetch(urlAPI, {
                method: "DELETE",
                headers: new Headers({
                    'Authorization': `Bearer ${valueToken}`,
                    'Content-Type': '*/*'
                })
            });

            if (!responseDelete.ok) {
                throw new Error("Erreur lors de la suppression du projet.");
            }

            console.log("Suppression réussie :", responseDelete);

            // Actualiser la liste des travaux
            await updateWorks();

            // Actualiser l'affichage dans la modale
            updateModalPresentation();
            clickOnDeleteIcon();
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };

    // Si l'utilisateur annule la suppression
    cancelDeleteBtn.onclick = function () {
        confirmationModal.classList.add("hidden");
        confirmationModal.setAttribute("aria-hidden", "true");
        console.log("Suppression annulée par l'utilisateur.");
    };
};

const addWorkInModal = async function (e){
    e.preventDefault();
    modal = document.querySelector(btnModal.getAttribute("href"));
    const valueToken = JSON.parse(token);
    const formEl = document.querySelector("#form-add-photo");
    const formData = new FormData(formEl);
    const fileInput = document.getElementById("photoInput");
    const errorMessage = document.querySelector("#photo-input-error");

    console.log(fileInput);

    // Vérifier si un fichier a été sélectionné
    if (!fileInput.files || fileInput.files.length === 0) {
        e.preventDefault();
        console.log("Pas d'image");
        errorMessage.textContent = "Veuillez ajouter une image avant de soumettre le formulaire.";
        errorMessage.classList.remove("hidden"); // Affiche le message d'erreur
        fileInput.focus(); // Met le focus sur le champ
        return;
    } else {
        errorMessage.textContent = ""; // Réinitialise le message d'erreur
        errorMessage.classList.add("hidden");

        // Envoi du formulaire au backend en utilisant FormData et FetchAPI
    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${valueToken}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout du projet.");
        }

        console.log("Ajout réussi :", await response.json());
        
        // Réinitialiser le champ file
        fileInput.value = "";
        modal.querySelector("#drop-container #previewImage").src = "";
        modal.querySelector("#drop-container #previewImage").classList.add("hidden");
        modal.querySelector("#drop-container .fa-image").classList.remove("hidden");
        modal.querySelector("#drop-container .add-image-btn").classList.remove("hidden");
        modal.querySelector("#drop-container .add-image-txt").classList.remove("hidden");
        fileInput.classList.remove("hidden");

        // Réinitialiser tout le formulaire
        formEl.reset();

        console.log("Formulaire réinitialisé !");

        // Actualiser la liste des travaux
        await updateWorks();
        updateModalPresentation();
    } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
    }
    }   
};

// Création de la modale
export function initializeModal(){
    if (!btnModal) {
        console.error("Aucun élément avec la classe .js-modal trouvé dans le DOM.");
        return;
    }
    btnModal.addEventListener("click", openModal);
    clickOnAddPhotoModal();
}

// Affiche la vue moddale "Ajout de photo"
function clickOnAddPhotoModal(){
    modal = document.querySelector(btnModal.getAttribute("href"));
    addPhotoBtn = modal.querySelector(".modal-wrapper #add-picture-btn");
    addPhotoBtn.addEventListener("click", showAddPhotoModal);
}
// Affiche le vue de présentation des projets "work"
function clickOnReturnIcon(){
    modal = document.querySelector(btnModal.getAttribute("href"));
    returnIcon = modal.querySelector("#modal-top .fa-arrow-left");
    returnIcon.addEventListener("click", showPresentationModal);
}

// Gestion des projets dans la modale Ajout et Suppression
function clickOnDeleteIcon() {
    modal = document.querySelector(btnModal.getAttribute("href"));
    modal.querySelectorAll(".picture .fa-trash-can").forEach(i => {
        i.addEventListener("click", deleteWorkInModal);
    })   
}

// Ajout d'un projet work
function clickOnAddWork() {
    const formEl = document.querySelector("#form-add-photo");
    formEl.addEventListener("submit", addWorkInModal);
}

// Affichage de l'image à télécharger pour le projet
function clickOnAddPhoto(){
    const imageInputEl = document.getElementById("photoInput");
    if (imageInputEl) {
        imageInputEl.addEventListener("change", previewImage);
    } else {
        console.error("L'élément avec l'ID 'photoInput' est introuvable.");
    }
}

// Gère l'utilisation via le clavier
window.addEventListener("keydown", function (e) {
    if(e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
    if(e.key === "Tab" && modal != null) {
        focusInModal(e);
    }
})

const focusInModal = function (e){
    e.preventDefault();
    let index = focusablesElements.findIndex(f => f === modal.querySelector(":focus"));
    console.log(index);
    if(e.shiftKey === true) {
        index--;
    } else {
        index++;
    }
    if(index >= focusablesElements.length) {
        index = 0;
    }
    if (index < 0 ) {
        index = focusablesElements.length - 1;
    }
    console.log(index);
    focusablesElements[index].focus();
}