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

    //Disable the search button while loading and enable it again when loading finishes
    searchButton.disabled = isLoading;

    //Display a loading message while the request is in progress.
    //If loading is finished, remove the message.
    loadingMessage.textContent = isLoading
    ? "Loading definition ..."
    : "";

    //Add or remove the loading css class on the page.
    // When isLoading is true, class shows loading, false, loading class removed.
    document.body.classList.toggle("loading", isLoading);
}

//Fetches the searched word from the Free Dictionary API
async function fetchWord(searchWord) {

    //Show the loading state while the API request is running
    setLoading(true);

    try {

        //send a request to the Dictionary API
        const response = await fetch(
           `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchWord)}`
        );

        //check if request was successful
        if (!response.ok) {

            //Dictionary API returns 404 when the word does not exist
            if(response.status === 404){
                displayError("We could not find that word.");
            } else {
                //Handle any other server errors
                displayError("Something went wrong. Please try again.");
            }

            return;
        }

        //Convert the API response into a Javascript object
        const data = await response.json();

        //Pass the returned data to displayWord()
        displayWord(data);

    } catch (error) {
        //Handle network errors
        displayError("Something went wrong. Please try again.")
    } finally {

        //Stop the loading state
        setLoading(false);
    }
    
}

// Displays the dictionary information returned by the API
function displayWord(data) {

    //Check that the API returned a valid result
    if (data.length === 0) {
        displayError("Something went wrong. Please try again.");
        return;
    }

    //Get the first dictionary entry
    const entry = dat[0];

    //Show the results section
    resultSection.hidden = false;

    //Display the searched word
    word.textContent = entry.word;

    //Display the pronunciation if available
    if (entry.phonetic) {
        pronunciation.textContent = entry.phonetic;
    } else {
        pronunciation.textContent = "";
    }

    //Display the part of speech if available
    if(entry.meanings.length > 0) {
        partOfSpeech.textContent = entry.meanings[0].partOfSpeech;
    }

    //Display the definition if available
    if (entry.meanings[0].definitions.length > 0) {
        definition.textContent = entry.meanings[0].definitions[0].definition;
    }

}
