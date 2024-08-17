const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.get('/feeds/CA', async (req, res) => {
  try {
    const feedUrl = 'https://www.spreaker.com/show/5934340/episodes/feed';
    const response = await fetch(feedUrl);
    const data = await response.text();

    res.set('Content-Type', 'text/xml');
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching RSS feed');
  }
});

app.listen(3000, () => console.log('Server listening on port 3000'));