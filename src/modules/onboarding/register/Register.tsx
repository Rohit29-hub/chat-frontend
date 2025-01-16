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

      const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/user/add_user`, {
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
      navigate('/profile');
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <>
      <div className="min-h-screen max-sm:px-2 bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Signup</h2>
          <p className="text-center text-gray-600 mb-4">
            Please create your account to continue to chat!
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="mb-4">
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="fullname" name="fullname" onChange={handleInputChange}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" id="email" name="email" onChange={handleInputChange}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" id="password" name="password" onChange={handleInputChange}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
        {
          loading && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <p className="text-gray-700 font-semibold">Loading...</p>
              </div>
            </div>
          )
        }
      </div>
    </>
  )

}

export default Register;
