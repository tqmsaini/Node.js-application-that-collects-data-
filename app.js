const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
    };

    // Read existing data
    fs.readFile('data.json', 'utf8', (err, jsonData) => {
        if (err && err.code !== 'ENOENT') {
            console.error(err);
            return res.status(500).send('Error reading data file.');
        }

        const dataList = jsonData ? JSON.parse(jsonData) : [];
        dataList.push(data);

        // Write updated data back to file
        fs.writeFile('data.json', JSON.stringify(dataList, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error writing data file.');
            }

            // Send back the submitted data to the user
            res.send(`
                <h1>Data Submitted Successfully!</h1>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Message:</strong> ${data.message}</p>
                <a href="/">Go Back</a>
            `);
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
