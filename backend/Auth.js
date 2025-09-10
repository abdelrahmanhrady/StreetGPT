import { auth } from "./Firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
  

export const signUp = async (email, password) => {
  try {
    // Check if email is already in use
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length > 0) {
      throw new Error("Email already in use");
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential; // contains user object
  } catch (error) {
    console.error("Sign Up Error:", error.message);
    throw error;
  }
};

export const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential; // contains user object
  } catch (error) {
    console.error("Log In Error:", error.message);
    throw error;
  }
};