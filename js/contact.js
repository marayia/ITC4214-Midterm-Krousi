document.getElementById('contactSubmitBtn').addEventListener('click', function() {
    let name = document.getElementById('contactName').value.trim();
    let email = document.getElementById('contactEmail').value.trim();
    let subject = document.getElementById('contactSubject').value.trim();
    let message = document.getElementById('contactMessage').value.trim();

    if (name === '') {
        alert('Please enter your name!'); 
        return; 
    }

    if (email === '') { 
        alert('Please enter your email!'); 
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { 
        alert('Please enter a valid email!'); 
        return; 
    }

    if (subject === '') { 
        alert('Please enter a subject!'); 
        return; 
    }

    if (message === '') { 
        alert('Please enter a message!'); 
        return; 
    }

    document.getElementById('modalName').textContent = name;
    document.getElementById('modalEmail').textContent = email;
    document.getElementById('modalSubject').textContent = subject;

    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactSubject').value = '';
    document.getElementById('contactMessage').value = '';

    let modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    modal.show();
});
