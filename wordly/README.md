# Wordly Dictionary SPA

## About 
Wordly Dictionary SPA is a **Single Page Application (SPA)** that allows users to search for English words and instantly view their meanings, pronunciations,audio pronunciation, examples, synonyms and source information. The application uses the **Free Dictionary API** to reveal real-time dictionary data without refreshing the page.

## Features
- Search for English words.
- View Definitions
- Display parts of speech
- Listen to pronunciation audio(when available)
- View pronunciation text
- Display example sentences
- View synonyms
- Save favorite words using **localStorage**
- Remove saved favorites
- Click a favorite word to search for it again
- Light/Dark theme toggle
- Error Handling
- Responsive design for desktop and mobile devices

## Technologies Used
- HTML
- CSS
- JavaScript
- Free Dictionary API
- Local Storage

## Project Structure
wordly/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
└── assets/
    └── screenshot.png

## How to run the project
1. Clone the repository
```bash
git clone git@github.com:modidi/dictionary-app.git
```

or download the ZIP file

2. Open the project folder 

3. Open **index.html** in your browser

OR 

Open the project using **Live Server** in Visual Studio Code.

4. Enter an English word in the search box.

5. Click **Search**.

## API Information

This project uses the **Free Dictionary API**.

Endpoint format: ```
https://api.dictionaryapi.dev/api/v2/entries/en/{word}
```
The API provides:
- Definitions
- Parts of speech
- Pronunciation text
- Audio pronunciation
- Example sentences
- Synonyms
- Source links

## Usage
1. 