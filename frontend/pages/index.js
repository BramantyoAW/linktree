import { useState } from 'react'
import { useRouter } from 'next/router'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const res = await fetch ('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

             const data = await res.json()

            if(!res.ok) {
                setError(data.error || 'Login failed')
                return
            }

            localStorage.setItem('token', data.token)
            router.push('/dashboard')
        } catch (err) {
            setError('something went wrong.')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-10 rounded-lg shadow-md w-96"
            >
                <h2 className = "text-2xl font-bold mb4 text-center">Login</h2>
                {error && <p className='text-red-500 mb-2'>{error}</p>}

                <input
                    type='email'
                    placeholder='Email'
                    className='w-full px-3 py-2 mb-3 border rounded'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
             
                <input
                    type='password'
                    placeholder='Password'
                    className='w-full px-3 py-2 mb-3 border rounded'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded'
                >
                    Login
                </button>


            </form>
        </div>
    )
}