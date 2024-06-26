import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const MySwal = withReactContent(Swal)


const GoogleGithub = () => {
    const { googleSignIn, githubSignIn, userDatabaseEntry, bannedUsers, userSignOut } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(result => {
                console.log(result);

                if (bannedUsers?.find(bannedUser => bannedUser.userEmail === result.user.email)) {
                    userSignOut();

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
                    toast.success('Successfully logged in');
                    userDatabaseEntry(result.user.displayName, result.user.email, result.user.photoURL);
                    navigate(location?.state ? location.state : "/");
                }
            })
            .catch(error => {
                console.log(error);
                toast.error('Login failed');
            })
    }

    const handleGithubSignIn = () => {
        githubSignIn()
            .then(result => {
                console.log(result);
                userDatabaseEntry(result.user.displayName, result.user.email, result.user.photoURL);
                navigate(location?.state ? location.state : "/");
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <div className=" m-6 space-y-4">
            <p className=" text-center">Or Sign In Using</p>
            <span className="flex justify-center items-center gap-2">
                <button onClick={handleGoogleSignIn}><FcGoogle size={45} /></button>
                <button onClick={handleGithubSignIn}><FaGithub size={40} /></button>
            </span>
        </div>
    );
};

export default GoogleGithub;