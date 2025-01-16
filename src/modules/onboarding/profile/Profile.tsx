import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAvatars } from '../../../utils/avatarImage'

type profileType = {
    username: string,
    img: string
    desc: string
}

const Profile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState<Array<string> | null>(null);
    const [selectedImg, setSelectedImg] = useState<string | null>(null);
    const imgRef = useRef<Array<HTMLImageElement | null>>([]);
    const [previous, setPrevious] = useState<number>(-1);

    const [userProfileInfo, setUserProfileInfo] = React.useState<profileType>({
        username: '',
        img: '',
        desc: ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserProfileInfo({ ...userProfileInfo, [e.target.name]: e.target.value })
    }

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            return navigate('/login');
        }

        try {
            setLoading(true);
            userProfileInfo['img'] = selectedImg != null ? selectedImg : '';
            const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/user/add_user_profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(userProfileInfo)
            })

            const data = await response.json()
            setLoading(false);
            if (data.success) {
                localStorage.setItem('token', data.token);
                navigate('/chats')
            } else {
                alert(data.message)
            }
        } catch (error: any) {
            alert(error.message)
        }
    }

    const handleImg = (index: number) => {
        if (previous != -1) {
            imgRef.current[previous]?.classList.remove('img_select_border');
            setPrevious(-1);
        }
        imgRef.current[index]?.classList.add('img_select_border')
        setPrevious(index);
        setSelectedImg(imgRef.current[index]?.src!);
    }

    useEffect(() => {
        const av = getAvatars();
        setAvatar(av);
    }, [])

    return (
        <div className="bg-gradient-to-br max-sm:px-2 from-blue-100 via-blue-300 to-blue-500bg-gray-100 flex items-center justify-center min-h-screen relative">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6">Profile </h2>
                <div className="grid grid-cols-3 gap-4">
                    {
                        avatar && avatar.slice(0, 6).map((avatar: any, index: number) => (
                            <img
                                key={index}
                                onClick={() => handleImg(index)}
                                ref={(ref) => imgRef.current[index] = ref}
                                className={`w-24 h-24 cursor-pointer `}
                                src={avatar}
                                alt={"Avatar " + index}
                            />
                        ))
                    }
                </div>
                <form className="mt-4" onSubmit={onSubmit}>
                    <div className="flex flex-col gap-y-3">
                        {/* Input fields */}
                        <div>
                            <input
                                type="text"
                                name='username'
                                placeholder='Enter your username'
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name='desc'
                                placeholder='Enter your description'
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <button type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Save Profile
                        </button>
                    </div>
                </form>
            </div>
            {loading && (
                <div className="w-full h-screen flex  flex-col gap-y-2  items-center justify-center absolute top-0 left-0 right-0 z-10 backdrop-blur-md">
                    <p>Loading...</p>
                </div>
            )
            }
        </div>

    )
}

export default Profile
