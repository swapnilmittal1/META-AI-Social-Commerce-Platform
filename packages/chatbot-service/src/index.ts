import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import chatbotRoutes from './routes/chatbot.routes';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Messenger Webhook
app.use('/webhook', chatbotRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Chatbot Service listening on port ${PORT}`);
});
