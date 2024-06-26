import { useContext, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import { useForm } from "react-hook-form";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import signUp from '../../assets/images/signUp.jpg';
import GoogleGithub from "./GoogleGithub";
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Helmet } from "react-helmet-async";

const MySwal = withReactContent(Swal)

const SignUp = () => {
    const { userSignUp, updateUserProfile, bannedUsers } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const [showPass, setShowPass] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        if (bannedUsers?.find(bannedUser => bannedUser.userEmail === data.email)) {
            MySwal.fire({
                title: <p className="text-3xl font-bold text-primary mb-4">User is banned</p>,
                icon: "error",
                confirmButtonText: "Okay",
                confirmButtonColor: 'black',
                customClass: {
                    popup: 'square',
                    confirmButton: 'square'
                }
            })
        }

        else {
            const { name, photoUrl = '', email, password } = data;

            userSignUp(email, password)
                .then(result => {
                    console.log(result);
                    updateUserProfile(name, photoUrl)
                        .then(result => {
                            console.log(result);
                            MySwal.fire({
                                title: '<p className="text-3xl font-bold mb-4">Welcome to Thread Frenzy</p>',
                                html: (
                                    '<div className="text-lg">' +
                                    '<p>Thank you for joining us! You\'re now part of the Thread Frenzy family. Enjoy shopping our exclusive collection of T-shirts!</p>' +
                                    '</div>'
                                ),
                                icon: 'success',
                                confirmButtonColor: 'black',
                                confirmButtonText: 'Start Shopping',
                                customClass: {
                                    popup: 'square',
                                    confirmButton: 'square'
                                }
                            })
                                .then(() => {
                                    navigate(location?.state ? location.state : "/");
                                });
                        })
                })
                .catch(error => {
                    console.log(error);
                    MySwal.fire({
                        title: <p className="text-3xl font-bold mb-4">Email Already Exists</p>,
                        icon: "error",
                        confirmButtonColor: 'red',
                        confirmButtonText: "Okay"
                    })
                })
        }
    }

    return (
        <>
            <Helmet>
                <title>Sign Up | Thread Frenzy</title>
            </Helmet>
            <div className="relative flex items-center h-screen bg-cover bg-center text-black" style={{ backgroundImage: `url(${signUp})` }} >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative bg-white bg-opacity-90 w-[450px] p-8 md:ml-10">
                    <form onSubmit={handleSubmit(onSubmit)} className=" space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold">Your name</span>
                            </label>
                            <input name="name" type="text" placeholder="Enter your name" className="bg-transparent input rounded-none border-b border-b-black focus:outline-none focus:border-0 focus:border-b focus:border-black" {...register("name", { required: true })} />
                            {errors.name && <span className="text-red-500">This field is required</span>}
                        </div>
                        {/* <div className="form-control">
                        <label className="label">
                            <span className="label-text font-bold">Photo URL</span>
                        </label>
                        <input name="photoUrl" type="text" placeholder="Enter your photo url" className="bg-transparent input rounded-none border-b border-b-black focus:outline-none focus:border-0 focus:border-b focus:border-black" {...register("photoUrl", { required: true })} />
                        {errors.photoUrl && <span className="text-red-500">This field is required</span>}
                    </div> */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold">Email address</span>
                            </label>
                            <input name="email" type="email" placeholder="Enter your email address" className="bg-transparent input rounded-none border-b border-b-black focus:outline-none focus:border-0 focus:border-b focus:border-black" {...register("email", { required: true })} />
                            {errors.email && <span className="text-red-500">This field is required</span>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold">Password</span>
                            </label>
                            <span className="flex relative">
                                <input name="password" type={showPass ? 'text' : 'password'} placeholder="Enter your password" className=" w-full bg-transparent input rounded-none border-b border-b-black focus:outline-none focus:border-0 focus:border-b focus:border-black" {...register("password", { required: true })} />
                                <span className="absolute top-1/3 right-3 cursor-pointer" onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                </span>
                            </span>
                            {errors.password && <span className="text-red-500">This field is required</span>}
                        </div>
                        <div className="form-control flex flex-row items-center">
                            <input name="checkbox" type="checkbox" id="termsAndConditions" className="mr-2" {...register("checkbox", { required: true })} />
                            <label htmlFor="termsAndConditions" className="cursor-pointer">
                                Accept Term & Conditions
                            </label>
                        </div>
                        {errors.checkbox && <span className="text-red-500">Accept our term & conditions to proceed</span>}
                        <div className="form-control mt-6">
                            <button className=" border border-black py-2 hover:bg-black hover:text-white transition duration-300 ease-in-out">Sign Up</button>
                        </div>
                    </form>
                    <GoogleGithub></GoogleGithub>
                    <p className="mt-3 text-center">Already Have An Account? <Link className="text-red-500" to={'/sign-in'}>Sign In</Link></p>
                </div>
            </div>
        </>
    );
};

export default SignUp;