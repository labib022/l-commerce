import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(id, quantity);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/review`, { rating: reviewRating, comment: reviewText });
      setReviewText('');
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!product) return <div className="text-center py-8">Product not found</div>;

  const price = product.discountPrice || product.price;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.images?.[0]?.url || 'https://placehold.co/500x500?text=No+Image'}
            alt={product.name}
            className="w-full rounded-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="mb-4">
            <span className="text-2xl font-bold text-blue-600">${price}</span>
            {product.discountPrice && (
              <span className="text-gray-500 line-through ml-2">${product.price}</span>
            )}
          </div>

          <p className="text-gray-700 mb-4">{product.description}</p>

          <div className="mb-4">
            <span className="font-semibold">Stock: </span>
            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
            </span>
          </div>

          <div className="flex items-center mb-6">
            <span className="mr-4">Quantity:</span>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 border rounded-l"
              disabled={product.stock === 0}
            >
              -
            </button>
            <span className="px-4 py-1 border-t border-b">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="px-3 py-1 border rounded-r"
              disabled={product.stock === 0}
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300"
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Reviews ({product.numReviews})</h2>
        {product.reviews?.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {product.reviews?.map(review => (
              <div key={review._id} className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="font-semibold">{review.name}</span>
                  <span className="ml-2 text-yellow-500">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {user && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Terrible</option>
                </select>
              </div>
              <div className="mb-4">
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review..."
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;