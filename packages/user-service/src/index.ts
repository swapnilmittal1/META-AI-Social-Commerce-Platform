import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import User from './models/User.model';
import authRoutes from './routes/auth.routes';
import fbIntegrationRoutes from './routes/fbIntegration.routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// DB
const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  models: [User],
  logging: false
});

sequelize.authenticate()
  .then(async () => {
    console.log('User Service: Database connected');
    await sequelize.sync({ alter: true });
  })
  .catch((err) => console.error(err));

// Routes
app.use('/auth', authRoutes);
app.use('/fb', fbIntegrationRoutes);

const PORT = process.env.PORT || 7001;
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
