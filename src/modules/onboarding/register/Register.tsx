import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type userInfo = {
  fullname: string,
  email: string,
  password: string
}

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<userInfo>({
    fullname: '',
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
      if (userInfo.fullname == '' || userInfo.email == '' || userInfo.password == '') {
        setLoading(false);
        alert('Please fill all the fields');
        return;
      }

      const response = await fetch(`https://chat-backend-puxf.onrender.com/api/user/add_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
      alert('Registration Successful');
      navigate('/profile');
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center h-screen relative">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6">Signup Form</h2>
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="fullname" name="fullname" onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" id="email" name="email" onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150" />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" id="password" name="password" onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150" />
            </div>
            <div>
              <button type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Sign Up
              </button>
            </div>
            <div className=''>
              <p className='my-2 text-center'>Already have an account ? <Link className='text-blue-400 underline' to={'/login'}>Login</Link></p>
            </div>
          </form>
        </div>
        {loading && (
          <div className="w-full h-screen flex  flex-col gap-y-2  items-center justify-center absolute top-0 left-0 right-0 z-10 backdrop-blur-md">
            <p>Loading...</p>
            <p>Please wait because server is slow !</p>
          </div>
        )
        }
      </div>
    </>
  )

}

export default Register;
