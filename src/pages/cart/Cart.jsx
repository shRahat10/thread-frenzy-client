import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../../provider/AuthProvider";
import { getCart, updateCartItem, deleteCartItem } from "../../redux/cartSlice";
import CartItem from "./CartItem";
import CheckOut from "./CheckOut";

const Cart = () => {
    const dispatch = useDispatch();
    const { user } = useContext(AuthContext);
    const { cartItems, cartStatus, cartError } = useSelector(state => state.cart);
    const [quantities, setQuantities] = useState({});
    const [filteredCart, setFilteredCart] = useState([]);
    const [isCheckingOut, setIsCheckingOut] = useState(() => JSON.parse(localStorage.getItem('isCheckingOut')) || false);


    const handleQuantity = (id, operation) => {
        setQuantities(prevQuantities => {
            const newQuantity = operation === "+" ? prevQuantities[id] + 1 : prevQuantities[id] - 1;
            const updatedQuantity = newQuantity < 1 ? 1 : newQuantity;

            dispatch(updateCartItem({ id, quantity: updatedQuantity }));

            return {
                ...prevQuantities,
                [id]: updatedQuantity
            };
        });
    };

    const handleDeleteCartItem = (id) => {
        dispatch(deleteCartItem(id))
            .unwrap()
            .then(() => {
                setFilteredCart(prevFilteredCart => prevFilteredCart.filter(item => item._id !== id));
            });
    };

    useEffect(() => {
        if (user?.email) {
            dispatch(getCart(user.email));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (cartItems) {
            setFilteredCart(cartItems);
            const initialQuantities = cartItems.reduce((acc, item) => {
                acc[item._id] = item.quantity;
                return acc;
            }, {});
            setQuantities(initialQuantities);
        }
    }, [cartItems, setFilteredCart, setQuantities]);


    const totalPrice = filteredCart.reduce((acc, item) => acc + item.price * (quantities[item._id] || 1), 0).toFixed(2);

    useEffect(() => {
        localStorage.setItem('isCheckingOut', JSON.stringify(isCheckingOut));
    }, [isCheckingOut]);

    if (cartStatus === 'loading') {
        return <div>Loading...</div>;
    }

    if (cartStatus === 'failed') {
        return <div>Error: {cartError}</div>;
    }



    return (
        <div className="px-[3%] grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
                {
                    !isCheckingOut
                        ? <CartItem filteredCart={filteredCart} handleDeleteCartItem={handleDeleteCartItem} quantities={quantities} handleQuantity={handleQuantity} />
                        : <CheckOut setIsCheckingOut={setIsCheckingOut} />

                }
            </div>
            <div className="lg:col-span-2 space-y-6">
                <h1 className="text-xl">Order Summary</h1>
                <div className="border-y border-gray-300 w-full space-y-3 py-6 px-2">
                    <div className="flex justify-between">
                        <p>Total</p>
                        <p>${totalPrice}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Shipping Fees</p>
                        {filteredCart.length > 0 ? <p>$14.99</p> : <p>$0.00</p>}
                    </div>
                </div>
                <div className="flex justify-between px-2 text-lg font-semibold">
                    <p>Subtotal</p>
                    {filteredCart.length > 0 ? <p>${(parseFloat(totalPrice) + 14.99).toFixed(2)}</p> : <p>$0.00</p>}
                </div>
                <div className="px-2">
                    {
                        isCheckingOut
                            ? <button className="bg-black text-white text-lg font-semibold w-full h-12" onClick={() => setIsCheckingOut(false)}>Back to Cart</button>
                            : <button className="bg-black text-white text-lg font-semibold w-full h-12" onClick={() => setIsCheckingOut(true)}>Checkout</button>
                    }

                </div>
            </div>
        </div>
    );
};

export default Cart;
