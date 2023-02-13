import { useState } from 'react';
import { Notification } from '../types/index';

const useNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({
    title: '',
    description: '',
    duration: 0,
    type: 'success', // 'warning', 'info', 'error'
    link: 'https://bscscan.com', // optional link
  } as Notification);
  const NOTIFICATION_DURATION_MS = 6000; // close after 6s

  const dismissNotification = () => {
    setShowNotification(false);
  }

  const popNotification = (noti: Notification) => {
    setNotification(noti);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, noti.duration || NOTIFICATION_DURATION_MS);
  }

  return {
    dismissNotification,
    notification,
    popNotification,
    showNotification,
  }
}

export default useNotification;