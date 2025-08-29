import React, { useState, useEffect } from 'react';
import { Bell, X, Mail, MessageSquare, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Add this import
import axiosInstance from '../Utils/axiosInstance';
import { getUserIdFromToken } from '../Utils/jwtUtils';
import { toast } from 'react-toastify';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Add navigation hook
  
  // Get user ID from token
  const userId = getUserIdFromToken(localStorage.getItem('token'));

  // Notification types mapping
  const notificationTypes = {
    1: { name: 'Email', icon: Mail, color: 'blue', description: 'Email notifications' },
    2: { name: 'SMS', icon: MessageSquare, color: 'green', description: 'SMS notifications' },
    3: { name: 'System Alert', icon: AlertTriangle, color: 'orange', description: 'In-app notifications' }
  };

  // Load notifications when component mounts
  useEffect(() => {
    if (userId && userId !== 0) {
      loadNotifications();
      loadUnreadCount();

      // Check for new notifications every 30 seconds
      const interval = setInterval(() => {
        loadUnreadCount();
        // Only refresh notifications if dropdown is closed to avoid interrupting user
        if (!isOpen) {
          loadNotifications();
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [userId, isOpen]);

  // Function to load ALL notifications (no limit)
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`api/Notification/user/${userId}`);
      
      // Handle both response formats: direct array or wrapped in {isSuccess, data}
      let allNotifications = [];
      
      if (response.data.isSuccess !== undefined) {
        // Standard wrapped response
        if (response.data.isSuccess) {
          allNotifications = response.data.data || [];
        }
      } else if (Array.isArray(response.data)) {
        // Direct array response
        allNotifications = response.data;
      }
      
      console.log('Loaded notifications:', allNotifications);
      
      // Sort by creation date (most recent first) - Show ALL notifications
      const sortedNotifications = allNotifications
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setNotifications(sortedNotifications);
      
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to load unread count
  const loadUnreadCount = async () => {
    try {
      const response = await axiosInstance.get(`api/Notification/user/${userId}/unread-count`);
      
      // Handle both response formats
      let count = 0;
      if (response.data.isSuccess !== undefined) {
        if (response.data.isSuccess) {
          count = response.data.data || 0;
        }
      } else {
        // If direct number response
        count = typeof response.data === 'number' ? response.data : 0;
      }
      
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
      // Fallback: calculate unread count from notifications
      if (notifications.length > 0) {
        const unreadFromNotifications = notifications.filter(n => !n.isRead).length;
        setUnreadCount(unreadFromNotifications);
      }
    }
  };

  // Function to mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await axiosInstance.put(`api/Notification/mark-read/${notificationId}`);
      
      // Handle response format
      const success = response.data.isSuccess !== undefined ? 
        response.data.isSuccess : response.status === 200;
      
      if (success) {
        // Update local state
        setNotifications(prev => 
          prev.map(n => 
            n.notificationId === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        toast.success('Marked as read');
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  // Function to mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await axiosInstance.put(`api/Notification/user/${userId}/mark-all-read`);
      
      const success = response.data.isSuccess !== undefined ? 
        response.data.isSuccess : response.status === 200;
      
      if (success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  // Function to extract job ID from notification
  const extractJobId = (notification) => {
    // Method 1: Check if jobId exists directly in notification object
    if (notification.jobId) {
      return notification.jobId;
    }
    
    // Method 2: Check if there's a relatedId field that contains jobId
    if (notification.relatedId) {
      return notification.relatedId;
    }
    
    // Method 3: Parse from message content if jobId is mentioned
    if (notification.message) {
      const jobIdMatch = notification.message.match(/job\s*(?:id|#)?\s*:?\s*(\d+)/i);
      if (jobIdMatch) {
        return parseInt(jobIdMatch[1]);
      }
    }
    
    // Method 4: Parse from title if jobId is mentioned
    if (notification.title) {
      const jobIdMatch = notification.title.match(/job\s*(?:id|#)?\s*:?\s*(\d+)/i);
      if (jobIdMatch) {
        return parseInt(jobIdMatch[1]);
      }
    }
    
    return null;
  };

  // Function to format date (updated to match screenshot format)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays)} days ago`;
    
    // Format like: "August 18, 2025 at 08:06 AM"
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Handle bell click
  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen && notifications.length === 0) {
      loadNotifications(); // Load notifications when opening dropdown
    }
  };

  // Handle notification click - Updated to include navigation
  const handleNotificationClick = async (notification) => {
    try {
      // Always mark as read first if not already read
      if (!notification.isRead) {
        await markAsRead(notification.notificationId);
      }

      // Extract job ID from notification
      const jobId = extractJobId(notification);
      
      // Close the dropdown
      setIsOpen(false);

      // Navigate to job page if jobId exists
      if (jobId) {
        navigate(`/job/${jobId}`);
        toast.success('Navigating to job details...');
      } else {
        // Handle specific actions based on notification type if no jobId
        switch(notification.notificationTypeId) {
          case 1: // Email
            toast.info('Email notification - Check your email inbox');
            break;
          case 2: // SMS
            toast.info('SMS notification - Check your phone messages');
            break;
          case 3: // System Alert
            toast.info('System alert acknowledged');
            break;
          default:
            toast.info('Notification viewed');
        }
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
      toast.error('Failed to process notification');
    }
  };

  // Get notification type info
  const getNotificationType = (typeId) => {
    return notificationTypes[typeId] || notificationTypes[3]; // Default to system alert
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium text-[10px]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[600px] overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 bg-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded-full font-medium">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-700 px-3 py-1 rounded hover:bg-blue-50 transition-colors font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm">Loading...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell size={40} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-base font-medium mb-2">No notifications</p>
                  <p className="text-sm text-gray-400">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => {
                    const notificationType = getNotificationType(notification.notificationTypeId);
                    const IconComponent = notificationType.icon;
                    const hasJobId = extractJobId(notification) !== null;
                    
                    return (
                      <div
                        key={notification.notificationId}
                        className={`px-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                          !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'bg-white'
                        } ${hasJobId ? 'hover:bg-blue-50' : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-4">
                          {/* Notification Type Icon */}
                          <div className={`p-2 rounded-lg flex-shrink-0 mt-1 ${
                            notification.notificationTypeId === 1 ? 'bg-blue-100' :
                            notification.notificationTypeId === 2 ? 'bg-green-100' :
                            'bg-orange-100'
                          }`}>
                            <IconComponent className={`w-4 h-4 ${
                              notification.notificationTypeId === 1 ? 'text-blue-600' :
                              notification.notificationTypeId === 2 ? 'text-green-600' :
                              'text-orange-600'
                            }`} />
                          </div>
                          
                          {/* Notification Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-900">
                                {notificationType.name}
                                {hasJobId && <span className="ml-1 text-xs text-blue-600">(Click to view job)</span>}
                              </span>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            
                            <p className="text-base text-gray-800 leading-relaxed mb-3">
                              {notification.message}
                            </p>
                            
                            {notification.title && notification.title !== 'string' && (
                              <p className="text-sm text-blue-600 font-medium mb-2">
                                {notification.title}
                              </p>
                            )}
                            
                            <p className="text-sm text-gray-500">
                              {formatDate(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;