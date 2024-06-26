import { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { allData, deleteItem, setCurrentPage } from "../../../redux/dataSlice";
import { MdOutlineDeleteForever } from "react-icons/md";
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import AddProductForm from "./AddProductForm";
import Select from 'react-select';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { FaEdit } from 'react-icons/fa';
import DashboardPagination from '../DashboardPagination';
import { AuthContext } from '../../../provider/AuthProvider';

const MySwal = withReactContent(Swal);

const ManageProducts = () => {
    const { buttonDisabled } = useContext(AuthContext);
    const dispatch = useDispatch();
    const { data, allDataStatus, error, totalPages, currentPage, totalItems } = useSelector(state => state.data);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [priceOrder, setPriceOrder] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);
    const [selectedBrands, setSelectedBrands] = useState([]);

    const openModal = (mode, product = null) => {
        setModalMode(mode);
        setSelectedProduct(product);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    }

    const handleDeleteItem = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                popup: 'square',
                confirmButton: 'square',
                cancelButton: 'square',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteItem(id))
                    .unwrap()
                    .then(() => {
                        dispatch(allData())
                        return MySwal.fire({
                            title: 'Product Deleted',
                            icon: 'success',
                            confirmButtonColor: 'black',
                            customClass: {
                                popup: 'square',
                                confirmButton: 'square'
                            }
                        });
                    })
                    .catch(error => {
                        console.error('Delete operation failed:', error);
                        MySwal.fire({
                            title: 'Error!',
                            text: 'Failed to delete the product. Please try again.',
                            icon: 'error',
                            confirmButtonColor: 'black',
                            customClass: {
                                popup: 'square',
                                confirmButton: 'square'
                            }
                        });
                    });
            }
        })
    }

    const handlePageChange = (newPage) => {
        dispatch(setCurrentPage(newPage));
    }

    useEffect(() => {
        const filters = {
            ...(priceOrder && { sort: priceOrder.value }),
            ...(selectedGender && { gender: selectedGender.value }),
            ...(selectedBrands.length > 0 && { brand: selectedBrands.map(b => b.value).join(',') }),
            page: currentPage,
            limit: 6
        };

        dispatch(allData(filters))
    }, [dispatch, priceOrder, selectedGender, selectedBrands, currentPage]);


    if (allDataStatus === 'failed') {
        return <div>Error: {error}</div>;
    }

    const priceOptions = [
        { value: 'asc', label: 'Low to High' },
        { value: 'desc', label: 'High to Low' }
    ];

    const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' }
    ];

    const brandOptions = [
        { value: 'Calvin Klein', label: 'Calvin Klein' },
        { value: 'Everlane', label: 'Everlane' },
        { value: 'Adidas', label: 'Adidas' },
        { value: 'Levis', label: 'Levis' },
        { value: 'Nike', label: 'Nike' },
        { value: 'Buck Mason', label: 'Buck Mason' },
        { value: 'Allen Solly', label: 'Allen Solly' },
        { value: 'Lacoste', label: 'Lacoste' },
    ];


    return (
        <>
            <Helmet>
                <title>Manage Products | Thread Frenzy</title>
            </Helmet>
            <div className="space-y-6 mr-2 md:mr-0">
                <h1 className="h-40 w-full text-4xl md:text-5xl font-semibold pl-10 pt-6 text-white bg-black flex gap-4 items-center">Product Management</h1>

                <button onClick={() => openModal('add')} className="border border-black dark:border-white font-semibold p-2 w-full">Add Product</button>

                <div className=' grid grid-cols-2 gap-6'>
                    <div>
                        <label className="mr-2">Sort by Price:</label>
                        <Select
                            className='text-black'
                            value={priceOrder}
                            onChange={setPriceOrder}
                            options={priceOptions}
                            isClearable
                            styles={{
                                control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderRadius: '0px',
                                }),
                            }}
                        />
                    </div>
                    <div>
                        <label className="mr-2">Filter by Gender:</label>
                        <Select
                            className='text-black'
                            value={selectedGender}
                            onChange={setSelectedGender}
                            options={genderOptions}
                            isClearable
                            styles={{
                                control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderRadius: '0px',
                                }),
                            }}
                        />
                    </div>
                </div>
                <div>
                    <label className="mr-2">Filter by Brands:</label>
                    <Select
                        className='text-black'
                        isMulti
                        value={selectedBrands}
                        onChange={setSelectedBrands}
                        options={brandOptions}
                        isClearable
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderRadius: '0px',
                            }),
                        }}
                    />
                </div>

                <p className=" text-3xl text-center bg-black text-white font-bold py-3">Products</p>

                {
                    allDataStatus === 'succeeded' && data.length === 0
                        ? <p className=" mt-10 text-center">No data found </p>
                        : <>
                            <div className=" overflow-x-auto">
                                <table className="table">
                                    <thead className="text-black dark:text-white font-bold pb-2">
                                        <tr className="border-b border-black dark:border-white">
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Brand</th>
                                            <th>Price</th>
                                            <th>Discount</th>
                                            <th>Color</th>
                                            <th>Gender</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.map((item, idx) => (
                                            <tr key={idx} className="border-b border-gray-400">
                                                <td className="w-24"><img className="w-full h-28 object-cover object-top" src={item.images[Object.keys(item.images)[0]][0]} alt="" /></td>
                                                <td><Link to={`/product-details/${item._id}`} className=' hover:underline'>{item.name}</Link></td>
                                                <td>{item.brand}</td>
                                                <td>${(item.price).toFixed(2)}</td>
                                                <td>{item.discount}%</td>
                                                <td>
                                                    {item.color.map((color, index) => (
                                                        <div key={index}>
                                                            {color} <span className=' text-[0.6rem]'>[{item.quantity[color]}]</span>
                                                            {index !== item.color.length - 1 ? ', ' : ''}
                                                        </div>
                                                    ))}
                                                </td>
                                                <td>{item.gender}</td>
                                                {
                                                    buttonDisabled
                                                        ? <td><FaEdit size={20} className="hover:cursor-pointer" /></td>
                                                        : <td><FaEdit size={20} onClick={() => openModal('update', item)} className="hover:cursor-pointer" /></td>
                                                }
                                                {
                                                    buttonDisabled
                                                        ? <td><MdOutlineDeleteForever className="text-red-500 hover:cursor-pointer" size={25} /></td>
                                                        : <td><MdOutlineDeleteForever onClick={() => handleDeleteItem(item._id)} className="text-red-500 hover:cursor-pointer" size={25} /></td>
                                                }
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <DashboardPagination totalItems={totalItems} currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                        </>
                }

                <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Add Product Modal" ariaHideApp={false} >
                    <AddProductForm
                        closeModal={closeModal}
                        allData={allData}
                        initialData={selectedProduct}
                        isUpdate={modalMode === 'update'}
                    />
                </Modal>
            </div>
        </>
    );
};

export default ManageProducts;
