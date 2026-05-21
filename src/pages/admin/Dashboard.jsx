import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders/admin/all'),
          api.get('/auth/me')
        ]);
        setStats({
          products: productsRes.data.total,
          orders: ordersRes.data.length
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold">Total Products</h3>
            <p className="text-3xl font-bold">{stats.products}</p>
            <Link to="/admin/products" className="text-blue-600 mt-2 block">Manage Products</Link>
          </div>
          <div className="bg-green-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold">Total Orders</h3>
            <p className="text-3xl font-bold">{stats.orders}</p>
            <Link to="/admin/orders" className="text-blue-600 mt-2 block">Manage Orders</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;