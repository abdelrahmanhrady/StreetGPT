import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styled from "styled-components";
import { useMessage } from "@/context/MessageContext";
import ReactMarkdown from "react-markdown";
import { FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import {signUp, logIn} from "backend/Auth.js";
import { getAuth, onAuthStateChanged,signOut,signInAnonymously  } from "firebase/auth";
import { deleteChatLog,getUserByUsername, getUserChatLogs, createChatLog, addMessageToChat} from "backend/Database.js";
import { v4 as uuidv4 } from "uuid";


// Layout
const PageWrapper = styled.div`
  display: flex;
  height: 100vh;
  background-color: #4b4b4b;
  color: #dadada;
`;

// Sidebar
const Sidebar = styled.aside`
  width: 260px;
  background-color: #4c8a5e;
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const LogoWrapper = styled.div`
  width: 50px;
  height: 50px;
  margin-bottom: 1rem;
  position: relative;
  align-self: center;
`;

const SidebarButton = styled.button`
  background: transparent;
  border: 1px solid #dadada;
  color: #dadada;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  margin-bottom: 1rem;

  &:hover {
    background: #3a6b4a;
    border-color: #3a6b4a;
  }
`;

const ChatLogs = styled.div`
  flex: 1;
  margin-top: 2rem;
  overflow-y: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1rem;
`;

const ChatLogButton = styled.button`
  display: block;
  width: 100%;
  background: transparent;
  border: 1px solid #dadada;
  color: #dadada;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background: #3a6b4a;
    border-color: #3a6b4a;
  }
`;

const ChatLogWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
`;

const ChatLogText = styled.span`
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrashButton = styled.button`
  background: transparent;
  border: none;
  color: #ff3b3b;
  cursor: pointer;
  margin-left: 0.5rem;
  font-size: 1rem;

  &:hover {
    color: #ff0000;
  }
`;

// Main Area
const MainArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MessagesWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const MessageBox = styled.div`
  background: ${(props) => (props.$isUser ? "#4c8a5e" : "#333")};
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  max-width: 600px;
  align-self: ${(props) => (props.$isUser ? "flex-end" : "flex-start")};
  color: ${(props) =>
    props.$isError ? "#ff3b3b" : props.$isUser ? "#fff" : "#dadada"};
`;

// Chat Bar
const ChatBar = styled.div`
  padding: 1rem;
  background: #4b4b4b;
  display: flex;
  justify-content: center;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: rgb(51, 51, 51);
  border: 1px solid #555;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  width: 100%;
  max-width: 800px;
  gap: 0.5rem;
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: flex-start;
`;

const LoginButton = styled.button`
  background: #4c8a5e;
  border-color: #dadada;
  color: #dadada;
  padding: 0.5rem 1.5rem;  /* reduced from 4rem */
  border-radius: 10px;
  cursor: pointer;
  white-space: nowrap;  /* ✅ keeps "Sign Out" in one line */

  &:hover {
    background: #3a6b4a;
  }
`;


const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #dadada;
  font-size: 1rem;
`;

const SendButton = styled.button`
  background: #4c8a5e;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  color: #dadada;

  &:hover {
    background: #3a6b4a;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #4b4b4b;
  padding: 2rem;
  border-radius: 15px;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ModalInput = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1px solid #555;
  background: #333;
  color: #dadada;
  outline: none;
`;

const ModalButton = styled.button`
  background: #4c8a5e;
  border: none;
  color: #dadada;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background: #3a6b4a;
  }
`;

const Dashboard = () => {
  const { message } = useMessage();
  const messagesEndRef = useRef(null);
  const [mounted, setMounted] = useState(false);
const [guestId] = useState(() => uuidv4());
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([{ id: 1, messages: [] }]);
  const [activeChatId, setActiveChatId] = useState(1);
  const [input, setInput] = useState(message || "");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState("");

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");

  const auth = getAuth();
signInAnonymously(auth)
  .then(() => console.log("Anonymous signed in"))
  .catch(console.error);
  const activeChat = chats.find((c) => c.id === activeChatId);

  // Mount effect
  useEffect(() => setMounted(true), []);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });

        const userChats = await getUserChatLogs(firebaseUser.uid);
        if (userChats.length > 0) {
          setChats(userChats);
          setActiveChatId(userChats[0].id);
        } else {
          const newChatId = await createChatLog(firebaseUser.uid);
          setChats([{ id: newChatId, messages: [] }]);
          setActiveChatId(newChatId);
        }
      } else {
        setShowLoginModal(true);
        setUser(null);
        setChats([{ id: 1, messages: [] }]);
        setActiveChatId(1);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // Scroll to bottom on messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [activeChat?.messages, loadingDots]);

  // Loading animation
  useEffect(() => {
    if (!isLoading) return;
    let dots = ".";
    const interval = setInterval(() => {
      dots = dots.length < 3 ? dots + "." : ".";
      setLoadingDots(dots);
    }, 400);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Send message
const handleSend = async () => {
  if (!input.trim() || isLoading) return;

  const senderID = user?.uid || guestId;

  if (!activeChatId) {
    alert("No active chat selected.");
    return;
  }

  const currentInput = input;
  const userMessage = { text: currentInput, isUser: true, timestamp: new Date() };
  const loadingMessage = { text: "Thinking...", isUser: false, isLoading: true, timestamp: new Date() };

  // Add user message + loading placeholder
  setChats((prev) =>
    prev.map((chat) =>
      chat.id === activeChatId
        ? { ...chat, messages: [...chat.messages, userMessage, loadingMessage] }
        : chat
    )
  );
  setInput("");
  setIsLoading(true);

  try {
    // Save user message to DB only if logged in
    if (user) await addMessageToChat(senderID, activeChatId, userMessage);

    // Make API request
    const res = await fetch("/api/GeminiAPI", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `${currentInput}\n\nRespond to me in street language and brain rot terms. Dont use em dashes or begin sentences with Yo`,
      }),
    });

    const rawText = await res.text();
    console.log("Raw API response:", rawText);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("Failed to parse JSON:", parseErr);
      data = { error: "Invalid JSON response from API" };
    }

    if (!res.ok) throw new Error(data.error || "API request failed");

    const botMessage = { text: data.reply || "No response", isUser: false, timestamp: new Date() };

    // Replace loading message with bot response
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: chat.messages.map((m) => (m.isLoading ? botMessage : m)) }
          : chat
      )
    );

    if (user) await addMessageToChat(senderID, activeChatId, botMessage);

  } catch (err) {
    console.error("Fetch failed:", err);
    const errorMessage = {
      text: `Error: ${err.message || "Could not get a response."}`,
      isUser: false,
      isError: true,
      timestamp: new Date(),
    };
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: chat.messages.map((m) => (m.isLoading ? errorMessage : m)) }
          : chat
      )
    );
  } finally {
    setIsLoading(false);
  }
};


  const handleNewChat = async () => {
  const senderID = user?.uid || guestId;

  let newChatId;

  if (user) {
    // Logged-in users: create chat in DB
    newChatId = await createChatLog(senderID);
  } else {
    // Guest: create temporary chat ID
    newChatId = Math.max(...chats.map(c => c.id)) + 1;
  }

  setChats((prev) => [...prev, { id: newChatId, messages: [] }]);
  setActiveChatId(newChatId);
};


  const handleDeleteChat = (chatId) => {
    setChats((prevChats) => {
      const filteredChats = prevChats.filter((chat) => chat.id !== chatId);
      if (filteredChats.length === 0) {
        const newId = Math.max(...prevChats.map((c) => c.id)) + 1;
        const newChat = { id: newId, messages: [] };
        setActiveChatId(newId);
        return [newChat];
      }
      if (activeChatId === chatId) setActiveChatId(filteredChats[0].id);
      return filteredChats;
    });
    if (user) deleteChatLog(user.uid, chatId);
  };

  const handleSignUp = async () => {
    if (signUpPassword !== signUpConfirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const userCredential = await signUp(signUpEmail, signUpPassword);
      setUser({ email: userCredential.user.email });
      setShowSignUpModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogIn = async () => {
    try {
      let emailToUse = loginIdentifier;
      if (!/\S+@\S+\.\S+/.test(loginIdentifier)) {
        const userDoc = await getUserByUsername(loginIdentifier);
        if (!userDoc) {
          alert("Make sure you're Gmail/Password is correct");
          return;
        }
        emailToUse = userDoc.email;
      }
      const userCredential = await logIn(emailToUse, loginPassword);
      setUser({ email: userCredential.user.email });
      setShowLoginModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

const handleSignOut = async () => {
  try {
    const auth = getAuth();
    await signOut(auth); // <-- actually signs out from Firebase
    setUser(null);
    alert("Signed out successfully");
  } catch (error) {
    console.error("Sign out error:", error);
    alert("Failed to sign out");
  }
};
  return (
    <PageWrapper>
      {/* Sidebar */}
      <Sidebar>
        <LogoRow>
  <LogoWrapper style={{ marginLeft: "-10px" }}>
    <Image
      src="/faviconlogo.png"
      alt="StreetGPT Logo"
      fill
      style={{ objectFit: "contain" }}
    />
  </LogoWrapper>

  <div style={{ display: "flex", flexDirection: "column" }}>
    {user && (
      <span style={{ marginBottom: "0.25rem", fontWeight: "bold" }}>
        {user.email.split("@")[0]} {/* show username part */}
      </span>
    )}

    <LoginButton onClick={user ? handleSignOut : () => setShowLoginModal(true)}>
      {user ? "Sign Out" : "Log In"}
    </LoginButton>
  </div>
        </LogoRow>

        <SidebarButton onClick={handleNewChat}>+ New Chat</SidebarButton>

{mounted && (
  <ChatLogs>
    {chats.map((c) => (
      <ChatLogButton key={c.id} onClick={() => setActiveChatId(c.id)}>
        <ChatLogWrapper>
          <ChatLogText>{c.messages[0]?.text || "Empty chat"}</ChatLogText>
          <TrashButton onClick={(e) => { e.stopPropagation(); handleDeleteChat(c.id); }}>
            <FiTrash2 />
          </TrashButton>
        </ChatLogWrapper>
      </ChatLogButton>
    ))}
  </ChatLogs>
)}

      </Sidebar>

      {/* Main Area */}
      <MainArea>
        <MessagesWrapper ref={messagesEndRef}>
          {activeChat?.messages.map((m, i) => (
<MessageBox
  key={i}
  $isUser={m.isUser}
  $isError={m.isError}
  style={{ whiteSpace: "pre-wrap" }}
>
  {m.isLoading ? loadingDots : <ReactMarkdown>{m.text}</ReactMarkdown>}
</MessageBox>
          ))}
        </MessagesWrapper>

        {/* Chat Bar */}
        <ChatBar>
          <InputWrapper>
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
              disabled={isLoading}
            />
            <SendButton onClick={handleSend} disabled={isLoading}>
              {isLoading ? "■" : "↑"}
            </SendButton>
          </InputWrapper>
        </ChatBar>
      </MainArea>
{showLoginModal && (
  <ModalOverlay onClick={() => setShowLoginModal(false)}>
    <ModalContent onClick={(e) => e.stopPropagation()} style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <h2 style={{ position: "relative", left: "50%", transform: "translateX(-10%)" }}>Log In</h2>

      {/* Wrap each label + input to reduce gap */}
<div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
  <label style={{ fontSize: "1rem" }}>Email</label>
  <ModalInput
    placeholder="example@gmail.com"
    value={loginIdentifier}
    onChange={(e) => setLoginIdentifier(e.target.value)}
  />
</div>

<div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
  <label style={{ fontSize: "1rem" }}>Password</label>
  <ModalInput
    placeholder="Example_Password123"
    type="password"
    value={loginPassword}
    onChange={(e) => setLoginPassword(e.target.value)}
  />
</div>

      {/* NEW: Create account link */}
      <div style={{ marginBottom: "0.5rem",fontSize: "0.85rem" }}>
        Don't have an account?{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setShowLoginModal(false);
            setShowSignUpModal(true);
          }}
          style={{ color: "#0d6efd", textDecoration: "underline", fontSize: "0.85rem" }}
        >
           Create an account
        </a>
      </div>

      <ModalButton onClick={handleLogIn}>Log In</ModalButton>
    </ModalContent>
  </ModalOverlay>
)}
{showSignUpModal && (
  <ModalOverlay onClick={() => setShowSignUpModal(false)}>
    <ModalContent onClick={(e) => e.stopPropagation()} style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <h2 style={{ position: "relative", left: "50%", transform: "translateX(-14%)" }}>
        Sign Up
      </h2>

      {/* Username */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <label style={{ fontSize: "1rem" }}>Username</label>
        <ModalInput 
          placeholder="Example123" 
          value={signUpUsername} 
          onChange={(e) => setSignUpUsername(e.target.value)}
        />
      </div>

      {/* Email */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <label style={{ fontSize: "1rem" }}>Email</label>
        <ModalInput 
          type="email"
          placeholder="example@gmail.com" 
          value={signUpEmail} 
          onChange={(e) => setSignUpEmail(e.target.value)}
        />
      </div>

      {/* Password */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <label style={{ fontSize: "1rem" }}>Password</label>
        <ModalInput 
          placeholder="Example_Password123" 
          type="password" 
          value={signUpPassword} 
          onChange={(e) => setSignUpPassword(e.target.value)}
        />
      </div>

      {/* Confirm Password */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <label style={{ fontSize: "1rem" }}>Confirm Password</label>
        <ModalInput 
          placeholder="Example_Password123" 
          type="password" 
          value={signUpConfirmPassword} 
          onChange={(e) => setSignUpConfirmPassword(e.target.value)}
        />
      </div>

      {/* Terms */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
        <input type="checkbox" id="tosSignUp" />
        <label htmlFor="tosSignUp" style={{ fontSize: "0.85rem" }}>
          I agree to the{" "}
          <Link
            href="/TOS"
            style={{ color: "#0d6efd", textDecoration: "underline" }}
            target="_blank"
          >
            Terms of Service
          </Link>
        </label>
      </div>

      <ModalButton
        onClick={() => {
          const tosChecked = document.getElementById("tosSignUp").checked;

          if (!tosChecked) {
            alert("You must agree to the Terms of Service.");
            return;
          }

          if (signUpPassword !== signUpConfirmPassword) {
            alert("Passwords do not match.");
            return;
          }

          handleSignUp();
        }}
      >
        Sign Up
      </ModalButton>
    </ModalContent>
  </ModalOverlay>
)}



    </PageWrapper>
  );
};

export default Dashboard;
