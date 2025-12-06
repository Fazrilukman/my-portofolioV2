import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../supabase';
import { 
  FolderKanban, 
  Award, 
  MessageSquare, 
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
        {trend && (
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    certificates: 0,
    comments: 0,
    pinnedComments: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      if (!supabase) {
        console.warn('Supabase not configured');
        setLoading(false);
        return;
      }

      // Fetch all stats in parallel
      const [projectsRes, certificatesRes, commentsRes, pinnedRes] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('certificates').select('*', { count: 'exact', head: true }),
        supabase.from('portfolio_comments').select('*', { count: 'exact', head: true }),
        supabase.from('portfolio_comments').select('*', { count: 'exact', head: true }).eq('is_pinned', true)
      ]);

      // Fetch recent comments for activity
      const { data: recentComments } = await supabase
        .from('portfolio_comments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        projects: projectsRes.count || 0,
        certificates: certificatesRes.count || 0,
        comments: commentsRes.count || 0,
        pinnedComments: pinnedRes.count || 0
      });

      setRecentActivity(recentComments || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <AdminLayout activePage="dashboard">
        <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activePage="dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome back! Here's your portfolio overview.</p>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Projects"
            value={stats.projects}
            icon={FolderKanban}
            color="bg-gradient-to-br from-red-500 to-red-600"
            trend="+12% from last month"
          />
          <StatCard
            title="Certificates"
            value={stats.certificates}
            icon={Award}
            color="bg-gradient-to-br from-green-500 to-green-600"
            trend="+8% from last month"
          />
          <StatCard
            title="Total Comments"
            value={stats.comments}
            icon={MessageSquare}
            color="bg-gradient-to-br from-rose-500 to-rose-600"
            trend="+23% from last month"
          />
          <StatCard
            title="Pinned Comments"
            value={stats.pinnedComments}
            icon={Activity}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Comments Activity
          </h2>
          
          {recentActivity.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {comment.profile_image ? (
                      <img
                        src={comment.profile_image}
                        alt={comment.user_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-red-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-medium text-white truncate">{comment.user_name}</h4>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">{comment.content}</p>
                    {comment.is_pinned && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-red-500/20 text-red-300 rounded">
                        Pinned
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => window.location.href = '/admin/projects'}
            className="p-6 bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl hover:from-red-500/20 hover:to-red-600/20 transition-all text-left group"
          >
            <FolderKanban className="w-8 h-8 text-red-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-1">Manage Projects</h3>
            <p className="text-sm text-gray-400">Add, edit, or remove portfolio projects</p>
          </button>

          <button
            onClick={() => window.location.href = '/admin/certificates'}
            className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl hover:from-green-500/20 hover:to-green-600/20 transition-all text-left group"
          >
            <Award className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-1">Manage Certificates</h3>
            <p className="text-sm text-gray-400">Upload and organize certificates</p>
          </button>

          <button
            onClick={() => window.location.href = '/admin/comments'}
            className="p-6 bg-gradient-to-br from-rose-500/10 to-rose-600/10 border border-rose-500/30 rounded-xl hover:from-rose-500/20 hover:to-rose-600/20 transition-all text-left group"
          >
            <MessageSquare className="w-8 h-8 text-rose-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-1">Moderate Comments</h3>
            <p className="text-sm text-gray-400">Pin, delete, or manage comments</p>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
