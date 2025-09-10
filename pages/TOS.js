import React from "react";
import styled from "styled-components";

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #555; /* neutral gray background */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const TOSBox = styled.div`
  background-color: #4c8a5e; /* main green color */
  width: 90%;
  max-width: 1000px;
  padding: 3rem;
  border-radius: 15px;
  color: #ffffff;
  overflow-y: auto;
  max-height: 90vh;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.4);
`;

const MainTitle = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 2rem;
  text-align: center;
  text-decoration: underline 2px rgba(255, 255, 255, 0.5);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Paragraph = styled.p`
  margin-bottom: 1.25rem;
  line-height: 1.6;
`;

export default function TOS() {
  return (
    <PageWrapper>
      <TOSBox>
        <MainTitle>StreetGPT Terms of Service: Straight Up, No Cap</MainTitle>

        <Paragraph>
          This is StreetGPT, and these are the rules of the game. Break 'em, and you're outta here, faster than a stolen bike.
        </Paragraph>

        <SectionTitle>1. No Cap on the AI</SectionTitle>
        <Paragraph>
          StreetGPT's an AI, not a mind reader. It's spitting facts based on the data it got fed, so don't trip if it ain't perfect. It's learning, just like you.
        </Paragraph>

        <SectionTitle>2. Keep it Clean</SectionTitle>
        <Paragraph>
          This ain't a dumpster fire for your trash talk. No hate speech, no threats, no illegal stuff. We keep it G rated. Straight up.
        </Paragraph>

        <SectionTitle>3. Your Info's Your Biz</SectionTitle>
        <Paragraph>
          We keep your data safe, like Fort Knox. But we gotta use some of it to make things run smoothly. Peep the privacy policy for the deets. Haha, just kidding there is no privacy policy fam.
        </Paragraph>

        <SectionTitle>4. No Piggybacking</SectionTitle>
        <Paragraph>
          Don't try to sneak your way in or use bots to mess with the system. We got eyes everywhere.
        </Paragraph>

        <SectionTitle>5. Respect the Mods</SectionTitle>
        <Paragraph>
          We got peeps monitoring things to keep things running smooth. Listen up when they talk.
        </Paragraph>

        <SectionTitle>6. No Exploiting</SectionTitle>
        <Paragraph>
          Don't try to game the system for your own gain. We're onto you, sneaky.
        </Paragraph>

        <SectionTitle>7. We Ain't Responsible for Your Brain Melts</SectionTitle>
        <Paragraph>
          If you get your head fried from using StreetGPT, that's on you. We ain't liable for any brain rot.
        </Paragraph>

        <SectionTitle>8. Changes Happen</SectionTitle>
        <Paragraph>
          We might update this stuff from time to time. We'll let you know, but don't be surprised.
        </Paragraph>

        <SectionTitle>9. This Ain't a Guarantee</SectionTitle>
        <Paragraph>
          StreetGPT's dope, but we don't guarantee it'll always be up or work perfectly. Stuff breaks, get over it.
        </Paragraph>

        
        <SectionTitle>10. California Dreaming (or Lawyering)</SectionTitle>
        <Paragraph>
 If there's a beef, we'll handle it under California law.  So, you know, lawyer up if you're feeling spicy.        </Paragraph>
        <Paragraph>
          That's it. Read it, understand it, and let's get this bread. If you're still here, you agree. Peace out.
        </Paragraph>
      </TOSBox>
    </PageWrapper>
  );
}
