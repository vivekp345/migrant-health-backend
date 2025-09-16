const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const locationsData = require('../migrant-health-portal-web/src/data/locations.json'); // Adjust path if needed

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadLocations() {
  console.log('Uploading location data to Firestore...');
  const batch = db.batch();

  locationsData.forEach(location => {
    // Use the string version of the ID for the document ID
    const docRef = db.collection('locations').doc(String(location.id));
    batch.set(docRef, location);
  });

  await batch.commit();
  console.log(`Successfully uploaded ${locationsData.length} location records!`);
  process.exit(0);
}

uploadLocations().catch(error => {
  console.error('Error uploading locations:', error);
  process.exit(1);
});