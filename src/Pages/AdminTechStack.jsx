import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../supabase';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Upload,
  Loader2,
  Save,
  Image as ImageIcon
} from 'lucide-react';
import Swal from 'sweetalert2';

const BUCKET_NAME = 'profile-images';
const FOLDER_NAME = 'tech-stack';

const AdminTechStack = () => {
  const [techStacks, setTechStacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStack, setEditingStack] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon_url: '',
    sort_order: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchTechStacks();
  }, []);

  const fetchTechStacks = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        console.warn('Supabase not configured');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('tech_stack')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('id', { ascending: true });

      if (error) throw error;
      setTechStacks(data || []);
    } catch (error) {
      console.error('Error fetching tech stack:', error);
      Swal.fire('Error', 'Failed to fetch tech stack', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (stack = null) => {
    if (stack) {
      setEditingStack(stack);
      setFormData({
        name: stack.name || '',
        icon_url: stack.icon_url || '',
        sort_order: stack.sort_order ?? ''
      });
      setImagePreview(stack.icon_url || '');
    } else {
      setEditingStack(null);
      setFormData({
        name: '',
        icon_url: '',
        sort_order: ''
      });
      setImagePreview('');
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStack(null);
    setImageFile(null);
    setImagePreview('');
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire('Error', 'Please select a valid image file', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Error', 'Image size must be less than 5MB', 'error');
        return;
      }

      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${FOLDER_NAME}/${fileName}`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!supabase) throw new Error('Supabase not configured');

      if (!formData.name.trim()) {
        throw new Error('Tech stack name is required');
      }

      let iconUrl = formData.icon_url.trim();
      if (!iconUrl && !imageFile) {
        throw new Error('Please upload an icon or provide an icon URL');
      }

      if (imageFile) {
        setUploadingImage(true);
        iconUrl = await uploadImage(imageFile);
        setUploadingImage(false);
      }

      const sortOrderNumber = Number.isFinite(Number(formData.sort_order))
        ? Number(formData.sort_order)
        : 0;

      const payload = {
        name: formData.name.trim(),
        icon_url: iconUrl,
        sort_order: sortOrderNumber
      };

      if (editingStack) {
        const { error } = await supabase
          .from('tech_stack')
          .update(payload)
          .eq('id', editingStack.id);

        if (error) throw error;
        Swal.fire('Success!', 'Tech stack updated successfully', 'success');
      } else {
        const { error } = await supabase
          .from('tech_stack')
          .insert([payload]);

        if (error) throw error;
        Swal.fire('Success!', 'Tech stack added successfully', 'success');
      }

      fetchTechStacks();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving tech stack:', error);
      Swal.fire('Error', error.message || 'Failed to save tech stack', 'error');
    } finally {
      setSubmitting(false);
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
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
        if (!supabase) throw new Error('Supabase not configured');

        const { error } = await supabase
          .from('tech_stack')
          .delete()
          .eq('id', id);

        if (error) throw error;

        await Swal.fire('Deleted!', 'Tech stack has been deleted.', 'success');
        await fetchTechStacks();
      } catch (error) {
        console.error('Error deleting tech stack:', error);
        Swal.fire('Error', 'Failed to delete tech stack', 'error');
      }
    }
  };

  const filteredTechStacks = techStacks.filter((stack) =>
    stack.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout activePage="tech-stack">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Tech Stack Management</h1>
            <p className="text-gray-400">Add, edit, and organize your tech stack</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Tech Stack
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tech stack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading tech stack...</p>
            </div>
          </div>
        ) : filteredTechStacks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No tech stack items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTechStacks.map((stack) => (
              <div
                key={stack.id}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                    {stack.icon_url ? (
                      <img
                        src={stack.icon_url}
                        alt={stack.name}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{stack.name}</h3>
                    <p className="text-xs text-gray-400">Order: {stack.sort_order ?? 0}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(stack)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(stack.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#140003] border border-white/10 rounded-xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">
                {editingStack ? 'Edit Tech Stack' : 'Add Tech Stack'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tech Stack Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. ReactJS"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Icon
                </label>

                {imagePreview && (
                  <div className="mb-3 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-contain rounded-lg border border-white/10 bg-black/30"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setImageFile(null);
                        setFormData({ ...formData, icon_url: '' });
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}

                <div className="flex gap-2 mb-2">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30">
                      <Upload className="w-5 h-5" />
                      <span>{imageFile ? imageFile.name : 'Upload Icon'}</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-white/10"></div>
                  <span className="text-xs text-gray-500">OR</span>
                  <div className="flex-1 h-px bg-white/10"></div>
                </div>

                <input
                  type="url"
                  value={formData.icon_url}
                  onChange={(e) => {
                    setFormData({ ...formData, icon_url: e.target.value });
                    setImagePreview(e.target.value);
                    setImageFile(null);
                  }}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://example.com/icon.svg"
                />
                <p className="text-xs text-gray-500 mt-1">Upload an image or paste an icon URL</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg transition-all disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading Icon...
                    </>
                  ) : submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingStack ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTechStack;
