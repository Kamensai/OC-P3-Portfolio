/*********************************************************************************
 * 
 * Ce fichier contient toutes les fonctions nécessaires à l'utilisation de la modale. 
 * 
 *********************************************************************************/

let modal = null;
let returnIcon = document.querySelector(".fa-arrow-left");
returnIcon.style.display = "none";
const btnModal = document.querySelector(".js-modal");


const openModal = function () {
    const target = document.querySelector(btnModal.getAttribute("href"));
    if (!target) {
        console.error("Modal target not found:", e.target.getAttribute("href"));
        return;
    }
    target.style.display = null;
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal", "true");
    modal = target;
    modal.addEventListener("click", closeModal);
    modal.querySelector("#modal-top .fa-xmark").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
}

const closeModal = function () {
    if(modal === null) return;
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", true);
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector("#modal-top .fa-xmark").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    modal = null;
}

const stopPropagation = function (e){
    e.stopPropagation();
}

export function initializeModal(){
    if (!btnModal) {
        console.error("Aucun élément avec la classe .js-modal trouvé dans le DOM.");
        return;
    }
    btnModal.addEventListener("click", openModal);
}
