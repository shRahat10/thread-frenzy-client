import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPayment, setCurrentPage, updatePaymentItem } from "../../../redux/paymentSlice";
import { Helmet } from "react-helmet-async";
import DashboardPagination from "../DashboardPagination";

const ManageOrders = () => {
    const dispatch = useDispatch();
    const { payment, paymentStatus, paymentError, totalPages, currentPage, totalItems } = useSelector(state => state.payment);

    const handleStatus = async (item) => {
        const updatedStatus = item.status === 'pending' ? 'delivered' : 'pending';
        try {
            await dispatch(updatePaymentItem({ id: item._id, status: updatedStatus })).unwrap();
            dispatch(getPayment({ page: currentPage, limit: 10 }));
        } catch (error) {
            console.error("Failed to update payment status: ", error);
        }
    };

    const handlePageChange = (newPage) => {
        dispatch(setCurrentPage(newPage));
    }

    useEffect(() => {
        const filters = {
            page: currentPage,
            limit: 10,
        };
        dispatch(getPayment(filters));
    }, [dispatch, currentPage]);

    if (paymentStatus === 'failed') {
        return <div>Error: {paymentError}</div>;
    }

    return (
        <>
            <Helmet>
                <title>Manage Orders | Thread Frenzy</title>
            </Helmet>
            <div className="space-y-6 mr-2 md:mr-0">
                <h1 className="h-40 w-full text-5xl font-semibold pl-10 pt-6 text-white bg-black flex gap-4 items-center">Order Management</h1>

                {
                    paymentStatus === 'succeeded' && payment.length === 0
                        ? <p className=" mt-10 text-center">No data found</p>
                        : <> <div className="overflow-x-auto">
                            <table className="table">
                                <thead className="text-black dark:text-white font-bold pb-2">
                                    <tr className="border-b border-black dark:border-white">
                                        <th>Date</th>
                                        <th>Order ID</th>
                                        <th>Transaction ID</th>
                                        <th>Total Price</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payment?.map(item => (
                                        <tr key={item._id} className="py-2 border-b">
                                            <td>{item.date.split('T')[0]}</td>
                                            <td>{item._id}</td>
                                            <td>{item.transactionId}</td>
                                            <td>${parseFloat(item.price).toFixed(2)}</td>
                                            <td>
                                                <button disabled={item.status === 'delivered'} onClick={() => handleStatus(item)} className={item.status === 'pending' ? "text-orange-500" : "text-green-500"}>
                                                    {item.status}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                            <DashboardPagination totalItems={totalItems} currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                        </>
                }
            </div>
        </>
    );
};

export default ManageOrders;
