/* eslint-disable no-undef */
import './App.css'
import Home from './pages/home/Home'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import Game from './pages/game/Game';
import { useEffect } from 'react';
import { useChatContext } from './context/ChatContext';
import ChatBox from './components/chatBox/ChatBox';

export default function App() {

  const { chat } = useChatContext();


  useEffect(() => {
      window.onpopstate = function() {
          alert("If you exit, you will not be able to return to the current game.");
          document.addEventListener('click', function() {
              location.reload(); // Refresh the page when OK is clicked
          }, { once: true }); // Event listener will be removed after being triggered once
      }

      window.onbeforeunload = () => {

        return confirm("Confirm refresh");
      }
  }, []);


  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/game' element={<Game />} />
      </Routes>

      <Toaster />

      <div className="relative mt-14">
        {chat && <ChatBox />}
      </div>

    </>


  )
}
