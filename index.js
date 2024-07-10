// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('build'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
