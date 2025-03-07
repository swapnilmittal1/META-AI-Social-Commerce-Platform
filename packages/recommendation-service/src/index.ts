import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import routes from './routes';
import Product from './models/Product.model'; // We'll replicate the Product model here or call product-service

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// DB - either replicate the same schema or connect to the same DB
const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  models: [Product],
  logging: false
});

sequelize.authenticate()
  .then(async () => {
    console.log('Recommendation Service: DB connected');
    await sequelize.sync();
  })
  .catch((err) => console.error(err));

// Routes
app.use('/recommendations', routes);

const PORT = process.env.PORT || 7004;
app.listen(PORT, () => {
  console.log(`Recommendation Service running on port ${PORT}`);
});
