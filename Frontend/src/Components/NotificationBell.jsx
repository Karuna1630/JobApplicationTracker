import React, { useState, useEffect } from 'react';
import { Bell, X, Trash2 } from 'lucide-react';
import axiosInstance from '../Utils/axiosInstance';
import { getUserIdFromToken } from '../Utils/jwtUtils';
import { toast } from 'react-toastify';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get user ID from token
  const userId = getUserIdFromToken(localStorage.getItem('token'));

  // Load notifications when component mounts
  useEffect(() => {
    if (userId && userId !== 0) {
      loadNotifications();
      loadUnreadCount();

      // Check for new notifications every 30 seconds
      const interval = setInterval(() => {
        loadUnreadCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [userId]);

  // Function to load all notifications
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/Notification/user/${userId}`);
      
      if (response.data.isSuccess) {
        setNotifications(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to load unread count
  const loadUnreadCount = async () => {
    try {
      const response = await axiosInstance.get(`/Notification/user/${userId}/unread-count`);
      
      if (response.data.isSuccess) {
        setUnreadCount(response.data.data || 0);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  // Function to mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await axiosInstance.put('/Notification/mark-read', {
        notificationId
      });
      
      if (response.data.isSuccess) {
        // Update local state
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
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

  // Function to delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const response = await axiosInstance.delete(`/Notification/${notificationId}`);
      
      if (response.data.isSuccess) {
        // Remove from local state
        const deletedNotification = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        
        // Update unread count if deleted notification was unread
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        
        toast.success('Notification deleted');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  // Function to mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await axiosInstance.put(`/Notification/user/${userId}/mark-all-read`);
      
      if (response.data.isSuccess) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    return date.toLocaleDateString();
  };

  // Handle bell click
  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen && notifications.length === 0) {
      loadNotifications(); // Load notifications when opening dropdown
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={handleBellClick}
        className="relative p-2 text-blue-800 hover:text-blue-600 transition-colors"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell size={48} className="mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                    !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">📢</span>
                        <span className="text-sm text-gray-600">
                          {formatDate(notification.createdAt)}
                        </span>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-800 mb-1">
                        {notification.message}
                      </p>
                      {notification.jobTitle && (
                        <p className="text-xs text-blue-600 font-medium">
                          Job: {notification.jobTitle}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-gray-400 hover:text-red-500 ml-2 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;