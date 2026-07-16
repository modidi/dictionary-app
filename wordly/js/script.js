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

//Store the favorite words
let favorites = [];

//Wait until the html page has fully loaded
document.addEventListener("DOMContentLoaded",initializeApp);

function initializeApp(){

    // Listen for form submission
    searchForm.addEventListener("submit", handleSearch);

    //Listen for theme button clicks
    toggleThemeButton.addEventListener("click", toggleTheme);

    //Save the current word
    saveFavoriteButton.addEventListener("click", saveCurrentWord);

    //Load the saved favorites from localStorage
    favorites = getFavorites();

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
                displayError("Sorry, we couldn't find that word. Please check the spelling and try again");
            } else {
                //Handle any other server errors
                displayError("Something went wrong, unable to load the definition right now. Please try again.");
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
    if (!data || data.length === 0) {
        displayError("Something went wrong. Please try again.");
        return;
    }

    //Get the first dictionary entry
    const entry = data[0];

    //Check that the entry exists
    if(!entry) {
        displayError("Something went wrong please try again.")
        return;
    }

    //Show the results section
    resultSection.hidden = false;

    //Display the searched word
    if(entry.word){
         word.textContent = entry.word;
    }else {
        word.textContent = "";
    }
   
    //Display the pronunciation if available
    if (entry.phonetic) {
        
        //Use the main phonetic text providec by API
        pronunciation.textContent = entry.phonetic;

    } else if (entry.phonetics && entry.phonetics.length > 0) {

        //Clear any previous pronunciation
        pronunciation.textContent = "";

        //Loopt through the phonetics array
        for (let i = 0; i < entry.phonetics.length; i++) {

            //Check if the current phonetic contains text
            if(entry.phonetics[i].text) {

                //Display the first available phonetic text
                pronunciation.textContent = entry.phonetics[i].text;

                //Stop searching once a pronunciation has been found
                break;
            }
        }

    } else {

        //Clear the pronunciation if none is available
        pronunciation.textContent = "";
    }

    // Get the first available audio pronunciation
    const audioUrl = getAudioUrl(entry.phonetics);

    //Display the audio player if an audio file exists
    if(audioUrl) {

        //set the audio source
        audio.src = audioUrl;

        //Show the audio player
        audio.hidden = false;

    } else {
        // Hide the audio player if no audio exists
        audio.src = "";
        audio.hidden = true;
    }

    //Display the part of speech if available
    if(entry.meanings && entry.meanings.length > 0) {
        partOfSpeech.textContent = entry.meanings[0].partOfSpeech;
    } else {
        partOfSpeech.textContent = "";
    }

    //Display the definition if available
    if (entry.meanings &&
        entry.meanings.length > 0 &&
        entry.meanings[0].definitions &&
        entry.meanings[0].definitions.length > 0) {
        definition.textContent = entry.meanings[0].definitions[0].definition;
    } else {
        definition.textContent = "";
    }

    //Display an example sentence if available
    if (entry.meanings && 
        entry.meanings.length > 0 &&
        entry.meanings[0].definitions &&
        entry.meanings[0].definitions.length > 0 &&
        entry.meanings[0].definitions[0].example
    ) {
        //Display the example sentence
        example.textContent = entry.meanings[0].definitions[0].example;

        //Show the example paragraph
        example.hidden = false;
    } else {
        //clear and hide the example if none exists
        example.textContent = "";
        example.hidden = true;
    }

    //Get all available synonyms
    const synonymList = getSynonyms(entry);

    //Display synonyms if available
    if (synonymList.length > 0) {

        //Join all synonyms into one string separated by commas
        synonyms.textContent = synonymList.join(", ");

        //Show synonyms section
        synonyms.hidden = false;

    } else {

        //Clear and hide the synonyms section
        synonyms.textContent = "";
        synonyms.hidden = true;
    }

    // Display the source link if available
    if (entry.sourceUrls && entry.sourceUrls.length > 0) {

        //Set the source link
        source.href = entry.sourceUrls[0];

        //Display the source text
        source.textContent = "View Source";

        //Show the source link
        source.hidden = false;
    
    } else {

        //Reset and hide the source link
        source.href = "#";
        source.textContent = "";
        source.hidden = true;
    }

    updateSaveButton(entry.word);

}

// Finds and returns the first available audio pronunciation
function getAudioUrl(phonetics) {

    //Checks that the phonetics array exists
    if (!phonetics) {
        return "";
    }

    //Loops through each phonetics objects
    for(let i = 0; i < phonetics.length; i++) {

        //Checks if an audio URL exists
        if (phonetics[i].audio) {
            return phonetics[i].audio;
        }
    }

    //no audio found
    return "";
}

// Synonym, returns all available synonyms without duplicates
function getSynonyms(entry) {

    //Creates an empty array to store synonyms
    const synonymList = [];

    //Check if meanings exist
    if (entry.meanings) {

        //Loop through each meaning
        for (let i = 0; i < entry.meanings.length; i++) {
           
            //Store the current meaning
            const meaning = entry.meanings[i];

            //Add meaning synonyms, if they exist loop through each indicidually
            if (meaning.synonyms) {
                for (let j = 0; j < meaning.synonyms.length; j++) {

                    //Avoid duplicates
                    if (!synonymList.includes(meaning.synonyms[j])) {
                        synonymList.push(meaning.synonyms[j]);
                    }
                }
            }

            //Check if definition exist
            if(meaning.definitions) {

                //Loop through each definition
                for(let j = 0; j < meaning.definitions.length; j++) {

                    //Store the current definition
                    const definition = meaning.definitions[j];

                    //Add definition synonyms, if they exist loop through each one
                    if (definition.synonyms) {

                        for (let m = 0; m < definition.synonyms.length; m++) {

                            //Avoid duplicates
                            if(!synonymList.includes(definition.synonyms[m])) {
                                synonymList.push(definition.synonyms[m]);
                            }
                        }
                    }
                }
            }
        }

    }

    //Return the completed synonym list
    return synonymList;
}

//Get saved favorite words from local storage
function getFavorites() {

    //Try to access localstorage safely 
    try {

        //Get the data saved under the key "favorites"
        const savedFavorites = localStorage.getItem("dictionaryFavorites");

        //Return empty array if there is no saved data
        if (!savedFavorites) {
            return [];
        }

        //Convert the json string back into a javascript array
        return JSON.parse(savedFavorites);

    } catch (error) {

        //If json.parse fails, return empty
        return [];
    }

}

//Save a word to the favorites list
function saveFavorite(word, phonetic) {


    //Check if the word already exists in the favorites list
    for (let i = 0; i < favorites.length; i++) {

        //Compare the words without considering uppercase or lowercase
        if (favorites[i].word.toLowerCase() === word.toLowerCase()) {

            //Stop the function if the word is already saved
            return;
        }
    }

    //Create a new favorite object
    const newFavorite = {
        word,
        phonetic
    };

    //Add the new favorite to the favorites array
    favorites.push(newFavorite);

    //Save the updated favorites array to localstorage
    localStorage.setItem("dictionaryFavorites", JSON.stringify(favorites));

}

//Remove a word from the favorites list
function removeFavorite(word) {

    //Create a new array without the selected word
    favorites = favorites.filter(favorite => 
        favorite.word.toLowerCase() !== word.toLowerCase()
    );

    //Save the updated favorites array to locaLstorage
    localStorage.setItem("dictionaryFavorites", JSON.stringify(favorites));
}

//Display all saved favorite words
function displayFavorites() {

    //Clear any existing favorite words from the list
    favoriteList.innerHTML = "";

    //Check if there are no saved favorites
    if(favorites.length === 0) {

        //Show the empty message
        emptyFavorites.style.display = "block";

        //Stop the function
        return;
    }

    //Hide the empty message
    emptyFavorites.style.display = "none";

    //Loop through each favorite word
    for(let i = 0; i < favorites.length; i++) {

        //Create a new list item
        const listItem = document.createElement("li");

        //Create a span to display the favorite word
        const wordSpan =  document.createElement("span");

        //Display the word and its phonetic text
        wordSpan.textContent = `${favorites[i].word} ${favorites[i].phonetic}`;

        //Allow the favorite word to be clicked
        wordSpan.addEventListener("click", function (){

            //Display the selected word in the search input
            wordInput.value = favorites[i].word;

            //Search for the selected word
            fetchWord(favorites[i].word);
        });

        //Create a remove button
        const removeButton =  document.createElement("button");

        //Set the button text
        removeButton.textContent = "Remove";

        //Remove the favorite word when the button is clicked
        removeButton.addEventListener("click", function () {

            //Remove the selected word
            removeFavorite(favorites[i].word);

            //Update the displayed favorites
            displayFavorites();

            //Update the Save Favorite button
            updateSaveButton(word.textContent);
        });

        //Add the word and button to the list item
        listItem.appendChild(wordSpan);
        listItem.appendChild(removeButton);

        //Add the list item to the favorite list
        favoriteList.appendChild(listItem);

    }

}

//Update the save favorite button
function updateSaveButton(word) {

    //Show the Save Favorite Button
    saveFavoriteButton.hidden = false;

    //Check if the word is already saved
    const savedWord = favorites.find(favorite =>
        favorite.word.toLowerCase() === word.toLowerCase()
    );

    //Update the button text and style
    if(savedWord) {

        //Change the button text
        saveFavoriteButton.textContent = "Saved";

        //Apply the saved style
        saveFavoriteButton.classList.add("saved");
    } else {
        
        //Change the button text
        saveFavoriteButton.textContent = "Save Favorite";

        //Remove the saved style
        saveFavoriteButton.classList.remove("saved");
    }
}

// Save the current displayed word
function saveCurrentWord() {

    //Get the current word and pronunciation
    const currentWord = word.textContent;
    const currentPhonetic = pronunciation.textContent;

    //Save the word to the favorites list
    saveFavorite(currentWord, currentPhonetic);

    //Update the displayed favorites
    displayFavorites();

    //Update the save favorite button
    updateSaveButton(currentWord);
}

//Toggle between the light and dark themes
function toggleTheme() {

    //Add or remove the dark-theme class
    document.body.classList.toggle("dark-theme");

    //Check whether the dark theme is active
    if(document.body.classList.contains("dark-theme")) {

        //Save the dark theme preference
        localStorage.setItem("theme", "dark");

    } else {

        //Save the light theme preference
        localStorage.setItem("theme", "light");
    }
}

//Load the saved theme
function loadTheme() {

    //Get the saved theme from localStorage
    const savedTheme = localStorage.getItem("theme");

    //Check if the saved theme is dark
    if (savedTheme === "dark") {

        //Apply the dark theme
        document.body.classList.add("dark-theme");
    }
}





