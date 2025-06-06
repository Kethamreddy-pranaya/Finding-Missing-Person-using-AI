import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { mockMissingPersons } from '../mockData';
import { SearchResult } from '../types';

export const SearchSection: React.FC = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsSearching(true);
      // Simulate AI processing
      setTimeout(() => {
        const results: SearchResult[] = mockMissingPersons.map(person => ({
          person,
          similarity: Math.random() * 100
        })).sort((a, b) => b.similarity - a.similarity);
        
        setSearchResults(results);
        setIsSearching(false);
        toast.success('Search completed!');
      }, 2000);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  return (
    <section className="py-12 px-4" id="search">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Search by Photo</h2>
        
        <div {...getRootProps()} className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}
        `}>
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-4" size={48} />
          <p className="text-lg">
            {isDragActive
              ? "Drop the photo here"
              : "Drag and drop a photo here, or click to select"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Supports JPG, JPEG, PNG
          </p>
        </div>

        {isSearching && (
          <div className="text-center mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-lg">Searching for matches...</p>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-6">Search Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map(({ person, similarity }) => (
                <div key={person.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={person.photoUrl}
                    alt={person.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-xl font-semibold">{person.name}</h4>
                    <p className="text-gray-600">Match: {similarity.toFixed(1)}%</p>
                    <p className="mt-2">Last seen: {person.lastSeen}</p>
                    <p className="text-sm text-gray-500">{person.location}</p>
                    <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};