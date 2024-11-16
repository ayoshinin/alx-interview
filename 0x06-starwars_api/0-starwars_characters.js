
#!/usr/bin/node
const request = require('request');
const { promisify } = require('util');
const id = process.argv[2];
const apiUrl = `https://swapi-api.alx-tools.com/api/films/${id}`;

// Promisify the request function
const requestPromise = promisify(request);

// Function to fetch and parse JSON data from a URL
const fetchJson = async (url) => {
    const response = await requestPromise(url);
    if (response.statusCode !== 200) {
        throw new Error(`Failed to fetch ${url}: ${response.statusMessage}`);
    }
    return JSON.parse(response.body);
};

const fetchCharacters = async () => {
    try {
        // Fetch the film data
        const filmData = await fetchJson(apiUrl);
        const characterUrls = filmData.characters;

        // Fetch all character names in parallel
        const characterPromises = characterUrls.map(url => fetchJson(url).then(data => data.name));
        const characterNames = await Promise.all(characterPromises);

        // Log each character's name
        characterNames.forEach(name => console.log(name));
    } catch (error) {
        console.error('Error:', error.message);
    }
};

fetchCharacters();

