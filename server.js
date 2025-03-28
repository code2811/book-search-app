const express = require('express');
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'google-books.p.rapidapi.com';

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.post('/api/search', async (req, res) => {
    try {
        const { query, type, page } = req.body;
        
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }
        
        // Default to 10 results per page
        const startIndex = (page - 1) * 10;
        
        // Build search parameter based on search type
        let searchParam = '';
        switch (type) {
            case 'title':
                searchParam = `intitle:${query}`;
                break;
            case 'author':
                searchParam = `inauthor:${query}`;
                break;
            case 'subject':
                searchParam = `subject:${query}`;
                break;
            case 'isbn':
                searchParam = `isbn:${query}`;
                break;
            default:
                searchParam = query;
        }
        
        const options = {
            method: 'GET',
            url: 'https://google-books.p.rapidapi.com/volumes',
            params: {
                q: searchParam,
                startIndex: startIndex,
                maxResults: '10'
            },
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST
            }
        };
        
        const response = await axios.request(options);
        res.json(response.data);
        
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ 
            error: 'An error occurred while searching for books',
            details: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
