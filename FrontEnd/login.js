import {linkApi} from "./works.js";

/*********************************************************************************
 * 
 * Ce fichier contient toutes les fonctions nécessaires à la connexion de l'utilisateur. 
 * 
 *********************************************************************************/

async function login() {
    
    const formLogin = document.querySelector(".form-login");
    formLogin.addEventListener("submit", async function (event) {
        try {
            event.preventDefault();
            // Vérification de l'email et du mot de passe aux normes
            const email = event.target.querySelector("[name=email]").value;
            validateEmail(email);

            const password = event.target.querySelector("[name=password]").value;
            validatePassword(password);
            // Création de l'objet de connexion.
            const connexion = {
                email: email,
                password: password,
            };
            console.log(email);
            console.log(password);
            // Création de la charge utile au format JSON
            const chargeUtile = JSON.stringify(connexion);

            // Appel de la fonction fetch avec toutes les informations
            const responseLogin = await fetch(`${linkApi}users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: chargeUtile
            });
            console.log(responseLogin);
            validateLogin(responseLogin);
            const login = await responseLogin.json();
            // Vérification de l'email et du mot de passe côté backend pour la connexion

            setTokenInLocalStorage(login);

            document.location.href = "index.html";
            
        } catch (error) {
            alert("Une erreur est survenue : " + error.message);
            console.log("Une erreur est survenue : " + error.message);
        }
        
    });
}

login();

/**
 * Cette fonction prend un body en paramètre et valide la réponse de l'API
 * @param {body} responseLogin
 * @throws {Error}
 */
// Vérification de l'email et du mot de passe pour la connexion : Réponse attendure TRUE (200)
function validateLogin(responseLogin) {
    console.log(responseLogin);
    if(!responseLogin.ok){
        throw new Error("Erreur dans l’identifiant ou le mot de passe.");
    }   
}

/**
 * Cette fonction prend un email en paramètre et valide qu'il est au bon format. 
 * @param {string} email 
 * @throws {Error}
 */
function validateEmail(email) {
    let emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+")
    if (!emailRegExp.test(email)) {
        throw new Error("L'email n'est pas valide.")
    } 
}
/**
 * Cette fonction prend un nom en paramètre et valide qu'il est au bon format
 * ici : deux caractères au minimum
 * @param {string} password 
 * @throws {Error}
 */
function validatePassword(password) {
    if (password.length < 2) {
        throw new Error("Le mot de passe est trop court. ")
    }
    
}
// Sauvegarde du token dans le LocalStorage
function setTokenInLocalStorage(login){
    const token = login.token;
    const valueToken = JSON.stringify(token);
    console.log("strungify valueToken : "+ valueToken);
    window.localStorage.setItem("token", valueToken);
}



// Create login link
export function createLoginLink(){
    const liLogin = document.querySelector(".login-logout");
    const aElement = document.createElement("a");
    aElement.href = "login.html";
    aElement.innerText = "login";
    liLogin.appendChild(aElement);
}

// Create Logout button
export async function createLogoutBtn(){
    const liLogout = document.querySelector(".login-logout");
    const aElement = document.createElement("a");
    aElement.classList.add("logout-btn");
    aElement.innerText = "logout";
    liLogout.appendChild(aElement);
}
export async function clickLogout(){
    const logoutBtn = document.querySelector(".logout-btn");
    logoutBtn.addEventListener("click", function () {
        window.localStorage.removeItem("token");
        document.location.href = "index.html";
    })
}