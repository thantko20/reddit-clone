import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from 'lib/firebase/firebase';
import { UserType } from '../types';

export const getUser = async () => {
  if (!auth.currentUser) return;

  const userRef = doc(db, 'users', auth.currentUser.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) return userSnap.data() as UserType;
};
