// Express server on port 3000
// 1. Serve static files from /public
// 2. Serve static files from /node_modules
// 3. Serve static files from /bower_components


// 1. Serve static files from /public
app.use(express.static('public'));

// 2. Serve static files from /node_modules

app.use('/node_modules', express.static('node_modules'));

// 3. Serve static files from /bower_components
