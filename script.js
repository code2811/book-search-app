document.getElementById('searchButton').addEventListener('click', function() {
    // Get the value of the search input
    const query = document.getElementById('searchInput').value;

    if (query) {
        searchBooks(query);  // Call the function to search for books
    } else {
        alert('Please enter a search term!');
    }
});

function searchBooks(query) {
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayResults(data.items);
        })
        .catch(error => {
            console.error('Error fetching books:', error);
        });
}

function displayResults(books) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';  // Clear previous results

    if (books) {
        books.forEach(book => {
            const bookTitle = book.volumeInfo.title;
            const bookAuthor = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown';

            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book');
            bookDiv.innerHTML = `
                <h3>${bookTitle}</h3>
                <p>Author(s): ${bookAuthor}</p>
            `;
            resultsDiv.appendChild(bookDiv);
        });
    } else {
        resultsDiv.innerHTML = '<p>No results found.</p>';
    }
}
