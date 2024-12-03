const express = require("express");
const morgan = require("morgan");
const { PrismaClient } = require("@prisma/client"); // Import Prisma Client from @prisma/client

const prisma = new PrismaClient(); // Initialize Prisma Client

const app = express();
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.get("/api/players", async (req, res) => {
  try {
    const players = await prisma.player.findMany(); // Fetch players using Prisma Client
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching players" });
  }
});

app.post("/api/players", async (req, res) => {
  try {
    const player = await prisma.player.create({ data: req.body }); // Create a new player
    res.status(201).json(player);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the player" });
  }
});

app.get("/api/players/:id", async (req, res) => {
  try {
    const player = await prisma.player.findUnique({
      where: { id: parseInt(req.params.id) }, // Fetch player by ID
    });
    if (player) {
      res.json(player);
    } else {
      res.status(404).json({ error: "Player not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the player" });
  }
});

app.put("/api/players/:id", async (req, res) => {
  try {
    const player = await prisma.player.update({
      where: { id: parseInt(req.params.id) }, // Update player by ID
      data: req.body,
    });
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the player" });
  }
});

app.delete("/api/players/:id", async (req, res) => {
  try {
    await prisma.player.delete({ where: { id: parseInt(req.params.id) } }); // Delete player by ID
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the player" });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
