import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../supabase';
import { 
  Trash2, 
  Search, 
  Pin,
  PinOff,
  UserCircle2,
  MessageSquare,
  Loader2,
  RefreshCw
} from 'lucide-react';
import Swal from 'sweetalert2';

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, pinned, unpinned

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        console.warn('Supabase not configured');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('portfolio_comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      Swal.fire('Error', 'Failed to fetch comments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePin = async (comment) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { error } = await supabase
        .from('portfolio_comments')
        .update({ is_pinned: !comment.is_pinned })
        .eq('id', comment.id);

      if (error) throw error;

      await Swal.fire({
        icon: 'success',
        title: comment.is_pinned ? 'Comment Unpinned' : 'Comment Pinned',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });

      await fetchComments();
    } catch (error) {
      console.error('Error toggling pin:', error);
      Swal.fire('Error', 'Failed to update comment', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Comment?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      background: '#1f2937',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        if (!supabase) {
          throw new Error('Supabase not configured');
        }

        const { error } = await supabase
          .from('portfolio_comments')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        await Swal.fire('Deleted!', 'Comment has been deleted.', 'success');
        await fetchComments();
      } catch (error) {
        console.error('Error deleting comment:', error);
        Swal.fire('Error', 'Failed to delete comment', 'error');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredComments = comments.filter(comment => {
    const matchesSearch = 
      comment.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.content?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterType === 'all' ? true :
      filterType === 'pinned' ? comment.is_pinned :
      !comment.is_pinned;

    return matchesSearch && matchesFilter;
  });

  const pinnedCount = comments.filter(c => c.is_pinned).length;
  const unpinnedCount = comments.length - pinnedCount;

  return (
    <AdminLayout activePage="comments">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Comments Management</h1>
            <p className="text-gray-400">Moderate and manage portfolio comments</p>
          </div>
          <button
            onClick={fetchComments}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <MessageSquare className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Comments</p>
                <p className="text-2xl font-bold text-white">{comments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/20 rounded-lg">
                <Pin className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Pinned</p>
                <p className="text-2xl font-bold text-white">{pinnedCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <MessageSquare className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Regular</p>
                <p className="text-2xl font-bold text-white">{unpinnedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterType === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('pinned')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterType === 'pinned'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Pinned
            </button>
            <button
              onClick={() => setFilterType('unpinned')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterType === 'unpinned'
                  ? 'bg-green-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Regular
            </button>
          </div>
        </div>

        {/* Comments List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading comments...</p>
            </div>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No comments found</p>
            {searchTerm && (
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filter</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <div
                key={comment.id}
                className={`bg-white/5 backdrop-blur-lg border rounded-xl p-6 hover:bg-white/10 transition-all ${
                  comment.is_pinned
                    ? 'border-rose-500/30 bg-gradient-to-r from-rose-500/5 to-red-500/5'
                    : 'border-white/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    {comment.profile_image ? (
                      <img
                        src={comment.profile_image}
                        alt={comment.user_name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-red-500/30"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                        <UserCircle2 className="w-7 h-7 text-red-400" />
                      </div>
                    )}
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          {comment.user_name}
                          {comment.is_pinned && (
                            <span className="px-2 py-0.5 text-xs bg-rose-500/20 text-rose-300 rounded-full">
                              Pinned
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(comment.created_at)}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{comment.content}</p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTogglePin(comment)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm ${
                          comment.is_pinned
                            ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300'
                            : 'bg-red-500/20 hover:bg-red-500/30 text-red-300'
                        }`}
                      >
                        {comment.is_pinned ? (
                          <>
                            <PinOff className="w-4 h-4" />
                            Unpin
                          </>
                        ) : (
                          <>
                            <Pin className="w-4 h-4" />
                            Pin Comment
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminComments;
