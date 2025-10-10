const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'src')));


app.listen(port, () => {
  console.log(`Vanilla app listening at http://localhost:${port}`);
});
