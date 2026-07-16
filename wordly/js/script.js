// Select Elements from HTML

//search-form
const searchForm = document.getElementById("search-form");
const wordInput = document.getElementById("word-input");

//search-button
const searchButton = searchForm.querySelector("button");

// Messages
const loadingMessage = document.getElementById("loading-message");
const errorMessage = document.getElementById("error-message");

// Results section
const resulSection = document.getElementById("result");

// Dictionary Information
const word = document.getElementById("word");
const pronunciation = document.getElementById("pronunciation");
const audio = document.getElementById("audio");
const partOfSpeech = document.getElementById("part-of-speech");
const definition = document.getElementById("definition");
const example = document.getElementById("example");
const synonyms = document.getElementById("synonyms");
const source = document.getElementById("source");

// Favorite Section
const saveFavoriteButton = document.getElementById("save-favorite");
const favoriteList = document.getElementById("favorite-list");
const emptyFavorites = document.getElementById("empty-favorites");

// Theme button
const toggleThemeButton = document.getElementById("toggle-theme");