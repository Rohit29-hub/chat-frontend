import { userType } from "../../types/user";
import { LogOut, SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

type NavbarProps = {
    userData: userType;
    onLogout: () => void;
}

const Navbar = ({ userData, onLogout }: NavbarProps) => {
    return (
        <div className='w-24 h-screen border shadow md:rounded-2xl bg-[#6E00FF]'>
            <div className='w-full h-full py-3 flex items-center justify-between flex-col'>
                <img
                    className='w-12 h-12 rounded-full border-2 border-[#5322BC]'
                    src={userData.img}
                    alt={userData.username}
                />
                <div className='flex-1 w-full flex flex-col gap-y-16 pt-10 items-center'>
                    <Link to={`/chats/settings/${userData.user}`}>
                        <SettingsIcon size={30} color='white' />
                    </Link>
                </div>
                <div className="cursor-pointer" onClick={onLogout}>
                    <LogOut size={30} color='white' />
                </div>
            </div>
        </div>
    );
};

export default Navbar