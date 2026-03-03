async function loadNavbar() {
    try {
        const response = await fetch('./components/navbar.html');
        const text = await response.text();
        // Insert the navbar at the beginning of the body
        document.body.insertAdjacentHTML('afterbegin', text);
    } catch (error) {
        console.error('Error loading the navbar:', error);
    }
}

// Run the function when the DOM is ready
document.addEventListener('DOMContentLoaded', loadNavbar);