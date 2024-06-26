import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getItemById, updateItem } from "../../redux/dataSlice";
import { addToCart } from "../../redux/cartSlice";
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import ReactStars from "react-rating-stars-component";
import SimilarProducts from "./SimilarProducts";
import { AuthContext } from "../../provider/AuthProvider";
import { IoBookmarks, IoBookmarksOutline } from "react-icons/io5";
import { addToWishlist, deleteWishlistItem, getAllWishlist } from "../../redux/wishlistSlice";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Review from "./Review";
import { getAllReview } from "../../redux/reviewSlice";
import { Helmet } from "react-helmet-async";

const ProductDetails = () => {
    const { userByEmail, userByEmailError } = useContext(AuthContext);
    const { itemId } = useParams();
    const dispatch = useDispatch();
    const { selectedItem, singleProductStatus, error } = useSelector(state => state.data);
    const { allWishlistItems, allWishlistStatus, allWishlistError } = useSelector(state => state.wishlist);
    const { allReviewItems, allReviewStatus, allReviewError } = useSelector(state => state.review);

    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isShippingOpen, setIsShippingOpen] = useState(false);
    const [colorIndex, setColorIndex] = useState(0);
    const [productQuantity, setProductQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [wishlisted, setWishlisted] = useState();


    // Rating calculation
    const validRatings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    const roundToNearestValidRating = (value) => {
        return validRatings.reduce((prev, curr) => Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
    };
    const calculateAverageRating = (items) => {
        const totalRatings = items.reduce((sum, item) => sum + roundToNearestValidRating(item.rating), 0);
        const average = items.length ? totalRatings / items.length : 0;
        return roundToNearestValidRating(average);
    };
    const [overallRating, setOverallRating] = useState(calculateAverageRating(allReviewItems) || 0);

    useEffect(() => {
        setOverallRating(calculateAverageRating(allReviewItems));
    }, [allReviewItems]);

    const handleQuantity = (e) => {
        let newQuantity = e === "+" ? productQuantity + 1 : productQuantity - 1;
        newQuantity = newQuantity < 1 ? 1 : newQuantity;
        if (selectedItem && newQuantity > selectedItem.quantity[selectedItem.color[colorIndex]]) {
            newQuantity = selectedItem.quantity[selectedItem.color[colorIndex]];
        }
        setProductQuantity(newQuantity);
    };

    const handleAddCart = () => {
        if (!selectedItem) return;

        if (!selectedSize) {
            setErrorMessage('Please select a size.');
            return;
        }

        if (productQuantity < 1) {
            setErrorMessage('Quantity must be at least 1.');
            return;
        }

        const cartItem = {
            itemId: selectedItem._id,
            name: selectedItem.name,
            image: selectedItem.images[selectedItem.color[colorIndex]][0],
            price: selectedItem.price - (selectedItem.price * (selectedItem.discount / 100)),
            color: selectedItem.color[colorIndex],
            gender: selectedItem.gender,
            size: selectedSize,
            quantity: productQuantity,
            userEmail: userByEmail.userEmail,
            status: 'pending',
            transactionId: 'pending',
        };
        setErrorMessage('');

        dispatch(addToCart(cartItem))
            .unwrap()
            .then(() => {
                const updatedQuantity = selectedItem.quantity[selectedItem.color[colorIndex]] - productQuantity;
                const updatedProduct = {
                    ...selectedItem,
                    quantity: {
                        ...selectedItem.quantity,
                        [selectedItem.color[colorIndex]]: updatedQuantity,
                    },
                };

                dispatch(updateItem({ id: selectedItem._id, updatedProduct }))
                    .unwrap()
                    .then(() => {
                        dispatch(getItemById(selectedItem._id));
                    });

                toast.success('Product added to cart');
                setProductQuantity(1);
                setSelectedSize('');
            })
            .catch(() => {
                toast.error('Failed to add product');
            });
    };

    const handleWishlist = () => {
        const wishlistItem = {
            itemId: selectedItem._id,
            userId: userByEmail._id,
        };
        dispatch(addToWishlist(wishlistItem))
            .unwrap()
            .then(() => {
                toast.success('Product added to wishlist');
                dispatch(getAllWishlist(userByEmail._id));
            })
            .catch((error) => {
                console.error("Error adding item to wishlist: ", error);
                toast.error('Product is already in wishlist');
            });
    };

    const handleDeleteWishlistItem = (id) => {
        dispatch(deleteWishlistItem(id))
            .unwrap()
            .then(() => {
                toast.success('Product removed from wishlist');
                dispatch(getAllWishlist(userByEmail._id));
            })
            .catch((error) => {
                console.error("Error removing item from wishlist: ", error);
                toast.error('Error removing item from wishlist');
            });
    };

    useEffect(() => {
        setColorIndex(0);
        setProductQuantity(1);
        setSelectedSize('');
        dispatch(getItemById(itemId));
    }, [dispatch, itemId]);

    useEffect(() => {
        if (userByEmail && userByEmail._id) {
            dispatch(getAllWishlist(userByEmail._id));
        }
    }, [dispatch, userByEmail]);

    useEffect(() => {
        if (allWishlistItems && selectedItem) {
            const wishList = allWishlistItems.find(item => item.itemId._id === selectedItem._id);
            setWishlisted(wishList);
        }
    }, [allWishlistItems, selectedItem]);

    useEffect(() => {
        dispatch(getAllReview(itemId));
    }, [itemId, dispatch]);

    if (singleProductStatus === 'failed' || userByEmailError === 'failed' || allReviewStatus === 'failed' || allWishlistStatus === 'failed') {
        return <div>Error: {error} || {userByEmailError || allReviewError || allWishlistError}</div>;
    }

    return (
        <>
            <Helmet>
                <title>Product Details | Thread Frenzy</title>
            </Helmet>
            <div className="px-[3%] pt-16 pb-32">
                {selectedItem && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                            <div className="col-span-3 grid grid-cols-2 grid-rows-2 gap-2 h-fit">
                                {selectedItem.images[selectedItem.color[colorIndex]]?.map((item, index) => (
                                    <img key={index} src={item} alt="loading..." className="h-96 w-full object-cover object-top" />
                                ))}
                            </div>
                            <div className="col-span-2 space-y-6">
                                {selectedItem.quantity[selectedItem.color[colorIndex]] < 1 && (
                                    <p className="bg-black w-fit px-2 text-white">Stock Out</p>
                                )}

                                <div className="flex gap-12">
                                    <h1 className="text-2xl font-semibold">{selectedItem.name}</h1>
                                    {wishlisted
                                        ? <button onClick={() => handleDeleteWishlistItem(wishlisted._id)}><IoBookmarks size={30} /></button>
                                        : <button onClick={handleWishlist}><IoBookmarksOutline size={30} /></button>
                                    }
                                </div>
                                {allReviewItems.length === 0
                                    ? <p>No reviews yet</p>
                                    : <div>
                                        <ReactStars value={overallRating} isHalf={true} count={5} size={24} activeColor="#ffd700" edit={false} key={overallRating} />
                                    </div>
                                }

                                <div className="flex gap-4 items-center">
                                    <p className="text-xl text-green-500 font-semibold">
                                        ${(selectedItem.price - (selectedItem.price * (selectedItem.discount / 100))).toFixed(2)}
                                    </p>
                                    {selectedItem.discount !== 0 && (
                                        <>
                                            <p className="line-through text-red-500 text-lg">${(selectedItem.price).toFixed(2)}</p>
                                            <p className="text-sm text-gray-600 bg-red-200 px-2 py-1">{selectedItem.discount}% off</p>
                                        </>
                                    )}
                                </div>

                                <ul className="flex gap-3">Colors:
                                    {selectedItem.color?.map((item, index) => (
                                        <li key={index} onClick={() => setColorIndex(index)} className={`cursor-pointer ${index === colorIndex ? 'border-b-2 border-black' : ''}`}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <ul className="flex gap-3 items-center">Sizes:
                                    {selectedItem.size?.map((item, index) => (
                                        <button
                                            key={index}
                                            className={`border h-10 w-12 ${selectedSize === item ? 'bg-gray-300' : ''}`}
                                            onClick={() => setSelectedSize(item)}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </ul>
                                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                                <div>
                                    <p>Product Left: {selectedItem.quantity[selectedItem.color[colorIndex]]}</p>
                                </div>

                                <div className="flex items-center">
                                    <div className="flex items-center gap-4 w-1/2">
                                        <p onClick={() => handleQuantity("-")} className="w-[20px] h-[20px] lg:w-[35px] lg:h-[35px] rounded-full flex justify-center items-center text-xl cursor-pointer active:scale-95 duration-300 border"> - </p>
                                        <p className="px-5 py-1 font-semibold border ">{productQuantity}</p>
                                        <p onClick={() => handleQuantity("+")} className="w-[20px] h-[20px] lg:w-[35px] lg:h-[35px] rounded-full flex justify-center items-center text-xl cursor-pointer active:scale-95 duration-300 border"> + </p>
                                    </div>

                                    <button disabled={selectedItem.quantity[selectedItem.color[colorIndex]] < 1 || productQuantity > selectedItem.quantity[selectedItem.color[colorIndex]]} onClick={handleAddCart} className={`w-1/2 h-10 text-white ${selectedItem.quantity[selectedItem.color[colorIndex]] < 1 ? 'bg-gray-400' : 'bg-black'}`}>
                                        {selectedItem.quantity[selectedItem.color[colorIndex]] < 1 ? 'Out of Stock' : 'Add to Cart'}
                                    </button>
                                </div>
                                <div>
                                    <div className="collapse border-t border-gray-400 rounded-none">
                                        <input type="checkbox" className="peer" checked={isDetailsOpen} onChange={() => setIsDetailsOpen(!isDetailsOpen)} />
                                        <div className="collapse-title font-semibold flex items-center justify-between">
                                            Product Details {isDetailsOpen ? <FaAngleUp /> : <FaAngleDown />}
                                        </div>
                                        <div className="collapse-content">
                                            <ul className="flex flex-col list-disc pl-5">
                                                {selectedItem.details?.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="collapse border-y border-gray-400 rounded-none">
                                        <input type="checkbox" className="peer" checked={isShippingOpen} onChange={() => setIsShippingOpen(!isShippingOpen)} />
                                        <div className="collapse-title font-semibold flex items-center justify-between">
                                            Shipping and Returns {isShippingOpen ? <FaAngleUp /> : <FaAngleDown />}
                                        </div>
                                        <div className="collapse-content">
                                            <ul className="list-disc pl-5">
                                                <li>Returns accepted by mail and in store within 30 days of the shipment date. Items must be unworn and tags must be attached.</li>
                                                <li>$4.99 USD will be deducted from your refund for returns.</li>
                                                <li>Once a return is received, please allow 7-14 business days to process and 3-5 business days for the refund to be credited.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="w-full pt-4">{selectedItem.about_product}</p>
                    </>
                )}
                <SimilarProducts itemBrand={selectedItem?.brand} itemId={itemId} />
                <Review productId={itemId} user={userByEmail} />
            </div>
        </>
    );
};

export default ProductDetails;
