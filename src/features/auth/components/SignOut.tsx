import { Button, ConfirmationDialog } from 'components';
import { signOut, Auth } from 'firebase/auth';
import { auth } from 'lib/firebase/firebase';
import { useNavigate } from 'react-router-dom';

export const SignOut = () => {
  const navigate = useNavigate();

  return (
    <ConfirmationDialog
      triggerButton={<Button>Sign Out</Button>}
      title='Sign Out?'
      confirmAction={async () => {
        await signOut(auth as Auth);
        navigate('/auth/login');
      }}
    >
      Are you sure you want to sign out?
    </ConfirmationDialog>
  );
};
