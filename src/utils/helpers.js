import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { auth } from '../config/firebase.config';
import { v4 as uuidv4 } from 'uuid';

const googleProvider = new GoogleAuthProvider()
const gitHubProvider = new GithubAuthProvider()

export const signINWithGoogle = async () => {
  await signInWithPopup(auth, googleProvider).then((userCredentials) => {
    window.location.reload()
  })
}

export const signINWithGitHub = async () => {
  await signInWithPopup(auth, gitHubProvider).then((userCredentials) => {
    window.location.reload()
  })
}

export const Menus = [
  {
    id: uuidv4(),
    name: 'Projects',
    uri: '/home/projects',
  },
  {
    id: uuidv4(),
    name: 'Collections',
    uri: '/home/collections',
  },
  {
    id: uuidv4(),
    name: 'Profile',
    uri: '/home/profile',
  },
];


  export const signOutAction = async() => {
    await auth.signOut().then(() => {
      localStorage.clear();


      window.location.reload();
    });

  }
