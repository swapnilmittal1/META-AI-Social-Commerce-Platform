import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import bodyParser from 'body-parser';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const USER_SERVICE = 'http://user-service:7001';
const PRODUCT_SERVICE = 'http://product-service:7002';
const ORDER_SERVICE = 'http://order-service:7003';
const RECOMMENDATION_SERVICE = 'http://recommendation_service:7004';
// chatbot-service is only for webhooks, not typically front-end calls

/***********************************
 * User Service
 **********************************/
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const resp = await axios.post(`${USER_SERVICE}/auth/register`, req.body);
    return res.json(resp.data);
  } catch (err: any) {
    return res.status(err?.response?.status || 500).json(err?.response?.data || { error: 'Error' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const resp = await axios.post(`${USER_SERVICE}/auth/login`, req.body);
    return res.json(resp.data);
  } catch (err: any) {
    return res.status(err?.response?.status || 500).json(err?.response?.data || { error: 'Error' });
  }
});

app.post('/api/fb/save-page-token', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    const resp = await axios.post(`${USER_SERVICE}/fb/save-page-token`, req.body, {
      headers: { Authorization: token || '' }
    });
    return res.json(resp.data);
  } catch (err: any) {
    return res
      .status(err?.response?.status || 500)
      .json(err?.response?.data || { error: 'Error' });
  }
});

app.get('/api/fb/page-token', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    const resp = await axios.get(`${USER_SERVICE}/fb/page-token`, {
      headers: { Authorization: token || '' }
    });
    return res.json(resp.data);
  } catch (err: any) {
    return res
      .status(err?.response?.status || 500)
      .json(err?.response?.data || { error: 'Error' });
  }
});

/***********************************
 * Product Service
 **********************************/
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const resp = await axios.get(`${PRODUCT_SERVICE}/products`);
    return res.json(resp.data);
  } catch (err: any) {
    return res.status(500).json({ error: 'Error fetching products' });
  }
});

app.post('/api/products', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    const resp = await axios.post(`${PRODUCT_SERVICE}/products`, req.body, {
      headers: { Authorization: token || '' }
    });
    return res.json(resp.data);
  } catch (err: any) {
    return res.status(500).json({ error: 'Error creating product' });
  }
});

app.post('/api/products/:id/sync', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    const { id } = req.params;
    const resp = await axios.post(`${PRODUCT_SERVICE}/products/${id}/sync`, req.body, {
      headers: { Authorization: token || '' }
    });
    return res.json(resp.data);
  } catch (err: any) {
    return res.status(500).json({ error: 'Error syncing product' });
  }
});

/***********************************
 * Order Service
 **********************************/
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const resp = await axios.post(`${ORDER_SERVICE}/orders`, req.body);
    return res.json(resp.data);
  } catch (err: any) {
    return res.status(500).json({ error: 'Error creating order' });
  }
});

app.get('/api/orders', async (req: Request, res: Response) => {
  try {
    const resp = await axios.get(`${ORDER_SERVICE}/orders`);
    return res.json(resp.data);
  } catch (err: any) {
    return res.status(500).json({ error: 'Error fetching orders' });
  }
});

app.put('/api/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resp = await axios.put(`${ORDER_SERVICE}/orders/${id}/status`, req.body);
    return res.json(resp.data);
  } catch (err: any) {
    return res.status(500).json({ error: 'Error updating order status' });
  }
});

app.post('/api/orders/:id/pay', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resp = await axios.post(`${ORDER_SERVICE}/orders/${id}/pay`);
    return res.json(resp.data);
  } catch (err: any) {
    return res.status(500).json({ error: 'Error paying order' });
  }
});

/***********************************
 * Recommendation Service
 **********************************/
app.get('/api/recommendations', async (req: Request, res: Response) => {
  try {
    const resp = await axios.get(`${RECOMMENDATION_SERVICE}/recommendations`);
    return res.json(resp.data);
  } catch (err: any) {
    return res.status(500).json({ error: 'Error fetching recommendations' });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Gateway is running on port ${PORT}`);
});
