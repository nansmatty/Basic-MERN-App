const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();
app.use(cors());

connectDB();

// HANDLING REGISTER

app.post('/api/register', async (req, res) => {
  console.log(req.body);
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
    });
    res.json({ status: 'ok' });
  } catch (err) {
    res.json({ status: 'error', error: 'Duplicate email' });
  }
});

// HANDLING LOGIN

app.post('/api/login', async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return { status: 'error', error: 'Invalid login' };
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET
    );

    return res.json({ status: 'ok', user: token });
  } else {
    return res.json({ status: 'error', user: false });
  }
});

// GETTING QUOTE

app.get('/api/quote', async (req, res) => {
  const token = req.headers['x-access-token'];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    return res.json({ status: 'ok', quote: user.quote });
  } catch (error) {
    console.log(error);
    res.json({ status: 'error', error: 'invalid token' });
  }
});

// HANDLING QUOTE

app.post('/api/quote', async (req, res) => {
  const token = req.headers['x-access-token'];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    await User.updateOne({ email: email }, { $set: { quote: req.body.quote } });

    return res.json({ status: 'ok' });
  } catch (error) {
    console.log(error);
    res.json({ status: 'error', error: 'invalid token' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => `Server running on PORT ${PORT} 🔥`);
