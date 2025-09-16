const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function addDetailedKeralaData() {
  console.log('Adding 20 new DETAILED Kerala migrant records to Firestore...');

  const migrants = [
    // Ernakulam Hotspot (3 cases)
    { name: "Sanjay Yadav", phone: "9876543210", age: 34, gender: "Male", location_id: 11, origin_state: "Bihar", health_profile: { overall_status: "Under Observation", vitals: { blood_pressure: "140/90 mmHg", blood_sugar: "110 mg/dL" }, conditions: [{ name: "Hypertension", status: "Monitoring" }], screenings: [], recent_checkups: [] } },
    { name: "Sunita Kumari", phone: "9876543213", age: 31, gender: "Female", location_id: 11, origin_state: "West Bengal", health_profile: { overall_status: "Under Observation", vitals: { blood_pressure: "130/85 mmHg", blood_sugar: "160 mg/dL" }, conditions: [{ name: "Diabetes", status: "Managed" }], screenings: [], recent_checkups: [] } },
    { name: "Rajesh Mahto", phone: "9876543220", age: 36, gender: "Male", location_id: 11, origin_state: "Bihar", health_profile: { overall_status: "Critical", vitals: { blood_pressure: "125/85 mmHg", blood_sugar: "105 mg/dL" }, conditions: [], screenings: [{ disease: "Dengue", result: "Positive", last_screened_date: "2025-09-15" }], recent_checkups: [] } },
    
    // Thiruvananthapuram (2 cases)
    { name: "Anjali Devi", phone: "9876543211", age: 26, gender: "Female", location_id: 1, origin_state: "Odisha", health_profile: { overall_status: "Under Observation", vitals: { blood_pressure: "120/80 mmHg", blood_sugar: "100 mg/dL" }, conditions: [], screenings: [], recent_checkups: [{date: "2025-09-10", reason: "Pregnancy Checkup", notes: "6 months"}] } },
    { name: "Kavita Bai", phone: "9876543223", age: 28, gender: "Female", location_id: 2, origin_state: "West Bengal", health_profile: { overall_status: "Under Observation", vitals: { blood_pressure: "125/82 mmHg", blood_sugar: "98 mg/dL" }, conditions: [], screenings: [], recent_checkups: [{date: "2025-09-12", reason: "Pregnancy Checkup", notes: "9 months"}] } },

    // Kozhikode (1 case)
    { name: "Rakesh Singh", phone: "9876543212", age: 29, gender: "Male", location_id: 20, origin_state: "Jharkhand", health_profile: { overall_status: "Critical", vitals: { blood_pressure: "120/80 mmHg", blood_sugar: "95 mg/dL" }, conditions: [], screenings: [{ disease: "Malaria", result: "Positive", last_screened_date: "2025-09-14" }], recent_checkups: [] } },
    
    // Healthy Migrants in various locations
    { name: "Manoj Kumar", phone: "9876543214", age: 45, gender: "Male", location_id: 15, origin_state: "Maharashtra", health_profile: { overall_status: "Healthy", vitals: { blood_pressure: "122/80 mmHg", blood_sugar: "92 mg/dL" }, conditions: [], screenings: [], recent_checkups: [] } },
    { name: "Geeta Paswan", phone: "9876543215", age: 22, gender: "Female", location_id: 16, origin_state: "Chhattisgarh", health_profile: { overall_status: "Healthy", vitals: { blood_pressure: "118/78 mmHg", blood_sugar: "88 mg/dL" }, conditions: [], screenings: [], recent_checkups: [] } },
    { name: "Vikram Sah", phone: "9876543216", age: 33, gender: "Male", location_id: 23, origin_state: "Uttar Pradesh", health_profile: { overall_status: "Healthy", vitals: { blood_pressure: "124/81 mmHg", blood_sugar: "96 mg/dL" }, conditions: [], screenings: [], recent_checkups: [] } },
    { name: "Rekha Devi", phone: "9876543217", age: 27, gender: "Female", location_id: 3, origin_state: "Karnataka", health_profile: { overall_status: "Healthy", vitals: { blood_pressure: "119/79 mmHg", blood_sugar: "90 mg/dL" }, conditions: [], screenings: [], recent_checkups: [] } },
    { name: "Amit Sharma", phone: "9876543218", age: 25, gender: "Male", location_id: 9, origin_state: "Madhya Pradesh", health_profile: { overall_status: "Healthy", vitals: { blood_pressure: "120/80 mmHg", blood_sugar: "94 mg/dL" }, conditions: [], screenings: [], recent_checkups: [] } },
    { name: "Pooja Mehta", phone: "9876543219", age: 30, gender: "Female", location_id: 7, origin_state: "Andhra Pradesh", health_profile: { overall_status: "Under Observation", vitals: { blood_pressure: "128/84 mmHg", blood_sugar: "105 mg/dL" }, conditions: [{ name: "Asthma", status: "Managed" }], screenings: [], recent_checkups: [] } },
    { name: "Suman Lata", phone: "9876543221", age: 24, gender: "Female", location_id: 10, origin_state: "Odisha", health_profile: { overall_status: "Healthy", vitals: { blood_pressure: "115/75 mmHg", blood_sugar: "89 mg/dL" }, conditions: [], screenings: [], recent_checkups: [] } },
    { name: "Deepak Kumar", phone: "9876543222", age: 39, gender: "Male", location_id: 19, origin_state: "Jharkhand", health_profile: { overall_status: "Critical", vitals: { blood_pressure: "130/86 mmHg", blood_sugar: "112 mg/dL" }, conditions: [], screenings: [{ disease: "TB", result: "Positive", last_screened_date: "2025-09-01" }], recent_checkups: [] } },
    { name: "Prakash Oraon", phone: "9876543224", age: 31, gender: "Male", location_id: 22, origin_state: "Maharashtra", health_profile: { overall_status: "Healthy", vitals: { blood_pressure: "121/79 mmHg", blood_sugar: "93 mg/dL" }, conditions: [], screenings: [], recent_checkups: [] } },
    { name: "Laxmi Murmu", phone: "9876543225", age: 23, gender: "Female", location_id: 5, origin_state: "Chhattisgarh", health_profile: { overall_status: "Healthy", vitals: { blood_pressure: "117/77 mmHg", blood_sugar: "87 mg/dL" }, conditions: [], screenings: [], recent_checkups: [] } },
    { name: "Arvind Tudu", phone: "9876543226", age: 35, gender: "Male", location_id: 25, origin_state: "Uttar Pradesh", health_profile: { overall_status: "Under Observation", vitals: { blood_pressure: "138/88 mmHg", blood_sugar: "109 mg/dL" }, conditions: [{ name: "Hypertension", status: "Unmanaged" }], screenings: [], recent_checkups: [] } },
    { name: "Sarita Devi", phone: "9876543227", age: 29, gender: "Female", location_id: 4, origin_state: "Karnataka", health_profile: { overall_status: "Healthy", vitals: { blood_pressure: "120/80 mmHg", blood_sugar: "95 mg/dL" }, conditions: [], screenings: [], recent_checkups: [] } },
    { name: "Ganesh Naik", phone: "9876543228", age: 27, gender: "Male", location_id: 14, origin_state: "Madhya Pradesh", health_profile: { overall_status: "Healthy", vitals: { blood_pressure: "123/81 mmHg", blood_sugar: "97 mg/dL" }, conditions: [], screenings: [], recent_checkups: [] } },
    { name: "Anita Ekka", phone: "9876543229", age: 32, gender: "Female", location_id: 12, origin_state: "Andhra Pradesh", health_profile: { overall_status: "Under Observation", vitals: { blood_pressure: "129/85 mmHg", blood_sugar: "155 mg/dL" }, conditions: [{ name: "Diabetes", status: "Monitoring" }], screenings: [], recent_checkups: [] } },
  ];

  const batch = db.batch();

  migrants.forEach(migrant => {
    // Add missing fields from the old schema for compatibility
    migrant.state = "Kerala";
    migrant.district = (db.collection('locations').doc(String(migrant.location_id))).id; // Placeholder
    migrant.city = ""; // Placeholder
    migrant.village = ""; // Placeholder
    migrant.migrationType = "Incoming";
    migrant.originDistrict = "Unknown";
    migrant.dateOfReturn = "2025-09-01";
    migrant.occupation = "Construction";
    migrant.chronicIllness = migrant.health_profile.conditions.map(c => c.name);
    migrant.pregnancy = null; // Add logic for this if needed
    migrant.createdBy = "workerId123";
    migrant.lastUpdated = new Date().toISOString();
    
    const docRef = db.collection('migrants').doc(migrant.phone);
    batch.set(docRef, migrant);
});

  await batch.commit();

  console.log(`Successfully added ${migrants.length} new, detailed Kerala migrant records!`);
  process.exit(0);
}

addDetailedKeralaData().catch(error => {
  console.error('Error adding data:', error);
  process.exit(1);
});