// Admin authentication helper functions

export const isAdminLoggedIn = () => {
  return sessionStorage.getItem('adminLoggedIn') === 'true';
};

export const getAdminUser = () => {
  return sessionStorage.getItem('adminUser');
};

export const logoutAdmin = () => {
  sessionStorage.removeItem('adminLoggedIn');
  sessionStorage.removeItem('adminUser');
};

export const loginAdmin = (username) => {
  sessionStorage.setItem('adminLoggedIn', 'true');
  sessionStorage.setItem('adminUser', username);
};
