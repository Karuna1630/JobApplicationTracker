import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, FileText, Users, Lock } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const TermsAndPolicy = () => {
  const [activeTab, setActiveTab] = useState('terms');
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-blue-800 text-white shadow-lg' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const Section = ({ title, children, sectionKey }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 px-4 rounded-lg transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="text-gray-500" size={20} />
        ) : (
          <ChevronDown className="text-gray-500" size={20} />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="px-4 pb-4 text-gray-700 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );

  const TermsContent = () => (
    <div className="space-y-0">
      <Section title="Acceptance of Terms" sectionKey="acceptance">
        <p className="mb-4">
          By accessing and using this application ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
        </p>
        <p>
          These terms may be updated from time to time, and your continued use of the Service constitutes acceptance of such changes.
        </p>
      </Section>

      <Section title="Service Description" sectionKey="service">
        <p className="mb-4">
          This application is a personal productivity tool designed to help users organize, track, and manage their activities and data. The Service includes features such as:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Data tracking and status updates</li>
          <li>Information management</li>
          <li>Scheduling and notes</li>
          <li>Document storage and organization</li>
          <li>Progress analytics and insights</li>
        </ul>
        <p>
          We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time.
        </p>
      </Section>

      <Section title="User Responsibilities" sectionKey="responsibilities">
        <p className="mb-4">As a user of this Service, you agree to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Provide accurate and truthful information</li>
          <li>Keep your login credentials secure and confidential</li>
          <li>Use the Service only for lawful purposes</li>
          <li>Not attempt to gain unauthorized access to other users' data</li>
          <li>Not use the Service to store illegal or harmful content</li>
          <li>Respect the intellectual property rights of others</li>
        </ul>
      </Section>

      <Section title="Data Ownership" sectionKey="ownership">
        <p className="mb-4">
          You retain full ownership of all data you input into this application. This includes but is not limited to:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Personal information and details</li>
          <li>Notes and documentation</li>
          <li>Files and documents uploaded to the Service</li>
          <li>Any other content created or uploaded by you</li>
        </ul>
        <p>
          We do not claim any ownership rights over your data and will not use it for any purpose other than providing the Service to you.
        </p>
      </Section>

      <Section title="Limitation of Liability" sectionKey="liability">
        <p className="mb-4">
          This application is provided "as is" without any warranties, expressed or implied. We shall not be liable for any damages arising from the use or inability to use this Service, including but not limited to:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Loss of data or information</li>
          <li>Business interruption or lost opportunities</li>
          <li>Technical failures or service outages</li>
          <li>Any indirect, incidental, or consequential damages</li>
        </ul>
      </Section>

    </div>
  );

  const PrivacyContent = () => (
    <div className="space-y-0">
      <Section title="Information We Collect" sectionKey="collect">
        <p className="mb-4">We collect information you provide directly to us, including:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Account Information:</strong> Email address, name, and password</li>
          <li><strong>Application Data:</strong> Personal information, notes, and status updates</li>
          <li><strong>Documents:</strong> Files and documents you upload</li>
          <li><strong>Usage Data:</strong> How you interact with our Service for improvement purposes</li>
        </ul>
        <p>
          We do not collect sensitive personal information beyond what's necessary for the Service functionality.
        </p>
      </Section>

      <Section title="How We Use Your Information" sectionKey="usage">
        <p className="mb-4">We use the information we collect to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Provide, maintain, and improve our Service</li>
          <li>Process transactions and send related information</li>
          <li>Send technical notices and support messages</li>
          <li>Respond to your comments and questions</li>
          <li>Analyze usage patterns to improve user experience</li>
        </ul>
        <p>
          <strong>We do not sell, rent, or share your personal information with third parties for marketing purposes.</strong>
        </p>
      </Section>

      <Section title="Data Security" sectionKey="security">
        <p className="mb-4">
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Encryption of data in transit and at rest</li>
          <li>Regular security assessments and updates</li>
          <li>Access controls and authentication requirements</li>
          <li>Secure backup and disaster recovery procedures</li>
        </ul>
        <p>
          However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
        </p>
      </Section>

      <Section title="Data Retention" sectionKey="retention">
        <p className="mb-4">
          We retain your information for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data at any time through your account settings.
        </p>
        <p>
          After account deletion, we may retain certain information for legitimate business purposes, such as fraud prevention and legal compliance, but will anonymize it where possible.
        </p>
      </Section>

      <Section title="Your Rights" sectionKey="rights">
        <p className="mb-4">You have the right to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Access and review your personal information</li>
          <li>Correct inaccurate or incomplete information</li>
          <li>Delete your account and associated data</li>
          <li>Export your data in a portable format</li>
          <li>Opt-out of certain communications</li>
          
        </ul>
        <p>
          To exercise these rights, please contact us through your account settings or our support channels.
        </p>
      </Section>

      <Section title="Contact Information" sectionKey="contact">
        <p className="mb-4">
          If you have any questions about this Privacy Policy or our data practices, please contact us at:
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p><strong>Email:</strong> info@jobmanager.com</p>
          <p><strong>Address:</strong> Itahari, Nepal.</p>
          <p>TowerBlock, Itahari-7</p>
        </div>
      </Section>
    </div>
  );

  return (
    <>
        <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Terms & Privacy Policy
          </h1>
          <p className="text-gray-600 text-lg">Legal Information & Privacy Policy</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-4 p-6 bg-gray-50 border-b">
            <TabButton
              id="terms"
              label="Terms of Service"
              icon={FileText}
              isActive={activeTab === 'terms'}
              onClick={() => setActiveTab('terms')}
            />
            <TabButton
              id="privacy"
              label="Privacy Policy"
              icon={Shield}
              isActive={activeTab === 'privacy'}
              onClick={() => setActiveTab('privacy')}
            />
          </div>

          {/* Content Area */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                {activeTab === 'terms' ? (
                  <>
                    <FileText className="text-blue-800" size={28} />
                    <span>Terms of Service</span>
                  </>
                ) : (
                  <>
                    <Shield className="text-green-800" size={28} />
                    <span>Privacy Policy</span>
                  </>
                )}
              </h2>
              <p className="text-gray-600 mt-2">
                {activeTab === 'terms' 
                  ? 'Last updated: January 2025'
                  : 'Last updated: January 2025 | Effective: January 2025'
                }
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg">
              {activeTab === 'terms' ? <TermsContent /> : <PrivacyContent />}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-600">
              <p>© 2025 Your Application. All rights reserved.</p>
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>User-Friendly</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Lock size={16} />
                  <span>Secure</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default TermsAndPolicy;
