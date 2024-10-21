import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

let broadcasters = new Set();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('startBroadcasting', () => {
    broadcasters.add(socket.id);
    socket.broadcast.emit('broadcasterAvailable', socket.id);
    console.log('New broadcaster:', socket.id);
  });

  socket.on('stopBroadcasting', () => {
    broadcasters.delete(socket.id);
    socket.broadcast.emit('broadcasterUnavailable', socket.id);
    console.log('Broadcaster stopped:', socket.id);
  });

  socket.on('watcher', (broadcasterId) => {
    if (broadcasters.has(broadcasterId)) {
      socket.to(broadcasterId).emit('watcher', socket.id);
      console.log('New watcher:', socket.id, 'for broadcaster:', broadcasterId);
    }
  });

  socket.on('offer', (id, message) => {
    socket.to(id).emit('offer', socket.id, message);
  });

  socket.on('answer', (id, message) => {
    socket.to(id).emit('answer', socket.id, message);
  });

  socket.on('candidate', (id, message) => {
    socket.to(id).emit('candidate', socket.id, message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    if (broadcasters.has(socket.id)) {
      broadcasters.delete(socket.id);
      socket.broadcast.emit('broadcasterUnavailable', socket.id);
    }
    socket.broadcast.emit('disconnectPeer', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




