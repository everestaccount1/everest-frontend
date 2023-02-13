import React from "react";
import { INotificationContext } from "../types";

const defaultState = {
  notification: null,
  showNotification: false,
  dismissNotification: () => {},
  popNotification: () => {},
}

const NotificationContext = React.createContext<INotificationContext>(defaultState);

export default NotificationContext;