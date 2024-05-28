import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Account from "./Account";
import { useContext } from "react";
import { AuthContext } from "../../../provider/AuthProvider";
import { useDispatch, useSelector } from "react-redux";
import { getUserByEmail } from "../../../redux/userSlice";


const User = () => {
    const dispatch = useDispatch();
    const { userByEmail, userByEmailstatus, userByEmailError } = useSelector(state => state.user);
    const { user } = useContext(AuthContext);
    const [isActive, setIsActive] = useState('account');


    useEffect(() => {
        if (user) {
            dispatch(getUserByEmail(user?.email))
        }
    }, [dispatch, userByEmailstatus, user])


    if (userByEmailstatus === 'loading') {
        return <div>Loading...</div>;
    }

    if (userByEmailstatus === 'failed') {
        return <div>Error: {userByEmailError}</div>;
    }

    return (
        <div className=" flex gap-6">
            <Sidebar userByEmail={userByEmail} isActive={isActive} setIsActive={setIsActive}></Sidebar>
            <div className=" w-[75%]">
                <Account userByEmail={userByEmail}></Account>
            </div>
        </div>
    );
};

export default User;