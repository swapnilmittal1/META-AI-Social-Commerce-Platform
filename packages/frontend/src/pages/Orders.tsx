import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  token: string;
}

const Orders: React.FC<Props> = ({ token }) => {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    try {
      const resp = await axios.get('/api/orders');
      setOrders(resp.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const payOrder = async (orderId: number) => {
    try {
      const resp = await axios.post(`/api/orders/${orderId}/pay`);
      alert(resp.data.message);
      fetchOrders();
    } catch (err) {
      console.error('Payment error:', err);
    }
  };

  const updateOrderStatus = async (orderId: number) => {
    const status = prompt('Enter new status (PENDING, PAID, SHIPPED, etc.):');
    if (!status) return;

    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      alert('Order status updated.');
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <h2>Orders</h2>
      {orders.map((ord) => (
        <div key={ord.id} style={{ border: '1px solid #ccc', margin: '5px', padding: '5px' }}>
          <strong>Order #{ord.id}</strong><br />
          User: {ord.userId}<br />
          Status: {ord.status}<br />
          Items:
          <ul>
            {ord.items.map((item: any, idx: number) => (
              <li key={idx}>
                Product {item.productId}, quantity {item.quantity}, price {item.price}
              </li>
            ))}
          </ul>
          Total: ${ord.totalAmount}<br />
          {ord.status !== 'PAID' && (
            <button onClick={() => payOrder(ord.id)}>Pay</button>
          )}{' '}
          <button onClick={() => updateOrderStatus(ord.id)}>Update Status</button>
        </div>
      ))}
    </div>
  );
};

export default Orders;
