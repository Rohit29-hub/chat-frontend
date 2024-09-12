import { Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './modules/onboarding/login/Login';
import Register from './modules/onboarding/register/Register';
import ChatHome from './modules/chats/ChatHome';
import ChatWithFriend from './modules/chats/ChatWithFriend';
import Profile from './modules/onboarding/profile/Profile';
import ChatHomeMsg from './modules/chats/ChatHomeMsg';
import { SocketContextProvider } from './context/socketProvider';

function App() {
    return (
        <SocketContextProvider>
                <Routes>
                    <Route path='/' element={<div className='w-full h-screen flex flex-col gap-6 items-center justify-center'>
                        <h1 className='text-3xl'>Welcome to RohitChat</h1>
                        <div className='flex flex-row items-center gap-x-3'>
                            <Link to={'/login'} className='px-3 py-2 rounded-md bg-blue-400 text-white'>Login</Link>
                            <p>OR</p>
                            <Link to={'/register'} className='px-3 py-2 rounded-md bg-blue-400 text-white'>Register</Link>
                        </div>
                    </div>} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/chats' element={<ChatHome />}>
                        <Route index element={<ChatHomeMsg />} />
                        <Route path=':userId' element={<ChatWithFriend />} />
                    </Route>
                </Routes>
        </SocketContextProvider>
    );
}

export default App;
