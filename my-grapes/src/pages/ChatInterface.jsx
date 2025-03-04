// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Button } from 'primereact/button';
// import { InputText } from 'primereact/inputtext';
// import { Card } from 'primereact/card';
// import { ProgressSpinner } from 'primereact/progressspinner';
// import Navbar from '../components/Navbar';

// const ChatInterface = () => {
//   // États pour le prompt, les messages et le chargement
//   const [prompt, setPrompt] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Récupération du token JWT depuis le localStorage (après login)
//   const token = localStorage.getItem("accessToken");

//   // Fonction de défilement automatique vers le dernier message
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Fonction d'envoi du message
//   const handleSend = async () => {
//     if (!prompt.trim()) return;

//     // Ajout du message utilisateur à l'affichage
//     const userMessage = {
//       sender: 'user',
//       text: prompt,
//       date: new Date().toLocaleString(),
//     };
//     setMessages(prev => [...prev, userMessage]);
//     setLoading(true);

//     try {
//       // Configuration de l'en-tête avec le token d'authentification
//       const config = {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       };

//       // Appel API vers le backend Django
//       const response = await axios.post(
//         'http://localhost:8000/chats/chat/',
//         { prompt },
//         config
//       );

//       // Création du message de réponse
//       const llmResponse = {
//         sender: 'llm',
//         text: response.data.response || 'Erreur de réponse',
//         date: new Date().toLocaleString(),
//       };
//       setMessages(prev => [...prev, llmResponse]);
//     } catch (error) {
//       console.error('Erreur:', error);
//       let errorMessage = "Erreur lors de la communication avec le serveur.";

//       if (error.response) {
//         if (error.response.status === 401) {
//           errorMessage = "Vous n'êtes pas authentifié. Veuillez vous connecter.";
//         } else if (error.response.data && error.response.data.error) {
//           errorMessage = error.response.data.error;
//         }
//       }

//       setMessages(prev => [
//         ...prev,
//         {
//           sender: 'llm',
//           text: errorMessage,
//           date: new Date().toLocaleString(),
//         },
//       ]);
//     } finally {
//       setLoading(false);
//       setPrompt('');
//     }
//   };

//   // Détection de la touche "Enter" pour envoyer le message
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-sans">
//       <Navbar />
//       <div className="max-w-4xl mx-auto my-6 p-4 bg-white rounded-2xl shadow-lg flex flex-col h-[calc(100vh-100px)]">
//         {/* Zone d'affichage des messages */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-4">
//           {messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//             >
//               <Card
//                 className={`rounded-2xl shadow-md transform transition-transform duration-200 ease-in-out hover:scale-105 ${
//                   msg.sender === 'user'
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-200 text-gray-800'
//                 }`}
//               >
//                 <div className="text-xs text-gray-500">{msg.date}</div>
//                 <div className="text-base">{msg.text}</div>
//               </Card>
//             </div>
//           ))}
//           {loading && (
//             <div className="flex justify-center my-4">
//               <ProgressSpinner
//                 style={{ width: '50px', height: '50px' }}
//                 strokeWidth="4"
//                 className="text-blue-500"
//               />
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>
//         {/* Zone de saisie */}
//         <div className="border-t border-gray-300 p-4">
//           <div className="flex items-center">
//             <InputText
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="flex-1 p-3 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-400"
//               placeholder="Entrez votre message..."
//             />
//             <Button
//               label=""
//               icon="pi pi-send"
//               onClick={handleSend}
//               className="p-3 rounded-r-full bg-blue-600 border-blue-600 hover:bg-blue-700 transition-colors duration-200"
//               disabled={loading}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import Navbar from '../components/Navbar';

const ChatInterface = () => {
  // États pour le prompt, les messages et l'indicateur de chargement
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Récupération du token JWT stocké après authentification
  const token = localStorage.getItem("accessToken");

  // Fonction pour scroller automatiquement vers le dernier message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Déclenche le scroll dès que la liste des messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fonction d'envoi du message
  const handleSend = async () => {
    if (!prompt.trim()) return; // Ne rien envoyer si le prompt est vide

    // Création et ajout du message utilisateur
    const userMessage = {
      sender: 'user',
      text: prompt,
      date: new Date().toLocaleString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      // Configuration de l'en-tête HTTP avec le token d'authentification
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      // Envoi du prompt au backend via une requête POST
      const response = await axios.post(
        'http://localhost:8000/chats/chat/',
        { prompt },
        config
      );

      // Création du message de réponse provenant du backend
      const llmMessage = {
        sender: 'llm',
        text: response.data.response || 'Erreur de réponse',
        date: new Date().toLocaleString(),
      };
      setMessages(prev => [...prev, llmMessage]);
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      let errorMessage = "Erreur lors de la communication avec le serveur.";
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Vous n'êtes pas authentifié. Veuillez vous connecter.";
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }
      setMessages(prev => [
        ...prev,
        {
          sender: 'llm',
          text: errorMessage,
          date: new Date().toLocaleString(),
        },
      ]);
    } finally {
      setLoading(false);
      setPrompt(''); // Réinitialise le champ de saisie
    }
  };

  // Envoi du message lors de l'appui sur la touche "Enter"
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto my-6 p-4 bg-white rounded-2xl shadow-lg flex flex-col h-[calc(100vh-100px)]">
        {/* Affichage des messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card
                className={`rounded-2xl shadow-md transform transition-transform duration-200 ease-in-out hover:scale-105 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <div className="text-xs text-gray-500">{msg.date}</div>
                {/* Si le message provient du backend, on affiche dans un bloc préformaté pour conserver la mise en forme */}
                {msg.sender === 'llm' ? (
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', margin: 0 }}>
                    {msg.text}
                  </pre>
                ) : (
                  <div className="text-base">{msg.text}</div>
                )}
              </Card>
            </div>
          ))}
          {loading && (
            <div className="flex justify-center my-4">
              <ProgressSpinner
                style={{ width: '50px', height: '50px' }}
                strokeWidth="4"
                className="text-blue-500"
              />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Zone de saisie du message */}
        <div className="border-t border-gray-300 p-4">
          <div className="flex items-center">
            <InputText
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 p-3 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Entrez votre message ou code de design..."
            />
            <Button
              label=""
              icon="pi pi-send"
              onClick={handleSend}
              className="p-3 rounded-r-full bg-blue-600 border-blue-600 hover:bg-blue-700 transition-colors duration-200"
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
