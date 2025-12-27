import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Public Pages
import Home from './pages/public/Home';
import Services from './pages/public/Services';
import ServiceDetail from './pages/public/ServiceDetail';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

// Auth Pages
import Login from './pages/auth/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import ProjectManagement from './pages/admin/ProjectManagement';
import TaskManagement from './pages/admin/TaskManagement';
import PaymentManagement from './pages/admin/PaymentManagement';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeTasks from './pages/employee/EmployeeTasks';
import EmployeeProfile from './pages/employee/EmployeeProfile';

// Components
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Scroll to top component
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, [pathname]);

    return null;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <div className="App">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/services/:slug" element={<ServiceDetail />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />

                        {/* Admin Routes */}
                        <Route
                            path="/admin/dashboard"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/employees"
                            element={
                                <AdminRoute>
                                    <EmployeeManagement />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/projects"
                            element={
                                <AdminRoute>
                                    <ProjectManagement />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/tasks"
                            element={
                                <AdminRoute>
                                    <TaskManagement />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/payments"
                            element={
                                <AdminRoute>
                                    <PaymentManagement />
                                </AdminRoute>
                            }
                        />

                        {/* Employee Routes */}
                        <Route
                            path="/employee/dashboard"
                            element={
                                <PrivateRoute>
                                    <EmployeeDashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/employee/tasks"
                            element={
                                <PrivateRoute>
                                    <EmployeeTasks />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/employee/profile"
                            element={
                                <PrivateRoute>
                                    <EmployeeProfile />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
