// footer load and logic

async function loadFooter() {
    try {
        const response = await fetch('./components/footer.html');
        if (!response.ok) throw new Error('Footer not found');
        const text = await response.text();
        document.body.insertAdjacentHTML('beforeend', text); // <-- change here

    } catch (error) {
        console.error('Error loading footer:', error);
    }
}
document.addEventListener('DOMContentLoaded', loadFooter);