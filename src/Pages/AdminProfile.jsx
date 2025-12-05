import React, { useState, useEffect } from 'react';
import { User, Image, Link, FileText, Instagram, Linkedin, Github, Youtube, Music, Save, Loader, Upload } from 'lucide-react';
import { supabase } from '../supabase';
import Swal from 'sweetalert2';
import AdminLayout from '../components/AdminLayout';

const AdminProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    photo_url: '',
    title: 'Frontend Developer',
    subtitle: 'Web Developer|Design|Video & Photo Editing|UI/UX Design',
    tech_stack: ['React', 'Javascript', 'Node.js', 'Tailwind'],
    github_url: 'https://github.com/Fazrilukman',
    linkedin_url: 'https://www.linkedin.com/in/fazrilukman/',
    instagram_url: 'https://www.instagram.com/fazrilukman_/?hl=id',
    name: 'Fazri Lukman Nurrohman',
    description: 'Seorang lulusan Teknik Jaringan Komputer dan Telekomunikasi yang memiliki ketertarikan besar dalam pengembangan Front-End. Saya berfokus pada menciptakan pengalaman digital yang menarik dan selalu berusaha memberikan solusi terbaik dalam setiap proyek yang saya kerjakan.',
    cv_link: 'https://drive.google.com/drive/folders/1BOm51Grsabb3zj6Xk27K-iRwI1zITcpo',
    // Social links untuk Connect With Me
    linkedin_connect: 'https://www.linkedin.com/in/fazrilukman/',
    instagram_connect: 'https://www.instagram.com/fazrilukman_/?hl=id',
    youtube_connect: 'https://www.youtube.com/@fazrilukman',
    github_connect: 'https://github.com/Fazrilukman',
    tiktok_connect: 'https://www.tiktok.com/@fazrilukman'
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profile_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfileData({
          photo_url: data.photo_url || '',
          title: data.title || 'Frontend Developer',
          subtitle: data.subtitle || 'Network & Telecom Student',
          tech_stack: data.tech_stack || ['React', 'Javascript', 'Node.js', 'Tailwind'],
          github_url: data.github_url || '',
          linkedin_url: data.linkedin_url || '',
          instagram_url: data.instagram_url || '',
          name: data.name || 'Fazri Lukman Nurrohman',
          description: data.description || '',
          cv_link: data.cv_link || '',
          linkedin_connect: data.linkedin_connect || '',
          instagram_connect: data.instagram_connect || '',
          youtube_connect: data.youtube_connect || '',
          github_connect: data.github_connect || '',
          tiktok_connect: data.tiktok_connect || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleTechStackChange = (index, value) => {
    const newTechStack = [...profileData.tech_stack];
    newTechStack[index] = value;
    setProfileData(prev => ({ ...prev, tech_stack: newTechStack }));
  };

  const addTechStack = () => {
    setProfileData(prev => ({ 
      ...prev, 
      tech_stack: [...prev.tech_stack, ''] 
    }));
  };

  const removeTechStack = (index) => {
    setProfileData(prev => ({ 
      ...prev, 
      tech_stack: prev.tech_stack.filter((_, i) => i !== index) 
    }));
  };

  const handleFileUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      
      if (!file) return;
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        await Swal.fire('Error', 'Ukuran file maksimal 5MB', 'error');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        await Swal.fire('Error', 'File harus berupa gambar', 'error');
        return;
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = fileName;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);
      
      if (uploadError) {
        // If bucket doesn't exist, show helpful message
        if (uploadError.message.includes('not found')) {
          await Swal.fire({
            icon: 'error',
            title: 'Storage Bucket Belum Dibuat',
            html: 'Silakan buat bucket <strong>profile-images</strong> di Supabase Storage terlebih dahulu.<br><br>Lihat <strong>FILE_UPLOAD_TODO.md</strong> untuk panduan.',
            confirmButtonText: 'OK'
          });
          return;
        }
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);
      
      // Update photo_url in state
      setProfileData(prev => ({ ...prev, photo_url: data.publicUrl }));
      
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Gambar berhasil diupload',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Upload error:', error);
      await Swal.fire('Error', 'Gagal upload gambar: ' + error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!supabase) {
      Swal.fire('Error', 'Supabase tidak terhubung', 'error');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profile_settings')
        .upsert([{
          id: 1,
          ...profileData,
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Profile berhasil diupdate',
        confirmButtonColor: '#6366f1',
        background: '#1e1b4b',
        color: '#ffffff'
      });

      await fetchProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Gagal menyimpan profile',
        confirmButtonColor: '#ef4444',
        background: '#1e1b4b',
        color: '#ffffff'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-400">Kelola informasi profil portfolio Anda</p>
        </div>

        <div className="space-y-6">
          {/* Photo Section */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Image className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-semibold text-white">Foto Profil</h2>
            </div>
            <div className="space-y-4">
              {/* File Upload Option */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Foto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-600 file:text-white
                    hover:file:bg-indigo-700
                    file:cursor-pointer cursor-pointer
                    disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Maksimal 5MB. Format: JPG, PNG, GIF, WebP
                </p>
                {uploading && (
                  <div className="flex items-center gap-2 mt-2 text-indigo-400">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Mengupload...</span>
                  </div>
                )}
              </div>
              
              {/* Divider */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-700"></div>
                <span className="text-xs text-gray-500">ATAU</span>
                <div className="flex-1 h-px bg-gray-700"></div>
              </div>
              
              {/* URL Input Option */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL Foto
                </label>
                <input
                  type="url"
                  value={profileData.photo_url}
                  onChange={(e) => handleInputChange('photo_url', e.target.value)}
                  placeholder="https://example.com/photo.jpg atau /Photo.jpg"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              
              {/* Preview */}
              {profileData.photo_url && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preview
                  </label>
                  <img 
                    src={profileData.photo_url} 
                    alt="Preview" 
                    className="w-32 h-32 rounded-full object-cover border-2 border-indigo-500"
                    onError={(e) => e.target.src = '/Photo.jpg'}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Hero Section */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-semibold text-white">Hero Section</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Title</label>
                <input
                  type="text"
                  value={profileData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Frontend Developer"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={profileData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  placeholder="Network & Telecom Student"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Tech Stack (4 items)</label>
                <div className="space-y-2">
                  {profileData.tech_stack.map((tech, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) => handleTechStackChange(index, e.target.value)}
                        placeholder={`Technology ${index + 1}`}
                        className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      />
                      {profileData.tech_stack.length > 1 && (
                        <button
                          onClick={() => removeTechStack(index)}
                          className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {profileData.tech_stack.length < 6 && (
                    <button
                      onClick={addTechStack}
                      className="w-full px-4 py-2 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-indigo-500 hover:text-indigo-400"
                    >
                      + Tambah Tech Stack
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Link className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-semibold text-white">Social Media Links</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Github className="w-4 h-4" /> GitHub
                </label>
                <input
                  type="url"
                  value={profileData.github_url}
                  onChange={(e) => handleInputChange('github_url', e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </label>
                <input
                  type="url"
                  value={profileData.linkedin_url}
                  onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Instagram className="w-4 h-4" /> Instagram
                </label>
                <input
                  type="url"
                  value={profileData.instagram_url}
                  onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                  placeholder="https://instagram.com/username"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-semibold text-white">About Section</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Fazri Lukman Nurrohman"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Deskripsi</label>
                <textarea
                  value={profileData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Ceritakan tentang diri Anda..."
                  rows="5"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <FileText className="w-4 h-4" /> CV Link
                </label>
                <input
                  type="url"
                  value={profileData.cv_link}
                  onChange={(e) => handleInputChange('cv_link', e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Connect With Me Section */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Link className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-semibold text-white">Connect With Me</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Linkedin className="w-4 h-4" /> LinkedIn Connect
                </label>
                <input
                  type="url"
                  value={profileData.linkedin_connect}
                  onChange={(e) => handleInputChange('linkedin_connect', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Instagram className="w-4 h-4" /> Instagram
                </label>
                <input
                  type="url"
                  value={profileData.instagram_connect}
                  onChange={(e) => handleInputChange('instagram_connect', e.target.value)}
                  placeholder="https://instagram.com/username"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Youtube className="w-4 h-4" /> YouTube
                </label>
                <input
                  type="url"
                  value={profileData.youtube_connect}
                  onChange={(e) => handleInputChange('youtube_connect', e.target.value)}
                  placeholder="https://youtube.com/@username"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Github className="w-4 h-4" /> GitHub
                </label>
                <input
                  type="url"
                  value={profileData.github_connect}
                  onChange={(e) => handleInputChange('github_connect', e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Music className="w-4 h-4" /> TikTok
                </label>
                <input
                  type="url"
                  value={profileData.tiktok_connect}
                  onChange={(e) => handleInputChange('tiktok_connect', e.target.value)}
                  placeholder="https://tiktok.com/@username"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Simpan Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
