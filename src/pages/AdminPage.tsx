
import React, { useState, useEffect } from 'react';
import { Plus, Package, TrendingUp, Users, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEcommerce } from '../contexts/EcommerceContext';
import { useToast } from '../hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminPage = () => {
  const navigate = useNavigate();
  const { state } = useEcommerce();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'products' | 'add-product' | 'inventory' | 'orders'>('products');
  const [orders] = useState([
    {
      id: '1',
      customerName: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      address: '123 Main St, City, State 12345',
      productName: 'Classic T-Shirt',
      quantity: 2,
      size: 'M',
      color: 'Black',
      total: 59.98,
      paymentMethod: 'online',
      status: 'pending',
      date: '2024-01-15'
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '987-654-3210',
      address: '456 Oak Ave, Town, State 67890',
      productName: 'Denim Jacket',
      quantity: 1,
      size: 'L',
      color: 'Blue',
      total: 89.99,
      paymentMethod: 'cod',
      status: 'completed',
      date: '2024-01-14'
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    originalPrice: '',
    image: '',
    category: 'men' as 'men' | 'women' | 'couples' | 'students',
    type: '',
    description: '',
    sizes: '',
    colors: '',
    isTrending: false,
    rating: '',
    reviews: '',
    stock: ''
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Product Added Successfully!",
      description: `${newProduct.name} has been added to the inventory.`,
    });
    
    // Reset form
    setNewProduct({
      name: '',
      price: '',
      originalPrice: '',
      image: '',
      category: 'men',
      type: '',
      description: '',
      sizes: '',
      colors: '',
      isTrending: false,
      rating: '',
      reviews: '',
      stock: ''
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin-login');
  };

  const totalProducts = state.products.length;
  const trendingProducts = state.products.filter(p => p.isTrending).length;
  const totalOrders = orders.length;
  const totalCustomers = 150; // Mock data

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your products, orders and inventory</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Trending Products</p>
                <p className="text-2xl font-bold text-gray-900">{trendingProducts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Orders</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <nav className="flex border-b">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'products'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('add-product')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'add-product'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Add Product
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'inventory'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Inventory
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'orders'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Orders
            </button>
          </nav>

          <div className="p-6">
            {activeTab === 'products' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Product List</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Trending</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="flex items-center space-x-3">
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                          <span className="font-medium">{product.name}</span>
                        </TableCell>
                        <TableCell className="capitalize">{product.category}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>{product.rating} ({product.reviews} reviews)</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded ${
                            product.isTrending ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.isTrending ? 'Yes' : 'No'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Orders</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-sm text-gray-600">{order.email}</p>
                            <p className="text-sm text-gray-600">{order.phone}</p>
                            <p className="text-xs text-gray-500">{order.address}</p>
                          </div>
                        </TableCell>
                        <TableCell>{order.productName}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>Qty: {order.quantity}</p>
                            <p>Size: {order.size}</p>
                            <p>Color: {order.color}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">${order.total}</TableCell>
                        <TableCell className="capitalize">
                          <span className={`px-2 py-1 text-xs rounded ${
                            order.paymentMethod === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.paymentMethod === 'online' ? 'Online' : 'COD'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {activeTab === 'add-product' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Product</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <select
                        id="category"
                        name="category"
                        value={newProduct.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      >
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="couples">Couples</option>
                        <option value="students">Students</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="originalPrice">Original Price</Label>
                      <Input
                        id="originalPrice"
                        name="originalPrice"
                        type="number"
                        step="0.01"
                        value={newProduct.originalPrice}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        value={newProduct.stock}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image">Image URL *</Label>
                    <Input
                      id="image"
                      name="image"
                      type="url"
                      value={newProduct.image}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      name="description"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="sizes">Sizes (comma separated)</Label>
                      <Input
                        id="sizes"
                        name="sizes"
                        type="text"
                        value={newProduct.sizes}
                        onChange={handleInputChange}
                        placeholder="S, M, L, XL"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="colors">Colors (comma separated)</Label>
                      <Input
                        id="colors"
                        name="colors"
                        type="text"
                        value={newProduct.colors}
                        onChange={handleInputChange}
                        placeholder="Black, White, Blue"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="rating">Rating (0-5)</Label>
                      <Input
                        id="rating"
                        name="rating"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={newProduct.rating}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="reviews">Number of Reviews</Label>
                      <Input
                        id="reviews"
                        name="reviews"
                        type="number"
                        value={newProduct.reviews}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-6">
                      <input
                        id="isTrending"
                        name="isTrending"
                        type="checkbox"
                        checked={newProduct.isTrending}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <Label htmlFor="isTrending">Mark as Trending</Label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </form>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Stock Management</h2>
                <p className="text-gray-600 mb-4">Monitor and manage product inventory levels</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="flex items-center space-x-3">
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                          <span className="font-medium">{product.name}</span>
                        </TableCell>
                        <TableCell className="capitalize">{product.category}</TableCell>
                        <TableCell>50</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                            In Stock
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
