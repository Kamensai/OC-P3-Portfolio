

// Récupération des projets (works) depuis l'api
export const responseWorks = await fetch("http://localhost:5678/api/works");
let works = await responseWorks.json();

// Récupération des catégories
const responseCategories = await fetch('http://localhost:5678/api/categories');
export const categories = await responseCategories.json();