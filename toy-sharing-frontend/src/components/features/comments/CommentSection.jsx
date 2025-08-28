import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../../context/AuthContext'

const API = 'http://localhost:3000/api/comments'

const CommentSection = ({ toyId }) => {
    const { user } = useAuth()
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [newComment, setNewComment] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [editContent, setEditContent] = useState('')
    const [replyingTo, setReplyingTo] = useState(null)
    const [replyContent, setReplyContent] = useState('')

    const authHeaders = useMemo(() => ({
        'Content-Type': 'application/json',
        ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
    }), [])

    // So sánh chủ sở hữu comment an toàn
    const isOwnerComment = (cmtUser, me) => {
        const a = cmtUser?._id ? String(cmtUser._id) : null
        const b = me?._id ? String(me._id) : null
        console.log('Debug owner check:', { cmtUser, me, a, b, result: a && b && a === b })
        return a && b && a === b
    }

    const fetchComments = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API}/${toyId}`)
            const data = await res.json()
            if (data.success) {
                setComments(data.data.comments || [])
            }
        } catch (err) {
            console.error('Error fetching comments:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (toyId) fetchComments()
    }, [toyId])

    const handleSubmitComment = async (e) => {
        e.preventDefault()
        if (!newComment.trim() || !user) return
        setSubmitting(true)
        try {
            const res = await fetch(`${API}/${toyId}`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({ content: newComment.trim() }),
            })
            const data = await res.json()
            if (data.success) {
                setComments([data.data.comment, ...comments])
                setNewComment('')
            } else {
                alert(data.error?.message || 'Có lỗi xảy ra khi thêm bình luận')
            }
        } catch (err) {
            console.error('Error adding comment:', err)
            alert('Có lỗi xảy ra khi thêm bình luận')
        } finally {
            setSubmitting(false)
        }
    }

    const handleSubmitReply = async (parentCommentId) => {
        if (!replyContent.trim() || !user) return
        setSubmitting(true)
        try {
            const res = await fetch(`${API}/${toyId}`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({ 
                    content: replyContent.trim(),
                    parentCommentId 
                }),
            })
            const data = await res.json()
            if (data.success) {
                // Refresh comments to get updated replies
                fetchComments()
                setReplyingTo(null)
                setReplyContent('')
            } else {
                alert(data.error?.message || 'Có lỗi xảy ra khi trả lời bình luận')
            }
        } catch (err) {
            console.error('Error adding reply:', err)
            alert('Có lỗi xảy ra khi trả lời bình luận')
        } finally {
            setSubmitting(false)
        }
    }

    const handleEditComment = async (commentId) => {
        if (!editContent.trim()) return
        try {
            const res = await fetch(`${API}/${commentId}`, {
                method: 'PUT',
                headers: authHeaders,
                body: JSON.stringify({ content: editContent.trim() }),
            })
            const data = await res.json()
            if (data.success) {
                setComments(comments.map(c => c._id === commentId ? data.data.comment : c))
                setEditingId(null)
                setEditContent('')
            } else {
                alert(data.error?.message || 'Có lỗi xảy ra khi sửa bình luận')
            }
        } catch (err) {
            console.error('Error editing comment:', err)
            alert('Có lỗi xảy ra khi sửa bình luận')
        }
    }

    const handleDeleteComment = async (commentId) => {
        if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return
        try {
            const res = await fetch(`${API}/${commentId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            const data = await res.json()
            if (data.success) {
                setComments(comments.filter(c => c._id !== commentId))
            } else {
                alert(data.error?.message || 'Có lỗi xảy ra khi xóa bình luận')
            }
        } catch (err) {
            console.error('Error deleting comment:', err)
            alert('Có lỗi xảy ra khi xóa bình luận')
        }
    }

    const handleToggleLike = async (commentId) => {
        if (!user) return
        try {
            const res = await fetch(`${API}/${commentId}/like`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            const data = await res.json()
            if (data.success) {
                const updatedComment = data.data.comment
                
                // Cập nhật comment hoặc reply trong state
                setComments(comments.map(c => {
                    // Nếu là comment chính
                    if (c._id === commentId) {
                        return updatedComment
                    }
                    // Nếu là reply trong comment này
                    if (c.replies && c.replies.some(r => r._id === commentId)) {
                        return {
                            ...c,
                            replies: c.replies.map(r => 
                                r._id === commentId ? updatedComment : r
                            )
                        }
                    }
                    return c
                }))
            }
        } catch (err) {
            console.error('Error toggling like:', err)
        }
    }

    const startEdit = (comment) => {
        setEditingId(comment._id)
        setEditContent(comment.content)
    }
    const cancelEdit = () => { setEditingId(null); setEditContent('') }
    
    const startReply = (comment) => {
        setReplyingTo(comment._id)
        setReplyContent('')
    }
    const cancelReply = () => { setReplyingTo(null); setReplyContent('') }

    const formatDate = (s) => new Date(s).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    const getUserInitial = (u) => u?.profile?.firstName?.charAt(0) || 'U'
    const getUserName = (u) => `${u?.profile?.firstName || 'User'} ${u?.profile?.lastName || ''}`.trim()

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center py-8">
                    <div className="spinner mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải bình luận...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">💬 Bình luận ({comments.length})</h3>

            {/* Add comment */}
            {user ? (
                <form onSubmit={handleSubmitComment} className="mb-6">
                    <div className="flex space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                            {getUserInitial(user)}
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Viết bình luận của bạn..."
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                rows="3"
                                maxLength={500}
                            />
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-sm text-gray-500">{newComment.length}/500 ký tự</span>
                                <button type="submit" disabled={!newComment.trim() || submitting} className="btn btn-primary btn-sm">
                                    {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
                    <p className="text-gray-600">
                        <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">Đăng nhập</a> để viết bình luận
                    </p>
                </div>
            )}

            {/* List */}
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</div>
                ) : (
                    comments.map((comment) => {
                        const owner = isOwnerComment(comment.user, user)
                        const likedByMe = user && user._id && Array.isArray(comment.likes) && comment.likes.some(id => String(id) === String(user._id))
                        return (
                            <div key={comment._id} className="border-b border-gray-100 pb-4 last:border-b-0">
                                <div className="flex space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {getUserInitial(comment.user)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-medium text-gray-900">{getUserName(comment.user)}</span>
                                            <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                                            {comment.createdAt !== comment.updatedAt && <span className="text-xs text-gray-400">(đã sửa)</span>}
                                        </div>

                                        {editingId === comment._id ? (
                                            <div className="space-y-2">
                                                <textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    rows={2}
                                                    maxLength={500}
                                                />
                                                <div className="flex space-x-2">
                                                    <button onClick={() => handleEditComment(comment._id)} disabled={!editContent.trim()} className="btn btn-primary btn-xs">
                                                        Lưu
                                                    </button>
                                                    <button onClick={cancelEdit} className="btn btn-ghost btn-xs">Hủy</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-gray-700 mb-2 whitespace-pre-wrap">{comment.content}</p>
                                                <div className="flex items-center space-x-4">
                                                    <button
                                                        onClick={() => handleToggleLike(comment._id)}
                                                        disabled={!user}
                                                        className={`flex items-center space-x-1 text-sm ${likedByMe ? 'text-red-600 hover:text-red-700' : 'text-gray-500 hover:text-red-600'} ${!user ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                                        title={likedByMe ? 'Bỏ thích' : 'Thích'}
                                                    >
                                                        <span>❤️</span>
                                                        <span>{comment.likeCount ?? (Array.isArray(comment.likes) ? comment.likes.length : 0)}</span>
                                                    </button>

                                                    <button onClick={() => startReply(comment)} className="text-sm text-gray-500 hover:text-blue-600 cursor-pointer">
                                                        💬 Trả lời
                                                    </button>

                                                    {user && (
                                                        <>
                                                            <button onClick={() => { setEditingId(comment._id); setEditContent(comment.content) }} className="text-sm text-gray-500 hover:text-primary-600 cursor-pointer">
                                                                ✏️ Sửa
                                                            </button>
                                                            <button onClick={() => handleDeleteComment(comment._id)} className="text-sm text-gray-500 hover:text-red-600 cursor-pointer">
                                                                🗑️ Xóa
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {/* Reply Form */}
                                        {replyingTo === comment._id && user && (
                                            <div className="mt-3 ml-8">
                                                <div className="flex space-x-3">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                                        {getUserInitial(user)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <textarea
                                                            value={replyContent}
                                                            onChange={(e) => setReplyContent(e.target.value)}
                                                            placeholder={`Trả lời ${getUserName(comment.user)}...`}
                                                            className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                            rows="2"
                                                            maxLength={500}
                                                        />
                                                        <div className="flex justify-between items-center mt-2">
                                                            <span className="text-xs text-gray-500">{replyContent.length}/500 ký tự</span>
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handleSubmitReply(comment._id)}
                                                                    disabled={!replyContent.trim() || submitting}
                                                                    className="btn btn-primary btn-xs"
                                                                >
                                                                    {submitting ? 'Đang gửi...' : 'Trả lời'}
                                                                </button>
                                                                <button onClick={cancelReply} className="btn btn-ghost btn-xs">
                                                                    Hủy
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Replies */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="mt-4 ml-8 space-y-3">
                                                {comment.replies.map((reply) => {
                                                    const replyOwner = isOwnerComment(reply.user, user)
                                                    const replyLikedByMe = user && user._id && Array.isArray(reply.likes) && reply.likes.some(id => String(id) === String(user._id))
                                                    return (
                                                        <div key={reply._id} className="border-l-2 border-gray-200 pl-4">
                                                            <div className="flex space-x-3">
                                                                <div className="w-8 h-8 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                                                    {getUserInitial(reply.user)}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center space-x-2 mb-1">
                                                                        <span className="font-medium text-gray-900 text-sm">{getUserName(reply.user)}</span>
                                                                        <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                                                                        {reply.createdAt !== reply.updatedAt && <span className="text-xs text-gray-400">(đã sửa)</span>}
                                                                    </div>

                                                                    {editingId === reply._id ? (
                                                                        <div className="space-y-2">
                                                                            <textarea
                                                                                value={editContent}
                                                                                onChange={(e) => setEditContent(e.target.value)}
                                                                                className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                                rows={2}
                                                                                maxLength={500}
                                                                            />
                                                                            <div className="flex space-x-2">
                                                                                <button onClick={() => handleEditComment(reply._id)} disabled={!editContent.trim()} className="btn btn-primary btn-xs">
                                                                                    Lưu
                                                                                </button>
                                                                                <button onClick={cancelEdit} className="btn btn-ghost btn-xs">Hủy</button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <p className="text-gray-700 mb-2 whitespace-pre-wrap text-sm">{reply.content}</p>
                                                                            <div className="flex items-center space-x-3">
                                                                                <button
                                                                                    onClick={() => handleToggleLike(reply._id)}
                                                                                    disabled={!user}
                                                                                    className={`flex items-center space-x-1 text-xs ${replyLikedByMe ? 'text-red-600 hover:text-red-700' : 'text-gray-500 hover:text-red-600'} ${!user ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                                                                    title={replyLikedByMe ? 'Bỏ thích' : 'Thích'}
                                                                                >
                                                                                    <span>❤️</span>
                                                                                    <span>{reply.likeCount ?? (Array.isArray(reply.likes) ? reply.likes.length : 0)}</span>
                                                                                </button>

                                                                                {user && (
                                                                                    <>
                                                                                        <button onClick={() => { setEditingId(reply._id); setEditContent(reply.content) }} className="text-xs text-gray-500 hover:text-primary-600 cursor-pointer">
                                                                                            ✏️ Sửa
                                                                                        </button>
                                                                                        <button onClick={() => handleDeleteComment(reply._id)} className="text-xs text-gray-500 hover:text-red-600 cursor-pointer">
                                                                                            🗑️ Xóa
                                                                                        </button>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default CommentSection
