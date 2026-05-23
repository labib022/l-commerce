import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CubeIcon, 
  ShoppingBagIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  PlusIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders/admin/all')
        ]);
        
        const orders = ordersRes.data;
        const revenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        
        setStats({
          products: productsRes.data.total,
          orders: orders.length,
          users: ordersRes.data.users || 100,
          revenue
        });
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      case 'shipped': return 'text-purple-600';
      default: return 'text-yellow-600';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Link 
            to="/admin/products" 
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Product
          </Link>
          <Link 
            to="/admin/categories" 
            className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <TagIcon className="h-4 w-4 mr-1" />
            Categories
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Products</p>
              <p className="text-3xl font-bold text-blue-800">{stats.products}</p>
            </div>
            <CubeIcon className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-green-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-green-800">{stats.orders}</p>
            </div>
            <ShoppingBagIcon className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <div className="bg-purple-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Users</p>
              <p className="text-3xl font-bold text-purple-800">{stats.users}</p>
            </div>
            <UsersIcon className="h-10 w-10 text-purple-600" />
          </div>
        </div>
        <div className="bg-yellow-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Revenue</p>
              <p className="text-3xl font-bold text-yellow-800">${stats.revenue.toFixed(2)}</p>
            </div>
            <CurrencyDollarIcon className="h-10 w-10 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold">Recent Orders</h3>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No recent orders</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Total</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id} className="border-t">
                    <td className="p-4">#{order._id.slice(-8)}</td>
                    <td className="p-4">{order.user?.name || 'N/A'}</td>
                    <td className="p-4">${order.totalPrice.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 border-t">
          <Link to="/admin/orders" className="text-blue-600 font-medium hover:underline">
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;