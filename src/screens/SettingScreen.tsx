import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getData, updateData } from '../utils/action';
import moment from 'moment';

type UserData = {
    fullname: string;
    email: string;
    img: string;
    desc: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
};

const SettingScreen = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [myData, setMyData] = useState<UserData>({
        fullname: '',
        email: '',
        img: '',
        desc: '',
        username: '',
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const [isUpdated, setIsUpdated] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMyData((prev) => ({ ...prev, [name]: value }));
        setIsUpdated(true);
    };

    useEffect(() => {
        const getMyData = async () => {
            setLoading(true)
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            const data = await getData(token);

            setMyData({
                fullname: data.fullname || '',
                email: data.email || '',
                img: data.profile?.img || '',
                desc: data.profile?.desc || '',
                username: data.profile?.username || '',
                createdAt: data.createdAt || new Date().toISOString(),
                updatedAt: data.updatedAt || new Date().toISOString(),
            });
            setLoading(false)
        };
        getMyData();
    }, [userId, navigate]);

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            setLoading(true)
            const res = await updateData(token, userId!, { img: myData.img, desc: myData.desc, username: myData.username });
            if (res.success) {
                alert('Profile updated successfully');
                setIsUpdated(false);
                navigate('/chats');
            } else {
                alert(res.message);
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="p-2 w-full ">
                <form>
                    {/* Image Preview */}
                    <div className="mb-4 text-center">
                        <img
                            src={myData.img}
                            alt="Profile"
                            className="mx-auto rounded-full w-20 h-20 object-cover mb-4"
                        />
                        <div className="text-sm text-gray-600">
                            <p>{myData.fullname}</p>
                            <p>{myData.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="mb-4">
                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullname"
                                name="fullname"
                                value={myData.fullname}
                                disabled
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none bg-gray-100"
                            />
                        </div>

                        {/* Email Address */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={myData.email}
                                disabled
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none bg-gray-100"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Username */}
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={myData.username}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Profile Picture (URL) */}
                        <div className="mb-4">
                            <label htmlFor="img" className="block text-sm font-medium text-gray-700">
                                Profile Picture URL
                            </label>
                            <input
                                type="text"
                                id="img"
                                name="img"
                                value={myData.img}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="desc" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="desc"
                            name="desc"
                            value={myData.desc}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Account Created */}
                        <div className="mb-4">
                            <label htmlFor="created" className="block text-sm font-medium text-gray-700">
                                Account Created
                            </label>
                            <input
                                type="text"
                                id="created"
                                name="created"
                                value={moment(myData.createdAt).format('MMMM Do YYYY, h:mm:ss A')}
                                disabled
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none bg-gray-100"
                            />
                        </div>

                        {/* Last Updated */}
                        <div className="mb-6">
                            <label htmlFor="updated" className="block text-sm font-medium text-gray-700">
                                Last Updated
                            </label>
                            <input
                                type="text"
                                id="updated"
                                name="updated"
                                value={moment(myData.updatedAt).format('MMMM Do YYYY, h:mm:ss A')}
                                disabled
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none bg-gray-100"
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled={!isUpdated}
                        onClick={handleUpdate}
                        className={`w-full py-2 rounded-md text-white font-semibold ${isUpdated ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        Update
                    </button>
                </form>
            </div>

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <p className="text-gray-700 font-semibold">Loading...</p>
                    </div>
                </div>
            )}
        </div>

    );
};

export default SettingScreen;
