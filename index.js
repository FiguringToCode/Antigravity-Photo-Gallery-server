const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


async function connectDB() {
  const uri = process.env.MONGODB_URI;
  
  if (uri) {
    console.log('Connecting to provided MongoDB URI...');
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB.');
  } else {
    console.log("Database Connection Failed")
  }
}

// Define Schema
const photoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  category: { type: String, default: 'General' },
  createdAt: { type: Date, default: Date.now }
});

const Photo = mongoose.model('Photo', photoSchema);

// Starter Photos Seed Data
const samplePhotos = [
  {
    title: 'Yosemite Valley',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80',
    category: 'Landscapes'
  },
  {
    title: 'Mountain Sunrise',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80',
    category: 'Landscapes'
  },
  {
    title: 'Forest Path',
    url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&q=80',
    category: 'Nature'
  },
  {
    title: 'Golden Woods',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
    category: 'Nature'
  },
  {
    title: 'Blooming Meadow',
    url: 'https://images.unsplash.com/photo-1472214222541-d510753a49fa?w=1200&q=80',
    category: 'Nature'
  },
  {
    title: 'Red Fox',
    url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1200&q=80',
    category: 'Wildlife'
  },
  {
    title: 'Majestic Deer',
    url: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=1200&q=80',
    category: 'Wildlife'
  },
  {
    title: 'Lion Portrait',
    url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1200&q=80',
    category: 'Wildlife'
  },
  {
    title: 'Distant Galaxy',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    category: 'Cosmos'
  },
  {
    title: 'Cosmic Nebula',
    url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1200&q=80',
    category: 'Cosmos'
  }
];

async function seedDatabase() {
  try {
    const count = await Photo.countDocuments();
    if (count === 0) {
      console.log('Seeding 10 sample photos...');
      await Photo.insertMany(samplePhotos);
      console.log('Seeding completed successfully.');
    } else {
      console.log(`Database already has ${count} photos. Skipping seed.`);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Routes
app.get('/api/photos', async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/photos', async (req, res) => {
  try {
    const { title, url, category } = req.body;
    if (!title || !url) {
      return res.status(400).json({ error: 'Title and URL are required' });
    }
    const newPhoto = new Photo({ title, url, category });
    await newPhoto.save();
    res.status(201).json(newPhoto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/photos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPhoto = await Photo.findByIdAndDelete(id);
    if (!deletedPhoto) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    res.json({ message: 'Photo deleted successfully', deletedPhoto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
async function startServer() {
  try {
    await connectDB();
    await seedDatabase();
    const port = process.env.PORT || 3000
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();