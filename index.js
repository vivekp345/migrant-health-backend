const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json()); // Allows the server to read JSON from request bodies

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'migrant-health-d51de.firebaseapp.com'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// --- NEW: API Endpoint to GET ALL migrants ---
app.get('/api/migrants', async (req, res) => {
  console.log('Received request to fetch all migrants.');
  try {
    const migrantsSnapshot = await db.collection('migrants').get();
    const migrants = [];
    migrantsSnapshot.forEach(doc => migrants.push(doc.data()));
    res.status(200).json(migrants);
  } catch (error) {
    console.error('Error fetching all migrants:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// --- NEW: API Endpoint to GET ALL locations ---
app.get('/api/locations', async (req, res) => {
    console.log('Received request to fetch all locations.');
    try {
      const locationsSnapshot = await db.collection('locations').get();
      const locations = [];
      locationsSnapshot.forEach(doc => locations.push(doc.data()));
      res.status(200).json(locations);
    } catch (error) {
      console.error('Error fetching all locations:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
});

// --- API Endpoint to GET a SINGLE migrant by phone number ---
app.get('/api/migrants/:phone', async (req, res) => {
  console.log(`Received request for migrant with phone: ${req.params.phone}`);
  try {
    const phone = req.params.phone;
    const migrantDoc = await db.collection('migrants').doc(phone).get();

    if (!migrantDoc.exists) {
      console.log(`Migrant with phone ${phone} not found.`);
      return res.status(404).json({ error: 'Migrant not found' });
    }
    
    console.log(`Found migrant: ${migrantDoc.data().name}`);
    res.status(200).json(migrantDoc.data());

  } catch (error) {
    console.error('Error fetching migrant:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// --- API Endpoint to POST (Register) a new migrant ---
app.post('/api/migrants/register', async (req, res) => {
  console.log('Received request to register a new migrant.');
  try {
    const { name, age, gender, phone, state, district, migrationType, createdBy } = req.body;

    if (!name || !age || !gender || !phone || !state || !district || !migrationType || !createdBy) {
      return res.status(400).json({ error: 'Missing required fields for registration.' });
    }

    const migrantData = { ...req.body, createdAt: new Date().toISOString() };
    await db.collection('migrants').doc(phone).set(migrantData);

    console.log(`Successfully registered migrant: ${name}`);
    res.status(201).json({ message: 'Migrant registered successfully!', data: migrantData });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Something went wrong during registration.' });
  }
});

// --- API Endpoint to POST (upload) a health record ---
app.post('/api/records/upload', upload.single('recordImage'), async (req, res) => {
  console.log('Received request to upload a health record.');
  try {
    const { patientPhone, description } = req.body;
    if (!req.file || !patientPhone) {
      return res.status(400).json({ error: 'Missing file or patient phone number.' });
    }

    const fileName = `${Date.now()}_${req.file.originalname}`;
    const fileUpload = bucket.file(fileName);
    const blobStream = fileUpload.createWriteStream({
      metadata: { contentType: req.file.mimetype },
    });

    blobStream.on('error', (error) => {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong during upload.' });
    });

    blobStream.on('finish', async () => {
      await fileUpload.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      const recordData = {
        imageUrl: publicUrl,
        fileName: fileName,
        description: description || '',
        uploadedAt: new Date().toISOString(),
      };
      await db.collection('migrants').doc(patientPhone).collection('records').add(recordData);
      
      console.log(`Successfully uploaded record for patient: ${patientPhone}`);
      res.status(200).json({ message: 'Record uploaded successfully!', record: recordData });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});