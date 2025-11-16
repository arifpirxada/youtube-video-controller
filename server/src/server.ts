import app from './app'
import dotenv from 'dotenv';
dotenv.config();
import connectDatabase from './db/db';

const PORT = process.env.port || 3000;

(async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.info(`Server running at PORT ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to connect to DB, exiting.', error);
    process.exit(1);
  }
})();