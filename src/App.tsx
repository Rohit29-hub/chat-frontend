import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './modules/onboarding/login/Login';
import Register from './modules/onboarding/register/Register';
import ChatWithFriend from './modules/chats/ChatWithFriend';
import Profile from './modules/onboarding/profile/Profile';
import ChatHomeMsg from './modules/chats/ChatHomeMsg';
import { SocketContextProvider } from './context/socketProvider';
import { FriendStatusProvider } from './context/friendStatusProvider';
import HomeScreen from './screens/HomeScreen';
import SettingScreen from './screens/SettingScreen';
import ChatScreen from './screens/ChatScreen';

function App() {
    return (
        <SocketContextProvider>
            <FriendStatusProvider>
                <Routes>
                    <Route path='/' element={<HomeScreen/>} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/chats' element={<ChatScreen />}>
                        <Route index element={<ChatHomeMsg />} />
                        <Route path=':userId' element={<ChatWithFriend />} />
                        <Route path='settings/:userId' element={<SettingScreen/>}/>
                    </Route>
                </Routes>
            </FriendStatusProvider>
        </SocketContextProvider>
    );
}

export default App;
