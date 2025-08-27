import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNotifications } from '../../context/NotificationContext'

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [isResend, setIsResend] = useState(false)
    const [resending, setResending] = useState(false)
    const { notifyError } = useNotifications()
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        try {
            setResending(true)
            e.preventDefault();
            const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            const result = await response.json();
            if (response.ok) {
                setIsResend(true)
                setResending(false)
            } else {
                notifyError('Vui lòng nhập đúng email', result?.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
                setResending(false)
            }
        } catch (error) {
            console.error(error);
            setResending(false)
        }
    }

    const handleChangePassword = async (e) => {
        try {
            e.preventDefault();
            const response = await fetch('http://localhost:3000/api/auth/verify-forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ otp, password, email })
            });
            const result = await response.json();
            if (response.ok) {
                navigate('/login', { replace: true })
            } else {
                notifyError('Xác minh thất bại', result?.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {['🧸', '🚗', '🎨', '⚽', '🤖'].map((emoji, index) => (
                    <div
                        key={index}
                        className="absolute text-4xl opacity-20 animate-bounce"
                        style={{
                            top: `${15 + (index * 20)}%`,
                            left: `${5 + (index * 18)}%`,
                            animationDelay: `${index * 2}s`
                        }}
                    >
                        {emoji}
                    </div>
                ))}
            </div>
            <div className="w-full max-w-md relative z-10">
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center space-x-3 text-decoration-none mb-6">
                            <span className="text-4xl animate-bounce">🧸</span>
                            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                                Toy Sharing
                            </span>
                        </Link>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt lại mật khẩu</h1>
                    </div>

                    <form onSubmit={handleSubmit} >
                        <div className="flex items-center justify-between mb-4">
                            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="form-input focus:ring-red-100" />
                            <button type="submit" className="px-4 py-2 rounded-xl font-semibold text-white bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400" disabled={resending}>Gửi</button>
                        </div>
                        {isResend && (
                            <p className="text-green-600"> Resend code sent successfully. Please check your email.</p>
                        )}
                    </form>
                    <form onSubmit={handleChangePassword}>
                        <input type="text" placeholder="Mã OTP" onChange={(e) => setOtp(e.target.value)} className="form-input focus:ring-red-100 mb-4" />
                        <input type="password" placeholder="Mật khẩu mới" onChange={(e) => setPassword(e.target.value)} className="form-input focus:ring-red-100 mb-4" />
                        <button type="submit" className="px-4 py-2 rounded-xl font-semibold text-white bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400">Đổi mật khẩu</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
