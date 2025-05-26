import {linkApi} from "./const.js";

// Récupération des projets (works) depuis l'api
const responseWorks = await fetch(`${linkApi}works`);
export let works = await responseWorks.json();

// Récupération des catégories
const responseCategories = await fetch(`${linkApi}categories`);
export const categories = await responseCategories.json();