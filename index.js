import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();
app.use(express.json());
console.log(process.env.DATABASE_URL);



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});