import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Button } from './components';
import { AuthProvider } from './providers';
import { AppRoutes } from './routes';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
      <Toaster />
    </AuthProvider>
  );
};

export default App;
