// assistance from chatgtp

//will work on it further

async function loadNavbar() {
    try {
        const response = await fetch('./components/navbar.html');
        if (!response.ok) throw new Error('Navbar not found');
        const text = await response.text();
        document.body.insertAdjacentHTML('afterbegin', text);

        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');

            const linkHref = link.getAttribute('href');

            // Standard Match (Home, About, etc.)
            if (linkHref === `./${currentPage}` || linkHref === currentPage) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }

            // --- DROPDOWN SPECIAL LOGIC ---
            // If we are on games.html, highlight the "Our Games" toggle
            if (currentPage === "games.html" && link.classList.contains('dropdown-toggle')) {
                link.classList.add('active');
            }
        });

        // Bootstrap Re-initialization (Keep this as is)
        if (window.bootstrap) {
            const navEl = document.querySelector('.navbar');
            if (navEl) {
                const collapseEl = navEl.querySelector('.navbar-collapse');
                if (collapseEl) new bootstrap.Collapse(collapseEl, { toggle: false });
                const dropdowns = navEl.querySelectorAll('.dropdown-toggle');
                dropdowns.forEach(dd => new bootstrap.Dropdown(dd));
            }
        }
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}
document.addEventListener('DOMContentLoaded', loadNavbar);