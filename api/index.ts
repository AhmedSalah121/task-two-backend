import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// simple test route
app.get("/", async (req, res) => {
  res.json({ status: "API running successfully on Vercel" });
});

// example: get all users
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

export default app;
