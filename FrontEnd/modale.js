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
}

const closeModal = function () {
    if(modal === null) return;
    if(previouslyFocusedElement != null){
        previouslyFocusedElement.focus();
    }
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
    modal.querySelector("#modal-presentation").classList.add("hidden");
    modal.querySelector("#modal-add-photo").classList.remove("hidden");
    addPhotoBtn = modal.querySelector(".modal-wrapper #add-picture-btn");
    validPhotoBtn = modal.querySelector(".modal-wrapper #valid-picture-btn");
    returnIcon = modal.querySelector("#modal-top .fa-arrow-left");
    returnIcon.classList.remove("hidden");
    addPhotoBtn.classList.add("hidden");
    validPhotoBtn.classList.remove("hidden");
    clickOnReturnIcon();
}

const showPresentationModal = function() {
    modal = document.querySelector(btnModal.getAttribute("href"));
    modal.querySelector("#title-modal").innerHTML = "Galerie photo";
    modal.querySelector("#modal-add-photo").classList.add("hidden");
    modal.querySelector("#modal-presentation").classList.remove("hidden");

    addPhotoBtn = modal.querySelector(".modal-wrapper #add-picture-btn");
    validPhotoBtn = modal.querySelector(".modal-wrapper #valid-picture-btn");
    validPhotoBtn.classList.add("hidden");
    addPhotoBtn.classList.remove("hidden");

    returnIcon = modal.querySelector("#modal-top .fa-arrow-left");
    returnIcon.classList.add("hidden");
}

export function initializeModal(){
    if (!btnModal) {
        console.error("Aucun élément avec la classe .js-modal trouvé dans le DOM.");
        return;
    }
    btnModal.addEventListener("click", openModal);
    clickOnAddPhotoModal();
}

function clickOnAddPhotoModal(){
    modal = document.querySelector(btnModal.getAttribute("href"));
    addPhotoBtn = modal.querySelector(".modal-wrapper #add-picture-btn");
    addPhotoBtn.addEventListener("click", showAddPhotoModal);
}

function clickOnReturnIcon(){
    modal = document.querySelector(btnModal.getAttribute("href"));
    returnIcon = modal.querySelector("#modal-top .fa-arrow-left");
    returnIcon.addEventListener("click", showPresentationModal);
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