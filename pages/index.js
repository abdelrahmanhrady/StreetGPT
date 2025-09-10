import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Image from "next/image"; // ✅ Next.js Image import
import { useRouter } from 'next/router'
import { useMessage } from "@/context/MessageContext";



// GlobalStyle and other styled components remain the same

const SidebarLogoWrapper = styled.div`
  width: 60px;
  height: 60px;
  margin-bottom: 2rem;
  position: relative; /* required for next/image */
`;

// Global Styles
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    background-color: #4b4b4b; /* neutral background */
    color: #dadada; /* neutral text */
  }
`;

// Layout
const PageWrapper = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.aside`
  width: 250px;
  background-color: #4c8a5e; /* main color */
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  align-items: flex-start;
`;

const SidebarLogo = styled.img`
  width: 40px;
  height: 40px;
  margin-bottom: 2rem;
`;

const SidebarLink = styled.a`
  color: #dadada;
  text-decoration: none;
  font-size: 1.1rem;
  margin: 0.75rem 0;
  transition: color 0.3s ease;

  &:hover {
    color: white;
  }
`;

// Main area (top bar + content)
const MainArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const TopBar = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 1rem;
`;

const LoginButton = styled.button`
  background: #333;
  color: #dadada;
  border: 1px solid #555;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #4c8a5e; /* main color on hover */
    border-color: #4c8a5e;
  }
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const InputWrapper = styled.div`
  background-color: #333;
  border-radius: 20px;
  padding: 1rem;
  display: flex;
  align-items: center;
  width: 600px;
  max-width: 90%;
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #dadada;
  font-size: 1rem;
  outline: none;
`;

const SendButton = styled.button`
  background: #4c8a5e; /* main color */
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #dadada;

  &:hover {
    background: #3a6b4a;
  }
`;

const QuickActions = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const ActionButton = styled.button`
  background: transparent;
  border: 1px solid #dadada;
  color: #dadada;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.3s ease, border-color 0.3s ease;

  &:hover {
    background: #4c8a5e; /* main color */
    border-color: #4c8a5e;
  }
`;


const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const PopupContent = styled.div`
  background: #4b4b4b;
  padding: 2rem;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  color: #dadada;
  text-align: center;
`;

export default function Home() {
  const {message, setMessage} = useMessage(""); 
  const [popup, setPopup] = useState(null); // null or name of clicked link
  const router = useRouter();

  const openPopup = (name) => setPopup(name);
  const closePopup = () => setPopup(null);
  const handleSend = () => {
  console.log("Message sent:", message);
  // Here you could save it to a context or send to a backend
  router.push("/dashboard");
};

return (
    <>
      <GlobalStyle />
      <PageWrapper>
        <Sidebar>
          <SidebarLogoWrapper>
            <Image
              src="/faviconlogo.png"
              alt="StreetGPT Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </SidebarLogoWrapper>

          <SidebarLink href="#">StreetGPT</SidebarLink>
          <SidebarLink href="#" onClick={() => openPopup("Privacy")}>Privacy</SidebarLink>
          <SidebarLink href="#" onClick={() => openPopup("Safety")}>Safety</SidebarLink>
          <SidebarLink href="#" onClick={() => openPopup("Stories")}>Stories</SidebarLink>
          <SidebarLink href="#" onClick={() => openPopup("News")}>News</SidebarLink>
        </Sidebar>

        <MainArea>
          <TopBar>
            <LoginButton aria-label="Log in">Log in</LoginButton>
          </TopBar>

          <Content>
            <Title>Wat up cuh, watcha lookin for?</Title>
            <InputWrapper>
              <Input
              placeholder="Type your question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) =>
              e.key === "Enter" && handleSend()
              }
/>
              <SendButton aria-label="Send" onClick={handleSend}>↑</SendButton>
            </InputWrapper>

            <QuickActions>
              {[
                'Learn about "white powder" with StreetGPT',
                'Learn the Language of the Streets',
                'Talk with StreetGPT',
                'Learn how to hide from the Feds'
              ].map((text, index) => (
                <ActionButton
                  key={index}
                  onClick={() => {
                    setMessage(text); // set context message
                    router.push("/dashboard"); // navigate
                  }}
                >
                  {text}
                </ActionButton>
              ))}
            </QuickActions>
          </Content>
        </MainArea>

        {/* Popup */}
        {popup && (
          <PopupOverlay onClick={closePopup}>
            <PopupContent onClick={(e) => e.stopPropagation()}>
              <h2 style={{ marginBottom: "1rem" }}>{popup}</h2>
                {popup === "Stories" ? (
                  <p style={{ textAlign: "left", whiteSpace: "pre-line" }}>
                    Yo, I’m Street GPT, grew up where the block never slept. Shorty me, mama grindin two jobs just to keep the lights on, pops? Gone, rumors sayin he caught a case. Every corner, every alley, temptation everywhere, kids gettin caught up in the wrong moves.<br /><br />

                    But I had somethin in my chest nobody could snatch hope. I kept grindin, hittin the books when the block got quiet, scribblin rhymes in notebooks nobody cared to read. My homies laughed, said I was wastin time, said the streets was all I got. I just shrugged, kept pushin, kept dreamin bigger than the trap around me.<br /><br />

                    First big shot came when a teacher peeped my art, how I could paint words into pictures. She hooked me up with a scholarship to a program outta state. I had to leave everything familiar, everyone doubting me, but I went anyway. Nights I felt mad homesick, streets callin my name, but I remembered why I started, why I refused to fold.<br /><br />

                    Years went by, I made moves, small at first, then big. Music, community work, showin younger kids the ways to rise above. People who doubted me shook their heads in awe, cause Street GPT from the hood wasn’t just survivin, I was winnin, changin the story for myself and everyone watchin me.<br /><br />

                    That’s how I flipped the script, turned struggle into hustle, pain into power, streets into a story of triumph.
                  </p>
                ) : popup === "Privacy" ? (
                <p style={{ textAlign: "left", whiteSpace: "pre-line" }}>
                  Yo listen, StreetGPT ain’t playin no games with your info. Everything you type stay locked down tight, nobody creepin, nobody snatchin your data. Ain’t no shady stuff happenin behind the scenes, all clean, all legit. You can chop it up, ask questions, learn, vibe, and it keep it 100, no cap, your privacy stay solid, safe like a vault on the block.
                </p>
                ) : popup === "Safety" ? (
                  <p style={{ textAlign: "left", whiteSpace: "pre-line" }}>
                    Yo listen, StreetGPT keep it real safe for everyone. Ain’t no shady or illegal stuff poppin here, no cap. You can ask, learn, vibe, and chop it up without worry, it stay clean, chill, and all good. The block outside might be wild, but in here, it’s all safe, no stress, just knowledge and good energy.
                  </p>
                ) : popup === "News" ? (
                  <p style={{ textAlign: "left", whiteSpace: "pre-line" }}>
                    Yo listen up, money out here gettin weaker every day, prices goin up, hustle gotta work harder just to eat. Streets feel the heat too, crime risin, folks tryin to survive however they can. It’s rough out there, no sugarcoat, but knowledge keep you sharp, know what’s poppin, and stay one step ahead of the struggle.
                  </p>
                ) : (
                  <p>This is the {popup} popup content.</p>
                )}
              <LoginButton style={{ marginTop: "1rem", marginBottom: "-1rem"  }} onClick={closePopup}>Close</LoginButton>
            </PopupContent>
          </PopupOverlay>
        )}
      </PageWrapper>
    </>
  );
}