import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useNotifications } from '../../context/NotificationContext'
import { useLocation } from 'react-router-dom'

const VerifyPage = () => {
    const navigate = useNavigate()
    const { notifyError } = useNotifications()
    const [isResend, setIsResend] = useState(false)
    const [resending, setResending] = useState(false)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const [formData, setFormData] = useState({
        email: email,
        otp: ''
    })
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const handleSubmit = async (e) => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const result = await response.json()
            if (response.ok) {
                navigate('/login', { replace: true })
            } else {
                notifyError('Xác minh thất bại', result?.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
            }
        } catch (err) {
            notifyError('Lỗi xác minh', 'Có lỗi xảy ra. Vui lòng thử lại.')
        }
    }
    const handleResend = async (e) => {
        try {
            setResending(true)
            const response = await fetch('http://localhost:3000/api/auth/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const result = await response.json()
            if (response.ok) {
                setIsResend(true)
                setResending(false)
            } else {
                notifyError('Xác minh thất bại', result?.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
                setResending(false)
            }
        } catch (err) {
            notifyError('Lỗi xác minh', 'Có lỗi xảy ra. Vui lòng thử lại.')
            setResending(false)
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

                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Email</h1>
                        <p className="text-gray-600">
                            Please check your email for the verification code.
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <input type="text" placeholder="Enter verification code" name="otp" value={formData.otp} onChange={handleChange} />
                        <button
                            onClick={handleResend}
                            disabled={resending}
                            className="px-4 py-2 rounded-xl font-semibold text-white bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            {resending ? "Resending..." : "Resend"}
                        </button>
                    </div>
                    {isResend && (
                        <p className="text-green-600"> Resend code sent successfully</p>
                    )}
                    <button className="w-full bg-pink-500 text-white mt-4 px-6 py-4 rounded-xl font-semibold hover:bg-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSubmit}>Verify</button>
                    <p className="text-gray-600"><span className="text-red-500">*</span> Verification code will expire in 10 minutes.</p>
                </div>
            </div>
        </div>
    )
}

export default VerifyPage
