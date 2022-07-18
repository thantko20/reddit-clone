import { firebaseConfig } from './config';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import uniqid from 'uniqid';

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const saveFileInStorage = async (file: File, folderName: string) => {
  if (!file) return;

  const imgRef = ref(storage, `${folderName}/${uniqid()}`);

  await uploadBytes(imgRef, file);

  const downloadURL = await getDownloadURL(imgRef);

  return downloadURL;
};

export { auth, db, storage, saveFileInStorage };
