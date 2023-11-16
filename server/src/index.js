const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Set up CORS middleware
app.use(cors());

// Initialize Socket.IO with CORS configuration
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Define the PORT
const PORT = process.env.PORT || 8080;

// Route for the base URL
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Socket.IO connection handler
io.on("connection", (socket) => {
    // Emit the 'me' event with the socket ID
    socket.emit("me", socket.id);

    // Listener for 'sendOffer'
    socket.on("sendOffer", ({ callToUserSocketId, callFromUserSocketId, offerSignal }) => {
        console.log("sending offer from ", callFromUserSocketId, ' to ', callToUserSocketId);
        io.to(callToUserSocketId).emit("receiveOffer", { callFromUserSocketId, offerSignal });
    });

    // Listener for 'sendAnswer'
    socket.on("sendAnswer", ({ callFromUserSocketId, callToUserSocketId, answerSignal }) => {
        console.log("sending answer from ", callToUserSocketId, " to ", callFromUserSocketId);
        io.to(callFromUserSocketId).emit("receiveAnswer", { callToUserSocketId, answerSignal });
    });
});

// Start the server
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));





