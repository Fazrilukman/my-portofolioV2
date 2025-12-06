import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id }) => {
  const [imageError, setImageError] = React.useState(false);
  
  // Handle kasus ketika ProjectLink kosong
  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      console.log("ProjectLink kosong");
      e.preventDefault();
      alert("Live demo link is not available");
    }
  };
  
  const handleDetails = (e) => {
    if (!id) {
      console.log("ID kosong");
      e.preventDefault();
      alert("Project details are not available");
    }
  };
  

  return (
    <div className="group relative w-full h-[400px] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl">
      {/* Background Image */}
      {Img && !imageError ? (
        <img
          src={Img}
          alt={Title}
          onError={() => setImageError(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-900/50 via-rose-900/50 to-pink-900/50 flex items-center justify-center">
          <div className="text-white/30 text-6xl">🖼️</div>
        </div>
      )}
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="transform transition-transform duration-300 group-hover:translate-y-[-8px]">
          <h3 className="text-2xl font-bold text-white mb-2">
            {Title || 'Untitled Project'}
          </h3>
          
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {Description || 'No description available'}
          </p>
          
          {/* Buttons */}
          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            {ProjectLink ? (
              <a
                href={ProjectLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLiveDemo}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105"
              >
                <ExternalLink className="w-4 h-4" />
                VIEW APP
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-600 text-gray-300 text-sm font-semibold rounded-lg cursor-not-allowed">
                <ExternalLink className="w-4 h-4" />
                VIEW APP
              </span>
            )}

            {id ? (
              <Link
                to={`/project/${id}`}
                onClick={handleDetails}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105 border border-white/20"
              >
                Details
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 text-gray-400 text-sm font-semibold rounded-lg cursor-not-allowed border border-white/10">
                Details
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProject;
