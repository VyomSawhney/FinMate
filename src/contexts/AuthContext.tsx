'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, FinancialGoal } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserGoal: (goal: string) => Promise<void>;
  updateUserProfile: (data: { displayName?: string }) => Promise<void>;
  updateUserGoals: (goals: FinancialGoal[], primaryGoal?: FinancialGoal) => Promise<void>;
  updateUserXP: (xp: number) => Promise<void>;
  updateUserStreak: () => Promise<void>;
  markLessonCompleted: (lessonId: string) => Promise<void>;
  resetProgress: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Firebase is initialized
    if (!auth || !db) {
      console.warn('Firebase not initialized, skipping auth state listener');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Convert Firestore timestamps to Date objects
            const processedUserData: User = {
              uid: userData.uid || firebaseUser.uid,
              email: userData.email || firebaseUser.email || '',
              displayName: userData.displayName || firebaseUser.displayName || undefined,
              photoURL: userData.photoURL || firebaseUser.photoURL || undefined,
              lastLogin: userData.lastLogin?.toDate?.() || new Date(),
              createdAt: userData.createdAt?.toDate?.() || new Date(),
              updatedAt: userData.updatedAt?.toDate?.() || new Date(),
              completedLessons: Array.isArray(userData.completedLessons) ? userData.completedLessons : [],
              selectedGoals: Array.isArray(userData.selectedGoals) ? userData.selectedGoals : (userData.selectedGoal ? [userData.selectedGoal] : ['budgeting']),
              primaryGoal: userData.primaryGoal || userData.selectedGoal || 'budgeting',
              xp: typeof userData.xp === 'number' ? userData.xp : 0,
              level: typeof userData.level === 'number' ? userData.level : 1,
              streak: typeof userData.streak === 'number' ? userData.streak : 0,
            } as User;
            setUser(processedUserData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document in Firestore
    const newUser: User = {
      uid: result.user.uid,
      email: result.user.email!,
      displayName,
      xp: 0,
      level: 1,
      streak: 0,
      lastLogin: new Date(),
      selectedGoals: ['budgeting'],
      primaryGoal: 'budgeting',
      completedLessons: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', result.user.uid), newUser);
    
    // Update local user state immediately
    setUser(newUser);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Check if user document exists
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      // Create new user document
      const newUser: User = {
        uid: result.user.uid,
        email: result.user.email!,
        displayName: result.user.displayName || undefined,
        photoURL: result.user.photoURL || undefined,
        xp: 0,
        level: 1,
        streak: 0,
        lastLogin: new Date(),
        selectedGoals: ['budgeting'],
        primaryGoal: 'budgeting',
        completedLessons: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', result.user.uid), newUser);
      
      // Update local user state immediately for new users
      setUser(newUser);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserGoal = async (goal: string) => {
    if (!firebaseUser) return;
    
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid), { 
        selectedGoal: goal, 
        updatedAt: new Date() 
      });
      
      // Update local user state if it exists
      if (user) {
        const updatedUser = { ...user, selectedGoal: goal as FinancialGoal, updatedAt: new Date() };
        setUser(updatedUser);
      } else {
        // If user object doesn't exist yet, fetch the updated user data
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const processedUserData: User = {
            uid: userData.uid || firebaseUser.uid,
            email: userData.email || firebaseUser.email || '',
            displayName: userData.displayName || firebaseUser.displayName || undefined,
            photoURL: userData.photoURL || firebaseUser.photoURL || undefined,
            lastLogin: userData.lastLogin?.toDate?.() || new Date(),
            createdAt: userData.createdAt?.toDate?.() || new Date(),
            updatedAt: userData.updatedAt?.toDate?.() || new Date(),
            completedLessons: Array.isArray(userData.completedLessons) ? userData.completedLessons : [],
            selectedGoals: Array.isArray(userData.selectedGoals) ? userData.selectedGoals : (userData.selectedGoal ? [userData.selectedGoal] : ['budgeting']),
            primaryGoal: userData.primaryGoal || userData.selectedGoal || 'budgeting',
            xp: typeof userData.xp === 'number' ? userData.xp : 0,
            level: typeof userData.level === 'number' ? userData.level : 1,
            streak: typeof userData.streak === 'number' ? userData.streak : 0,
          } as User;
          setUser(processedUserData);
        }
      }
    } catch (error) {
      console.error('Error updating user goal:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: { displayName?: string }) => {
    if (!user || !firebaseUser) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...data,
        updatedAt: new Date(),
      });
      setUser({ ...user, ...data, updatedAt: new Date() });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const updateUserGoals = async (goals: FinancialGoal[], primaryGoal?: FinancialGoal) => {
    if (!user || !firebaseUser) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        selectedGoals: goals,
        primaryGoal: primaryGoal || goals[0],
        updatedAt: new Date(),
      });
      setUser({ ...user, selectedGoals: goals, primaryGoal: primaryGoal || goals[0], updatedAt: new Date() });
    } catch (error) {
      console.error('Error updating user goals:', error);
      throw error;
    }
  };

  const markLessonCompleted = async (lessonId: string) => {
    if (!user || !firebaseUser) return;
    try {
      const updatedCompletedLessons = [...(user.completedLessons || []), lessonId];
      await updateDoc(doc(db, 'users', user.uid), {
        completedLessons: updatedCompletedLessons,
        updatedAt: new Date(),
      });
      setUser({ ...user, completedLessons: updatedCompletedLessons, updatedAt: new Date() });
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
      throw error;
    }
  };

  const updateUserXP = async (xp: number) => {
    if (!user) return;
    
    const newXP = user.xp + xp;
    const newLevel = Math.floor(newXP / 1000) + 1;
    
    const updatedUser = { 
      ...user, 
      xp: newXP, 
      level: newLevel, 
      updatedAt: new Date() 
    };
    
    await updateDoc(doc(db, 'users', user.uid), { 
      xp: newXP, 
      level: newLevel, 
      updatedAt: new Date() 
    });
    
    setUser(updatedUser);
  };

  const updateUserStreak = async () => {
    if (!user || !firebaseUser) return;
    
    try {
      const today = new Date();
      const lastLogin = user.lastLogin ? new Date(user.lastLogin) : today;
      const daysSinceLastLogin = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
      
      let newStreak = user.streak || 0;
      if (daysSinceLastLogin === 1) {
        newStreak += 1;
      } else if (daysSinceLastLogin > 1) {
        newStreak = 1;
      }
      
      const updatedUser = { 
        ...user, 
        streak: newStreak, 
        lastLogin: today, 
        updatedAt: new Date() 
      };
      
      await updateDoc(doc(db, 'users', firebaseUser.uid), { 
        streak: newStreak, 
        lastLogin: today, 
        updatedAt: new Date() 
      });
      
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user streak:', error);
    }
  };

  const resetProgress = async () => {
    if (!user || !firebaseUser) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        xp: 0,
        level: 1,
        streak: 0,
        completedLessons: [],
        selectedGoals: ['budgeting'],
        primaryGoal: 'budgeting',
        updatedAt: new Date(),
      });
      setUser({
        ...user,
        xp: 0,
        level: 1,
        streak: 0,
        completedLessons: [],
        selectedGoals: ['budgeting'],
        primaryGoal: 'budgeting',
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error resetting user progress:', error);
      throw error;
    }
  };

  const value = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    updateUserGoal,
    updateUserProfile,
    updateUserGoals,
    updateUserXP,
    updateUserStreak,
    markLessonCompleted,
    resetProgress,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 