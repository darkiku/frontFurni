import React,{useEffect,useState} from 'react';
import {productAPI,cartAPI} from '../services/api';
import ProductCard from '../components/ProductCard';
import {Search,Wand2,Upload,X,AlertCircle,Sparkles} from 'lucide-react';

const Products=({cartId,onCartUpdate})=>{
const[products,setProducts]=useState([]);
const[filteredProducts,setFilteredProducts]=useState([]);
const[searchQuery,setSearchQuery]=useState('');
const[selectedCategory,setSelectedCategory]=useState('all');
const[loading,setLoading]=useState(true);
const[showBuilder,setShowBuilder]=useState(false);
const[imagePreview,setImagePreview]=useState('');
const[creating,setCreating]=useState(false);
const[error,setError]=useState('');
const[customProduct,setCustomProduct]=useState({
name:'',
category:'sofa',
price:299,
color:'Blue',
size:'Medium',
material:'Leather',
imageUrl:''
});

const categories=['all','sofa','chair','table','bed','storage','lighting'];
const colors=['Blue','Red','Green','Black','White','Brown','Gray','Beige'];
const sizes=['Small','Medium','Large','XL'];
const materials=['Leather','Fabric','Wood','Metal','Plastic','Glass'];

useEffect(()=>{
fetchProducts();
},[]);

useEffect(()=>{
filterProducts();
},[products,searchQuery,selectedCategory]);

const fetchProducts=async()=>{
try{
const response=await productAPI.getAll();
setProducts(response.data);
setFilteredProducts(response.data);
}catch(error){
console.error('Failed to fetch products:',error);
}finally{
setLoading(false);
}
};

const filterProducts=()=>{
let filtered=products;
if(searchQuery){
filtered=filtered.filter((p)=>p.name.toLowerCase().includes(searchQuery.toLowerCase()));
}
if(selectedCategory!=='all'){
filtered=filtered.filter((p)=>p.category.toLowerCase()===selectedCategory.toLowerCase());
}
setFilteredProducts(filtered);
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
notification.className='fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
notification.textContent='Added to cart!';
document.body.appendChild(notification);
setTimeout(()=>notification.remove(),2000);
}catch(error){
console.error('Failed to add to cart:',error);
alert('Failed to add product to cart');
}
};

const handleImageChange=(e)=>{
const url=e.target.value;
setCustomProduct({...customProduct,imageUrl:url});
setImagePreview(url);
};

const generatePlaceholder=()=>{
const placeholder=`https://placehold.co/400x300/f59e0b/fff?text=${encodeURIComponent(customProduct.name||'Product')}`;
setCustomProduct({...customProduct,imageUrl:placeholder});
setImagePreview(placeholder);
};

const createCustomProduct=async()=>{
if(!customProduct.name){
setError('Please enter product name');
return;
}
setCreating(true);
setError('');
try{
const token=localStorage.getItem('token');
const response=await fetch('http://localhost:8080/api/product/createCustom',{
method:'POST',
headers:{
'Content-Type':'application/json',
'Authorization':`Bearer ${token}`
},
body:JSON.stringify(customProduct)
});
if(response.ok){
const newProduct=await response.json();
const notification=document.createElement('div');
notification.className='fixed top-24 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl shadow-2xl z-50';
notification.innerHTML='<div class="flex items-center gap-3"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span class="font-semibold">Product created successfully!</span></div>';
document.body.appendChild(notification);
setTimeout(()=>notification.remove(),3000);
setShowBuilder(false);
setCustomProduct({
name:'',
category:'sofa',
price:299,
color:'Blue',
size:'Medium',
material:'Leather',
imageUrl:''
});
setImagePreview('');
fetchProducts();
}else{
const errorText=await response.text();
setError('Failed to create product: '+errorText);
}
}catch(error){
setError('Network error: '+error.message);
}finally{
setCreating(false);
}
};

return(
<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
<div className="max-w-7xl mx-auto px-4">
<div className="flex items-center justify-between mb-8">
<div>
<h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent mb-2">Our Collection</h1>
<p className="text-gray-600 text-lg">Discover furniture that transforms spaces</p>
</div>
<button onClick={()=>setShowBuilder(true)} className="group relative bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
<div className="relative flex items-center gap-3">
<Sparkles size={22} className="animate-pulse"/>
<span className="text-lg">Build Custom</span>
</div>
</button>
</div>

<div className="mb-10 bg-white rounded-2xl shadow-lg p-6">
<div className="flex flex-col md:flex-row gap-4">
<div className="flex-1 relative">
<Search className="absolute left-4 top-4 text-amber-500" size={22}/>
<input type="text" placeholder="Search your dream furniture..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-lg"/>
</div>
<select value={selectedCategory} onChange={(e)=>setSelectedCategory(e.target.value)} className="px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-lg font-medium bg-white cursor-pointer hover:border-amber-300">
{categories.map((cat)=>(
<option key={cat} value={cat}>{cat==='all'?'All Categories':cat.charAt(0).toUpperCase()+cat.slice(1)}</option>
))}
</select>
</div>
</div>

{loading?(
<div className="text-center py-24">
<div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600"></div>
<p className="mt-6 text-xl text-gray-600 font-medium">Loading amazing products...</p>
</div>
):filteredProducts.length===0?(
<div className="text-center py-24 bg-white rounded-2xl shadow-lg">
<div className="text-6xl mb-4">🔍</div>
<p className="text-2xl text-gray-600 font-semibold">No products found</p>
<p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
</div>
):(
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
{filteredProducts.map((product)=>(
<ProductCard key={product.id} product={product} onAddToCart={handleAddToCart}/>
))}
</div>
)}
</div>

{showBuilder&&(
<div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={()=>setShowBuilder(false)}>
<div className="bg-white rounded-3xl p-10 max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl animate-slideUp" onClick={(e)=>e.stopPropagation()}>
<div className="flex items-center justify-between mb-8">
<div className="flex items-center gap-4">
<div className="bg-gradient-to-br from-amber-500 to-orange-500 p-4 rounded-2xl shadow-lg">
<Wand2 className="text-white" size={32}/>
</div>
<div>
<h2 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">Build Your Dream Furniture</h2>
<p className="text-gray-600 text-lg mt-1">Customize every detail to perfection</p>
</div>
</div>
<button onClick={()=>setShowBuilder(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition">
<X size={28}/>
</button>
</div>

{error&&(
<div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3 text-red-800 animate-shake">
<AlertCircle size={24}/>
<span className="font-medium">{error}</span>
</div>
)}

<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
<div className="space-y-6">
<div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl">
<label className="block text-sm font-bold mb-3 text-amber-900">Product Name *</label>
<input type="text" placeholder="e.g. Luxury Velvet Sofa" value={customProduct.name} onChange={(e)=>setCustomProduct({...customProduct,name:e.target.value})} className="w-full px-5 py-4 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-lg bg-white"/>
</div>

<div>
<label className="block text-sm font-bold mb-3 text-gray-700">Category</label>
<select value={customProduct.category} onChange={(e)=>setCustomProduct({...customProduct,category:e.target.value})} className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-lg bg-white cursor-pointer">
<option value="sofa">🛋️ Sofa</option>
<option value="chair">🪑 Chair</option>
<option value="table">🍽️ Table</option>
<option value="bed">🛏️ Bed</option>
<option value="storage">📦 Storage</option>
<option value="lighting">💡 Lighting</option>
</select>
</div>

<div className="grid grid-cols-2 gap-4">
<div>
<label className="block text-sm font-bold mb-3 text-gray-700">Color</label>
<select value={customProduct.color} onChange={(e)=>setCustomProduct({...customProduct,color:e.target.value})} className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 transition-all text-lg bg-white cursor-pointer">
{colors.map(c=><option key={c} value={c}>🎨 {c}</option>)}
</select>
</div>
<div>
<label className="block text-sm font-bold mb-3 text-gray-700">Size</label>
<select value={customProduct.size} onChange={(e)=>setCustomProduct({...customProduct,size:e.target.value})} className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 transition-all text-lg bg-white cursor-pointer">
{sizes.map(s=><option key={s} value={s}>📏 {s}</option>)}
</select>
</div>
</div>

<div className="grid grid-cols-2 gap-4">
<div>
<label className="block text-sm font-bold mb-3 text-gray-700">Material</label>
<select value={customProduct.material} onChange={(e)=>setCustomProduct({...customProduct,material:e.target.value})} className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 transition-all text-lg bg-white cursor-pointer">
{materials.map(m=><option key={m} value={m}>✨ {m}</option>)}
</select>
</div>
<div>
<label className="block text-sm font-bold mb-3 text-gray-700">Price ($)</label>
<input type="number" value={customProduct.price} onChange={(e)=>setCustomProduct({...customProduct,price:parseFloat(e.target.value)})} min="50" step="10" className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 transition-all text-lg"/>
</div>
</div>

<div>
<label className="block text-sm font-bold mb-3 text-gray-700">Image URL</label>
<div className="flex gap-3">
<input type="text" placeholder="https://example.com/image.jpg" value={customProduct.imageUrl} onChange={handleImageChange} className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 transition-all"/>
<button onClick={generatePlaceholder} className="px-5 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg">
<Upload size={22}/>
</button>
</div>
<p className="text-sm text-gray-500 mt-2">💡 Leave empty for auto-generated placeholder</p>
</div>
</div>

<div className="space-y-6">
<div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border-4 border-purple-200 rounded-3xl p-8 shadow-xl">
<div className="flex items-center gap-2 mb-6">
<Sparkles className="text-purple-600" size={24}/>
<h3 className="font-bold text-2xl text-purple-900">Live Preview</h3>
</div>
<div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
{(imagePreview||customProduct.imageUrl)?(
<img src={imagePreview||customProduct.imageUrl} alt="Preview" className="w-full h-56 object-cover" onError={(e)=>{e.target.src=`https://placehold.co/400x300/f59e0b/fff?text=${encodeURIComponent(customProduct.name||'Product')}`;}}/>
):(
<div className="w-full h-56 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
<Upload size={64} className="text-gray-400"/>
</div>
)}
<div className="p-6">
<h4 className="font-bold text-2xl text-gray-800 mb-2">{customProduct.name||'Product Name'}</h4>
<p className="text-gray-600 mb-4">{customProduct.category.charAt(0).toUpperCase()+customProduct.category.slice(1)}</p>
<div className="flex gap-2 mb-4 flex-wrap">
<span className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">{customProduct.color}</span>
<span className="px-4 py-2 bg-green-100 text-green-800 text-sm font-semibold rounded-full">{customProduct.size}</span>
<span className="px-4 py-2 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full">{customProduct.material}</span>
</div>
<p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">${customProduct.price}</p>
</div>
</div>
</div>

<div className="bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-300 rounded-2xl p-6 shadow-lg">
<h4 className="font-bold text-amber-900 mb-3 text-lg">📝 Summary</h4>
<p className="text-amber-800 text-lg leading-relaxed">
{customProduct.size} {customProduct.color} {customProduct.material} {customProduct.category} for <span className="font-bold">${customProduct.price}</span>
</p>
</div>
</div>
</div>

<div className="flex gap-4 pt-8 border-t-2 mt-8">
<button onClick={createCustomProduct} disabled={!customProduct.name||creating} className="flex-1 group relative bg-gradient-to-r from-amber-500 to-orange-500 text-white py-5 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
<span className="relative flex items-center justify-center gap-3">
{creating?(
<>
<div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
Creating Magic...
</>
):(
<>
<Sparkles size={24}/>
Create Product
</>
)}
</span>
</button>
<button onClick={()=>setShowBuilder(false)} className="flex-1 border-3 border-gray-300 text-gray-700 py-5 rounded-xl font-bold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all">
Cancel
</button>
</div>
</div>
</div>
)}

<style>{`
@keyframes fadeIn {
from { opacity: 0; }
to { opacity: 1; }
}
@keyframes slideUp {
from { transform: translateY(30px); opacity: 0; }
to { transform: translateY(0); opacity: 1; }
}
@keyframes shake {
0%, 100% { transform: translateX(0); }
25% { transform: translateX(-5px); }
75% { transform: translateX(5px); }
}
.animate-fadeIn {
animation: fadeIn 0.3s ease-out;
}
.animate-slideUp {
animation: slideUp 0.4s ease-out;
}
.animate-shake {
animation: shake 0.5s ease-in-out;
}
`}</style>
</div>
);
};

export default Products;