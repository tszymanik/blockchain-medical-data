import React from 'react';

export const UserContext = React.createContext({
  userName: '',
  setUserName: (userName: string) => {},
});
