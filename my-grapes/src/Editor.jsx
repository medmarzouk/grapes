
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import grapesjs from 'grapesjs';
// import 'grapesjs/dist/css/grapes.min.css';
// import gjsPresetWebpage from 'grapesjs-preset-webpage';
// import gjsBlocksBasic from 'grapesjs-blocks-basic';
// import grapesjsForms from 'grapesjs-plugin-forms';
// import { topBarBlock } from './blocks/TopBarBlock';
// import { toolbarBlock } from './blocks/ToolbarBlock';
// import { formBlock } from './blocks/FormBlock';
// import { footerBlock } from './blocks/FooterBlock';
// import Navbar from './components/Navbar';



// function Editor() {
//   const [editor, setEditor] = useState(null);
//   const {pageId}= useParams();
  
//   console.log('pageId :) ')
//   useEffect(() => {
//     const editorInstance = grapesjs.init({
//       container: '#editor',
//       height: '100vh',
//       plugins: [gjsPresetWebpage, gjsBlocksBasic, grapesjsForms],
//       pluginsOpts: {
//         gjsPresetWebpage: {},
//         gjsBlocksBasic: {},
//         grapesjsForms: {},
//       },
//       storageManager: { autoload: 0 }, // désactive le chargement auto
//     });

//     // Ajout des blocs personnalisés
//     editorInstance.BlockManager.add(topBarBlock.id, topBarBlock);
//     editorInstance.BlockManager.add(toolbarBlock.id, toolbarBlock);
//     editorInstance.BlockManager.add(formBlock.id, formBlock);
//     editorInstance.BlockManager.add(footerBlock.id, footerBlock);

//     setEditor(editorInstance);

//     return () => {
//       editorInstance.destroy();
//     };
//   }, []);

//   return (
//     <div>
      
//       <Navbar />
//       <div id="editor"></div>
//     </div>
//   );
// }

// export default Editor;
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import grapesjsForms from 'grapesjs-plugin-forms';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { topBarBlock } from './blocks/TopBarBlock';
import { toolbarBlock } from './blocks/ToolbarBlock';
import { formBlock } from './blocks/FormBlock';
import { footerBlock } from './blocks/FooterBlock';
import Navbar from './components/Navbar';

function Editor() {
  const [editor, setEditor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(null);
  const { pageId } = useParams();
  const navigate = useNavigate();
  const toastRef = useRef(null);
  
  // Récupération du token dans localStorage
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    // Vérifie si un token existe
    if (!token) {
      console.warn("Aucun token trouvé dans localStorage. Redirection vers la page de login.");
      navigate("/login");
      return;
    }

    // Fonction pour récupérer les données de la page
    const fetchPage = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/pages/${pageId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPage(response.data);
        return response.data;
      } catch (error) {
        console.error("Fetch page error:", error);
        if (toastRef.current) {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to fetch page data",
            life: 3000,
          });
        }
        return null;
      }
    };

    let editorInstance = null;

    // Initialisation de l'éditeur GrapesJS
    const initEditor = async () => {
      try {
        const pageData = await fetchPage();
        
        // Make sure DOM is ready before initializing GrapesJS
        if (!document.getElementById('editor')) {
          console.error("Editor container not found");
          return;
        }
        
        editorInstance = grapesjs.init({
          container: '#editor',
          height: '92vh', // Slightly reduced height to prevent overflow issues
          plugins: [gjsPresetWebpage, gjsBlocksBasic, grapesjsForms],
          pluginsOpts: {
            gjsPresetWebpage: {},
            gjsBlocksBasic: {},
            grapesjsForms: {},
          },
          storageManager: { autoload: 0 },
          // Chargement du contenu sauvegardé s'il existe
          components: pageData?.components || pageData?.html || '',
          style: pageData?.styles || pageData?.css || '',
          // Add additional configuration to prevent errors
          allowScripts: 1,
          canvas: {
            scripts: [],
            styles: [],
          }
        });

        // Ajout des blocs personnalisés
        editorInstance.BlockManager.add(topBarBlock.id, topBarBlock);
        editorInstance.BlockManager.add(toolbarBlock.id, toolbarBlock);
        editorInstance.BlockManager.add(formBlock.id, formBlock);
        editorInstance.BlockManager.add(footerBlock.id, footerBlock);

        // Ajout du bouton de sauvegarde dans le panneau de GrapesJS
        editorInstance.Panels.addButton('options', {
          id: 'save-button',
          className: 'fa fa-floppy-o',
          command: 'save-content',
          attributes: { title: 'Sauvegarder' }
        });

        // Définition de la commande de sauvegarde
        editorInstance.Commands.add('save-content', {
          run: function(editor) {
            saveContent(editor);
          }
        });

        // Add error handling for common GrapesJS operations
        editorInstance.on('canvas:dragend', () => {
          try {
            editorInstance.refresh();
          } catch (error) {
            console.warn('Error during canvas refresh:', error);
          }
        });

        setEditor(editorInstance);
      } catch (error) {
        console.error("Error initializing GrapesJS editor:", error);
        if (toastRef.current) {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to initialize editor",
            life: 3000,
          });
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initEditor();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (editorInstance) {
        try {
          editorInstance.destroy();
        } catch (error) {
          console.warn("Error during editor cleanup:", error);
        }
      }
    };
  }, [pageId, token, navigate]);

  // Fonction pour sauvegarder le contenu
  const saveContent = async (editorInstance) => {
    if (!editorInstance || !pageId || !token) return;

    try {
      setLoading(true);
      
      // Récupération du contenu de l'éditeur
      const html = editorInstance.getHtml();
      const css = editorInstance.getCss();
      
      // Safer JSON stringification with error handling
      let components, styles;
      try {
        components = JSON.stringify(editorInstance.getComponents());
        styles = JSON.stringify(editorInstance.getStyle());
      } catch (err) {
        console.error("Error stringifying editor content:", err);
        components = "{}";
        styles = "{}";
      }

      // Envoi des données au backend
      await axios.post(
        `http://127.0.0.1:8000/api/pages/${pageId}/save-content/`,
        {
          html,
          css,
          components,
          styles
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (toastRef.current) {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: "Page saved successfully",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Save error:", error);
      if (toastRef.current) {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to save page content",
          life: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-container flex flex-col h-screen">
      <Toast ref={toastRef} />
      <Navbar />
      <div className="editor-toolbar p-3 bg-gray-100 border-b flex items-center gap-2">
        <Button
          label="Save"
          icon="pi pi-save"
          className="p-button-primary"
          onClick={() => editor && saveContent(editor)}
          loading={loading}
        />
        <Button
          label="Return to Home"
          icon="pi pi-arrow-left"
          className="p-button-secondary"
          onClick={() => navigate('/')}
        />
      </div>
      <div id="editor" className="flex-grow"></div>
    </div>
  );
}

export default Editor;