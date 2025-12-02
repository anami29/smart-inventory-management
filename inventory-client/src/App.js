import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useReactToPrint } from 'react-to-print';

// --- 1. LOGIN & REGISTER COMPONENT (Database Connected) ---
const LoginScreen = ({ onLogin }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({ username: "", password: "", shopName: "", mobile: "" });
    
    // OTP States
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSendOtp = async () => {
        if (!formData.mobile || formData.mobile.length < 10) { setError("❌ Please enter a valid mobile number"); return; }
        try { await axios.post(`http://localhost:8080/api/users/send-otp?mobile=${formData.mobile}`); setIsOtpSent(true); setError(""); alert("📲 OTP Sent! Check your Java Console."); } catch (e) { setError("❌ Failed to send SMS"); }
    };

    const handleVerifyOtp = async () => {
        try { const res = await axios.post("http://localhost:8080/api/users/verify-otp", { mobile: formData.mobile, otp }); if (res.data === true) { setIsVerified(true); setSuccess("✅ Verified! You can now register."); setError(""); } else { setError("❌ Invalid OTP"); } } catch (e) { setError("❌ Verification Error"); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); 

        if (isRegistering) {
            if (!isVerified) { setError("⚠️ Please verify mobile number first"); return; }
            try {
                const res = await axios.post("http://localhost:8080/api/users/register", formData);
                if (res.data) { setSuccess("✅ Account created! Please login."); setIsRegistering(false); setIsVerified(false); setIsOtpSent(false); setOtp(""); } 
                else { setError("❌ Username already exists"); }
            } catch (e) { setError("❌ Registration Failed"); }
        } else {
            // 👇 LOGIN VIA DATABASE
            try {
                const res = await axios.post("http://localhost:8080/api/users/login", { username: formData.username, password: formData.password });
                if (res.data) { onLogin(res.data); } 
                else { setError("❌ Invalid Username or Password"); }
            } catch (e) { setError("❌ Server Error (Is Backend Running?)"); }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" }}>
            <div className="card p-5 shadow-lg border-0" style={{ width: "420px", borderRadius: "15px" }}>
                <div className="text-center mb-3">
                    <div className="fs-1 mb-2">🛍️</div>
                    <h3 className="fw-bold text-primary">{isRegistering ? "Create Account" : "Smart Shop"}</h3>
                    <p className="text-muted small">{isRegistering ? "Verify mobile to setup shop" : "Login to manage inventory"}</p>
                </div>

                {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}
                {success && <div className="alert alert-success p-2 small text-center">{success}</div>}

                <form onSubmit={handleSubmit}>
                    {isRegistering && (
                        <>
                            <div className="mb-2"><input type="text" className="form-control" placeholder="Shop Name" value={formData.shopName} onChange={e => setFormData({...formData, shopName: e.target.value})} required /></div>
                            <div className="input-group mb-2">
                                <input type="text" className="form-control" placeholder="Mobile Number" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} disabled={isOtpSent} required />
                                {!isOtpSent && <button type="button" className="btn btn-warning btn-sm" onClick={handleSendOtp}>Send OTP</button>}
                            </div>
                            {isOtpSent && !isVerified && (
                                <div className="input-group mb-2">
                                    <input type="text" className="form-control" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
                                    <button type="button" className="btn btn-success btn-sm" onClick={handleVerifyOtp}>Verify</button>
                                </div>
                            )}
                        </>
                    )}

                    <div className="mb-2"><input type="text" className="form-control" placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required /></div>
                    <div className="mb-4"><input type="password" class="form-control" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required /></div>
                    
                    <button type="submit" className="btn btn-primary w-100 btn-lg fw-bold shadow-sm" disabled={isRegistering && !isVerified}>
                        {isRegistering ? "Sign Up" : "Login"}
                    </button>
                </form>

                <div className="text-center mt-4 pt-3 border-top">
                    <button className="btn btn-link btn-sm fw-bold text-decoration-none" onClick={() => { setIsRegistering(!isRegistering); setError(""); setSuccess(""); }}>
                        {isRegistering ? "Back to Login" : "New User? Register Here"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 2. INVOICE COMPONENT ---
const Invoice = React.forwardRef(({ cart, customer, subtotal, discount, finalTotal, date, invoiceId, shopName }, ref) => (
    <div ref={ref} className="p-5 bg-white text-dark" style={{ width: '100%', minHeight: '100vh' }}>
        <div className="text-center mb-4"><h2 className="fw-bold">🚀 {shopName || "Smart Shop Manager"}</h2><p>Official Tax Invoice</p></div>
        <div className="d-flex justify-content-between mb-4 border-bottom pb-3">
            <div><strong>Billed To:</strong><br />{customer.name || "Guest"}<br />{customer.mobile || ""}<br/>{customer.address}</div>
            <div className="text-end"><strong>Invoice #:</strong> {invoiceId}<br /><strong>Date:</strong> {date}</div>
        </div>
        <table className="table table-bordered"><thead className="table-light"><tr><th>Item</th><th>Category</th><th className="text-end">Price</th></tr></thead><tbody>{cart.map((item, index) => (<tr key={index}><td>{item.name}</td><td>{item.category}</td><td className="text-end">₹{item.price.toLocaleString()}</td></tr>))}</tbody><tfoot><tr><td colSpan="2" className="text-end">Subtotal</td><td className="text-end">₹{subtotal.toLocaleString()}</td></tr><tr><td colSpan="2" className="text-end text-danger">Discount</td><td className="text-end text-danger">- ₹{discount.toLocaleString()}</td></tr><tr><td colSpan="2" className="text-end fw-bold bg-light">Grand Total</td><td className="text-end fw-bold bg-light">₹{finalTotal.toLocaleString()}</td></tr></tfoot></table>
        <div className="text-center mt-5 text-muted small"><p>Thank you for shopping with us!</p></div>
    </div>
));

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || null);
  const [shopName, setShopName] = useState(localStorage.getItem("shopName") || "Smart Shop");
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("currentUser") || "");

  const [view, setView] = useState("inventory"); 
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]); 
  const [usersList, setUsersList] = useState([]); 
  const [auditLog, setAuditLog] = useState([]); 
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // UI States
  const [darkMode, setDarkMode] = useState(false);
  const [viewCustomerDetails, setViewCustomerDetails] = useState(null); 
  const [cart, setCart] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({ name: "", mobile: "", email: "", address: "" });
  const [discountPercent, setDiscountPercent] = useState(0);
  const [lastInvoice, setLastInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState(new Set());
  const [showNotifications, setShowNotifications] = useState(false);
  const printRef = useRef();
  
  const [newUserForm, setNewUserForm] = useState({ username: "", password: "", role: "staff" });
  const [form, setForm] = useState({ name: "", category: "", price: "", stockQuantity: "", warrantyDate: "", description: "", supplierName: "", supplierContact: "", lastPurchaseDate: "", deliveryDays: "" });
  const [supplierForm, setSupplierForm] = useState({ name: '', contact: '', category: '', deliveryDays: '', address: '', notes: '' });
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [suggestion, setSuggestion] = useState("");
  const [deadStockDays, setDeadStockDays] = useState(30);

  const handlePrint = useReactToPrint({ content: () => printRef.current, onAfterPrint: () => { setShowInvoiceModal(false); window.location.reload(); } });

  const handleLogin = (userData) => { 
      setUserRole(userData.role); setShopName(userData.shopName || "Smart Shop"); setCurrentUser(userData.username);
      localStorage.setItem("userRole", userData.role); localStorage.setItem("shopName", userData.shopName || "Smart Shop"); localStorage.setItem("currentUser", userData.username);
      logAction("LOGIN", `User ${userData.username} logged in`); 
  };
  const handleLogout = () => { logAction("LOGOUT", `User ${currentUser} logged out`); setUserRole(null); localStorage.clear(); };
  
  const logAction = (action, details) => { 
      const newLog = { id: Date.now(), timestamp: new Date().toISOString(), userRole: currentUser, action, details, shopName: shopName }; 
      setAuditLog(prev => [newLog, ...prev]); 
      if(isOnline) axios.post("http://localhost:8080/api/audit", newLog).catch(console.error); 
  };

  // --- LOAD DATA ---
  useEffect(() => { 
      if (!userRole) return; 
      const handleOnline = () => { setIsOnline(true); syncOfflineData(); }; 
      const handleOffline = () => { setIsOnline(false); }; 
      window.addEventListener('online', handleOnline); 
      window.addEventListener('offline', handleOffline); 
      loadProducts(); loadSales(); loadSuppliers(); loadAuditLogs(); loadCustomers(); loadUsers(); 
      return () => { 
          window.removeEventListener('online', handleOnline); 
          window.removeEventListener('offline', handleOffline); 
      }; 
  }, [userRole]);

  const syncOfflineData = async () => { const pending = JSON.parse(localStorage.getItem("pendingActions") || "[]"); if(pending.length > 0) { for (const action of pending) { try { if (action.type === "ADD_PRODUCT") await axios.post("http://localhost:8080/api/products", action.payload); if (action.type === "ADD_SUPPLIER") await axios.post("http://localhost:8080/api/suppliers", action.payload); if (action.type === "ADD_SALE") { const fd = new FormData(); Object.keys(action.payload).forEach(k => fd.append(k, action.payload[k])); await axios.post("http://localhost:8080/api/sales", fd, { headers: { 'Content-Type': 'multipart/form-data' } }); } } catch (e) { console.error("Sync Error", e); } } localStorage.removeItem("pendingActions"); alert("🟢 Sync Complete!"); loadProducts(); loadSales(); loadSuppliers(); } };
  
  const loadProducts = async () => { try { const res = await axios.get(`http://localhost:8080/api/products?shopName=${shopName}`); setProducts(res.data); } catch (e) { } };
  const loadSales = async () => { try { const res = await axios.get(`http://localhost:8080/api/sales?shopName=${shopName}`); setSales(res.data.reverse()); } catch (e) { } };
  const loadSuppliers = async () => { try { const res = await axios.get(`http://localhost:8080/api/suppliers?shopName=${shopName}`); setSuppliers(res.data); } catch (e) { } };
  const loadCustomers = async () => { try { const res = await axios.get(`http://localhost:8080/api/customers?shopName=${shopName}`); setCustomers(res.data); } catch (e) { } };
  const loadAuditLogs = async () => { try { const res = await axios.get(`http://localhost:8080/api/audit?shopName=${shopName}`); setAuditLog(res.data.reverse()); } catch (e) { } };
  const loadUsers = async () => { if(userRole === 'admin') { try { const res = await axios.get("http://localhost:8080/api/users"); setUsersList(res.data); } catch (e) { } } };

  // --- HELPER FUNCTIONS ---
  const getDaysDiff = (date) => { if (!date) return 9999; return Math.ceil(Math.abs(new Date() - new Date(date)) / (1000 * 60 * 60 * 24)); };
  const getDaysLeft = (date) => { if (!date) return 9999; return Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24)); };
  const getInactiveDays = (p) => { const refDate = p.lastSaleDate || p.lastPurchaseDate; if (!refDate) return 999; return getDaysDiff(refDate); };
  const formatJavaDate = (dateData) => { if (!dateData) return "-"; if (Array.isArray(dateData)) { const [year, month, day, hour, minute] = dateData; return new Date(year, month - 1, day, hour, minute).toLocaleString(); } return new Date(dateData).toLocaleString(); };
  const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const getNotifications = () => {
      const alerts = [];
      products.forEach(p => {
          if(p.stockQuantity < 5) alerts.push({ icon: "📉", msg: `Low Stock: ${p.name}`, color: "text-danger" });
          const inactive = getInactiveDays(p);
          if(inactive > 90) alerts.push({ icon: "🤖", msg: `Dead Stock: ${p.name}`, color: "text-primary" });
      });
      return alerts;
  };
  const notifications = getNotifications();

  const getSmartSuggestion = (p) => {
    const days = getInactiveDays(p); const recent = sales.filter(s => s.productName === p.name && new Date(s.saleDate) > new Date(Date.now() - 30*24*60*60*1000)).length;
    if (days > 90) return { text: "📉 Clearance", color: "bg-danger text-white", reason: "⚠️ Dead stock (>90d)" };
    if (days > 60) return { text: "🎁 Bundle", color: "bg-warning text-dark", reason: "💡 Slow moving" };
    if (recent >= 5 && p.stockQuantity < 10) return { text: "🔥 Hot", color: "bg-success text-white", reason: "📈 High demand" };
    if (p.stockQuantity > 50 && recent < 2) return { text: "📦 Overstock", color: "bg-info text-dark", reason: "📉 Too much stock" };
    return { text: "✅ Optimal", color: "bg-light text-secondary border", reason: "👍 Good balance" };
  };
  const getReorderQty = (p) => { const recent = sales.filter(s => s.productName === p.name && new Date(s.saleDate) > new Date(Date.now() - 30*24*60*60*1000)).length; const avg = Math.ceil(recent / 4); const target = avg + 5; const toOrder = target - p.stockQuantity; return toOrder > 0 ? toOrder : 0; };

  const addToCart = (p) => { if (p.stockQuantity <= 0) return alert("Out of Stock!"); setCart([...cart, p]); setAddedItemIds(prev => new Set(prev).add(p.id)); setTimeout(() => { setAddedItemIds(prev => { const newSet = new Set(prev); newSet.delete(p.id); return newSet; }); }, 600); };
  const removeFromCart = (i) => { const newCart = [...cart]; newCart.splice(i, 1); setCart(newCart); };
  
  const handleCheckout = async () => {
      if (cart.length === 0) return;
      const subtotal = cart.reduce((a, c) => a + Number(c.price), 0); const discountAmount = (subtotal * discountPercent) / 100; const finalTotal = subtotal - discountAmount; const ratio = (100 - discountPercent) / 100;
      
      for (const item of cart) {
          const payload = { productName: item.name, category: item.category, soldPrice: item.price * ratio, quantity: 1, shopName: shopName, customerMobile: customerDetails.mobile };
          if (isOnline) { try { const fd = new FormData(); Object.keys(payload).forEach(k => fd.append(k, payload[k])); await axios.post("http://localhost:8080/api/sales", fd, { headers: { 'Content-Type': 'multipart/form-data' } }); } catch(e) { console.error(e); } } 
          else { const pending = JSON.parse(localStorage.getItem("pendingActions") || "[]"); pending.push({ type: "ADD_SALE", payload }); localStorage.setItem("pendingActions", JSON.stringify(pending)); }
      }

      if(customerDetails.mobile) {
          const cleanMobile = customerDetails.mobile.trim(); const cleanName = customerDetails.name.trim(); const cleanEmail = customerDetails.email ? customerDetails.email.trim() : ""; const cleanAddress = customerDetails.address ? customerDetails.address.trim() : "";
          
          if(isOnline) { 
              axios.post("http://localhost:8080/api/customers", { name: cleanName, mobile: cleanMobile, email: cleanEmail, address: cleanAddress, totalSpent: finalTotal, shopName: shopName })
              .then(() => { setTimeout(() => { loadCustomers(); loadSales(); loadProducts(); }, 800); })
              .catch(console.error); 
          }
      }

      logAction("SALE", `Sold ${cart.length} items. Total: ₹${finalTotal}.`);
      setLastInvoice({ cart: [...cart], customer: customerDetails, subtotal, discount: discountAmount, finalTotal, date: new Date().toLocaleString(), invoiceId: "INV-" + Date.now().toString().slice(-6), shopName });
      setCart([]); setCustomerDetails({ name: "", mobile: "", email: "", address: "" }); setShowCartModal(false); setShowInvoiceModal(true);
  };

  const handleSubmit = async (e) => { e.preventDefault(); logAction("ADD_PRODUCT", `Added ${form.name}`); const productData = { ...form, shopName: shopName }; if (isOnline && form.supplierName && !suppliers.find(s => s.name === form.supplierName)) { try { await axios.post("http://localhost:8080/api/suppliers", { name: form.supplierName, contact: form.supplierContact || "Unknown", category: form.category, deliveryDays: form.deliveryDays || "Mon-Fri", address: "", notes: "", shopName: shopName }); loadSuppliers(); } catch (err) { console.error("Auto-supplier failed", err); } } if (isOnline) { try { await axios.post("http://localhost:8080/api/products", productData); setForm({ name: "", category: "", price: "", stockQuantity: "", warrantyDate: "", description: "", supplierName: "", supplierContact: "", lastPurchaseDate: "", deliveryDays: "" }); loadProducts(); } catch (e) { console.error(e); } } else { const pending = JSON.parse(localStorage.getItem("pendingActions") || "[]"); pending.push({ type: "ADD_PRODUCT", payload: productData }); localStorage.setItem("pendingActions", JSON.stringify(pending)); alert("🔴 Saved locally."); } };
  const handleDelete = async (id) => { if(window.confirm("Delete?")) { logAction("DELETE_PRODUCT", `Deleted Item ID: ${id}`); if(isOnline) { await axios.delete(`http://localhost:8080/api/products/${id}`); loadProducts(); } else { alert("🔴 Cannot delete offline."); } } };
  const handleSupplierSubmit = async (e) => { e.preventDefault(); const supplierData = { ...supplierForm, shopName: shopName }; if (!isOnline) { alert("🔴 Cannot manage suppliers offline."); return; } try { if (editingSupplierId) { await axios.put(`http://localhost:8080/api/suppliers/${editingSupplierId}`, supplierData); logAction("EDIT_SUPPLIER", `Updated supplier: ${supplierForm.name}`); setEditingSupplierId(null); } else { await axios.post("http://localhost:8080/api/suppliers", supplierData); logAction("ADD_SUPPLIER", `Added supplier: ${supplierForm.name}`); } setSupplierForm({ name: '', contact: '', category: '', deliveryDays: '', address: '', notes: '' }); loadSuppliers(); } catch (e) { alert("Failed to save supplier"); } };
  const startEditSupplier = (sup) => { setSupplierForm({ name: sup.name, contact: sup.contact, category: sup.category, deliveryDays: sup.deliveryDays, address: sup.address || "", notes: sup.notes || "" }); setEditingSupplierId(sup.id); };
  const handleDeleteSupplier = async (id) => { if(window.confirm("Delete?")) { logAction("DELETE_SUPPLIER", `Deleted Supplier ID: ${id}`); await axios.delete(`http://localhost:8080/api/suppliers/${id}`); loadSuppliers(); } };
  const handleAddUser = async (e) => { e.preventDefault(); try { const res = await axios.post("http://localhost:8080/api/users/add", { ...newUserForm, shopName: shopName }); if(res.data) { alert("User Added!"); setNewUserForm({ username: "", password: "", role: "staff" }); loadUsers(); } else { alert("Username taken"); } } catch(e) { alert("Error adding user"); } };
  const handleDeleteUser = async (username) => { if(window.confirm(`Delete user ${username}?`)) { await axios.delete(`http://localhost:8080/api/users/${username}`); loadUsers(); } };

  if (!userRole) return <LoginScreen onLogin={handleLogin} />;

  const totalRevenue = sales.reduce((acc, s) => acc + s.soldPrice, 0);
  const totalStockValue = products.reduce((acc, p) => acc + (p.price * p.stockQuantity), 0);
  const categoryProfitData = [];
  sales.forEach(s => { const c = categoryProfitData.find(cat => cat.name === s.category); if (c) c.profit += s.soldPrice; else categoryProfitData.push({ name: s.category, profit: s.soldPrice }); });
  
  const filteredProducts = products.filter((p) => { const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()); const matchCat = selectedCategory === "All" || p.category === selectedCategory; let matchFilter = true; if (filterType === "Low Stock") matchFilter = p.stockQuantity < 5; if (filterType === "Dead Stock") matchFilter = getInactiveDays(p) >= deadStockDays; return matchSearch && matchCat && matchFilter; });
  const deadStockItems = products.filter(p => getInactiveDays(p) >= deadStockDays && p.stockQuantity > 0);
  const chartData = filteredProducts.map(p => ({ name: p.name, stock: p.stockQuantity }));
  const isAdmin = userRole === "admin"; const isStaff = userRole === "staff"; const canEdit = isAdmin; const canSell = isAdmin || isStaff;
  const bgClass = darkMode ? "bg-dark text-white" : "bg-light text-dark";
  const cardClass = darkMode ? "bg-secondary text-white border-secondary shadow-sm" : "bg-white border-0 shadow-sm";
  const tableClass = darkMode ? "table table-dark table-hover mb-0 align-middle border-top" : "table table-hover mb-0 align-middle border-top";

  return (
    <div className={`container-fluid p-4 ${bgClass}`} style={{ minHeight: "100vh", transition: "0.3s" }}>
      {showInvoiceModal && lastInvoice && ( <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.8)",zIndex:2000,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><div className="bg-white rounded shadow-lg overflow-auto" style={{maxWidth:'800px',width:'90%',maxHeight:'90vh'}}><Invoice ref={printRef} {...lastInvoice}/></div><div className="mt-3 d-flex gap-3"><button className="btn btn-secondary btn-lg" onClick={()=>setShowInvoiceModal(false)}>Close</button><button className="btn btn-primary btn-lg" onClick={handlePrint}>🖨️ Print Bill</button></div></div>)}
      {viewCustomerDetails && (<div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.8)",zIndex:3000,display:"flex",justifyContent:"center",alignItems:"center"}}><div className={`rounded shadow-lg p-4 ${darkMode ? "bg-dark text-white" : "bg-white"}`} style={{maxWidth:'600px', width:'90%'}}><h4 className="fw-bold mb-3">📜 Purchase History: {viewCustomerDetails.name}</h4><div style={{maxHeight:'400px', overflowY:'auto'}}>{sales.filter(s => String(s.customerMobile).trim() === String(viewCustomerDetails.mobile).trim()).map((sale, idx) => (<div key={idx} className={`border rounded p-3 mb-2 ${darkMode ? "border-secondary" : "bg-light"}`}><div className="d-flex justify-content-between fw-bold"><span>{sale.productName}</span><span>₹{sale.soldPrice.toLocaleString()}</span></div><small>{formatJavaDate(sale.saleDate)}</small></div>))}</div><button className="btn btn-secondary w-100 mt-3" onClick={() => setViewCustomerDetails(null)}>Close</button></div></div>)}

      {showCartModal && ( 
        <div style={{position:"fixed",top:0,right:0,width:"400px",height:"100%",background: darkMode ? "#343a40" : "white", color: darkMode ? "white" : "black",zIndex:1500,boxShadow:"-5px 0 15px rgba(0,0,0,0.1)",padding:"20px",display:"flex",flexDirection:"column"}}>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2"><h4>🛒 Current Bill</h4><button className="btn-close" onClick={()=>setShowCartModal(false)} style={darkMode ? {filter:"invert(1)"} : {}}></button></div>
            <div className="flex-grow-1 overflow-auto">{cart.length===0?<p className="text-muted text-center mt-5">Cart is empty.</p>:<ul className="list-group">{cart.map((item,idx)=>(<li key={idx} className={`list-group-item d-flex justify-content-between align-items-center ${darkMode ? "bg-dark text-white border-secondary" : ""}`}><div><div className="fw-bold">{item.name}</div><div className="small">₹{item.price.toLocaleString()}</div></div><button className="btn btn-sm btn-outline-danger" onClick={()=>removeFromCart(idx)}>✕</button></li>))}</ul>}</div>
            <div className="border-top pt-3 mt-3">
                <h6 className="fw-bold mb-2">👤 Customer Details</h6>
                <div className="row mb-2"><div className="col-6"><input className="form-control form-control-sm" placeholder="Name" value={customerDetails.name} onChange={e=>setCustomerDetails({...customerDetails,name:e.target.value})} /></div><div className="col-6"><input className="form-control form-control-sm" placeholder="Mobile" value={customerDetails.mobile} onChange={e=>setCustomerDetails({...customerDetails,mobile:e.target.value})} /></div></div>
                <div className="row mb-2"><div className="col-6"><input className="form-control form-control-sm" placeholder="Email" value={customerDetails.email} onChange={e=>setCustomerDetails({...customerDetails,email:e.target.value})} /></div><div className="col-6"><input className="form-control form-control-sm" placeholder="Address" value={customerDetails.address} onChange={e=>setCustomerDetails({...customerDetails,address:e.target.value})} /></div></div>
                <div className="mb-3"><label className="form-label small">Discount % {isStaff && "(Max 10%)"}</label><input type="number" className="form-control" value={discountPercent} onChange={e=> { let val = Number(e.target.value); if(isStaff && val > 10) { alert("Staff limit 10%!"); val = 10; } setDiscountPercent(val); }} disabled={!isAdmin && !isStaff}/></div><div className="d-flex justify-content-between fs-5 fw-bold mb-3"><span>Total:</span><span>₹{(cart.reduce((a,c)=>a+Number(c.price),0) * (100-discountPercent)/100).toLocaleString()}</span></div><button className="btn btn-success w-100 py-2 fw-bold" onClick={handleCheckout} disabled={cart.length===0}>✅ Checkout & Print</button>
            </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h2 className="fw-bold">🚀 {shopName} <span className="badge bg-info fs-6 align-middle text-dark border">{userRole.toUpperCase()}</span></h2><div className="btn-group mt-2"><button className={`btn ${view === 'inventory' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('inventory')}>📦 Inventory</button><button className={`btn ${view === 'history' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('history')}>📜 History</button><button className={`btn ${view === 'suppliers' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('suppliers')}>🚚 Suppliers</button><button className={`btn ${view === 'crm' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('crm')}>👥 CRM</button>{isAdmin && <button className={`btn ${view === 'users' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('users')}>👤 Users</button>}{isAdmin && <button className={`btn ${view === 'audit' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('audit')}>📝 Audit</button>}</div></div>
        <div className="text-end d-flex align-items-center gap-3"><button className={`btn ${darkMode ? 'btn-light' : 'btn-dark'} rounded-circle shadow-sm`} onClick={()=>setDarkMode(!darkMode)} style={{width:'45px',height:'45px'}} title="Toggle Dark Mode">{darkMode ? "☀️" : "🌙"}</button><div className="position-relative"><button className={`btn ${darkMode ? 'btn-secondary' : 'btn-light'} border rounded-circle shadow-sm`} onClick={() => setShowNotifications(!showNotifications)} style={{width:'45px', height:'45px'}}>🔔</button>{notifications.length > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{notifications.length}</span>}{showNotifications && (<div className={`position-absolute end-0 mt-2 shadow-lg border rounded p-2 text-start ${darkMode ? "bg-dark text-white" : "bg-white"}`} style={{width: '320px', zIndex: 3000, maxHeight:'400px', overflowY:'auto'}}><h6 className="border-bottom pb-2 px-2 mb-0">📢 Notifications</h6>{notifications.length === 0 ? <p className="small text-muted p-3 mb-0 text-center">No alerts.</p> : <ul className="list-group list-group-flush small">{notifications.map((n,i) => (<li key={i} className={`list-group-item ${darkMode ? "bg-secondary text-white" : ""} fw-medium`}><span className="me-2">{n.icon}</span>{n.msg}</li>))}</ul>}</div>)}</div><div>{isOnline ? <span className="badge bg-success me-2">🟢 Online</span> : <span className="badge bg-danger me-2">🔴 Offline</span>}{canSell && <button className="btn btn-warning position-relative fw-bold me-2" onClick={() => setShowCartModal(true)}>🛒 Bill ({cart.length})</button>}<button className="btn btn-danger btn-sm" onClick={handleLogout}>🚪 Logout</button></div></div>
      </div>
      
      <div className="row mb-4"><div className="col-12 d-flex justify-content-end gap-3"><span className="badge bg-primary p-3 fs-5 shadow-sm">📦 Stock Value: ₹{totalStockValue.toLocaleString()}</span><span className="badge bg-dark p-3 fs-5 shadow-sm">💰 Revenue: ₹{totalRevenue.toLocaleString()}</span></div></div>

      {view === "inventory" && (
        <>
          {deadStockItems.length > 0 && (<div className="alert alert-danger d-flex align-items-center shadow-sm p-2"><div className="flex-grow-1"><strong>⚠️ Dead Stock Alert:</strong> {deadStockItems.slice(0,3).map(p => p.name).join(", ")} {deadStockItems.length > 3 && "..."}</div><button className="btn btn-sm btn-danger ms-2" onClick={() => setFilterType("Dead Stock")}>View</button></div>)}
          <div className="row mb-4"><div className="col-md-6"><div className={cardClass + " p-3"}><h6 className="text-muted fw-bold">📦 Stock Levels</h6><div style={{ width: '100%', height: 200 }}><ResponsiveContainer><BarChart data={chartData}><XAxis dataKey="name" hide /><Tooltip contentStyle={darkMode ? {backgroundColor:'#333', color:'#fff'} : {}}/><Bar dataKey="stock" fill="#8884d8" /></BarChart></ResponsiveContainer></div></div></div><div className="col-md-6"><div className={cardClass + " p-3"}><h6 className="text-success fw-bold">💰 Category Profit</h6><div style={{ width: '100%', height: 200 }}><ResponsiveContainer><BarChart data={categoryProfitData}><XAxis dataKey="name" tick={{fontSize: 12}} /><Tooltip contentStyle={darkMode ? {backgroundColor:'#333', color:'#fff'} : {}}/><Bar dataKey="profit" fill="#198754" /></BarChart></ResponsiveContainer></div></div></div></div>
          <div className={cardClass + " p-3 mb-4"}><div className="row g-2"><div className="col-md-4"><input type="text" className="form-control" placeholder="🔍 Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div><div className="col-md-3"><select className="form-select" onChange={e => setSelectedCategory(e.target.value)}><option value="All">All Categories</option>{uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}</select></div><div className="col-md-3"><select className="form-select" value={filterType} onChange={e => setFilterType(e.target.value)}><option value="All">All Status</option><option value="Low Stock">Low Stock</option><option value="Dead Stock">Dead Stock</option></select></div></div></div>
          <div className="row"><div className={isAdmin ? "col-md-8" : "col-md-12"}><div className={cardClass}><div className={`card-header fw-bold ${darkMode ? 'bg-secondary border-bottom border-dark' : 'bg-white'}`}>📦 Stock List</div><table className={tableClass}><thead className={darkMode ? "table-dark" : "table-light"}><tr><th style={{width:"25%"}}>Product</th><th style={{width:"10%"}}>Price</th><th style={{width:"10%"}}>Stock</th><th style={{width:"15%"}}>Warranty</th><th style={{width:"10%"}}>Supplier</th><th style={{width:"10%"}}>Auto Order</th><th>AI Hint</th>{canSell && <th>Action</th>}</tr></thead><tbody>{filteredProducts.map((p) => { const daysLeft = getDaysLeft(p.warrantyDate); const suggestion = getSmartSuggestion(p); const reorderQty = getReorderQty(p); const isAdded = addedItemIds.has(p.id); return (<tr key={p.id}><td><div className={`fw-bold d-flex align-items-center gap-2 ${darkMode ? 'text-white' : 'text-dark'}`}>{p.name}</div><span className="badge bg-secondary border">{p.category}</span></td><td className="fw-bold">₹{p.price.toLocaleString()}</td><td><span className={`badge rounded-pill ${p.stockQuantity < 5 ? 'bg-danger' : 'bg-success bg-opacity-75'}`}>{p.stockQuantity}</span></td><td>{daysLeft > 900 ? <span className="text-muted">-</span> : daysLeft < 0 ? <span className="badge bg-dark">Expired</span> : daysLeft < 30 ? <span className="badge bg-warning text-dark">⚠️ {daysLeft} Days</span> : <span className="badge bg-success">{daysLeft} Days</span>}</td><td>{p.supplierName ? <span className="badge bg-info text-dark bg-opacity-10 border border-info">{p.supplierName}</span> : "-"}</td><td>{reorderQty > 0 ? <span className="badge bg-primary">🔧 Buy {reorderQty}</span> : <span className="text-muted small">—</span>}</td><td><span className={`badge ${suggestion.color} fw-normal`} style={{cursor: "help"}} title={suggestion.reason}>{suggestion.text}</span></td>{canSell && <td><div className="d-flex gap-1"><button onClick={() => addToCart(p)} className={`btn btn-sm shadow-sm fw-bold transition-all ${isAdded ? 'btn-success' : 'btn-warning'}`} title="Add to Bill">{isAdded ? '✅' : '➕ Bill'}</button>{canEdit && <button onClick={() => handleDelete(p.id)} className="btn btn-outline-danger btn-sm shadow-sm">🗑</button>}</div></td>}</tr>); })}</tbody></table></div></div>{isAdmin && <div className="col-md-4"><div className={cardClass + " p-3"}><h5>Add New Stock</h5><form onSubmit={handleSubmit}><input type="text" className="form-control mb-2" placeholder="Product Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required /><input className="form-control mb-2" list="catOptions" placeholder="Select or Type Category" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} required /><datalist id="catOptions">{uniqueCategories.map(c => <option key={c} value={c} />)}</datalist><div className="row mb-2"><div className="col"><input type="number" className="form-control" placeholder="Price" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required /></div><div className="col"><input type="number" className="form-control" placeholder="Qty" value={form.stockQuantity} onChange={(e) => setForm({...form, stockQuantity: e.target.value})} required /></div></div><select className="form-select mb-2" value={form.supplierName} onChange={(e) => { const s = suppliers.find(s => s.name === e.target.value); setForm({ ...form, supplierName: e.target.value, supplierContact: s?.contact, deliveryDays: s?.deliveryDays }); }}><option value="">Select Saved Supplier</option>{suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}</select><input type="text" className="form-control mb-2" placeholder="Or Type Name Manual..." value={form.supplierName} onChange={(e) => setForm({...form, supplierName: e.target.value})} /><div className="row mb-2"><div className="col"><input type="text" className="form-control" placeholder="Contact" value={form.supplierContact} onChange={(e) => setForm({...form, supplierContact: e.target.value})} /></div><div className="col"><input type="text" className="form-control" placeholder="Days" value={form.deliveryDays} onChange={(e) => setForm({...form, deliveryDays: e.target.value})} /></div></div><div className="row mb-2"><div className="col"><input type="date" className="form-control" value={form.lastPurchaseDate} onChange={(e) => setForm({...form, lastPurchaseDate: e.target.value})} /></div><div className="col"><input type="date" className="form-control" value={form.warrantyDate} onChange={(e) => setForm({...form, warrantyDate: e.target.value})} /></div></div><button type="submit" className="btn btn-primary w-100">Add Item</button></form></div></div>}</div>
        </>
      )}

      {view === "history" && (<div className={cardClass}><div className="card-header fw-bold">📜 Transaction Log</div><table className={tableClass}><thead className="table-dark"><tr><th>Date</th><th>Product</th><th>Category</th><th>Profit</th><th>Bill Record</th></tr></thead><tbody>{sales.map((sale) => (<tr key={sale.id}><td>{new Date(sale.saleDate).toLocaleString()}</td><td className="fw-bold">{sale.productName}</td><td><span className="badge bg-secondary">{sale.category}</span></td><td className="text-success fw-bold">+ ₹{sale.soldPrice}</td><td>{sale.billImageUrl ? <span className="badge bg-primary">📄 Bill Uploaded</span> : <span className="text-muted small">-</span>}</td></tr>))}</tbody></table></div>)}
      {view === "suppliers" && (<div className="row"><div className={isAdmin ? "col-md-8" : "col-md-12"}><div className={cardClass}><div className="card-header fw-bold"><span>🚚 Supplier Directory</span></div><div className="card-body p-0"><table className={tableClass}><thead className="table-dark"><tr><th>Company</th><th>Category</th><th>Contact</th><th>Address</th><th>Action</th></tr></thead><tbody>{suppliers.map(sup => (<tr key={sup.id}><td className="fw-bold">{sup.name}</td><td>{sup.category}</td><td>{sup.contact}</td><td>{sup.address || "-"}</td><td>{canEdit && (<div className="d-flex gap-2"><button className="btn btn-sm btn-primary" onClick={() => startEditSupplier(sup)}>✏️</button><button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteSupplier(sup.id)}>🗑</button></div>)}</td></tr>))}</tbody></table></div></div></div>{isAdmin && <div className="col-md-4"><div className={cardClass + " p-3"}><h5>{editingSupplierId ? "Edit Supplier" : "Add Supplier"}</h5><form onSubmit={handleSupplierSubmit}><input className="form-control mb-2" placeholder="Company Name" value={supplierForm.name} onChange={e=>setSupplierForm({...supplierForm, name:e.target.value})} required/><input className="form-control mb-2" list="supCatOptions" placeholder="Select or Type Category" value={supplierForm.category} onChange={e=>setSupplierForm({...supplierForm, category:e.target.value})} required /><datalist id="supCatOptions">{uniqueCategories.map(c => <option key={c} value={c} />)}</datalist><div className="row mb-2"><div className="col"><input className="form-control" placeholder="Contact" value={supplierForm.contact} onChange={e=>setSupplierForm({...supplierForm, contact:e.target.value})} required/></div><div className="col"><input className="form-control" placeholder="Del. Days" value={supplierForm.deliveryDays} onChange={e=>setSupplierForm({...supplierForm, deliveryDays:e.target.value})} required/></div></div><textarea className="form-control mb-2" rows="2" placeholder="Address" value={supplierForm.address} onChange={e=>setSupplierForm({...supplierForm, address:e.target.value})}></textarea><textarea className="form-control mb-3" rows="2" placeholder="Notes..." value={supplierForm.notes} onChange={e=>setSupplierForm({...supplierForm, notes:e.target.value})}></textarea><button className={`btn w-100 ${editingSupplierId ? "btn-warning fw-bold" : "btn-primary"}`}>{editingSupplierId ? "Update Supplier" : "Save Supplier"}</button>{editingSupplierId && <button type="button" className="btn btn-sm btn-secondary w-100 mt-2" onClick={() => { setEditingSupplierId(null); setSupplierForm({ name: '', contact: '', category: '', deliveryDays: '', address: '', notes: '' }); }}>Cancel Edit</button>}</form></div></div>}</div>)}
      {view === "crm" && (<div className={cardClass}><div className="card-header fw-bold">👥 Customer Directory</div><div className="card-body p-0">{customers.length === 0 ? <div className="p-5 text-center text-muted">No customers yet.</div> : (<table className={tableClass}><thead className="table-dark"><tr><th>Customer</th><th>Mobile</th><th>Email</th><th>Last Purchase</th><th>Orders</th><th>Total Spent</th><th>Status</th><th>Action</th></tr></thead><tbody>{customers.map((cust, idx) => (<tr key={idx}><td className="fw-bold">{cust.name || "Guest"}</td><td>{cust.mobile}</td><td>{cust.email || "-"}</td><td>{new Date(cust.lastPurchase).toLocaleDateString()}</td><td><span className="badge bg-secondary">{cust.totalOrders || 0}</span></td><td className="fw-bold text-success">₹{(cust.totalSpent || 0).toLocaleString()}</td><td>{(cust.totalOrders || 0) > 3 ? <span className="badge bg-warning text-dark">⭐ Loyal</span> : <span className="badge bg-info">New</span>}</td><td><button className="btn btn-sm btn-primary" onClick={() => setViewCustomerDetails(cust)}>👁️ View</button></td></tr>))}</tbody></table>)}</div></div>)}
      {view === "users" && isAdmin && (<div className="row"><div className="col-md-8"><div className={cardClass}><div className="card-header fw-bold">👤 User Management</div><div className="card-body p-0"><table className={tableClass}><thead className="table-dark"><tr><th>Username</th><th>Role</th><th>Shop</th><th>Action</th></tr></thead><tbody>{usersList.map((u, idx) => (<tr key={idx}><td className="fw-bold">{u.username}</td><td><span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>{u.role.toUpperCase()}</span></td><td>{u.shopName || "-"}</td><td>{u.username !== currentUser && <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(u.username)}>🗑</button>}</td></tr>))}</tbody></table></div></div><div className={cardClass + " mt-4 p-3"}><h5 className="fw-bold">🏬 Shop Profile</h5><p><strong>Shop Name:</strong> {shopName}</p><p><strong>Admin:</strong> {currentUser}</p></div></div><div className="col-md-4"><div className={cardClass + " p-3"}><h5>Add New Staff</h5><form onSubmit={handleAddUser}><div className="mb-2"><label className="small">Username</label><input className="form-control" value={newUserForm.username} onChange={e=>setNewUserForm({...newUserForm, username:e.target.value})} required/></div><div className="mb-2"><label className="small">Password</label><input className="form-control" type="password" value={newUserForm.password} onChange={e=>setNewUserForm({...newUserForm, password:e.target.value})} required/></div><div className="mb-3"><label className="small">Role</label><select className="form-select" value={newUserForm.role} onChange={e=>setNewUserForm({...newUserForm, role:e.target.value})}><option value="staff">Staff / Cashier</option><option value="viewer">Viewer</option></select></div><button className="btn btn-primary w-100">Create User</button></form></div><div className={cardClass + " p-3 mt-3"}><div className="card-header fw-bold text-danger">📝 Audit Trail</div><div className="card-body p-0" style={{maxHeight:'300px',overflowY:'auto'}}><ul className="list-group list-group-flush small">{auditLog.slice(0, 10).map((log, idx) => (<li key={idx} className={`list-group-item ${darkMode ? "bg-secondary text-white" : ""}`}><span className="fw-bold">{log.action}</span> by {log.userRole}: {log.details}</li>))}</ul></div></div></div></div>)}
      {view === "audit" && isAdmin && (<div className={cardClass}><div className="card-header fw-bold text-danger">📝 Audit Trail</div><div className="card-body p-0" style={{maxHeight:'500px',overflowY:'auto'}}>{auditLog.length === 0 ? <div className="p-5 text-center text-muted">No activities recorded.</div> : (<table className={tableClass}><thead className="table-dark"><tr><th>Time</th><th>User</th><th>Action</th><th>Details</th></tr></thead><tbody>{auditLog.map((log, idx) => (<tr key={idx}><td className="small text-muted">{formatJavaDate(log.timestamp)}</td><td><span className="badge bg-dark">{log.userRole?.toUpperCase() || "SYSTEM"}</span></td><td className="fw-bold">{log.action}</td><td>{log.details}</td></tr>))}</tbody></table>)}</div></div>)}
    </div>
  );
}

export default App;