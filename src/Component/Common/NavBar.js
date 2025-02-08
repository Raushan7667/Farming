import axios from "axios";
import { Bell, Heart, Search, Server, ShoppingCart, Store, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [userRole, setUserRole] = useState("");
  const [query, setQuery] = useState("");
  const [token, setToken] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const menuRef = useRef(null);

  // Token handling
  useEffect(() => {
    // localStorage.removeItem("token");
    const storedTokenData = JSON.parse(localStorage.getItem("token"));
    if (storedTokenData && Date.now() < storedTokenData.expires) {
      setToken(storedTokenData.value);
    } else {
      localStorage.removeItem("token");
      setToken(null);
    }
  }, []);

  // Fetch user details if token exists
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/auth/getuserbytoken", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserImage(response.data.user.image);
        setUserRole(response.data.user.accountType);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    if (token) fetchUser();
  }, [token]);

  // Update active section based on the route
  const [activeSection, setActiveSection] = useState("");
  useEffect(() => {
    setActiveSection(location.pathname.startsWith("/product") ? "product" : "");
  }, [location]);

  // Handle search function
  const handleSearch = () => {
    navigate(`/product/search?query=${query}`);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenu(false);
      }
    };

    if (mobileMenu) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [mobileMenu]);

  const goTocart=(id)=>{
    navigate(`/product/cart`)
  }

  const goToProfile=()=>{
    navigate(`/product/profile`)
  }
  const goToWishList=()=>{
    navigate(`/product/wishlist`)
  }

  return (
    <>
      {activeSection !== "product" ? (
        <nav className="bg-green-600 text-white shadow-lg fixed top-0 left-0 w-full z-50">
          <div className="container mx-auto px-4 flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold">
              eFarming
            </Link>

            {/* Links */}
            <ul className="hidden md:flex space-x-6">
              <li><Link to="/" className="hover:text-gray-200">Home</Link></li>
              <li><Link to="/news" className="hover:text-gray-200">News</Link></li>
              <li><Link to="/about" className="hover:text-gray-200">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-gray-200">Contact</Link></li>
              <li><Link to="/product" className="hover:text-gray-200">Product</Link></li>

              {!token ? (
                <div className="flex gap-5">
                  <li><Link to="/signup" className="hover:text-gray-200 font-bold">SignUp</Link></li>
                  <li><Link to="/login" className="font-bold hover:text-gray-200">Login</Link></li>
                </div>
              ) : (
                <div className="flex gap-5 items-center">
                  <li>
                    <Link to="/profile" className="hover:text-gray-200 font-bold">
                      <img src={userImage} alt="User Profile" className="w-8 h-8 rounded-full object-cover z-30" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/server" className="hover:text-gray-200 font-bold">
                      <Server className="w-5 h-5" />
                    </Link>
                  </li>
                </div>
              )}
            </ul>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden text-white focus:outline-none" onClick={() => setMobileMenu(!mobileMenu)}>☰</button>
          </div>

          {/* Mobile Menu */}
          {mobileMenu && (
            <div ref={menuRef} className=" block md:hidden" onClick={() => setMobileMenu(false)}>
              <ul className="space-y-4 px-4 py-2 bg-green-700">
                <li><Link to="/" className="hover:text-gray-200">Home</Link></li>
                <li><Link to="/news" className="hover:text-gray-200">News</Link></li>
                <li><Link to="/about" className="hover:text-gray-200">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-gray-200">Contact</Link></li>
                <li><Link to="/product" className="hover:text-gray-200">Product</Link></li>

                {!token ? (
                  <div className="flex gap-5">
                    <li><Link to="/signup" className="hover:text-gray-200 font-bold">SignUp</Link></li>
                    <li><Link to="/login" className="font-bold hover:text-gray-200">Login</Link></li>
                  </div>
                ) : (
                  <div className="flex gap-5">
                    <li><Link to="/profile" className="hover:text-gray-200 font-bold"><User className="w-5 h-5" /></Link></li>
                    <li><Link to="/server" className="hover:text-gray-200 font-bold"><Server className="w-5 h-5" /></Link></li>
                  </div>
                )}
              </ul>
            </div>
          )}
        </nav>
      ) : (

        <div className="fixed top-0 left-0 w-full bg-green-600 text-white shadow-lg z-50">
          <div className="flex items-center justify-between px-4 md:px-8 py-3">

            {/* Logo & Search */}
            <div className="flex items-center gap-4 md:gap-8 w-full">
              {/* Logo */}
              <Link to="/" className="text-2xl font-bold whitespace-nowrap">eFarming</Link>

              {/* Search Bar */}
              <div className="flex items-center border border-gray-300 rounded-lg shadow-sm bg-green-200 w-full max-w-lg">
                <button onClick={handleSearch} className="p-2 text-gray-500 hover:text-gray-700">
                  <Search className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for seeds, pesticides, tools..."
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full px-3 py-2 text-gray-700 bg-green-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Cart, Profile & Notification */}
            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 cursor-pointer hover:text-gray-200" onClick={()=>{goTocart()}}>
                <ShoppingCart className="w-5 h-5" /> {!isMobile && <span>Cart</span>}
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-gray-200"  onClick={()=>{goToProfile()}}>
                <User className="w-5 h-5" /> {!isMobile && <span>Profile</span>}
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-gray-200" onClick={()=>{goToWishList()}}>
                <Heart className="w-5 h-5" /> {!isMobile && <span>WishList</span>}
              </div>

              {/* Seller Button (Only for Sellers) */}
              {userRole === "Seller" && (
                <div
                  className="flex items-center gap-2 cursor-pointer hover:text-gray-200"
                  onClick={() => navigate("/seller")}
                >
                  <Store className="w-5 h-5" />  {!isMobile && <span>Sell Now</span>}
                
                </div>
              )}
            </div>
          </div>
        </div>

      )}
    </>
  );
};

export default NavBar;
