import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../supabase';
import { 
  Plus, 
  Trash2, 
  Search, 
  X,
  Upload,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import Swal from 'sweetalert2';

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'file'
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        console.warn('Supabase not configured');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      Swal.fire('Error', 'Failed to fetch certificates', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setImageUrl('');
    setImageFile(null);
    setUploadMethod('url');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setImageUrl('');
    setImageFile(null);
    setUploadMethod('url');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi file
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        Swal.fire('Error', 'Only JPG, PNG, and WEBP files are allowed', 'error');
        return;
      }

      if (file.size > maxSize) {
        Swal.fire('Error', 'File size must be less than 5MB', 'error');
        return;
      }

      setImageFile(file);
    }
  };

  const uploadImageToSupabase = async (file) => {
    try {
      setUploading(true);
      
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      // Buat nama file unik
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `certificates/${fileName}`;

      // Cek apakah bucket ada, jika tidak tampilkan pesan yang lebih jelas
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        console.error('Error checking buckets:', bucketError);
      }

      const bucketExists = buckets?.some(bucket => bucket.name === 'certificates');
      
      if (!bucketExists) {
        throw new Error('Storage bucket "certificates" not found. Please create it in Supabase Dashboard:\n1. Go to Storage\n2. Create new bucket named "certificates"\n3. Make it public\n\nOr use URL method instead.');
      }

      // Upload ke Supabase Storage
      const { data, error } = await supabase.storage
        .from('certificates')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Dapatkan public URL
      const { data: { publicUrl } } = supabase.storage
        .from('certificates')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      let finalImageUrl = imageUrl;

      // Jika upload file
      if (uploadMethod === 'file') {
        if (!imageFile) {
          throw new Error('Please select an image file');
        }
        
        try {
          finalImageUrl = await uploadImageToSupabase(imageFile);
        } catch (uploadError) {
          // Jika upload gagal karena bucket tidak ada, beri instruksi
          const errorMessage = uploadError.message || '';
          
          if (errorMessage.includes('bucket') || errorMessage.includes('Bucket not found')) {
            await Swal.fire({
              icon: 'info',
              title: 'Storage Bucket Not Found',
              html: `
                <div class="text-left">
                  <p class="mb-3">The Supabase storage bucket needs to be created first.</p>
                  <p class="font-bold mb-2">Steps to create bucket:</p>
                  <ol class="list-decimal ml-5 space-y-1">
                    <li>Go to your Supabase Dashboard</li>
                    <li>Navigate to <strong>Storage</strong></li>
                    <li>Click <strong>New Bucket</strong></li>
                    <li>Name it: <code class="bg-gray-200 px-2 py-1 rounded">certificates</code></li>
                    <li>Make it <strong>Public</strong></li>
                    <li>Save and try again</li>
                  </ol>
                  <p class="mt-3 text-sm text-gray-600">Alternatively, you can use the URL method instead.</p>
                </div>
              `,
              confirmButtonColor: '#ef4444'
            });
            setSubmitting(false);
            return;
          }
          
          throw uploadError;
        }
      } else {
        // Jika pakai URL
        if (!imageUrl.trim()) {
          throw new Error('Image URL is required');
        }
        finalImageUrl = imageUrl.trim();
      }

      const { error } = await supabase
        .from('certificates')
        .insert([{ Img: finalImageUrl }]);

      if (error) throw error;
      
      Swal.fire('Success!', 'Certificate added successfully', 'success');
      fetchCertificates();
      handleCloseModal();
    } catch (error) {
      console.error('Error adding certificate:', error);
      Swal.fire('Error', error.message || 'Failed to add certificate', 'error');
    } finally {
      setSubmitting(false);
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
          .from('certificates')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        await Swal.fire('Deleted!', 'Certificate has been deleted.', 'success');
        await fetchCertificates();
      } catch (error) {
        console.error('Error deleting certificate:', error);
        Swal.fire('Error', 'Failed to delete certificate', 'error');
      }
    }
  };

  const filteredCertificates = certificates.filter(cert =>
    cert.Img?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout activePage="certificates">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Certificates Management</h1>
            <p className="text-gray-400">Manage your certificates and achievements</p>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Certificate
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search certificates by URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Certificates Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading certificates...</p>
            </div>
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No certificates found</p>
            <p className="text-gray-500 text-sm mt-2">Click "Add Certificate" to upload your first certificate</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCertificates.map((certificate) => (
              <div
                key={certificate.id}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all group"
              >
                <div className="relative aspect-[4/3] bg-gray-900">
                  {certificate.Img ? (
                    <img
                      src={certificate.Img}
                      alt={`Certificate ${certificate.id}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-gray-800"
                    style={{ display: certificate.Img ? 'none' : 'flex' }}
                  >
                    <ImageIcon className="w-12 h-12 text-gray-600" />
                  </div>
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex gap-2">
                      <a
                        href={certificate.Img}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDelete(certificate.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-xs text-gray-400 truncate">ID: {certificate.id}</p>
                  <p className="text-xs text-gray-500 truncate mt-1" title={certificate.Img}>
                    {certificate.Img}
                  </p>
                  {certificate.created_at && (
                    <p className="text-xs text-gray-500 mt-2">
                      Added: {new Date(certificate.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Certificates</p>
              <p className="text-3xl font-bold text-white">{certificates.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Filtered Results</p>
              <p className="text-3xl font-bold text-white">{filteredCertificates.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">This Month</p>
              <p className="text-3xl font-bold text-white">
                {certificates.filter(c => {
                  if (!c.created_at) return false;
                  const date = new Date(c.created_at);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">This Year</p>
              <p className="text-3xl font-bold text-white">
                {certificates.filter(c => {
                  if (!c.created_at) return false;
                  const date = new Date(c.created_at);
                  const now = new Date();
                  return date.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Certificate Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#140003] border border-white/10 rounded-xl w-full max-w-md my-8 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
              <h2 className="text-2xl font-bold text-white">Add New Certificate</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-4">
              {/* Upload Method Toggle */}
              <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setUploadMethod('url')}
                  className={`flex-1 px-4 py-2 rounded-md transition-all ${
                    uploadMethod === 'url'
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod('file')}
                  className={`flex-1 px-4 py-2 rounded-md transition-all ${
                    uploadMethod === 'file'
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Upload File
                </button>
              </div>

              {/* URL Input */}
              {uploadMethod === 'url' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Certificate Image URL *
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="https://example.com/certificate.png"
                    required={uploadMethod === 'url'}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Enter the direct URL to your certificate image
                  </p>
                </div>
              )}

              {/* File Upload */}
              {uploadMethod === 'file' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Certificate Image File *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                      id="certificate-file"
                      required={uploadMethod === 'file'}
                    />
                    <label
                      htmlFor="certificate-file"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-red-500 transition-colors bg-white/5"
                    >
                      {imageFile ? (
                        <div className="text-center">
                          <ImageIcon className="w-10 h-10 text-green-500 mx-auto mb-2" />
                          <p className="text-sm text-white">{imageFile.name}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <p className="text-xs text-gray-500 mt-2">Click to change</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-300">Click to upload</p>
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG, WEBP (Max 5MB)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {/* Image Preview */}
              {((uploadMethod === 'url' && imageUrl) || (uploadMethod === 'file' && imageFile)) && (
                <div className="border border-white/10 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Preview:</p>
                  <img
                    src={uploadMethod === 'url' ? imageUrl : URL.createObjectURL(imageFile)}
                    alt="Certificate preview"
                    className="w-full rounded-lg max-h-96 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <p 
                    className="text-red-400 text-sm text-center py-4"
                    style={{ display: 'none' }}
                  >
                    Failed to load image. Please check the {uploadMethod === 'url' ? 'URL' : 'file'}.
                  </p>
                </div>
              )}
              </div>

              <div className="flex gap-3 p-6 border-t border-white/10 bg-[#140003] flex-shrink-0">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg transition-all disabled:opacity-50"
                >
                  {submitting || uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {uploading ? 'Uploading...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Add Certificate
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

export default AdminCertificates;
