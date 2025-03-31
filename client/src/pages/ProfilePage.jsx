import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  if (!isLoggedIn) return <Navigate to="/login" />;

  return (
    <div className="profile">
      <h1>Your Profile</h1>
      {/* Add profile content here */}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default ProfilePage;