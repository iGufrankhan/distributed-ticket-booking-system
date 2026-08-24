import './payment.worker.js';
import { connectDB } from '../Config/dbConfig.js';

connectDB()
  .then(() => {
    console.log(' Workers initialized successfully');
    console.log(' Listening for payment jobs...');
  })
  .catch((err) => {
    console.error(' Worker initialization failed:', err);
    process.exit(1);
  });