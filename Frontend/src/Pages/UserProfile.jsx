import React, { useState, useEffect } from "react";
import { FiEdit, FiCamera } from "react-icons/fi";

const suggestedSkills = [
  "Engineering",
  "Project Management",
  "English",
  "Research Skills",
  "Training",
  "Communication",
  "Strategy",
  "Amazon Web Services (AWS)",
  "Analytical Skills",
  "Finance",
];

// Props interface for the component
const UserProfile = ({ userId = 1, onUpdateUser = null }) => {
  const [showFullExperience, setShowFullExperience] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [softSkills, setSoftSkills] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [showEditIntro, setShowEditIntro] = useState(false);
  const [showUploadIntro, setShowUploadIntro] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // User info state
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "Frontend Developer | UI/UX Specialist",
    profilePicture: null
  });

  // Base API URL
  const API_BASE_URL = "https://localhost:7047/api";

  // Fetch user data from API
  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Adjust based on your auth setup
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserInfo({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || "Frontend Developer | UI/UX Specialist",
          profilePicture: data.profilePicture || null
        });
        
        if (data.profilePicture) {
          setProfileImage(data.profilePicture);
        }
        
        if (data.skills) {
          setSoftSkills(data.skills);
        }
      } else {
        setError(`Failed to fetch user data: ${response.status}`);
      }
    } catch (error) {
      setError(`Error fetching user data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load user data when component mounts
  useEffect(() => {
    fetchUserData();
  }, [userId]);

  // Function to handle profile image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      
      try {
        const formData = new FormData();
        formData.append('profilePicture', file);
        
        const response = await fetch(`${API_BASE_URL}/users/profile/${userId}/upload-profile-picture`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setProfileImage(data.profilePictureUrl);
          setUserInfo(prev => ({ ...prev, profilePicture: data.profilePictureUrl }));
          
          if (onUpdateUser) {
            onUpdateUser({ ...userInfo, profilePicture: data.profilePictureUrl });
          }
        } else {
          setError('Failed to upload profile picture');
        }
      } catch (error) {
        setError(`Error uploading profile picture: ${error.message}`);
      } finally {
        setLoading(false);
        setShowImageUpload(false);
      }
    }
  };

  // Function to update user profile via API
  const updateUserProfile = async (updatedData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
        
        if (onUpdateUser) {
          onUpdateUser(data);
        }
        
        return true;
      } else {
        setError('Failed to update profile');
        return false;
      }
    } catch (error) {
      setError(`Error updating profile: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to add skill via API
  const addSkill = async (skill) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile/${userId}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ skill })
      });
      
      if (response.ok) {
        const updatedSkills = [...softSkills, skill];
        setSoftSkills(updatedSkills);
        return true;
      } else {
        setError('Failed to add skill');
        return false;
      }
    } catch (error) {
      setError(`Error adding skill: ${error.message}`);
      return false;
    }
  };

  const EditProfile = ({ userData, onSave, onClose }) => {
    const [formData, setFormData] = useState(userData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
      setIsSubmitting(true);
      const success = await updateUserProfile(formData);
      setIsSubmitting(false);
      
      if (success) {
        onSave(formData);
        onClose();
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-500 text-2xl hover:text-gray-700"
              disabled={isSubmitting}
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                rows="3"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Uploadresume = ({ onClose }) => {
    const [uploading, setUploading] = useState(false);

    const handleResumeUpload = async (file) => {
      if (!file) return;
      
      setUploading(true);
      
      try {
        const formData = new FormData();
        formData.append('resume', file);
        
        const response = await fetch(`${API_BASE_URL}/users/profile/${userId}/upload-resume`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setResumeFile(file);
          console.log("Resume uploaded successfully:", data);
        } else {
          setError('Failed to upload resume');
        }
      } catch (error) {
        setError(`Error uploading resume: ${error.message}`);
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Upload Resume</h2>
            <button
              onClick={onClose}
              className="text-gray-500 text-2xl hover:text-gray-700"
              disabled={uploading}
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600">Upload your latest CV or resume to share with recruiters.</p>
            
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleResumeUpload(file);
                }
              }}
              disabled={uploading}
            />
            
            {resumeFile && (
              <p className="text-sm text-green-600">Selected: {resumeFile.name}</p>
            )}
            
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Done"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-6">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden relative">
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
              <div className="flex items-center">
                <span className="text-sm">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Banner */}
          <div className="h-56 flex items-end justify-between px-6 py-4 relative bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="absolute inset-0 bg-black opacity-20"></div>
          </div>

          <div className="absolute top-64 right-4 flex gap-2 z-40">
            <button
              onClick={() => setShowEditIntro(true)}
              className="bg-white hover:bg-gray-100 text-gray-700 p-2 border border-gray-300 rounded-full shadow"
              title="Edit Profile"
              disabled={loading}
            >
              <FiEdit className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Image Section */}
          <div className="absolute top-32 left-8 z-30">
            <div className="relative">
              <div className="w-40 h-40 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
                {profileImage ? (
                  <img
                    src={profileImage}
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <span className="text-4xl font-bold">
                      {userInfo.firstName ? userInfo.firstName[0] : '?'}
                      {userInfo.lastName ? userInfo.lastName[0] : ''}
                    </span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowImageUpload(true)}
                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition shadow-lg"
                title="Change Profile Picture"
                disabled={loading}
              >
                <FiCamera className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="pt-28 px-8 pb-4 relative z-20">
            <h2 className="text-3xl font-semibold text-gray-800">
              {userInfo.firstName || "First Name"} {userInfo.lastName || "Last Name"}
            </h2>
            <p className="text-base text-gray-600 mt-2">{userInfo.bio}</p>
          </div>

          <hr className="border-gray-600 w-11/12 mx-auto mb-6" />

          <div className="px-12 pb-12 space-y-8 relative z-20">
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Contact Information
              </h3>
              <ul className="flex flex-wrap gap-x-32 text-gray-600 text-lg">
                <li>
                  <strong>Email:</strong> <span>{userInfo.email || "Not provided"}</span>
                </li>
                <li>
                  <strong>Phone:</strong> <span>{userInfo.phone || "Not provided"}</span>
                </li>
                <li>
                  <strong>Location:</strong> <span>{userInfo.location || "Not provided"}</span>
                </li>
              </ul>
            </section>

            <hr className="border-gray-300" />

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Experience Summary
              </h3>
              <p
                className={`text-gray-700 leading-relaxed text-lg transition-all duration-300 ease-in-out ${
                  showFullExperience ? "" : "line-clamp-3"
                }`}
              >
                Over 2 years of experience building modern, scalable, and user-centric web applications using
                React, TypeScript, and other cutting-edge technologies. Worked in dynamic startup environments
                solving real-world problems through design-focused engineering. Passionate about building accessible,
                high-performance interfaces that create real value for users.
              </p>
              <button
                onClick={() => setShowFullExperience(!showFullExperience)}
                className="mt-3 text-base text-indigo-600 hover:underline"
              >
                {showFullExperience ? "See Less" : "See More"}
              </button>
            </section>

            <hr className="border-gray-300" />

            <section>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-gray-800">Education</h3>
                <span className="text-2xl text-gray-500 cursor-pointer hover:text-gray-700">+</span>
              </div>
              <div className="w-full h-32 bg-gray-100 rounded-lg shadow-md flex items-center justify-center">
                <p className="text-gray-500">Education details will be added here</p>
              </div>
            </section>

            <hr className="my-6 border-gray-300" />

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Skills</h3>
              <p className="text-gray-600 text-sm mb-4">Skills data to fill their roles</p>
              <div className="border-t border-b border-gray-200 py-4">
                <p className="text-gray-500 mb-2">Soft skills</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {softSkills.length > 0 ? (
                    softSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No skills added yet.</p>
                  )}
                </div>
                <hr className="my-2 border-gray-200" />
                <p className="text-gray-500">Technical skills</p>
              </div>
              <div className="pt-4">
                <button
                  onClick={() => setShowSkillModal(true)}
                  className="px-4 py-2 border border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 text-sm"
                  disabled={loading}
                >
                  Add skills
                </button>
              </div>
            </section>

            <hr className="my-6 border-gray-300" />

            <section>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Upload Resume</h3>
                  <p className="text-sm text-gray-600">Upload your latest CV or resume to share with recruiters.</p>
                </div>
                <button
                  onClick={() => setShowUploadIntro(true)}
                  className="bg-white hover:bg-gray-100 text-gray-700 p-2 border border-gray-300 rounded-full shadow"
                  title="Upload Resume"
                  disabled={loading}
                >
                  <FiEdit className="w-5 h-5" />
                </button>
              </div>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setResumeFile(file);
                    console.log("Resume uploaded:", file.name);
                  }
                }}
                disabled={loading}
              />
              {resumeFile && (
                <p className="mt-2 text-sm text-green-600">Selected: {resumeFile.name}</p>
              )}
            </section>
          </div>
        </div>

        {/* Image Upload Modal */}
        {showImageUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Change Profile Picture</h2>
                <button
                  onClick={() => setShowImageUpload(false)}
                  className="text-gray-500 text-2xl hover:text-gray-700"
                  disabled={loading}
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={loading}
                />
                
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setShowImageUpload(false)}
                    className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resume Upload Modal */}
        {showUploadIntro && (
          <Uploadresume onClose={() => setShowUploadIntro(false)} />
        )}

        {/* Edit Profile Modal */}
        {showEditIntro && (
          <EditProfile
            userData={userInfo}
            onSave={(updated) => setUserInfo(updated)}
            onClose={() => setShowEditIntro(false)}
          />
        )}

        {/* Skills Modal */}
        {showSkillModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Add Skill</h2>
                <button
                  onClick={() => {
                    setShowSkillModal(false);
                    setSelectedSkill("");
                  }}
                  className="text-gray-500 text-2xl hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <label className="block text-sm font-medium mb-2">Skill*</label>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Skill (ex: Project Management)"
                className="w-full border border-gray-300 px-4 py-2 rounded-md mb-4"
              />

              <div>
                <p className="font-semibold mb-2">Suggested based on your profile</p>
                <div className="flex flex-wrap gap-3">
                  {suggestedSkills.map((skill) => (
                    <span
                      key={skill}
                      onClick={() => setSelectedSkill(skill)}
                      className={`px-4 py-2 border rounded-full text-sm cursor-pointer ${
                        selectedSkill === skill
                          ? "bg-blue-100 text-blue-700 border-blue-500"
                          : "text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowSkillModal(false)}
                  className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (selectedSkill && !softSkills.includes(selectedSkill)) {
                      const success = await addSkill(selectedSkill);
                      if (success) {
                        setShowSkillModal(false);
                        setSelectedSkill("");
                        setSkillInput("");
                      }
                    }
                  }}
                  className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;