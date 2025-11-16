import React,{useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {productAPI,cartAPI} from '../services/api';
import ProductCard from '../components/ProductCard';
import {ArrowRight,Sparkles,Package,Truck,Shield} from 'lucide-react';

const Home=({cartId,onCartUpdate})=>{
const[products,setProducts]=useState([]);
const[loading,setLoading]=useState(true);
const navigate=useNavigate();

useEffect(()=>{
fetchProducts();
},[]);

const fetchProducts=async()=>{
try{
const response=await productAPI.getAll();
if(Array.isArray(response.data)){
setProducts(response.data);
}else{
console.error('Response data is not an array:',response.data);
}
}catch(error){
console.error('Failed to fetch products:',error);
}finally{
setLoading(false);
}
};

const handleAddToCart=async(product)=>{
if(!cartId){
alert('Cart not initialized. Please refresh the page.');
return;
}
try{
await cartAPI.add(cartId,product.id);
onCartUpdate();
const notification=document.createElement('div');
notification.className='fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50';
notification.textContent='Added to cart!';
document.body.appendChild(notification);
setTimeout(()=>notification.remove(),2000);
}catch(error){
console.error('Failed to add to cart:',error);
alert('Failed to add product to cart');
}
};

return(
<div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
<div className="relative bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 py-32 overflow-hidden">
<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmNTllMGIiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
<div className="max-w-7xl mx-auto px-4 text-center relative z-10">
<div className="inline-block mb-6">
<span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
Premium Quality
</span>
</div>
<h1 className="text-6xl md:text-7xl font-black mb-6">
<span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
Transform Your Space
</span>
</h1>
<p className="text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
Discover elegant furniture that brings comfort, style, and personality to every corner of your home
</p>
<button onClick={()=>navigate('/products')} className="group inline-flex items-center gap-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-12 py-6 rounded-2xl text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
<span>Explore Collection</span>
<ArrowRight size={24} className="group-hover:translate-x-2 transition-transform"/>
</button>
</div>
</div>

<div className="max-w-7xl mx-auto px-4 py-20">
<div className="text-center mb-16">
<div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-3 rounded-full mb-6">
<Sparkles className="text-amber-600" size={24}/>
<span className="font-bold text-amber-900">Featured Products</span>
</div>
<h2 className="text-5xl font-bold text-gray-800 mb-4">Our Best Sellers</h2>
<p className="text-xl text-gray-600">Handpicked pieces loved by our customers</p>
</div>

{loading?(
<div className="text-center py-20">
<div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600"></div>
<p className="mt-6 text-xl text-gray-600 font-medium">Loading amazing products...</p>
</div>
):(
Array.isArray(products)&&products.length>0?(
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
{products.slice(0,6).map((product)=>(
<ProductCard key={product.id} product={product} onAddToCart={handleAddToCart}/>
))}
</div>
):(
<div className="text-center py-20">
<p className="text-xl text-gray-600">No products available</p>
</div>
)
)}

<div className="text-center">
<button onClick={()=>navigate('/products')} className="inline-flex items-center gap-3 border-2 border-amber-500 text-amber-600 px-10 py-5 rounded-xl text-lg font-semibold hover:bg-amber-50 transition-all">
<span>View All Products</span>
<ArrowRight size={22}/>
</button>
</div>
</div>

<div className="bg-gradient-to-br from-white to-amber-50 py-24">
<div className="max-w-7xl mx-auto px-4">
<div className="text-center mb-16">
<h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">Why Choose Furni?</h2>
<p className="text-xl text-gray-600">Experience the difference with our premium service</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
<div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
<div className="bg-gradient-to-br from-amber-500 to-orange-500 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
<Package className="text-white" size={36}/>
</div>
<h3 className="text-2xl font-bold mb-4">Premium Quality</h3>
<p className="text-gray-600 text-lg leading-relaxed">Handcrafted furniture made with the finest materials and attention to every detail</p>
</div>
<div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
<div className="bg-gradient-to-br from-green-500 to-emerald-500 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
<Truck className="text-white" size={36}/>
</div>
<h3 className="text-2xl font-bold mb-4">Free Delivery</h3>
<p className="text-gray-600 text-lg leading-relaxed">Fast and secure shipping to your doorstep with professional handling and care</p>
</div>
<div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
<div className="bg-gradient-to-br from-blue-500 to-indigo-500 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
<Shield className="text-white" size={36}/>
</div>
<h3 className="text-2xl font-bold mb-4">Satisfaction Guaranteed</h3>
<p className="text-gray-600 text-lg leading-relaxed">30-day money back guarantee on all items. Your happiness is our priority</p>
</div>
</div>
</div>
</div>
</div>
);
};

export default Home;