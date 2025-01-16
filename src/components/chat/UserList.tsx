import { useFriendStatus } from '../../context/friendStatusProvider';
import { userType } from '../../types/user';

type UserListProps = {
    onlineUsers: [string, userType][] | null;
    mySocketId: string;
    onUserSelect: (userId: string) => void;
}

const UserList = ({ onlineUsers, mySocketId, onUserSelect }: UserListProps) => {

    const { friendStatus: { isTyping, userId } } = useFriendStatus();

    if (!onlineUsers) {
        return (
            <div className="flex justify-center items-center p-4">
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div className='flex-1 w-full h-full bg-white shadow overflow-hidden px-3'>
            <h1 className='text-xl font-medium sticky top-0 bg-white py-3 border-b'>
                People
            </h1>
            <div className='overflow-y-auto w-full h-full'>
                {onlineUsers.map(([usersKey, userData]) => (
                    mySocketId !== usersKey && (
                        <div
                            key={usersKey}
                            className='flex w-full py-2 border-b items-center justify-between cursor-pointer hover:bg-gray-100'
                            onClick={() => onUserSelect(userData.user)}
                        >
                            <div className='w-full h-auto flex gap-x-2'>
                                <div className='w-11 h-11 relative'>
                                    <img
                                        className='w-full h-full object-contain rounded-full border-2 border-blue-500'
                                        src={userData.img}
                                        alt={userData.username}
                                    />
                                    <span
                                        className={`${userData.status === 'online' &&
                                            'absolute z-10 left-1 top-0 p-1.5 bg-green-400 rounded-full'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <h1 className='text-base font-medium'>
                                        {userData.username}
                                    </h1>
                                    <p className='text-sm'>
                                        {userId === userData.user && isTyping ? <span className='text-green-500'>typing...</span> : <span className='text-gray-500'>{userData.status}</span>}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                ))}

                {onlineUsers.length == 1 && <span className='text-red-500  text-center'>Try to login one more account in different browser for testing.</span>}
            </div>
        </div>
    );
};

export default UserList;