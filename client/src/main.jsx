import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SoundProvider } from './context/SoundContext'
import { BrowserRouter } from 'react-router-dom'
import { SocketContextProvider } from './context/SocketContext.jsx'
import { RoomContextProvider } from './context/RoomContext.jsx'
import { ChatContextProvider } from './context/ChatContext.jsx'
import { GameContextProvider } from './context/GameContext.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <SoundProvider>
      <SocketContextProvider>
        <RoomContextProvider>
          <GameContextProvider>
            <ChatContextProvider>
                  <App />

            </ChatContextProvider>

          </GameContextProvider>
        </RoomContextProvider>
      </SocketContextProvider>
      </SoundProvider>
    </BrowserRouter>
  </React.StrictMode>
  
)
