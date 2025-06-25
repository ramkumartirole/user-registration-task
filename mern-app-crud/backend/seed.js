const mongoose = require('mongoose');
const Country = require('./models/Country');
const State = require('./models/State');

const DB_URI = 'mongodb://localhost:27017/your_database_name';
async function seed() {
  await mongoose.connect(DB_URI);

  // Remove existing data
  await Country.deleteMany({});
  await State.deleteMany({});

  // Create country
  const pakistan = await Country.create({ name: 'Pakistan' });
  const usa = await Country.create({ name: 'United States' });

  // Create states
  await State.create([
    { name: 'Punjab', country: pakistan._id },
    { name: 'Sindh', country: pakistan._id },
    { name: 'California', country: usa._id },
    { name: 'Texas', country: usa._id }
  ]);

  console.log('Seeded countries and states!');
  mongoose.disconnect();
}

seed();