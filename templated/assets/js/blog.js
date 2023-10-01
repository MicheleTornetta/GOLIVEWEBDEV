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
                    const parsedResult = await res.json();

                    const commentsBox = document.getElementById('comments-box');

                    // For next time, remove dompurify and just have the
                    // server run it through ejs & send back the result
                    // to display it
                    commentsBox.insertAdjacentHTML('afterend', `
                    <li>
                    <div class="comment-header">
                      <div class="username">
                        ${username}
                      </div>
                      <div class="date">
                        ${new Date().toLocaleDateString('en-US')}
                      </div>
                    </div>
                    <div class="text">
                      ${parsedResult.text}
                    </div>
                  </li>
                    `);

                    commentBox.value = '';
                }
                else if (res.status === 429) {
                    modal.alert('Error', 'You have made too many comments in short succession, please try again later.');
                }
                else {
                    modal.alert('Error', 'Error submitting your comment, please try again later.');
                }
            }
            catch (ex) {
                modal.alert('Error', 'Error submitting your comment, please try again later.');
                console.error(ex);
            }

            submitBtn.removeAttribute('disabled');
        }
    }
    else {
        console.error("Missing form element or comment box!");
    }
})();