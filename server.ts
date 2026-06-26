import app from './api/index.js';
import { createServer } from 'net';

const PREFERRED_PORT = parseInt(process.env.PORT || '3001');

function isPortFree(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port, '0.0.0.0');
  });
}

async function start() {
  let port = PREFERRED_PORT;
  const free = await isPortFree(port);
  if (!free) {
    port = 0;
    console.warn(`Port ${PREFERRED_PORT} in use — using random available port`);
  }

  const server = app.listen(port, '0.0.0.0', () => {
    const addr = server.address();
    const actualPort = typeof addr === 'object' && addr ? addr.port : port;
    console.log(`API server running on http://localhost:${actualPort}`);

    if (actualPort !== PREFERRED_PORT) {
      console.log(`NOTE: Update VITE_API_PORT env or vite proxy target to :${actualPort}`);
    }
  });
}

start().catch(err => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
