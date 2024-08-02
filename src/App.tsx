import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './modules/onboarding/login/Login';
import Register from './modules/onboarding/register/Register';
import { MessageCircleMore } from 'lucide-react';
import ChatHome from './modules/chats/ChatHome';
import ChatWithFriend from './modules/chats/ChatWithFriend';
import Profile from './modules/onboarding/profile/Profile';

function App() {
    return (
        <Routes>
            <Route path='/' element={<h1>Hello world</h1>} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/chats' element={<ChatHome />}>
                <Route index element={
                    <div className='flex justify-center items-center gap-y-2 rounded w-full h-full'>
                        <div className="w-auto h-auto flex flex-col items-center gap-y-3">
                            <MessageCircleMore size={100} />
                            <h1 className="text-2xl ">Yours Messages</h1>
                            <p className="text-gray-500">Send a message to start a chat.</p>
                            <button className="px-3 py-2 rounded-md bg-blue-400 text-white text-sm">Send message</button>
                        </div>
                    </div>
                }/>
                <Route path=':socketId' element={<ChatWithFriend />} />
            </Route>
        </Routes>
    );
}

export default App;
