(() => {
    const contactForm = document.getElementById('contact-form');

    contactForm.onsubmit = async (e) => {
        e.preventDefault();

        const request = {};

        for (let i = 0; i < e.target.length; i++) {
            const element = e.target[i];
            if (element.name) {
                request[element.name] = element.value;
            }
        }

        try {
            const result = await (await fetch('/api/contact/', {
                method: 'POST',
                body: JSON.stringify(request),
                headers: {
                    'Content-Type': 'application/json',
                }
            })).json();

            if (result.error) {
                window.modal.alert("Failed to send message", result.error);
            }
            else {
                window.modal.alert("Message Sent!", "We will get back to you within 1 to 2 business days.", () => {
                    window.location.href = '/';
                });
            }
        }
        catch (ex) {
            console.error(ex);
            window.modal.alert("Failed to send message", 'You have tried to contact us too many times. Please try again later.');
        }
    };
})();