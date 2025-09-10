import { getFirestore,getDoc, deleteDoc,doc, setDoc, updateDoc, getDocs, collection, addDoc, query,where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { db } from "./Firebase";

export async function getUserByUsername(username) {
  const docRef = doc(db, "usernames", username);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data(); // contains { uid: "..." }
}
export async function createChatLog(uid) {
  if (!uid) {
    throw new Error("createChatLog called without a valid uid");
  }

  try {
    const chatRef = await addDoc(
      collection(db, "users", uid, "chats"),
      { createdAt: new Date() }
    );
    return chatRef.id;
  } catch (err) {
    console.error("Error creating chat log:", err);
    throw err;
  }
}

export async function deleteChatLog(uid, chatId) {
  if (!uid || !chatId) throw new Error("User ID and Chat ID required");

  try {
    const chatDocRef = doc(db, "users", uid, "chats", chatId);
    await deleteDoc(chatDocRef);
    console.log("Chat deleted successfully:", chatId);
  } catch (err) {
    console.error("Error deleting chat:", err);
    throw err;
  }
}

export async function getUserChatLogs(uid) {
  const chatCol = collection(db, "users", uid, "chats");
  const chatSnapshot = await getDocs(chatCol);

  const chats = await Promise.all(
    chatSnapshot.docs.map(async (chatDoc) => {
      const messagesCol = collection(db, "users", uid, "chats", chatDoc.id, "messages");
      const messagesSnapshot = await getDocs(messagesCol);
      const messages = messagesSnapshot.docs.map(m => m.data());
      return {
        id: chatDoc.id,
        messages,
      };
    })
  );

  return chats;
}


// Add a message to an existing chat
export const addMessageToChat = async (uid, chatId, message) => {
  if (!uid || !chatId) {
    console.error("Cannot add message: uid or chatId is undefined", { uid, chatId });
    return; // safely exit
  }

  try {
    const chatRef = collection(db, `users/${uid}/chats/${chatId}/messages`);
    await addDoc(chatRef, message);
  } catch (err) {
    console.error("Error adding message to chat:", err);
    throw err; // re-throw so the frontend knows it failed
  }
};
