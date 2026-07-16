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
const resultSection = document.getElementById("result");

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

//Wait until the html page has fully loaded
document.addEventListener("DOMContentLoaded",initializeApp);

function initializeApp(){

    // Listen for form submission
    searchForm.addEventListener("submit", handleSearch);

    //Listen for theme button clicks
    toggleThemeButton.addEventListener("click", toggleTheme);

    //Display savedFavorites
    displayFavorites();

    //Restore the saved theme
    loadTheme();
}

// Handle Search Submission
function handleSearch(event) {
    // Prevent the browser from refreshing the page
    event.preventDefault();

    //Remove any previous error message
    errorMessage.textContent = "";

    //Clear previous search results
    clearResults();

    //Read the users's input
    const searchWord = wordInput.value.trim().toLowerCase();

    //Check if the user entered a word
    if (searchWord === "") {
        displayError("Please enter a word.");
        return;
    }

    //fetch the word form the Dictionary API
    fetchWord(searchWord);
}

// Clear Results, any previous dictionary results
function clearResults(){

    // Hide the results section
    resultSection.hidden = true;

    //Clear all displayed information
    word.textContent = "";
    pronunciation.textContent = "";
    partOfSpeech.textContent = "";
    definition.textContent = "";

    //Clear optional fields and hide them
    example.textContent = "";
    example.hidden = true;
    synonyms.textContent = "";
    synonyms.hidden = true;

    //Reset the source link
    source.textContent = "View Source";
    source.href = "#";
    source.hidden = true;

    //Hide the audio player
    audio.src = "";
    audio.hidden = true;

    //Hide the Save Favorite button
    saveFavoriteButton.hidden = true;

}

//Displays Error Message
function displayError(message) {
    errorMessage.textContent = message;
}

//Enables or disables the loading state while the API request is running.
function setLoading(isLoading){

    //Disable or enable the SearchButton
    searchButton.disabled = isLoading;

    //Show or hide the loading message
    loadingMessage.textContent = isLoading
    ? "Loading definition ..."
    : "";

    //Add or remove the loading css class
    document.body.classList.toggle("loading", isLoading);
}

