import { Injectable } from '@angular/core';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import { Observable, BehaviorSubject, from } from 'rxjs';

export interface UserProfile {
  uid: string;
  email?: string;
  name?: string;
  phone?: string;
  role: 'guest' | 'user' | 'business';
  stripeById?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<UserProfile | null>(null);
  user$ = this.userSubject.asObservable();

  get currentUser(): UserProfile | null {
    return this.userSubject.value;
  }


  constructor() {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch profile
        const profile = await this.getUserProfile(firebaseUser.uid);
        if (profile) {
          this.userSubject.next(profile);
        } else {
          // Fallback / Guest handling
          this.userSubject.next({
            uid: firebaseUser.uid,
            email: firebaseUser.email || undefined,
            role: firebaseUser.isAnonymous ? 'guest' : 'user'
          });
        }
      } else {
        this.userSubject.next(null);
      }
    });
  }

  async login(email: string, pass: string) {
    return signInWithEmailAndPassword(auth, email, pass);
  }

  async loginAnonymously() {
    return signInAnonymously(auth);
  }

  async signUp(email: string, pass: string, name: string, role: 'user' | 'business' = 'user') {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const uid = cred.user.uid;

    const profile: UserProfile = {
      uid,
      email,
      name,
      role
    };

    await setDoc(doc(db, 'users', uid), profile);
    return cred;
  }

  async logout() {
    return signOut(auth);
  }

  async getUserProfile(uid: string): Promise<UserProfile | undefined> {
    const docSnap = await getDoc(doc(db, 'users', uid));
    return docSnap.exists() ? (docSnap.data() as UserProfile) : undefined;
  }
}
