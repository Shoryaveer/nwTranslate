// import * as deepl from 'deepl-node';
const deepl = require('deepl-node');


const authKey = "2de7d025-1190-dae9-3340-692a41756c47:fx"; // Replace with your key
const translator = new deepl.Translator(authKey);



async function translateText(text, fromLanguage, toLanguage) {
    try {
        const result = await translator.translateText(text, fromLanguage, toLanguage);
        return result.text; // The translated text
    } catch (error) {
        // Handle the error appropriately in your context
        console.error('Error during translation:', error);
        throw error; // Rethrow the error if you want to handle it at a higher level
    }
}

// usage:
// translateText('¡Hola, mundo!', 'ES', 'EN-US')
//     .then(translatedText => console.log(translatedText))
//     .catch(error => console.error(error));


// (async () => {
//     const result = await translator.translateText('¡Hola, mundo!', null, 'en-US');
//     console.log(result.text); // Bonjour, le monde !
// })();