(() => {
    const form = document.getElementById('comment-form');
    const commentBox = document.getElementById('comment-text');
    const submitBtn = document.getElementById('submit-comment');

    if (form && commentBox && submitBtn) {
        form.onsubmit = async (e) => {
            e.preventDefault();

            submitBtn.setAttribute('disabled', true);

            const value = commentBox.value ? commentBox.value.trim() : '';
            commentBox.value = value;

            if (value.length === 0) {
                return;
            }

            try {
                const res = await fetch('/api/comments/create-comment/', {
                    method: 'POST',
                    body: JSON.stringify({
                        text: value,
                        postId // postId is set in the blog.ejs file
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (res.ok) {
                    alert('Added comment!');
                }
                else {
                    alert('Error submitting your comment, please try again later.');
                }
            }
            catch (ex) {
                alert('Error submitting your comment, please try again later.');
                console.error(ex);
            }

            submitBtn.setAttribute('disabled', false);
        }
    }
    else {
        console.error("Missing form element or comment box!");
    }
})();