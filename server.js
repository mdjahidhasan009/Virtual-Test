import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();
app.use(express.json());
app.use(cors());

//Routes
app.use('/api/assignment', assignmentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
  console.log('API is running!!!');
})

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
