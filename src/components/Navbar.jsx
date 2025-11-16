import React from 'react';
import {Link,useNavigate,useLocation} from 'react-router-dom';
import {Home,Package,ShoppingCart,LogOut} from 'lucide-react';

const Navbar=({cartCount=0,onLogout})=>{
const navigate=useNavigate();
const location=useLocation();

const handleLogout=()=>{
localStorage.removeItem('token');
localStorage.removeItem('user');
localStorage.removeItem('cartId');
onLogout();
navigate('/login');
};

const isActive=(path)=>location.pathname===path;

return(
<nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-amber-100">
<div className="max-w-7xl mx-auto px-4 py-4">
<div className="flex items-center justify-between">
<Link to="/" className="flex items-center gap-3 group">
<div className="text-5xl transform group-hover:rotate-12 transition-transform">🪑</div>
<div>
<span className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">Furni</span>
<p className="text-xs text-gray-500 font-medium">Premium Furniture</p>
</div>
</Link>

<div className="flex items-center gap-2">
<Link to="/" className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all ${isActive('/')?'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg':'text-gray-700 hover:bg-amber-50'}`}>
<Home size={22}/>
<span className="hidden md:inline">Home</span>
</Link>

<Link to="/products" className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all ${isActive('/products')?'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg':'text-gray-700 hover:bg-amber-50'}`}>
<Package size={22}/>
<span className="hidden md:inline">Products</span>
</Link>

<Link to="/cart" className={`relative flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all ${isActive('/cart')?'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg':'text-gray-700 hover:bg-amber-50'}`}>
<ShoppingCart size={22}/>
<span className="hidden md:inline">Cart</span>
{cartCount>0&&(
<span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg animate-pulse">
{cartCount}
</span>
)}
</Link>

<button onClick={handleLogout} className="flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all ml-2">
<LogOut size={22}/>
<span className="hidden md:inline">Logout</span>
</button>
</div>
</div>
</div>
</nav>
);
};

export default Navbar;