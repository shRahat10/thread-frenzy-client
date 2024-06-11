import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserSpecificPayment } from "../../../redux/paymentSlice";
import { AuthContext } from "../../../provider/AuthProvider";
import { getUserByEmail } from "../../../redux/userSlice";

const OrderHistory = () => {
    const { user } = useContext(AuthContext);
    const dispatch = useDispatch();
    const { userByEmail, userByEmailStatus, userByEmailError } = useSelector(state => state.user);
    const { userSpecificPayment, paymentStatus, paymentError } = useSelector(state => state.payment);

    useEffect(() => {
        if (user) {
            dispatch(getUserByEmail(user?.email))
        }
    }, [dispatch, user])

    useEffect(() => {
        if (userByEmailStatus ==='succeeded') {
            dispatch(getUserSpecificPayment(userByEmail.userEmail));
        }
    }, [dispatch, userByEmailStatus, paymentStatus, userByEmail]);

    if (paymentStatus === 'failed' || userByEmailStatus === 'failed') {
        return <div>Error: {paymentError || userByEmailError}</div>;
    }

    return (
        <div>
            <h1 className="h-40 w-full text-5xl font-semibold pl-10 pt-6 text-white bg-black flex gap-4 items-center">Order History</h1>
            <div className=" pt-10 grid grid-cols-8 gap-2 border-y border-gray-600 font-bold pb-2">
                <div>Date</div>
                <div className=" col-span-2">Product</div>
                <div className=" text-center">Color</div>
                <div className=" text-center">Size</div>
                <div className=" text-center">Quantity</div>
                <div className=" text-center">Total Price</div>
                <div className=" text-center">Status</div>
            </div>
            {
                userSpecificPayment?.map(item => (
                    <div key={item._id} className=" grid grid-cols-8 gap-2 border-b border-gray-600">
                        <div className=" py-3 text-sm">{item.date.split('T')[0]}</div>
                        <div className=" col-span-5">
                            {
                                item.orderedItems.map((orderedItem, idx) => (
                                    <div key={idx} className="grid grid-cols-5 gap-2 py-2">
                                        <Link className=" col-span-2" to={`/product-details/${orderedItem.itemId}`}>{orderedItem.name}</Link>
                                        <div className=" text-center">{orderedItem.color}</div>
                                        <div className=" text-center">{orderedItem.size}</div>
                                        <div className=" text-center">{orderedItem.quantity}</div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className=" py-2 text-center">{item.price}</div>
                        <div className={item.status === 'pending' ? " py-2 text-center text-orange-500" : " py-2 text-center text-green-500"}>{item.status}</div>
                    </div>
                ))
            }
        </div>
    );
};

export default OrderHistory;
