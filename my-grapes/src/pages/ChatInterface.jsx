import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Menubar } from 'primereact/menubar';
import { Chip } from 'primereact/chip';
import { ScrollTop } from 'primereact/scrolltop';
import { InputTextarea } from 'primereact/inputtextarea';
import { ToggleButton } from 'primereact/togglebutton';
import { Ripple } from 'primereact/ripple';
import { PrimeReactProvider } from 'primereact/api';
import Navbar from '../components/Navbar';
import { Toast } from 'primereact/toast';
import './ChatInterface.css'; // Fichier CSS séparé pour les styles globaux

const ChatInterface = () => {
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showStackblitzPopup, setShowStackblitzPopup] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [conversationTitle, setConversationTitle] = useState('Nouvelle conversation');
    const [suggestions] = useState([
        'Comment styliser avec Tailwind?',
        'Créer un composant modal avec PrimeReact',
        'Optimiser les performances React'
    ]);
    
    const messagesEndRef = useRef(null);
    const toast = useRef(null);
    const inputRef = useRef(null);
    const chatContainerRef = useRef(null);

    const token = localStorage.getItem("accessToken");
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Copié !',
                    detail: 'Le texte a été copié dans le presse-papiers',
                    life: 2000
                });
            })
            .catch(err => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de copier le texte',
                    life: 1000
                });
                console.error('Erreur lors de la copie :', err);
            });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Focus input when component mounts
        inputRef.current?.focus();
        
        // Apply theme based on user preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    useEffect(() => {
        // Update document theme when darkMode changes
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const handleSend = async () => {
        if (!prompt.trim()) return; 
        const userMessage = {
            sender: 'user',
            text: prompt,
            date: new Date().toLocaleString(),
        };
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);

        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.post(
                'http://localhost:8000/chats/chat/',
                { prompt },
                config
            );
            const llmMessage = {
                sender: 'llm',
                text: response.data.response || 'Erreur de réponse',
                date: new Date().toLocaleString(),
            };
            setMessages(prev => [...prev, llmMessage]);
            
            // Update conversation title if this is the first exchange
            if (messages.length === 0 && conversationTitle === 'Nouvelle conversation') {
                // Generate a title based on first user message
                setConversationTitle(prompt.length > 25 ? `${prompt.substring(0, 25)}...` : prompt);
            }
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
            setPrompt(''); 
            // Focus back on input after sending
            inputRef.current?.focus();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatMessageText = (text) => {
        // Enhanced formatter for code blocks with language support
        if (!text) return '';
        
        // Split by code blocks with optional language
        const parts = text.split(/```([\w]*)\n?([\s\S]*?)```/);
        
        if (parts.length === 1) return <span className="whitespace-pre-wrap">{text}</span>;
        
        const result = [];
        
        for (let i = 0; i < parts.length; i++) {
            if (i % 3 === 0) {
                // Regular text
                if (parts[i]) {
                    result.push(<span key={`text-${i}`} className="whitespace-pre-wrap">{parts[i]}</span>);
                }
            } else if (i % 3 === 1) {
                // Language indicator (skip, will be used in the next iteration)
                continue;
            } else {
                // Code block
                const language = parts[i-1] || '';
                result.push(
                    <div key={`code-${i}`} className="relative group">
                        {language && (
                            <div className="absolute top-0 right-0 bg-gray-700 text-xs text-gray-300 px-2 py-1 rounded-bl">
                                {language}
                            </div>
                        )}
                        <div className="flex justify-end mb-1">
                            <Button
                                icon="pi pi-copy"
                                onClick={() => copyToClipboard(parts[i])}
                                className="p-button-rounded p-button-text p-button-sm absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 text-white m-1"
                                tooltip="Copier le code"
                                tooltipOptions={{ position: 'top' }}
                            />
                        </div>
                        <pre className={`bg-gray-800 text-white p-4 my-2 rounded-md font-mono text-sm overflow-x-auto ${language ? 'pt-8' : ''}`}>
                            <code>{parts[i]}</code>
                        </pre>
                    </div>
                );
            }
        }
        
        return result;
    };

    const handleSuggestionClick = (suggestion) => {
        setPrompt(suggestion);
        inputRef.current?.focus();
    };

    const handleClearChat = () => {
        setMessages([]);
        setConversationTitle('Nouvelle conversation');
    };

    const menuItems = [
        {
            label: conversationTitle,
            icon: 'pi pi-comment',
            className: 'font-bold'
        },
        {
            label: darkMode ? 'Mode clair' : 'Mode sombre',
            icon: darkMode ? 'pi pi-sun' : 'pi pi-moon',
            command: () => setDarkMode(prev => !prev)
        },
        {
            label: 'Effacer la conversation',
            icon: 'pi pi-trash',
            command: handleClearChat
        },
        {
            label: 'Prévisualiser',
            icon: 'pi pi-external-link',
            command: () => setShowStackblitzPopup(true)
        }
    ];

    return (
        <PrimeReactProvider>
            <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-blue-50 to-indigo-50'} font-sans`}>
                <Navbar />
                <Toast ref={toast} position="top-right" />
                <ScrollTop />

                <div className={`max-w-5xl mx-auto my-4 md:my-6 p-0 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl flex flex-col h-[calc(100vh-100px)] transition-colors duration-300`}>
                    {/* Header with menubar */}
                    <Menubar 
                        model={menuItems} 
                        className={`border-none ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-t-xl`}
                        end={<Badge value={messages.length} severity={messages.length > 0 ? "info" : "secondary"} />}
                    />

                    {/* Messages area */}
                    <div 
                        ref={chatContainerRef}
                        className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50 bg-opacity-50'} transition-colors duration-300`}
                    >
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className={`mb-8 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <i className="pi pi-comments text-4xl mb-4"></i>
                                    <h3 className="text-xl font-semibold mb-2">Assistant IA à votre service</h3>
                                    <p className="mb-6">Posez une question ou partagez du code pour commencer</p>
                                    
                                    <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                                        {suggestions.map((suggestion, index) => (
                                            <Chip 
                                                key={index} 
                                                label={suggestion}
                                                className={`cursor-pointer hover:bg-blue-100 transition-colors duration-200 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white'}`}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-start ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                                    >
                                        {msg.sender === 'llm' && (
                                            <Avatar 
                                                icon="pi pi-server" 
                                                size="large" 
                                                shape="circle" 
                                                className={`mr-2 ${darkMode ? 'bg-indigo-800' : 'bg-indigo-600'} text-white flex items-center justify-center`}
                                            />
                                        )}
                                        
                                        <Card
                                            className={`relative max-w-[80%] md:max-w-[75%] rounded-lg shadow-md 
                                                ${msg.sender === 'user'
                                                    ? 'bg-blue-600 text-white'
                                                    : darkMode 
                                                        ? 'bg-gray-700 border-gray-600 text-white' 
                                                        : 'bg-white border border-gray-200'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between text-xs mb-2">
                                                <span className={msg.sender === 'user' ? 'text-blue-100' : (darkMode ? 'text-gray-300' : 'text-gray-500')}>
                                                    {msg.date}
                                                </span>
                                                <Button
                                                    icon="pi pi-copy"
                                                    onClick={() => copyToClipboard(msg.text)}
                                                    className={`p-button-rounded p-button-text p-button-sm ${
                                                        msg.sender === 'user' ? 'text-blue-100' : (darkMode ? 'text-gray-300' : 'text-gray-500')
                                                    }`}
                                                    tooltip="Copier le message"
                                                    tooltipOptions={{ position: 'top' }}
                                                />
                                            </div>

                                            <div className={`text-base ${msg.sender === 'llm' ? (darkMode ? 'text-gray-100' : 'text-gray-800') : ''}`}>
                                                {msg.sender === 'llm' 
                                                    ? formatMessageText(msg.text)
                                                    : msg.text
                                                }
                                            </div>
                                        </Card>
                                        
                                        {msg.sender === 'user' && (
                                            <Avatar 
                                                icon="pi pi-user" 
                                                size="large" 
                                                shape="circle" 
                                                className="ml-2 bg-blue-700 text-white flex items-center justify-center"
                                            />
                                        )}
                                    </div>
                                ))}

                                {loading && (
                                    <div className="flex items-start animate-fadeIn">
                                        <Avatar 
                                            icon="pi pi-server" 
                                            size="large" 
                                            shape="circle" 
                                            className={`mr-2 ${darkMode ? 'bg-indigo-800' : 'bg-indigo-600'} text-white flex items-center justify-center`}
                                        />
                                        <Card className={`relative rounded-lg shadow-md p-4 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border border-gray-200'}`}>
                                            <div className="flex items-center space-x-2">
                                                <ProgressSpinner
                                                    style={{ width: '30px', height: '30px' }}
                                                    strokeWidth="4"
                                                    className="text-indigo-500"
                                                    animationDuration=".5s"
                                                />
                                                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Rédaction en cours...</span>
                                            </div>
                                        </Card>
                                    </div>
                                )}
                            </>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    {/* Input area */}
                    <div className={`border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-4 rounded-b-xl transition-colors duration-300`}>
                        <div className="flex mb-1 justify-between items-center">
                            <ToggleButton
                                checked={expanded}
                                onChange={(e) => setExpanded(e.value)}
                                onLabel=""
                                offLabel=""
                                onIcon="pi pi-minus"
                                offIcon="pi pi-arrows-alt"
                                tooltip={expanded ? "Réduire" : "Agrandir"}
                                tooltipOptions={{ position: 'top' }}
                                className={`p-button-rounded p-button-text p-button-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                            />
                            
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Appuyez sur Entrée pour envoyer, Maj+Entrée pour une nouvelle ligne
                            </span>
                        </div>
                        
                        <div className="flex items-center p-ripple">
                            <Ripple />
                            {expanded ? (
                                <InputTextarea
                                    ref={inputRef}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    rows={3}
                                    autoResize
                                    className={`w-full p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                                    }`}
                                    placeholder="Entrez votre message ou code de design..."
                                />
                            ) : (
                                <span className={`p-input-icon-left flex-1 ${darkMode ? 'text-white' : ''}`}>
                                    <i className={`pi pi-search ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                                    <InputText
                                        ref={inputRef}
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        className={`w-full p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                                        }`}
                                        placeholder="Entrez votre message ou code de design..."
                                    />
                                </span>
                            )}
                            <Button
                                icon="pi pi-send"
                                onClick={handleSend}
                                disabled={loading || !prompt.trim()}
                                className={`p-3 h-full rounded-r-lg ${
                                    darkMode 
                                        ? 'bg-blue-700 border-blue-700 hover:bg-blue-800' 
                                        : 'bg-blue-600 border-blue-600 hover:bg-blue-700'
                                } transition-colors duration-200 flex items-center justify-center`}
                                aria-label="Envoyer"
                                tooltip="Envoyer le message"
                                tooltipOptions={{ position: 'top' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Preview dialog */}
                <Dialog
                    header="Prévisualisation du projet"
                    visible={showStackblitzPopup}
                    style={{ width: '80vw', height: '80vh' }}
                    onHide={() => setShowStackblitzPopup(false)}
                    draggable={false}
                    resizable={false}
                    className={`p-fluid ${darkMode ? 'dark-dialog' : ''}`}
                >
                    <iframe
                        title="Stackblitz Preview"
                        src="https://stackblitz.com/edit/react?embed=1&file=src/App.js"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                    />
                </Dialog>
            </div>
        </PrimeReactProvider>
    );
};

export default ChatInterface;