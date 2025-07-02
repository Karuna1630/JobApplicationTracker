import React from "react";

const CandidateScreening = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-6 flex flex-col items-center text-white">
          <div className="w-20 h-20 bg-white rounded-full shadow-md mb-4 border-4 border-indigo-400" />
          <h2 className="text-2xl font-semibold tracking-wide">John Doe</h2>
          <p className="text-sm opacity-90">Frontend Developer | UI/UX Specialist</p>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Contact Info */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📞 Contact Information</h3>
            <ul className="space-y-1 text-gray-600">
              <li><strong>Email:</strong> example@email.com</li>
              <li><strong>Phone:</strong> 123-456-7890</li>
              <li><strong>Location:</strong> Belbari, Nepal</li>
            </ul>
          </section>

          {/* Experience */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">💼 Experience Summary</h3>
            <p className="text-gray-700 leading-relaxed">
              Over 2 years of experience building modern, scalable, and user-centric web applications using
              React, TypeScript, and other cutting-edge technologies. Worked in dynamic startup environments
              solving real-world problems through design-focused engineering.
            </p>
          </section>

          {/* Skills */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🛠️ Key Skills</h3>
            <div className="flex flex-wrap gap-2">
              {["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Node.js", "Figma"].map((skill) => (
                <span
                  key={skill}
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Notes */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📝 Screening Notes</h3>
            <textarea
              rows={4}
              placeholder="Add your screening notes here..."
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </section>

          {/* Actions */}
          <section className="flex flex-wrap justify-between items-center mt-6">
            <div className="flex gap-4">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition">
                Schedule Interview
              </button>
              <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-medium py-2 px-4 rounded-lg transition">
                Send Assessment
              </button>
            </div>
            <button className="text-sm text-gray-500 hover:underline mt-4 sm:mt-0">Cancel</button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CandidateScreening;
