import { Server } from "socket.io";
import http from "http";
import Proposal from "../schema/Proposal.ts";
import Job from "../schema/Job.ts";
import Message from "../schema/Messsage.ts"; // Import the updated Message model

// Map to track online users: userId -> socketId
const onlineUsers = new Map<string, string>();
// Map to track chat rooms: jobId -> roomId
const jobRooms = new Map<string, string>();

export const initSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for authentication
    socket.on("authenticate", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User authenticated: ${userId}`);
    });

    // Handle job proposal creation
    socket.on("propose:job", async (data) => {
      try {
        const { jobId, artisanId, clientId, message } = data;

        // Create proposal
        const proposal = await Proposal.create({
          job: jobId,
          artisan: artisanId,
          client: clientId,
          message
        });

        // Populate artisan details
        const populated = await proposal.populate({
          path: "artisan",
          select:
            "first_name last_name profile_picture categories years_of_experience"
        });

        // Create a room for this job if it doesn't exist
        if (!jobRooms.has(jobId)) {
          const roomId = `job_${jobId}`;
          jobRooms.set(jobId, roomId);
        }

        // Join both parties to the room
        const roomId = jobRooms.get(jobId)!;
        socket.join(roomId);

        // Notify client
        const clientSocketId = onlineUsers.get(clientId);
        if (clientSocketId) {
          io.to(clientSocketId).emit("proposal:received", populated);
        }
      } catch (error) {
        console.error("Proposal error:", error);
      }
    });

    // Handle proposal responses
    socket.on("proposal:response", async (data) => {
      try {
        const { proposalId, response, jobId } = data;
        const status = response ? "accepted" : "rejected";

        // Update proposal status
        const updatedProposal = await Proposal.findByIdAndUpdate(
          proposalId,
          { status },
          { new: true }
        ).populate("artisan");

        if (!updatedProposal) return;

        // Update job if accepted
        if (status === "accepted") {
          await Job.findByIdAndUpdate(jobId, {
            artisan: updatedProposal.artisan._id,
            status: "ongoing"
          });

          // Create acceptance message
          const messageContent =
            "You're a great fit for the job, thanks for applying to my job request";
          const acceptanceMessage = await Message.create({
            sender: updatedProposal.client,
            receiver: updatedProposal.artisan._id,
            job: jobId,
            content: messageContent
          });

          // Populate sender details
          const populatedMessage = await acceptanceMessage.populate({
            path: "sender",
            select: "first_name last_name profile_picture"
          });

          // Get job room
          const roomId = jobRooms.get(jobId);
          if (roomId) {
            // Send to job room
            io.to(roomId).emit("message:new", populatedMessage);
          }
        }

        // Notify artisan
        const artisanId = updatedProposal.artisan._id.toString();
        if (artisanId) {
          const artisanSocketId = onlineUsers.get(artisanId);
          if (artisanSocketId) {
            io.to(artisanSocketId).emit("proposal:update", {
              status,
              jobId,
              proposalId
            });
          }
        }
      } catch (error) {
        console.error("Response error:", error);
      }
    });

    // Handle new chat messages
    socket.on("message:send", async (data) => {
      try {
        const { jobId, senderId, receiverId, content } = data;

        // Create message
        const message = await Message.create({
          sender: senderId,
          receiver: receiverId,
          job: jobId,
          content
        });

        // Populate sender details
        const populatedMessage = await message.populate({
          path: "sender",
          select: "first_name last_name profile_picture"
        });

        // Get job room
        const roomId = jobRooms.get(jobId);
        if (roomId) {
          // Send to job room
          io.to(roomId).emit("message:new", populatedMessage);
        } else {
          // Create room if it doesn't exist
          const newRoomId = `job_${jobId}`;
          jobRooms.set(jobId, newRoomId);
          socket.join(newRoomId);
          io.to(newRoomId).emit("message:new", populatedMessage);
        }
      } catch (error) {
        console.error("Message error:", error);
      }
    });

    // Join job conversation room
    socket.on("join:job", (jobId: string) => {
      if (!jobRooms.has(jobId)) {
        const roomId = `job_${jobId}`;
        jobRooms.set(jobId, roomId);
      }
      const roomId = jobRooms.get(jobId)!;
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    socket.on("disconnect", () => {
      // Remove user from online list
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User disconnected: ${userId}`);
          break;
        }
      }
    });
  });

  return io;
};
