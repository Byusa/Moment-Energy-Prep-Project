import React from 'react';
import Dashboard from './components/Dashboard';
import UploadForm from './components/UploadForm';

const App = () => {
  return (
    <div className="App">
      <UploadForm />
      <Dashboard />
    </div>
  );
};

export default App;
