import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { jwtDecode } from 'jwt-decode';

interface userType {
    email: string,
    password: string
}

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<userType>({
        email: '',
        password: ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
    }

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch('https://chat-backend-puxf.onrender.com/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userInfo)
            })

            const data = await response.json();
            setLoading(false);
            if (!data.success) {
                alert(data.message);
                return;
            }

            localStorage.setItem('token', data.token);
            const payload: any = jwtDecode(data.token);
            if (payload.profile == null) {
                navigate('/profile')
            } else {
                navigate('/chats');
            }
        } catch (err: any) {
            alert(err.message);
        }
    }

    return (
        <div className="bg-gray-100 flex items-center justify-center h-screen relative">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6">Login Your account </h2>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="text" id="email" name="email" onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative flex items-center">
                            <input type={isPasswordVisible ? 'text' : 'password'} id="password" name="password" onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150" />
                            <button type="button" className="absolute right-3 h-full flex items-center justify-center mt-1 cursor-pointer" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>{isPasswordVisible ? <Eye size={23} className="text-black opacity-85" /> : <EyeOff size={23} className="text-black opacity-85" />}</button>
                        </div>
                    </div>
                    <div>
                        <button type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Login
                        </button>
                    </div>
                    <div className=''>
                        <p className='my-2 text-center'>Don't have an account? <Link className='text-blue-400 underline' to={'/register'}>Register</Link></p>
                    </div>
                </form>
                {loading && (
                    <div className="w-full h-screen flex  flex-col gap-y-2  items-center justify-center absolute top-0 left-0 right-0 z-10 backdrop-blur-md">
                        <p>Loading...</p>
                        <p>Please wait because server is slow !</p>
                    </div>
                )
                }
            </div>
        </div>
    )
}

export default Login