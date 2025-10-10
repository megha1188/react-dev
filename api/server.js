const express = require('express');
const cors = require('cors');
const app = express();
const port = 3002;

app.use(cors());

const generateMockData = () => {
    const mockData = [];
    for (let i = 1; i <= 5000; i++) {
        mockData.push({
            id: i,
            firstName: `FirstName${i}`,
            lastName: `LastName${i}`,
            email: `user${i}@example.com`,
            city: `City${i % 100}`,
            country: `Country${i % 20}`,
            jobTitle: `JobTitle${i % 50}`
        });
    }
    return mockData;
};

app.get('/api/users', (req, res) => {
    res.json(generateMockData());
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
