import { RegisterForm, Layout } from '../components';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const navigate = useNavigate();

  return (
    <Layout title='Register an Account'>
      <RegisterForm onSuccess={() => navigate('/app')} />
    </Layout>
  );
};
