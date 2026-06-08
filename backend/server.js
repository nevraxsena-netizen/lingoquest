const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const stringRoutes = require('./routes/strings');
const translationRoutes = require('./routes/translations');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/strings', stringRoutes);
app.use('/api/translations', translationRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'LingoQuest API çalışıyor!' });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
  });
}

module.exports = app;