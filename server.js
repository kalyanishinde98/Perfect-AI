require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'Perfect-AI-master'))); 

const dbURI = process.env.DB_URI; 

mongoose.connect(dbURI)
  .then(() => console.log(' MongoDB connected successfully to [newUser] database'))
  .catch(err => console.error('MongoDB connection error:', err));


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema, 'userInfo');

const promptSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now }
});
const Prompt = mongoose.model('Prompt', promptSchema, 'prompts');



app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with that email.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ name, email, password: hashedPassword });
    await user.save();
    console.log('New user signed up:', user.email);

    res.status(201).json({
      message: 'Signup successful!',
      user: {
        name: user.name,
        email: user.email,
        _id: user._id
      }
    });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});


app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please check your email.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Please check your password.' });
    }
    console.log('User logged in:', user.email);

    res.status(200).json({
      message: 'Login successful!',
      user: {
        name: user.name,
        email: user.email,
        _id: user._id
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
});


app.post('/api/prompts', async (req, res) => {
  try {
    const { text, userId } = req.body;
    if (!text || !userId) {
      return res.status(400).json({ message: 'Prompt text and user ID are required.' });
    }
    const newPrompt = new Prompt({ text, userId });
    await newPrompt.save();
    console.log(`Saved prompt for user ${userId}: ${text}`);
    res.status(201).json({ message: 'Prompt saved successfully!', prompt: newPrompt });
  } catch (err) {
    console.error('Error saving prompt:', err.message);
    res.status(500).json({ message: 'Server error while saving prompt.' });
  }
});

app.get('/api/prompts/:userId', async (req, res) => {
    try {
        const prompts = await Prompt.find({ userId: req.params.userId })
                                     .sort({ timestamp: -1 }); 
        if (!prompts) {
            return res.status(404).json({ message: 'No prompts found for this user.' });
        }
        res.status(200).json(prompts);
    } catch (err) {
        console.error('Error fetching prompts:', err.message);
        res.status(500).json({ message: 'Server error while fetching prompts.' });
    }
});


app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});