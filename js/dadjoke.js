// fetches a random dad joke from icanhazdadjoke.com
function fetchJoke() {
    document.getElementById('jokeText').textContent = 'Loading...';

    fetch('https://icanhazdadjoke.com/', {
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'KMC Studios Website (https://github.com/marayia)'
        }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        document.getElementById('jokeText').textContent = data.joke;
    })
    .catch(function(error) {
        document.getElementById('jokeText').textContent = 'Failed to load joke. Try again!';
    });
}

// load a joke on page load
fetchJoke();

// load a new joke when button is clicked
document.getElementById('newJokeBtn').addEventListener('click', fetchJoke);