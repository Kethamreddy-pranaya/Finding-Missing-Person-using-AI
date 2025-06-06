import React, { useState } from 'react';
import { UserSearch, Upload, Search, AlertCircle, Camera } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast, Toaster } from 'react-hot-toast';

interface MissingPerson {
  id: string;
  name: string;
  age: number;
  lastSeen: string;
  location: string;
  description: string;
  photoUrl: string;
  status: 'missing' | 'found';
  matchPercentage?: number;
}

// Mock data for demonstration
const mockDatabase: MissingPerson[] = [
  {
    id: '1',
    name: 'John Smith',
    age: 25,
    lastSeen: '2024-03-15',
    location: 'Central Park, New York',
    description: 'Last seen wearing a blue jacket and jeans',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    status: 'missing'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    age: 32,
    lastSeen: '2024-03-10',
    location: 'Downtown Seattle',
    description: 'Has a distinctive butterfly tattoo on right arm',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    status: 'missing'
  }
];

function App() {
  const [searchResults, setSearchResults] = useState<MissingPerson[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    lastSeen: '',
    location: '',
    description: '',
    photo: null as File | null
  });

  // Mock AI search function
  const performAISearch = async (file: File) => {
    setIsSearching(true);
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock results with random match percentages
    const results = mockDatabase.map(person => ({
      ...person,
      matchPercentage: Math.random() * 100
    })).sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
    
    setSearchResults(results);
    setIsSearching(false);
    toast.success('AI analysis complete');
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        await performAISearch(acceptedFiles[0]);
      }
    }
  });

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // In a real app, you would:
      // 1. Show video preview
      // 2. Capture frame
      // 3. Convert to file
      // 4. Perform AI search
      stream.getTracks().forEach(track => track.stop());
      toast.success('Photo captured successfully');
    } catch (error) {
      toast.error('Failed to access camera');
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Report submitted successfully');
    setShowReport(false);
    setFormData({
      name: '',
      age: '',
      lastSeen: '',
      location: '',
      description: '',
      photo: null
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-indigo-600 text-white py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserSearch size={32} className="text-indigo-200" />
            <div>
              <h1 className="text-2xl font-bold">Missing Person Finder</h1>
              <p className="text-indigo-200 text-sm">Powered by AI</p>
            </div>
          </div>
          <button
            onClick={() => setShowReport(!showReport)}
            className="bg-white text-indigo-600 px-6 py-2 rounded-full hover:bg-indigo-50 transition-colors font-semibold shadow-md"
          >
            Report Missing Person
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4">
        {/* Search Section */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Find Missing Persons</h2>
          <p className="text-gray-600 mb-8">
            Upload a photo or use your camera to search our database using AI facial recognition
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-3 font-medium ${
                    activeTab === 'upload' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'
                  }`}
                >
                  <Upload size={18} className="inline mr-2" />
                  Upload Photo
                </button>
                <button
                  onClick={() => setActiveTab('camera')}
                  className={`flex-1 py-3 font-medium ${
                    activeTab === 'camera' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'
                  }`}
                >
                  <Camera size={18} className="inline mr-2" />
                  Use Camera
                </button>
              </div>

              {/* Upload Area */}
              {activeTab === 'upload' && (
                <div
                  {...getRootProps()}
                  className="p-12 text-center cursor-pointer hover:bg-indigo-50 transition-colors"
                >
                  <input {...getInputProps()} />
                  <Upload size={48} className="mx-auto mb-4 text-indigo-600" />
                  <p className="text-lg font-medium">
                    Drag and drop a photo here, or click to select
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Supports JPG, JPEG, PNG
                  </p>
                </div>
              )}

              {/* Camera Area */}
              {activeTab === 'camera' && (
                <div className="p-12 text-center">
                  <button
                    onClick={handleCameraCapture}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Camera size={18} className="inline mr-2" />
                    Take Photo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isSearching && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium">Analyzing photo with AI...</p>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Potential Matches</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((person) => (
                <div key={person.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <img
                    src={person.photoUrl}
                    alt={person.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-semibold">{person.name}</h4>
                        <p className="text-gray-600">Age: {person.age}</p>
                      </div>
                      {person.matchPercentage && (
                        <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                          {person.matchPercentage.toFixed(1)}% Match
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><strong>Last Seen:</strong> {new Date(person.lastSeen).toLocaleDateString()}</p>
                      <p><strong>Location:</strong> {person.location}</p>
                      <p><strong>Description:</strong> {person.description}</p>
                    </div>
                    <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report Form Modal */}
        {showReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Report Missing Person</h2>
                  <button
                    onClick={() => setShowReport(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleReportSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Seen Date
                      </label>
                      <input
                        type="date"
                        value={formData.lastSeen}
                        onChange={(e) => setFormData({ ...formData, lastSeen: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location Last Seen
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
                  >
                    <input {...getInputProps()} />
                    <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Upload a recent photo</p>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mt-4">
                    <AlertCircle size={16} className="mr-2" />
                    <p>This information will be shared with law enforcement agencies</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Submit Report
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-400">
            This is a demo application showcasing AI-powered missing person search capabilities.
            In a real-world scenario, it would be connected to law enforcement databases and use actual AI face recognition.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;