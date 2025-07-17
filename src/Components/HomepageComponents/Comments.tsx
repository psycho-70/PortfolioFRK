
"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAppContext } from '@/Context/AppContext';
import { v4 as uuidv4 } from 'uuid';

// Type definitions
interface Comment {
  id: string;
  text: string;
  username: string;
  createdAt: string;
  likes: number;
  liked: boolean;
  likedBy?: string[];
}

interface ApiComment {
  id: string;
  name: string;
  comment?: string;
  message?: string;
  createdAt: string;
  likes?: number;
  likedBy?: string[];
}

interface ApiResponse {
  id: string;
  name: string;
  message?: string;
  comment?: string;
  createdAt: string;
  likes?: number;
  likedBy?: string[];
}

interface LikeResponse {
  likes: number;
  likedBy: string[];
}

interface AppContextType {
  darkMode: boolean;
}

const Comments: React.FC = () => {
  const { darkMode }: AppContextType = useAppContext();
  const [comment, setComment] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [visibleComments, setVisibleComments] = useState<number>(3);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userId] = useState<string>(() => {
    // Generate or retrieve a unique user ID
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('userId');
      if (storedId) return storedId;
      const newId = uuidv4();
      localStorage.setItem('userId', newId);
      return newId;
    }
    return uuidv4();
  });

  const API_URL: string = process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'https://backendproject-01.vercel.app';
  console.log('API_URL:', process.env.NEXT_PUBLIC_DEPLOYMENT_URL);

  const fetchComments = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/contacts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiComment[] = await response.json();
      
      // Handle the response data properly
      if (Array.isArray(data)) {
        setComments(data.map((c: ApiComment): Comment => ({
          id: c.id,
          text: c.comment || c.message || '',
          username: c.name,
          createdAt: c.createdAt,
          likes: c.likes || 0,
          liked: c.likedBy?.includes(userId) || false,
          likedBy: c.likedBy
        })));
      } else {
        setComments([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching comments:', err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [userId]);

  const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setComment(e.target.value);
  };

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(e.target.value.slice(0, 20));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (username.trim() === '' || comment.trim() === '') {
      setError('Please enter your name and comment.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username,
          email: `${username.replace(/\s+/g, '-').toLowerCase()}@comment.com`,
          message: comment,
          comment: comment
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit comment');
      }

      const newComment: ApiResponse = await response.json();
      
      // Add the new comment to the list
      setComments((prev: Comment[]) => [{
        id: newComment.id || Date.now().toString(),
        text: newComment.message || newComment.comment || '',
        username: newComment.name,
        createdAt: newComment.createdAt || new Date().toISOString(),
        likes: newComment.likes || 0,
        liked: false,
        likedBy: newComment.likedBy || []
      }, ...prev]);

      setComment('');
      setUsername('');
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error submitting comment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/contacts/${id}/like`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        // If like endpoint doesn't exist, just update locally
        setComments((prev: Comment[]) => prev.map((c: Comment) => 
          c.id === id 
            ? { ...c, likes: (c.likes || 0) + 1, liked: true }
            : c
        ));
        return;
      }

      const result: LikeResponse = await response.json();
      
      setComments((prev: Comment[]) => prev.map((c: Comment) => 
        c.id === id 
          ? { ...c, likes: result.likes, liked: true }
          : c
      ));
    } catch (err) {
      // If there's an error, still update locally
      setComments((prev: Comment[]) => prev.map((c: Comment) => 
        c.id === id 
          ? { ...c, likes: (c.likes || 0) + 1, liked: true }
          : c
      ));
      console.error('Error liking comment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = (): void => {
    setVisibleComments((prev: number) => prev + 3);
  };

  return (
    <div className={`transition-all duration-700 relative`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-20 w-72 h-72 rounded-full opacity-20 blur-3xl animate-pulse ${
          darkMode ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-400 to-purple-400'
        }`}></div>
        <div className={`absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse delay-1000 ${
          darkMode ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-pink-400 to-purple-400'
        }`}></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-16 pb-8">
        <div className="text-center mb-8">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Share Your Thoughts
            </span>
          </h1>
          <p className={`text-lg md:text-xl ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Join the conversation and let your voice be heard
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className={`h-1 w-32 rounded-full ${
            darkMode 
              ? 'bg-gradient-to-r from-purple-400 to-pink-400' 
              : 'bg-gradient-to-r from-blue-400 to-purple-400'
          }`}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pb-16">
        {/* Error Message */}
        {error && (
          <div className={`p-4 rounded-xl mb-6 ${
            darkMode 
              ? 'bg-red-900/30 border border-red-700 text-red-300' 
              : 'bg-red-100 border border-red-300 text-red-700'
          }`}>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Comment Form Section */}
          <div className={`p-8 rounded-3xl backdrop-blur-sm border transition-all duration-500 hover:scale-105 ${
            darkMode 
              ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-2xl shadow-purple-500/20' 
              : 'bg-gradient-to-br from-white/70 to-white/90 border-white/40 shadow-2xl shadow-blue-500/20'
          }`}>
            <div className="flex items-center mb-6">
              <div className={`p-3 rounded-full mr-4 ${
                darkMode 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500'
              }`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Join the Discussion
              </h2>
            </div>
            
            <p className={`mb-6 text-lg ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Share your thoughts and connect with our community
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label htmlFor="username" className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Your Name ✨
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={handleChangeUsername}
                  maxLength={20}
                  minLength={6}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 ${
                    darkMode 
                      ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:bg-gray-800/70' 
                      : 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:bg-white'
                  }`}
                  placeholder="Enter your amazing name..."
                  required
                />
                <div className="absolute right-3 top-9">
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {username.length}/20
                  </span>
                </div>
              </div>

              <div className="relative">
                <label htmlFor="comment" className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Your Comment 💭
                </label>
                <textarea
                  rows={4}
                  id="comment"
                  value={comment}
                  onChange={handleChangeComment}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 resize-none ${
                    darkMode 
                      ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:bg-gray-800/70' 
                      : 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:bg-white'
                  }`}
                  placeholder="Share your thoughts with the world..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                  darkMode 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg shadow-blue-500/30'
                } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Submitting...' : '🚀 Share Your Thoughts'}
              </button>
            </form>
          </div>

          {/* Comments Display Section */}
          <div className={`p-8 rounded-3xl backdrop-blur-sm border ${
            darkMode 
              ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-2xl shadow-blue-500/20' 
              : 'bg-gradient-to-br from-white/70 to-white/90 border-white/40 shadow-2xl shadow-purple-500/20'
          }`}>
            <div className="flex items-center mb-6">
              <div className={`p-3 rounded-full mr-4 ${
                darkMode 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1-2V10a2 2 0 011-2h8z" />
                </svg>
              </div>
              <h2 className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Community Voice ({comments.length})
              </h2>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {comments.slice(0, visibleComments).map((comment: Comment, index: number) => (
                <div
                  key={comment.id || index}
                  className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                    darkMode 
                      ? 'bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-600/50 hover:border-purple-400/50' 
                      : 'bg-gradient-to-r from-white/80 to-white/90 border-gray-200/50 hover:border-blue-400/50'
                  }`}
                >
                  <div className="flex items-start mb-4">
                    <div className="relative">
                      <Image
                        src='/avatar-man.gif'
                        width={48}
                        height={48}
                        alt={comment.username}
                        className="w-12 h-12 rounded-full border-2 border-purple-400 shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-bold text-lg ${
                          darkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {comment.username}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          darkMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Just now'}
                        </span>
                      </div>
                      <p className={`mt-2 text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString() : 'Now'}
                      </p>
                    </div>
                  </div>
                  
                  <p className={`mb-4 text-base leading-relaxed ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {comment.text}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike(comment.id)}
                        disabled={comment.liked || loading}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                          comment.liked 
                            ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white cursor-not-allowed' 
                            : darkMode 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 hover:text-white' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 hover:text-white'
                        } ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                        </svg>
                        <span className="font-medium">{comment.likes || 0}</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        darkMode ? 'bg-purple-400' : 'bg-blue-400'
                      }`}></div>
                      <div className={`w-2 h-2 rounded-full ${
                        darkMode ? 'bg-pink-400' : 'bg-purple-400'
                      }`}></div>
                      <div className={`w-2 h-2 rounded-full ${
                        darkMode ? 'bg-blue-400' : 'bg-pink-400'
                      }`}></div>
                    </div>
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className={`text-6xl mb-4 ${
                    darkMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    💭
                  </div>
                  <p className={`text-lg ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Be the first to share your thoughts!
                  </p>
                </div>
              )}

              {loading && comments.length === 0 && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
                  <p className={`text-lg ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Loading comments...
                  </p>
                </div>
              )}
            </div>
            
            {visibleComments < comments.length && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    darkMode 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30'
                  } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Loading...' : `🔄 Load More (${comments.length - visibleComments} remaining)`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${darkMode ? 'linear-gradient(to bottom, #8B5CF6, #EC4899)' : 'linear-gradient(to bottom, #3B82F6, #8B5CF6)'};
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? 'linear-gradient(to bottom, #7C3AED, #DB2777)' : 'linear-gradient(to bottom, #2563EB, #7C3AED)'};
        }
      `}</style>
    </div>
  );
};

export default Comments;