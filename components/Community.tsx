
import React from 'react';
import { Post } from '../types';
import { MessageSquare, ThumbsUp, BadgeCheck, Search, PenSquare } from 'lucide-react';

const Community: React.FC = () => {
    const posts: Post[] = [
        {
            id: '1',
            author: 'Sarah J.',
            avatar: 'SJ',
            content: 'Can someone explain the difference between AC and DC current simply? I keep getting confused about the flow direction.',
            tags: ['Physics', 'Electricity'],
            likes: 24,
            comments: 5,
            isAiVerified: true,
            timestamp: '2h ago'
        },
        {
            id: '2',
            author: 'Mike Chen',
            avatar: 'MC',
            content: 'Just finished the Python Level 3 challenge! Here is a tip: make sure you check your indentation in the loop.',
            tags: ['Coding', 'Python', 'Tips'],
            likes: 12,
            comments: 1,
            timestamp: '5h ago'
        }
    ];

    return (
        <div className="h-full flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Student Community</h2>
                    <p className="text-sm text-slate-500">Ask questions, share tips, grow together.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Search discussions..." className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <button className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-700 transition-colors">
                        <PenSquare className="w-4 h-4" /> Post
                    </button>
                </div>
            </div>

            {/* Feed */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-3xl mx-auto space-y-4">
                    {posts.map(post => (
                        <div key={post.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transform transition-all duration-300 hover:scale-[1.02]">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                        {post.avatar}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-sm">{post.author}</h3>
                                        <span className="text-xs text-slate-400">{post.timestamp}</span>
                                    </div>
                                </div>
                                {post.isAiVerified && (
                                    <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold border border-green-100" title="Answer verified by AI">
                                        <BadgeCheck className="w-3 h-3" /> AI Verified
                                    </span>
                                )}
                            </div>
                            
                            <p className="text-slate-700 mb-4 leading-relaxed">
                                {post.content}
                            </p>

                            <div className="flex items-center gap-2 mb-4">
                                {post.tags.map(tag => (
                                    <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">#{tag}</span>
                                ))}
                            </div>

                            <div className="flex items-center gap-6 border-t border-slate-50 pt-4 text-slate-500 text-sm font-medium">
                                <button className="flex items-center gap-2 hover:text-brand-600 transition-colors">
                                    <ThumbsUp className="w-4 h-4" /> {post.likes}
                                </button>
                                <button className="flex items-center gap-2 hover:text-brand-600 transition-colors">
                                    <MessageSquare className="w-4 h-4" /> {post.comments} Comments
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Community;
