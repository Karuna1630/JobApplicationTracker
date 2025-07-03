import React, { useState } from "react";

const EditProfile = ({ userData, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    additionalName: "",
    headline: userData?.bio || "",
    phone: userData?.phone || "",
    email: userData?.email || "",
    location: userData?.location || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send only selected data back
    onSave({
      firstName: formData.firstName,
      lastName: formData.lastName,
      bio: formData.headline,
      phone: formData.phone,
      email: formData.email,
      location: formData.location,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative max-h-[95vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Edit Intro</h2>
        <p className="text-sm text-gray-500 mb-6">* Indicates required</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              First name <span className="text-red-500">*</span>
            </label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="First name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Last name <span className="text-red-500">*</span>
            </label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Last name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Additional name</label>
            <input
              name="additionalName"
              value={formData.additionalName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Middle name or other"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-500">Name pronunciation</label>
            <div className="text-sm text-gray-400">
              <span className="text-blue-600 font-medium">ℹ</span> This can only be added using our mobile app
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Headline <span className="text-red-500">*</span>
            </label>
            <textarea
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
              placeholder="e.g., Student at Itahari International College"
            />
          </div>

          {/* Optional: Add more fields if needed like current position, etc. */}

          <div className="flex justify-end mt-6 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
        {/* sdfghjklfghjkdfghjk */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
