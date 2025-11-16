import React from 'react';
import {Trash2} from 'lucide-react';

const CartItem=({item,onRemove})=>{
return(
<div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition">
<div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
<img src={item.imageUrl||'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200'} alt={item.name} className="w-full h-full object-cover" onError={(e)=>{e.target.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200';}}/>
</div>

<div className="flex-1 min-w-0">
<h3 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h3>
<p className="text-sm text-gray-500 truncate">{item.category||'Furniture'}</p>
{item.color&&<span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Color: {item.color}</span>}
{item.size&&<span className="inline-block mt-1 ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Size: {item.size}</span>}
<p className="text-amber-600 font-bold mt-2">${parseFloat(item.price).toFixed(2)}</p>
</div>

<button onClick={()=>onRemove(item)} className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition transform hover:scale-105" title="Remove from cart">
<Trash2 size={18}/>
</button>
</div>
);
};

export default CartItem;