import {updateWorks, updateModalPresentation, showCustomAlertToken} from "./works.js";
import {linkApi, token} from "./const.js";

/*********************************************************************************
 * 
 * Ce fichier contient toutes les fonctions nécessaires à l'utilisation de la modale. 
 * 
 *********************************************************************************/
let previouslyFocusedElement = null;
const btnModal = document.querySelector(".js-modal");
const modal = document.querySelector(btnModal.getAttribute("href"));
const addPhotoBtn = modal.querySelector(".modal-wrapper #add-picture-btn");
const validPhotoBtn = modal.querySelector(".modal-wrapper #valid-picture-btn");
const returnIcon = modal.querySelector("#modal-top .fa-arrow-left");


const openModal = function () {
    //stock l'élément focus avant la création de la modale
    previouslyFocusedElement = document.querySelector(":focus");

    // Afficher la modale
    modal.classList.remove("hidden");
    modal.querySelector("#modal-presentation").classList.remove("hidden");
    addPhotoBtn.classList.remove("hidden");

    // Configurer les attributs d'accessibilité
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");

    // Ajouter les gestionnaires d'événements
    modal.addEventListener("click", closeModal);
    modal.querySelector("#modal-top .fa-xmark").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
    
    // Initialiser les icônes de suppression
    clickOnDeleteIcon();
}

const closeModal = function () {
    if(modal === null) return;
    if(previouslyFocusedElement != null){
        previouslyFocusedElement.focus();
    }
    document.getElementById("form-add-photo").reset();
    modal.querySelector("#drop-container #preview-image").src = "";
    modal.querySelector("#drop-container #preview-image").classList.add("hidden");
    modal.querySelector("#photo-input-error").classList.add("hidden");
    
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
    modal.querySelector("#title-modal").innerHTML = "Ajout photo";
    // Affiche la vue de modale pour ajouter un projet "work"
    modal.querySelector("#modal-presentation").classList.add("hidden");
    modal.querySelector("#modal-add-photo").classList.remove("hidden");

    // Affiche les éléments de #drop-container pour ajouter une photo
    modal.querySelector("#drop-container .fa-image").classList.remove("hidden");
    modal.querySelector("#drop-container .add-image-btn").classList.remove("hidden");
    modal.querySelector("#drop-container .add-image-txt").classList.remove("hidden");

    // Affiche le bouton retour et le bouton valider Et cache le bouton "ajouter Photo"
    returnIcon.classList.remove("hidden");
    addPhotoBtn.classList.add("hidden");
    validPhotoBtn.classList.remove("hidden");

    clickOnReturnIcon();
    clickOnAddPhoto();
    clickOnAddWork();
}

const previewImage = function(e) {
    const input = e.target;
    const image = document.getElementById("preview-image");
    const fileInput = document.getElementById("photoInput");
    const errorMessage = document.querySelector("#photo-input-error");

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
        modal.querySelector("#drop-container #preview-image").src = "";
        modal.querySelector("#drop-container #preview-image").classList.add("hidden");
        fileInput.classList.remove("hidden");
    } else {
        modal.querySelector("#drop-container #preview-image").classList.remove("hidden");
        fileInput.classList.add("hidden");
    }
}


const showPresentationModal = function() {
    const fileInput = document.getElementById("photoInput");
    // Réinitialiser le formulaire
    document.getElementById("form-add-photo").reset();
    fileInput.classList.remove("hidden");
    modal.querySelector("#drop-container #preview-image").src = "";
    modal.querySelector("#drop-container #preview-image").classList.add("hidden");
    modal.querySelector("#photo-input-error").classList.add("hidden");

    
    modal.querySelector("#title-modal").innerHTML = "Galerie photo";
    modal.querySelector("#modal-add-photo").classList.add("hidden");
    modal.querySelector("#modal-presentation").classList.remove("hidden");

    validPhotoBtn.classList.add("hidden");
    addPhotoBtn.classList.remove("hidden");

    returnIcon.classList.add("hidden");
    clickOnDeleteIcon();
}

const deleteWorkInModal = async function (e){
    e.preventDefault();
    const pictureId = e.target.id;
    if (!pictureId) {
        console.error("L'ID de l'image n'a pas été trouvé.");
        return;
    }

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
        const urlAPI = `${linkApi}works/${pictureId}`;

        try {
            // Supprimer l'objet côté backend
            const responseDelete = await fetch(urlAPI, {
                method: "DELETE",
                headers: new Headers({
                    'Authorization': `Bearer ${valueToken}`,
                    'Content-Type': '*/*'
                })
            });

            if (responseDelete.status == 401) {
                showCustomAlertToken("Session expirée. Veuillez vous reconnecter.");
                throw new Error("Connexion non autorisée.");
            }

            if (!responseDelete.ok) {
                throw new Error("Erreur lors de la suppression du projet.");
            }

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
    };
};

const addWorkInModal = async function (e){
    e.preventDefault();
    const valueToken = JSON.parse(token);
    const formEl = document.querySelector("#form-add-photo");
    const formData = new FormData(formEl);
    const fileInput = document.getElementById("photoInput");
    const errorMessage = document.querySelector("#photo-input-error");

    // Vérifier si un fichier a été sélectionné
    if (!fileInput.files || fileInput.files.length === 0) {
        e.preventDefault();
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
        
        // Réinitialiser le champ file
        fileInput.value = "";
        modal.querySelector("#drop-container #preview-image").src = "";
        modal.querySelector("#drop-container #preview-image").classList.add("hidden");
        modal.querySelector("#drop-container .fa-image").classList.remove("hidden");
        modal.querySelector("#drop-container .add-image-btn").classList.remove("hidden");
        modal.querySelector("#drop-container .add-image-txt").classList.remove("hidden");
        fileInput.classList.remove("hidden");

        // Réinitialiser tout le formulaire
        formEl.reset();

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
    addPhotoBtn.addEventListener("click", showAddPhotoModal);
}
// Affiche le vue de présentation des projets "work"
function clickOnReturnIcon(){
    returnIcon.addEventListener("click", showPresentationModal);
}

// Gestion des projets dans la modale Ajout et Suppression
function clickOnDeleteIcon() {
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
    imageInputEl.addEventListener("change", validateImageSize);
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
        trapFocusInModal(e);
    }
})

const trapFocusInModal = function (e) {
    e.preventDefault();

    let focusablesElements = [];
    if (modal.querySelector("#modal-presentation") && !modal.querySelector("#modal-presentation").classList.contains("hidden")) {
        // Vue #modal-presentation : Seuls les icônes trash-can et le bouton add-picture-btn sont focusables
        focusablesElements = Array.from(modal.querySelectorAll("#add-picture-btn"));
    } else if (modal.querySelector("#modal-add-photo") && !modal.querySelector("#modal-add-photo").classList.contains("hidden")) {
        // Vue #modal-add-photo : Les inputs et les boutons sont focusables
        focusablesElements = Array.from(modal.querySelectorAll("#photoTitle, #drop-container, #form-add-photo select, #valid-picture-btn"));
    }

    // Trouver l'élément actuellement focusé
    const focusedElement = document.activeElement;
    let index = focusablesElements.indexOf(focusedElement);
    
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
    focusablesElements[index].focus();
}

// Vérification de la taille de l'image téléchargée
function validateImageSize(event) {
    const fileInput = event.target;
    const errorMessage = document.querySelector("#photo-input-error");

    // Vérifier si un fichier a été sélectionné
    if (fileInput.files && fileInput.files[0]) {
        const fileSizeInMB = fileInput.files[0].size / (1024 * 1024); // Convertir la taille en Mo

        if (fileSizeInMB > 4) {
            // Afficher un message d'erreur si la taille dépasse 4 Mo
            errorMessage.textContent = "L'image ne doit pas dépasser 4 Mo.";
            errorMessage.classList.remove("hidden");
            fileInput.value = ""; // Réinitialiser le champ de fichier
        } else {
            // Réinitialiser le message d'erreur si la taille est correcte
            errorMessage.textContent = "";
            errorMessage.classList.add("hidden");
        }
    }
}