import { createBrowserRouter } from "react-router-dom";
import Root from "../pages/Root";
import Error from "../pages/Error";
import Home from "../pages/home/Home";
import Men from "../pages/products/Men";
import Women from "../pages/products/Women";
import ProductDetails from "../pages/products/ProductDetails";
import SignIn from "../pages/loginRegister/SignIn";
import SignUp from "../pages/loginRegister/SignUp";
import Cart from "../pages/cart/Cart";
import Dashboard from "../pages/profile/Dashboard";
import Profile from "../pages/profile/Profile";
import OrderHistory from "../pages/profile/userComponents/OrderHistory";
import Wishlist from "../pages/profile/userComponents/Wishlist";
import SalesOverview from "../pages/profile/adminComponents/SalesOverview";
import ManageProducts from "../pages/profile/adminComponents/ManageProducts";
import ManageOrders from "../pages/profile/adminComponents/ManageOrders";
import ManageUsers from "../pages/profile/adminComponents/ManageUsers";
import PrivateRouter from "./PrivateRouter";
import AdminRouter from "./AdminRouter";
import ContactUs from "../pages/ContactUs";
import Messages from "../pages/profile/adminComponents/Messages";


const Router = createBrowserRouter(
    [
        {
            path: '/',
            element: <Root></Root>,
            errorElement: <Error></Error>,
            children: [
                {
                    path: '/',
                    element: <Home></Home>
                },
                {
                    path: '/men',
                    element: <Men></Men>
                },
                {
                    path: '/women',
                    element: <Women></Women>
                },
                {
                    path: '/product-details/:itemId',
                    element: <PrivateRouter><ProductDetails></ProductDetails></PrivateRouter>
                },
                {
                    path: '/sign-in',
                    element: <SignIn></SignIn>
                },
                {
                    path: '/sign-up',
                    element: <SignUp></SignUp>
                },
                {
                    path: '/cart',
                    element: <PrivateRouter><Cart></Cart></PrivateRouter>
                },
                {
                    path: '/contact-us',
                    element: <ContactUs></ContactUs>
                },
            ],
        },
        {
            path: '/dashboard',
            element: <Dashboard></Dashboard>,
            errorElement: <Error></Error>,
            children: [
                {
                    path: '/dashboard/profile',
                    element: <PrivateRouter><Profile></Profile></PrivateRouter>
                },
                {
                    path: '/dashboard/wishlist',
                    element: <PrivateRouter><Wishlist></Wishlist></PrivateRouter>
                },
                {
                    path: '/dashboard/order-history',
                    element: <PrivateRouter><OrderHistory></OrderHistory></PrivateRouter>
                },
                {
                    path: '/dashboard/sales-overview',
                    element: <AdminRouter><SalesOverview></SalesOverview></AdminRouter>
                },
                {
                    path: '/dashboard/manage-products',
                    element: <AdminRouter><ManageProducts></ManageProducts></AdminRouter>
                },
                {
                    path: '/dashboard/manage-orders',
                    element: <AdminRouter><ManageOrders></ManageOrders></AdminRouter>
                },
                {
                    path: '/dashboard/manage-users',
                    element: <AdminRouter><ManageUsers></ManageUsers></AdminRouter>
                },
                {
                    path: '/dashboard/messages',
                    element: <AdminRouter><Messages></Messages></AdminRouter>
                },
            ]
        },
    ]
)

export default Router;
