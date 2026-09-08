import 'dotenv/config';
import { createApp } from './app';
import { getDatabase } from './config/database';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Initialize the database (creates tables if not present)
getDatabase();

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV ?? 'development'}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});
