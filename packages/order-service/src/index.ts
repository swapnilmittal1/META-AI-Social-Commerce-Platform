import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import Order from './models/Order.model';
import orderRoutes from './routes/order.routes';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// DB
const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  models: [Order],
  logging: false
});

sequelize.authenticate()
  .then(async () => {
    console.log('Order Service: DB connected');
    await sequelize.sync({ alter: true });
  })
  .catch((err) => console.error(err));

// Routes
app.use('/orders', orderRoutes);

const PORT = process.env.PORT || 7003;
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
