document.addEventListener('DOMContentLoaded', () => {
    loadPosts();

    // Handle form submission
    document.getElementById('postForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        // Submit the post data
        fetch('/api/posts', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadPosts(); // Reload posts after adding a new one
            } else {
                alert('Failed to add post.');
            }
        })
        .catch(error => console.error('Error:', error));
    });
});

// Load posts from the server
function loadPosts() {
    fetch('/api/posts')
    .then(response => response.json())
    .then(posts => {
        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = '';

        posts.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');

            postElement.innerHTML = `
                <h4>${post.user}</h4>
                <p>${post.content}</p>
                ${post.image ? `<img src="${post.image}" alt="Post Image">` : ''}
                <div class="reactions">
                    <button class="reaction-btn" onclick="addReaction(${index}, 'hearts')">❤️ ${post.reactions.hearts}</button>
                    <button class="reaction-btn" onclick="addReaction(${index}, 'thumbsUps')">👍 ${post.reactions.thumbsUps}</button>
                    <button class="reaction-btn" onclick="addReaction(${index}, 'smiles')">😊 ${post.reactions.smiles}</button>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });
    });
}

// Add reaction to a post
function addReaction(index, type) {
    fetch(`/api/posts/${index}/reaction`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadPosts(); // Reload posts after reaction
        }
    });
}
