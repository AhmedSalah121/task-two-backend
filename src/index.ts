import express, { Request, Response } from 'express';
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.json({ status: "API running successfully on Vercel" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at port: ${PORT}`);
});

export default app;
