import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, AlertTriangle, Check, X, Trash2 } from 'lucide-react';
import axiosInstance from '../Utils/axiosInstance';
import { getUserIdFromToken } from '../Utils/jwtUtils';
import { toast } from 'react-toastify';

const UserNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  // Get user ID from token
  const userId = getUserIdFromToken(localStorage.getItem('token'));

  // Notification types mapping based on your API
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
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [userId]);

  // Function to load all notifications
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`api/Notification/user/${userId}`);
      
      if (response.data.isSuccess) {
        setNotifications(response.data.data || []);
      } else {
        toast.error('Failed to load notifications');
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Error loading notifications');
    } finally {
      setLoading(false);
    }
  };

  // Function to load unread count
  const loadUnreadCount = async () => {
    try {
      const response = await axiosInstance.get(`api/Notification/user/${userId}/unread-count`);
      
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
      const response = await axiosInstance.put('api/Notification/mark-read', {
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
      } else {
        toast.error('Failed to mark as read');
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  // Function to delete notification
  const deleteNotification = async (notificationId) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      const response = await axiosInstance.delete(`api/Notification/${notificationId}`);
      
      if (response.data.isSuccess) {
        // Remove from local state
        const deletedNotification = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        
        // Update unread count if deleted notification was unread
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        
        toast.success('Notification deleted');
      } else {
        toast.error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  // Function to mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await axiosInstance.put(`api/Notification/user/${userId}/mark-all-read`);
      
      if (response.data.isSuccess) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success('All notifications marked as read');
      } else {
        toast.error('Failed to mark all as read');
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
    if (diffInHours < 48) return '1 day ago';
    return date.toLocaleDateString();
  };

  // Handle notification action based on type
  const handleNotificationAction = (notification) => {
    switch(notification.notificationTypeId) {
      case 1: // Email
        toast.info('Email notification - Check your email inbox');
        break;
      case 2: // SMS
        toast.info('SMS notification - Check your phone messages');
        break;
      case 3: // System Alert
        // You can add navigation logic here
        toast.info('System alert acknowledged');
        break;
      default:
        console.log('Unknown notification type');
    }
    markAsRead(notification.id);
  };

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
    switch(filter) {
      case 'unread':
        return !notification.isRead;
      case 'read':
        return notification.isRead;
      default:
        return true;
    }
  });

  const NotificationItem = ({ notification }) => {
    // Default to system alert if notificationTypeId is not recognized
    const type = notificationTypes[notification.notificationTypeId] || notificationTypes[3];
    const IconComponent = type.icon;

    return (
      <div className={`p-6 border-l-4 border-${type.color}-500 bg-white rounded-lg shadow-sm mb-4 ${!notification.isRead ? 'bg-blue-50' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className={`p-3 bg-${type.color}-100 rounded-full flex-shrink-0`}>
              <IconComponent className={`w-5 h-5 text-${type.color}-600`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-semibold text-gray-900">{notification.title || 'Notification'}</h4>
                <span className={`px-2 py-1 text-xs rounded-full bg-${type.color}-100 text-${type.color}-800`}>
                  {type.name}
                </span>
                {!notification.isRead && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                )}
              </div>
              <p className="text-gray-700 text-sm mb-2 leading-relaxed">
                {notification.message}
              </p>
              {notification.jobTitle && (
                <p className="text-xs text-blue-600 font-medium mb-2">
                  Job: {notification.jobTitle}
                </p>
              )}
              <p className="text-gray-500 text-xs">
                {formatDate(notification.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            {!notification.isRead && (
              <button
                onClick={() => markAsRead(notification.id)}
                className={`p-2 text-${type.color}-600 hover:bg-${type.color}-50 rounded-full transition-colors`}
                title="Mark as read"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => handleNotificationAction(notification)}
              className={`p-2 text-${type.color}-600 hover:bg-${type.color}-50 rounded-full transition-colors`}
              title="View notification"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteNotification(notification.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete notification"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bell className="w-8 h-8 text-blue-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600">Manage your notifications and alerts</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => loadNotifications()}
                disabled={loading}
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mark All Read
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-4 border-b border-gray-200">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: notifications.filter(n => !n.isRead).length },
              { key: 'read', label: 'Read', count: notifications.filter(n => n.isRead).length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`pb-2 px-1 border-b-2 transition-colors ${
                  filter === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div>
          {loading ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <Bell size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
              </h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? "You'll see your notifications here when you receive them."
                  : `You have no ${filter} notifications at the moment.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {notifications.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(notificationTypes).map(([id, type]) => {
                const count = notifications.filter(n => n.notificationTypeId === parseInt(id)).length;
                const unreadTypeCount = notifications.filter(n => n.notificationTypeId === parseInt(id) && !n.isRead).length;
                return (
                  <div key={id} className={`p-4 bg-${type.color}-50 rounded-lg border border-${type.color}-200`}>
                    <div className="flex items-center space-x-3">
                      <type.icon className={`w-6 h-6 text-${type.color}-600`} />
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{count}</div>
                        <div className="text-sm text-gray-600">{type.name}</div>
                        {unreadTypeCount > 0 && (
                          <div className="text-xs text-red-600">{unreadTypeCount} unread</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNotificationsPage;