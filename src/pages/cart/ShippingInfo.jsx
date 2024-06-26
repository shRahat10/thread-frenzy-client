

const ShippingInfo = ({ shippingInfo, setShippingInfo, handlePayment, register, handleSubmit, errors }) => {

    const onSubmit = (data) => {
        setShippingInfo(data)
        handlePayment();
    };

    return (
        <div>
            <h1 className="text-3xl mb-10">Shipping Information</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control relative w-full">
                        <input name="firstName" defaultValue={shippingInfo?.firstName} type="text" className="border border-gray-400 bg-transparent h-12 pl-3 outline-none" {...register("firstName", { required: true })} />
                        <label className="absolute left-6 -top-2 text-gray-600 text-sm bg-white dark:bg-[#292929] dark:text-white">First Name*</label>
                        {errors.firstName && <span className="text-red-500">This field is required</span>}
                    </div>
                    <div className="form-control relative w-full">
                        <input name="lastName" defaultValue={shippingInfo?.lastName} type="text" className="border border-gray-400 bg-transparent h-12 pl-3 outline-none" {...register("lastName", { required: true })} />
                        <label className="absolute left-6 -top-2 text-gray-600 text-sm bg-white dark:bg-[#292929] dark:text-white">Last Name*</label>
                        {errors.lastName && <span className="text-red-500">This field is required</span>}
                    </div>
                </div>
                <div className="form-control relative">
                    <input name="address" defaultValue={shippingInfo?.address} type="text" className="border border-gray-400 bg-transparent h-12 pl-3 outline-none" {...register("address", { required: true })} />
                    <label className="absolute left-6 -top-2 text-gray-600 text-sm bg-white dark:bg-[#292929] dark:text-white">Address*</label>
                    {errors.address && <span className="text-red-500">This field is required</span>}
                </div>
                <p className="text-xl">Contact Information</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control relative w-full">
                        <input name="email" defaultValue={shippingInfo?.email} type="email" className="border border-gray-400 bg-transparent h-12 pl-3 outline-none" {...register("email", { required: true })} />
                        <label className="absolute left-6 -top-2 text-gray-600 text-sm bg-white dark:bg-[#292929] dark:text-white">Email*</label>
                        {errors.email && <span className="text-red-500">This field is required</span>}
                    </div>
                    <div className="form-control relative w-full">
                        <input name="phoneNumber" defaultValue={shippingInfo?.phoneNumber} type="number" className="border border-gray-400 bg-transparent h-12 pl-3 outline-none" {...register("phoneNumber", { required: true })} />
                        <label className="absolute left-6 -top-2 text-gray-600 text-sm bg-white dark:bg-[#292929] dark:text-white">Phone Number*</label>
                        {errors.phoneNumber && <span className="text-red-500">This field is required</span>}
                    </div>
                </div>
                <div className="form-control mt-6">
                    <button type="submit" className="bg-black text-white text-lg font-semibold w-full h-12">Continue to Payment</button>
                </div>
            </form>
        </div>
    );
};

export default ShippingInfo;