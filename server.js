const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve the static files from the React app's build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle any requests that don't match the static files by returning the index.html file
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
