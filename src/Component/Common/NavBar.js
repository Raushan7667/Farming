import axios from 'axios';
import { Bell, Search, Server, ShoppingCart, Store, User } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NavBar = () => {

  const [mobileMenu, setMobileMenu] = useState(false);
  const [userImage, setUserImage] = useState({});
  const [userRole, setUserRole] = useState("")
  // localStorage.removeItem('token')
  let token;
  const storedTokenData = JSON.parse(localStorage.getItem("token"));
  if (storedTokenData && Date.now() < storedTokenData.expires) {
    console.log("Token:", storedTokenData.value);
    token = storedTokenData.value
  } else {
    localStorage.removeItem("token");
    console.log("Token has expired");
  }
  const navigate = useNavigate()

  console.log("token is in navbar", token)


  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // get user frrom token
  if (token) {
    // api call to get user frrom token
    const getUserByToken = async () => {
      // api call to get user frrom token
      let response = await axios.get("http://localhost:4000/api/v1/auth/getuserbytoken", config)
      console.log("user by token: ", response)
      setUserImage(response.data.user.image)
      setUserRole(response.data.user.accountType)
    }
    getUserByToken();

  }


  // Track the active section
  const [activeSection, setActiveSection] = useState('home');

  const location = useLocation();

  // Update active section based on the route
  React.useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/product')) {
      setActiveSection('product');
    } else {
      setActiveSection('');
    }
  }, [location]);

  const [query, setQuery] = useState('');

  const handleSearch = () => {
    alert(`Searching for: ${query}`);
  };

  return (
    <>
      {activeSection !== 'product' ? (
        <nav className="bg-green-600 text-white shadow-lg fixed top-0 left-0 w-full z-50">
          <div className="container mx-auto px-4 flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold">
              eFarming
            </Link>

            {/* Links */}
            <ul className="hidden md:flex space-x-6">
              <li>
                <Link to="/" className="hover:text-gray-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-gray-200">
                  News
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gray-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/product" className="hover:text-gray-200">
                  Product
                </Link>
              </li>
              {token == null && (
                <div className="flex gap-5">
                  <li>
                    <Link to="/signup" className="hover:text-gray-200 font-bold">
                      SignUp
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="font-bold hover:text-gray-200">
                      Login
                    </Link>
                  </li>
                </div>
              )}
              {
                token != null && (
                  <div className="flex gap-5 items-center">
                    <li>
                      <Link to="/profile" className="hover:text-gray-200 font-bold">
                        <img
                          src={userImage}
                          alt="User Profile"
                          className="w-8 h-8 rounded-full object-cover z-30"
                        />
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
            <div className="md:hidden">
              <button
                className="text-white focus:outline-none"
                onClick={() => setMobileMenu(!mobileMenu)}
              >
                ☰
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenu && (
            <div className="block md:hidden">
              <ul className="space-y-4 px-4 py-2 bg-green-700">
                <li>
                  <Link to="/" className="hover:text-gray-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="hover:text-gray-200">
                    News
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-gray-200">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-gray-200">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/product" className="hover:text-gray-200">
                    Product
                  </Link>
                </li>
                {token == null && (
                  <div className="flex gap-5">
                    <li>
                      <Link to="/signup" className="hover:text-gray-200 font-bold">
                        SignUp
                      </Link>
                    </li>
                    <li>
                      <Link to="/login" className="font-bold hover:text-gray-200">
                        Login
                      </Link>
                    </li>
                  </div>
                )}
                {
                  token != null && (
                    <div className="flex gap-5">
                      <li>
                        <Link to="/profile" className="hover:text-gray-200 font-bold">
                          <User className="w-5 h-5" />
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
            </div>
          )}
        </nav>
      ) : (
        <div className="fixed top-0 left-0 w-full bg-green-600 text-white shadow-lg z-50">
          <div className="flex items-center justify-between px-8 py-4">
            {/* Logo and Search */}
            <div className="flex items-center gap-10">
              <Link to="/" className="text-2xl font-bold">
                eFarming
              </Link>

              <div className="flex items-center border border-gray-300 rounded-lg shadow-sm bg-lime-200">
                <button
                  onClick={handleSearch}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <Search className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search here..."
                  className="w-full px-2 py-1 text-gray-700 bg-lime-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Cart, Profile, and Notification */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 cursor-pointer hover:text-gray-200">
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-gray-200">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-gray-200">
                <Bell className="w-5 h-5" />
                <span>Notification</span>
              </div>
              {
                userRole === "Seller" &&

                <div className="flex items-center gap-2 cursor-pointer hover:text-gray-200" onClick={() => {
                  navigate("/seller")
                }}>
                  <Store className="w-5 h-5" />
                  <span>Sell Now</span>
                </div>
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;

