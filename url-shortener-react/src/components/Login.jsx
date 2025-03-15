import GoogleAuthButton from './GoogleAuthButton';

const Login = () => {
  return (
    <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-darkBg' : 'bg-lightBg'}`}>
      {/* ... existing form code */}
      
      {/* Add this after the login button */}
      <div className="mt-4 w-full">
        <div className="flex items-center my-4">
          <div className={`flex-1 h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <p className={`mx-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>OR</p>
          <div className={`flex-1 h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        </div>
        
        <GoogleAuthButton />
      </div>
      
      {/* ... rest of the component */}
    </div>
  );
};

export default Login; 