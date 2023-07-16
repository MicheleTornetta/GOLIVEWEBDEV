var modal = {
    alert(message) {
        const modalTemplate = document.getElementById('modal-base').content;

        const modal = modalTemplate.cloneNode(true);
        const container = document.createElement('div');
        container.append(modal);

        container.querySelector('.message').textContent = message;
        const closeBtn = container.querySelector('.close');
        closeBtn.onclick = () => {
            container.remove();
        }
        document.body.append(container);

        setTimeout(() => {
            closeBtn.focus();
        }, 10);
    }
}