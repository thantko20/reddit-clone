import { Layout, LoginForm } from '../components';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();

  return (
    <Layout title='Login To Your Account'>
      <LoginForm onSuccess={() => navigate('/app')} />
    </Layout>
  );
};
