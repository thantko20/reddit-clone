import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <Router>
      <Toaster />
      <h1>Hello World</h1>
    </Router>
  );
};

export default App;
