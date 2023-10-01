window.modal = {
    alert(title, message, callback) {
        const modalTemplate = document.getElementById('modal-base').content;

        const modal = modalTemplate.cloneNode(true);
        const container = document.createElement('div');
        container.append(modal);

        container.querySelector('.message').textContent = message;
        container.querySelector('.title').textContent = title;
        const closeBtn = container.querySelector('.close');
        closeBtn.onclick = () => {
            container.remove();
            if (callback) {
                callback();
            }
        }
        document.body.append(container);

        setTimeout(() => {
            closeBtn.focus();
        }, 10);
    }
}