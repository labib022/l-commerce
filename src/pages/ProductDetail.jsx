import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        fetchRelatedProducts(response.data.category?._id);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const fetchRelatedProducts = async (categoryId) => {
    if (!categoryId) return;
    try {
      const response = await api.get(`/products?category=${categoryId}&limit=4`);
      setRelatedProducts(response.data.products.filter(p => p._id !== id));
    } catch (error) {
      console.error('Failed to fetch related products:', error);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(id, quantity);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    window.location.href = '/checkout';
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="bg-gray-200 rounded-lg h-96 animate-pulse"></div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-20 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link to="/products" className="text-blue-600 mt-4 inline-block">Back to Products</Link>
      </div>
    );
  }

  const price = product.discountPrice || product.price;

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'} ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={interactive ? () => onRatingChange(i + 1) : undefined}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="relative">
            <img
              src={product.images?.[selectedImage]?.url || 'https://placehold.co/500x500?text=No+Image'}
              alt={product.name}
              className="w-full h-80 sm:h-96 object-cover rounded-lg"
            />
            {product.discountPrice && (
              <span className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                SALE
              </span>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={`${product.name} ${index + 1}`}
                  className={`h-20 object-cover rounded cursor-pointer border-2 ${
                    selectedImage === index ? 'border-blue-600' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            {renderStars(Math.round(product.rating || 0))}
            <span className="text-sm text-gray-500 ml-2">
              ({product.numReviews || 0} reviews)
            </span>
          </div>
          <div className="mb-6">
            <span className="text-3xl font-bold text-blue-600">${price}</span>
            {product.discountPrice && (
              <span className="text-xl text-gray-500 line-through ml-3">${product.price}</span>
            )}
          </div>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <div className="mb-6">
            <span className="font-semibold">Stock: </span>
            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
            </span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <span className="font-semibold">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100"
                disabled={product.stock === 0}
              >
                -
              </button>
              <span className="px-4 py-2 border-x">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-2 hover:bg-gray-100"
                disabled={product.stock === 0}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-300 transition-colors"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="border-b mb-6">
          <button
            className={`px-6 py-3 font-semibold ${activeTab === 'description' ? 'border-b-2 border-blue-600' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={`px-6 py-3 font-semibold ${activeTab === 'reviews' ? 'border-b-2 border-blue-600' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({product.numReviews})
          </button>
        </div>

        {activeTab === 'description' && (
          <div className="prose max-w-none">
            <p>{product.description}</p>
            <ul className="mt-4">
              <li>Category: {product.category?.name}</li>
              <li>SKU: {product._id}</li>
              <li>Stock: {product.stock}</li>
            </ul>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            {product.reviews?.length === 0 ? (
              <p>No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-4">
                {product.reviews?.map(review => (
                  <div key={review._id} className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold mr-2">{review.name}</span>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {user && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-2 font-semibold">Rating</label>
                    <div className="flex text-2xl">{renderStars(reviewRating, true, setReviewRating)}</div>
                  </div>
                  <div>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Write your review..."
                      rows="4"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;