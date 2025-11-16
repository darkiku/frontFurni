import React from 'react';
import {ShoppingCart,Sparkles} from 'lucide-react';

const ProductCard=({product,onAddToCart})=>{
return(
<div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
<div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
<img src={product.imageUrl||`https://placehold.co/400x300/f59e0b/fff?text=${encodeURIComponent(product.name)}`} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
<div className="absolute top-3 right-3">
<span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold uppercase shadow-lg">
{product.category}
</span>
</div>
{(product.color||product.size||product.material)&&(
<div className="absolute bottom-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
{product.color&&<span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">🎨 {product.color}</span>}
{product.size&&<span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">📏 {product.size}</span>}
</div>
)}
</div>

<div className="p-6">
<h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-amber-600 transition-colors">
{product.name}
</h3>
<p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
{product.description||'Premium quality furniture for your space'}
</p>

<div className="flex items-center justify-between pt-4 border-t border-gray-100">
<div>
<span className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
${product.price}
</span>
</div>
<button onClick={()=>onAddToCart(product)} className="group/btn relative bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105">
<div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
<div className="relative flex items-center gap-2 font-semibold">
<ShoppingCart size={20}/>
<span>Add</span>
</div>
</button>
</div>
</div>
</div>
);
};

export default ProductCard;