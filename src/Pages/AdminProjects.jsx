import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../supabase';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  X,
  ExternalLink,
  Github,
  Save,
  Loader2,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import Swal from 'sweetalert2';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    Title: '',
    Description: '',
    Img: '',
    Link: '',
    Github: '',
    Features: [],
    TechStack: [],
    category: 'Project'
  });
  const [featureInput, setFeatureInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        console.warn('Supabase not configured');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      Swal.fire('Error', 'Failed to fetch projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        Title: project.Title || '',
        Description: project.Description || '',
        Img: project.Img || '',
        Link: project.Link || '',
        Github: project.Github || '',
        Features: project.Features || [],
        TechStack: project.TechStack || [],
        category: project.category || 'Project'
      });
      setImagePreview(project.Img || '');
    } else {
      setEditingProject(null);
      setFormData({
        Title: '',
        Description: '',
        Img: '',
        Link: '',
        Github: '',
        Features: [],
        TechStack: [],
        category: 'Project'
      });
      setImagePreview('');
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setFeatureInput('');
    setTechInput('');
    setImageFile(null);
    setImagePreview('');
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        Swal.fire('Error', 'Please select an image file', 'error');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Error', 'Image size must be less than 5MB', 'error');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      let imageUrl = formData.Img;

      // Upload image if file is selected
      if (imageFile) {
        setUploadingImage(true);
        imageUrl = await uploadImage(imageFile);
        setUploadingImage(false);
      }

      const projectData = {
        ...formData,
        Img: imageUrl,
        Features: formData.Features,
        TechStack: formData.TechStack
      };

      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);

        if (error) throw error;
        Swal.fire('Success!', 'Project updated successfully', 'success');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;
        Swal.fire('Success!', 'Project created successfully', 'success');
      }

      fetchProjects();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving project:', error);
      Swal.fire('Error', error.message || 'Failed to save project', 'error');
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
        if (!supabase) {
          throw new Error('Supabase not configured');
        }

        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        await Swal.fire('Deleted!', 'Project has been deleted.', 'success');
        await fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        Swal.fire('Error', 'Failed to delete project', 'error');
      }
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        Features: [...prev.Features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      Features: prev.Features.filter((_, i) => i !== index)
    }));
  };

  const addTech = () => {
    if (techInput.trim()) {
      setFormData(prev => ({
        ...prev,
        TechStack: [...prev.TechStack, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const removeTech = (index) => {
    setFormData(prev => ({
      ...prev,
      TechStack: prev.TechStack.filter((_, i) => i !== index)
    }));
  };

  const filteredProjects = projects.filter(project =>
    project.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.Description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout activePage="projects">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Projects Management</h1>
            <p className="text-gray-400">Manage your portfolio projects</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Project
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading projects...</p>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all"
              >
                {project.Img && (
                  <img
                    src={project.Img}
                    alt={project.Title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{project.Title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.Description}</p>
                  
                  {/* Category Badge */}
                  {project.category && (
                    <div className="mb-3">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        project.category === 'Project' ? 'bg-rose-500/20 text-rose-300' :
                        project.category === 'Design' ? 'bg-pink-500/20 text-pink-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {project.category}
                      </span>
                    </div>
                  )}
                  
                  {/* Tech Stack */}
                  {project.TechStack && project.TechStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.TechStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-red-500/20 text-red-300 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.Link && (
                      <a
                        href={project.Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Live Demo
                      </a>
                    )}
                    {project.Github && (
                      <a
                        href={project.Github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-300"
                      >
                        <Github className="w-3 h-3" />
                        GitHub
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(project)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#140003] border border-white/10 rounded-xl w-full max-w-3xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.Title}
                  onChange={(e) => setFormData({ ...formData, Title: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.Description}
                  onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="Project">Project</option>
                  <option value="Design">Design</option>
                  <option value="Editing">Editing</option>
                </select>
              </div>

              {/* Image Upload / URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Image
                </label>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-3 relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border border-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setImageFile(null);
                        setFormData({ ...formData, Img: '' });
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
                
                {/* Upload Button */}
                <div className="flex gap-2 mb-2">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30">
                      <Upload className="w-5 h-5" />
                      <span>{imageFile ? imageFile.name : 'Upload Image'}</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {/* Or divider */}
                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-white/10"></div>
                  <span className="text-xs text-gray-500">OR</span>
                  <div className="flex-1 h-px bg-white/10"></div>
                </div>
                
                {/* Image URL Input */}
                <input
                  type="url"
                  value={formData.Img}
                  onChange={(e) => {
                    setFormData({ ...formData, Img: e.target.value });
                    setImagePreview(e.target.value);
                    setImageFile(null);
                  }}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://example.com/image.png"
                />
                <p className="text-xs text-gray-500 mt-1">Upload a file or paste an image URL</p>
              </div>

              {/* Live Link */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  value={formData.Link}
                  onChange={(e) => setFormData({ ...formData, Link: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://example.com"
                />
              </div>

              {/* GitHub Link */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.Github}
                  onChange={(e) => setFormData({ ...formData, Github: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Features
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter a feature"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.Features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="hover:text-green-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tech Stack
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter a technology"
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.TechStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTech(idx)}
                        className="hover:text-red-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
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
                      Uploading Image...
                    </>
                  ) : submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingProject ? 'Update' : 'Create'}
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

export default AdminProjects;
