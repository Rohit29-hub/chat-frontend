import { useRouteError } from 'react-router-dom'

const ErrorPage = () => {
    const error: any = useRouteError();
    return (
        <div className='w-full h-screen flex items-center justify-center flex-col gap-y-4'>
            <h1 className='text-3xl'>Oops!</h1>
            <p className='text-lg'>Sorry, an unexpected error has occurred.</p>
            <p className=''>
                <i className='text-sm underline'>{error.statusText || error.message}</i>
            </p>
        </div>
    )
}

export default ErrorPage