import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/admin/all');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(order => 
    !statusFilter || order.status === statusFilter
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Manage Orders</h2>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Filter by status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <React.Fragment key={order._id}>
                    <tr className="border-t hover:bg-gray-50">
                      <td className="p-4 font-medium">#{order._id.slice(-8)}</td>
                      <td className="p-4">{order.user?.name || 'N/A'}</td>
                      <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">${order.totalPrice.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="px-2 py-1 border rounded text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {expandedOrder === order._id ? (
                              <ChevronUpIcon className="h-5 w-5" />
                            ) : (
                              <ChevronDownIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedOrder === order._id && (
                      <tr>
                        <td colSpan="6" className="p-4 bg-gray-50 border-t">
                          <div className="space-y-4">
                            <h4 className="font-semibold">Order Items</h4>
                            <div className="space-y-2">
                              {order.items.map(item => (
                                <div key={item._id} className="flex justify-between text-sm">
                                  <span>{item.name} x {item.quantity}</span>
                                  <span>${item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                            <div className="border-t pt-2">
                              <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${order.totalPrice}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>${order.shippingPrice}</span>
                              </div>
                              <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>${order.totalPrice + order.shippingPrice}</span>
                              </div>
                            </div>
                            <div className="text-sm">
                              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                              <p><strong>Shipping Address:</strong> {order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;