import { createContext, useContext } from 'react';
import clickSoundSrc from '../assets/soundes/clickSound.mp3';
import switchSoundSrc from '../assets/soundes/switchSound.mp3';
import sendMessageSoundSrc from '../assets/soundes/imessageSend.mp3';
import receiveMessageSoundSrc from '../assets/soundes/imessageReceive.mp3';
import loasingGameSoundSrc from '../assets/soundes/loasingGame.wav';
import SquareClickSoundSrc from '../assets/soundes/SquareClickSound.mp3';
import winingGameSoundSrc from '../assets/soundes/winGame.wav';
import tiaGameSoundSrc from '../assets/soundes/tieGame.wav';

const SoundContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSoundContext = () => useContext(SoundContext);

// eslint-disable-next-line react/prop-types
export const SoundProvider = ({ children }) => {

  const playClickSound = () => {
    const clickSound = new Audio(clickSoundSrc);
    clickSound.play();
  };

  const playSwitchSound = () => {
    const switchSound = new Audio(switchSoundSrc);
    switchSound.play();
  };

  const playSendMessageSound = () => {
    const switchSound = new Audio(sendMessageSoundSrc);
    switchSound.play();
  };

  const playReceiveMessageSound = () => {
    const switchSound = new Audio(receiveMessageSoundSrc);
    switchSound.play();
  };

  const playLoasingGameSound = () => {
    const loasingGameSound = new Audio(loasingGameSoundSrc);
    loasingGameSound.play();
  };

  const playSquareClickSound = () => {
    const squareClickSound = new Audio(SquareClickSoundSrc);
    squareClickSound.play();
  };

  const playWiningGameSound= () => {
    const winingGameSound = new Audio(winingGameSoundSrc);
    winingGameSound.play();
  };

  const playTiaGameSound= () => {
    const tiaGameSound = new Audio(tiaGameSoundSrc);
    tiaGameSound.play();
  };

  return (
    <SoundContext.Provider value={{ 
      playClickSound,
      playSwitchSound, 
      playSendMessageSound, 
      playReceiveMessageSound,
      playWiningGameSound,
      playLoasingGameSound,
      playSquareClickSound,
      playTiaGameSound
    }}>
      {children}
    </SoundContext.Provider>
  );
};
