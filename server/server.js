import express from 'express';
import cors from 'cors';
import userRouter from './src/routes/user.routes.js';
import taskRouter from './src/routes/task.routes.js';
import noteRouter from './src/routes/note.routes.js';
import diaryRouter from './src/routes/diary.routes.js';
import dotenv from 'dotenv';
import './src/cron.js';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os'; // Import the os module

dotenv.config(); // Load environment variables

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
     // origin: 'https://weedtodo.rhinoguards.co.uk',
     // origin: 'https://weedtodo.vercel.app',
         origin: 'http://localhost:5173',
     // origin: 'http://192.168.0.148:5173', // Fixed typo: removed the 'I' after IP
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization'],
     credentials: true,
};
app.use(cors(corsOptions));

// Serve API documentation page
app.get('/', (req, res) => {
     res.sendFile(path.join(__dirname, 'src', 'view', 'index.html'));
});


// Routes
app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);
app.use('/api/note', noteRouter);
app.use('/api/diary', diaryRouter);

app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

// Catch-all route for errors
app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'src', 'view', 'error.html'));
});

const PORT = process.env.PORT || 9055; // Changed to match your network service port

// Function to get network IP
function getNetworkIp() {
     const interfaces = os.networkInterfaces();
     for (const name of Object.keys(interfaces)) {
          for (const iface of interfaces[name]) {
               // Skip over non-IPv4 and internal (loopback) addresses
               if (iface.family === 'IPv4' && !iface.internal) {
                    return iface.address;
               }
          }
     }
     return '0.0.0.0'; // Default fallback
}

app.listen(PORT, '0.0.0.0', () => {
     const networkIp = getNetworkIp();
     console.log(`Server running on http://localhost:${PORT}`);
     console.log(`Network: http://${networkIp}:${PORT}`);
});
