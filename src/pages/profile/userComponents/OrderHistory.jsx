import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserSpecificPayment, setUserSpecificCurrentPage } from "../../../redux/paymentSlice";
import { AuthContext } from "../../../provider/AuthProvider";
import { Helmet } from "react-helmet-async";
import DashboardPagination from "../DashboardPagination";

const OrderHistory = () => {
    const { userByEmail, userByEmailStatus, userByEmailError } = useContext(AuthContext);
    const dispatch = useDispatch();
    const { userSpecificPayment, paymentStatus, paymentError, totalUserSpecificPages, UserSpecificCurrentPage, totalUserSpecificItems } = useSelector(state => state.payment);

    const handlePageChange = (newPage) => {
        dispatch(setUserSpecificCurrentPage(newPage));
    }

    useEffect(() => {
        if (userByEmailStatus === 'succeeded') {
            const filters = {
                page: UserSpecificCurrentPage,
                limit: 10,
            };

            dispatch(getUserSpecificPayment({ email: userByEmail.userEmail, filters }));
        }
    }, [dispatch, userByEmailStatus, userByEmail, UserSpecificCurrentPage]);

    if (paymentStatus === 'failed' || userByEmailStatus === 'failed') {
        return <div>Error: {paymentError || userByEmailError}</div>;
    }

    return (
        <>
            <Helmet>
                <title>Order History | Thread Frenzy</title>
            </Helmet>
            <div className="mr-2 md:mr-0">
                <h1 className="h-40 w-full text-5xl font-semibold pl-10 pt-6 text-white bg-black flex gap-4 items-center">Order History</h1>

                {
                    paymentStatus === 'succeeded' && userSpecificPayment.length === 0
                        ? <p className=" mt-10">No data found </p>
                        : <> <div className="overflow-x-auto pt-10">
                            <table className="table">
                                <thead className="text-black dark:text-white font-bold pb-2">
                                    <tr className="border-b border-black dark:border-white">
                                        <th>Date</th>
                                        <th>Product</th>
                                        <th>Color</th>
                                        <th>Size</th>
                                        <th>Quantity</th>
                                        <th>Total Price</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userSpecificPayment?.map(item => (
                                        <tr key={item._id} className="border-b border-gray-400">
                                            <td>{item.date.split('T')[0]}</td>
                                            <td>
                                                {item.orderedItems.map(orderedItem => (
                                                    <div key={orderedItem._id}>
                                                        <Link to={`/product-details/${orderedItem.itemId}`} className="hover:underline">
                                                            {orderedItem.name}
                                                        </Link>
                                                    </div>
                                                ))}
                                            </td>
                                            <td>
                                                {item.orderedItems.map(orderedItem => (
                                                    <div key={orderedItem._id}>
                                                        {orderedItem.color}
                                                    </div>
                                                ))}
                                            </td>
                                            <td>
                                                {item.orderedItems.map(orderedItem => (
                                                    <div key={orderedItem._id}>
                                                        {orderedItem.size}
                                                    </div>
                                                ))}
                                            </td>
                                            <td>
                                                {item.orderedItems.map(orderedItem => (
                                                    <div key={orderedItem._id}>
                                                        {orderedItem.quantity}
                                                    </div>
                                                ))}
                                            </td>
                                            <td>${parseFloat(item.price).toFixed(2)}</td>
                                            <td className={item.status === 'pending' ? "text-orange-500" : "text-green-500"}>{item.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                            <DashboardPagination totalItems={totalUserSpecificItems} currentPage={UserSpecificCurrentPage} totalPages={totalUserSpecificPages} handlePageChange={handlePageChange} />
                        </>
                }
            </div>
        </>
    );
};

export default OrderHistory;
