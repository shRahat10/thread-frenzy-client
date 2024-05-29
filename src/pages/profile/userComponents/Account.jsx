import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../redux/userSlice";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Account = ({ userByEmail }) => {
    const dispatch = useDispatch();
    const { updateUserProfile } = useContext(AuthContext);
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            address: '',
            email: '',
            phoneNumber: '',
        }
    });

    useEffect(() => {
        if (userByEmail) {
            reset({
                firstName: userByEmail.firstName || '',
                lastName: userByEmail.lastName || '',
                address: userByEmail.address || '',
                email: userByEmail.userEmail || '',
                phoneNumber: userByEmail.phoneNumber || '',
            });
        }
    }, [userByEmail, reset]);

    const onSubmit = async (data) => {
        console.log(data);
        if (userByEmail?._id) {
            await updateUserProfile(data.firstName, null);
            dispatch(updateUser({ id: userByEmail._id, userInfo: data }))
                .unwrap()
                .then(result => {
                    console.log(result);
                    toast.success('User information updated');
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Invalid user input');
                })
        }
    };

    return (
        <div className="mt-6 mr-6">
            <h1 className="h-40 w-full text-5xl font-semibold pl-10 pt-6 text-white bg-black flex gap-4 items-center">Account</h1>
            <div className=" pt-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex gap-6">
                        <div className="form-control relative w-full">
                            <input
                                id="firstName"
                                type="text"
                                className="border border-gray-400 h-12 pl-3 outline-none"
                                {...register("firstName", { required: true })}
                            />
                            <label htmlFor="firstName" className="absolute left-6 -top-2 text-gray-600 text-sm bg-white">First Name*</label>
                            {errors.firstName && <span className="text-red-500">This field is required</span>}
                        </div>
                        <div className="form-control relative w-full">
                            <input
                                id="lastName"
                                type="text"
                                className="border border-gray-400 h-12 pl-3 outline-none"
                                {...register("lastName", { required: true })}
                            />
                            <label htmlFor="lastName" className="absolute left-6 -top-2 text-gray-600 text-sm bg-white">Last Name*</label>
                            {errors.lastName && <span className="text-red-500">This field is required</span>}
                        </div>
                    </div>
                    <div className="form-control relative">
                        <input
                            id="address"
                            type="text"
                            className="border border-gray-400 h-12 pl-3 outline-none"
                            {...register("address", { required: true })}
                        />
                        <label htmlFor="address" className="absolute left-6 -top-2 text-gray-600 text-sm bg-white">Address*</label>
                        {errors.address && <span className="text-red-500">This field is required</span>}
                    </div>
                    <p className="text-xl">Contact Information</p>
                    <div className="flex gap-6">
                        <div className="form-control relative w-full">
                            <input
                                disabled
                                id="email"
                                type="email"
                                className="border border-gray-400 h-12 pl-3 outline-none"
                                {...register("email", { required: true })}
                            />
                            <label htmlFor="email" className="absolute left-6 -top-2 text-gray-600 text-sm bg-white">Email*</label>
                            {errors.email && <span className="text-red-500">This field is required</span>}
                        </div>
                        <div className="form-control relative w-full">
                            <input
                                id="phoneNumber"
                                type="number"
                                className="border border-gray-400 h-12 pl-3 outline-none"
                                {...register("phoneNumber", { required: true })}
                            />
                            <label htmlFor="phoneNumber" className="absolute left-6 -top-2 text-gray-600 text-sm bg-white">Phone Number*</label>
                            {errors.phoneNumber && <span className="text-red-500">This field is required</span>}
                        </div>
                    </div>
                    <div className="form-control mt-6">
                        <button type="submit" className="bg-black text-white text-lg font-semibold w-full h-12">Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Account;
