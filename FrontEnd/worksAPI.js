

// Récupération des projets (works) depuis l'api
const responseWorks = await fetch("http://localhost:5678/api/works");
export let works = await responseWorks.json();

// Récupération des catégories
const responseCategories = await fetch('http://localhost:5678/api/categories');
export const categories = await responseCategories.json();