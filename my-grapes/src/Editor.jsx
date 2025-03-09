import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import grapesjsForms from 'grapesjs-plugin-forms';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { topBarBlock } from './blocks/TopBarBlock';
import { toolbarBlock } from './blocks/ToolbarBlock';
import { formBlock } from './blocks/FormBlock';
import { footerBlock } from './blocks/FooterBlock';
import Navbar from './components/Navbar';
import { cardBlock } from './blocks/CardBlock';
import { heroBlock } from './blocks/HeroBlock';
import { ctaBlock } from './blocks/CTABlock';
import { sliderBlock } from './blocks/SliderBlock';

function Editor() {
  const [editor, setEditor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(null);
  const { pageId } = useParams();
  const navigate = useNavigate();
  const toastRef = useRef(null);
  const editorContainerRef = useRef(null);

  // Get token from localStorage
  const token = localStorage.getItem("accessToken");

  // Helper function to safely parse JSON
  const safeParseJSON = (jsonString, fallback = {}) => {
    if (!jsonString) return fallback;
    
    // If it's already an object, return it
    if (typeof jsonString !== 'string') return jsonString;

    // Check if it's HTML content (common error case)
    if (jsonString.trim().startsWith('<!') || 
        jsonString.trim().startsWith('<html')) {
      console.warn('Received HTML instead of JSON');
      return fallback;
    }

    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("JSON Parse Error:", error);
      return fallback;
    }
  };

  // Function to prepare save payload with safe JSON handling
  const getSavePayload = (editorInstance) => {
    if (!editorInstance) return {};

    const html = editorInstance.getHtml();
    const css = editorInstance.getCss();
    let components, styles;
    
    try {
      // Get components and styles as objects first
      const componentsObj = editorInstance.getComponents();
      const stylesObj = editorInstance.getStyle();
      
      // Then stringify them
      components = JSON.stringify(componentsObj);
      styles = JSON.stringify(stylesObj);
    } catch (err) {
      console.error("Error converting editor content:", err);
      components = "{}";
      styles = "{}";
    }
    
    return { html, css, components, styles };
  };

  // Function to save content
  const saveContent = async (editorInstance) => {
    if (!editorInstance || !pageId || !token) {
      console.error("Cannot save: missing editor, pageId, or token");
      return;
    }
    
    try {
      setLoading(true);

      // Prepare data to save
      const payload = getSavePayload(editorInstance);

      // Send to backend
      const response = await axios.post(
        `http://127.0.0.1:8000/api/pages/${pageId}/save-content/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Save response:", response.data);

      if (toastRef.current) {
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: "Page saved successfully",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error saving:", error.response || error);
      if (toastRef.current) {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: error.response?.data?.error || "Failed to save page content",
          life: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch the page data directly
  const fetchPageData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/pages/${pageId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched page data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching page data:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        console.warn("Authentication failed. Redirecting to login.");
        navigate("/login");
      }
      throw error;
    }
  };

  useEffect(() => {
    if (!token) {
      console.warn("No token found in localStorage. Redirecting to login page.");
      navigate("/login");
      return;
    }

    // Cleanup function to handle editor destruction
    let currentEditor = null;
    
    const initEditor = async () => {
      try {
        // First fetch page data separately
        const pageData = await fetchPageData();
        setPage(pageData);

        if (!editorContainerRef.current) {
          console.error("Editor container not found");
          return;
        }

        // Configure GrapesJS with correct storage settings
        const storageConfig = {
          type: 'remote',
          stepsBeforeSave: 1,
          contentTypeJson: true,
          headers: {
            Authorization: `Bearer ${token}`
          },
          autosave: false,
          // Use custom save handler instead of built-in storage
          urlStore: false,
          urlLoad: false
        };

        // Initialize GrapesJS
        const editorInstance = grapesjs.init({
          container: editorContainerRef.current,
          height: '92vh',
          plugins: [gjsPresetWebpage, gjsBlocksBasic, grapesjsForms],
          pluginsOpts: {
            gjsPresetWebpage: {},
            gjsBlocksBasic: {},
            grapesjsForms: {},
          },
          storageManager: storageConfig,
          // Load basic HTML/CSS initially
          components: '',
          style: '',
          allowScripts: 1,
          canvas: { scripts: [], styles: [] },
        });

        // Store reference for cleanup
        currentEditor = editorInstance;

        // Add custom blocks
        editorInstance.BlockManager.add(topBarBlock.id, topBarBlock);
        editorInstance.BlockManager.add(toolbarBlock.id, toolbarBlock);
        editorInstance.BlockManager.add(formBlock.id, formBlock);
        editorInstance.BlockManager.add(footerBlock.id, footerBlock);
        editorInstance.BlockManager.add(cardBlock.id, cardBlock);
        editorInstance.BlockManager.add(heroBlock.id, heroBlock);
        editorInstance.BlockManager.add(ctaBlock.id, ctaBlock);
        editorInstance.BlockManager.add(sliderBlock.id, sliderBlock);

        // Add save button to panel
        editorInstance.Panels.addButton('options', {
          id: 'save-button',
          className: 'fa fa-floppy-o',
          command: 'save-content',
          attributes: { title: 'Save' }
        });

        // Define save command
        editorInstance.Commands.add('save-content', {
          run: () => saveContent(editorInstance)
        });

        // Refresh canvas after drag-end
        editorInstance.on('canvas:dragend', () => {
          try {
            editorInstance.refresh();
          } catch (error) {
            console.warn('Error refreshing canvas:', error);
          }
        });

        // Try to load components and styles if available
        try {
          // First try to load components
          if (pageData.components) {
            const componentsData = safeParseJSON(pageData.components);
            if (Object.keys(componentsData).length > 0) {
              editorInstance.setComponents(componentsData);
            } else if (pageData.html) {
              // Fallback to HTML if components JSON is empty or invalid
              editorInstance.setComponents(pageData.html);
            }
          } else if (pageData.html) {
            // If no components data at all, use HTML
            editorInstance.setComponents(pageData.html);
          }

          // Then try to load styles
          if (pageData.styles) {
            const stylesData = safeParseJSON(pageData.styles);
            if (Object.keys(stylesData).length > 0) {
              editorInstance.setStyle(stylesData);
            } else if (pageData.css) {
              // Fallback to CSS if styles JSON is empty or invalid
              editorInstance.setStyle(pageData.css);
            }
          } else if (pageData.css) {
            // If no styles data at all, use CSS
            editorInstance.setStyle(pageData.css);
          }
        } catch (err) {
          console.warn('Error loading components or styles, falling back to HTML/CSS:', err);
          // Final fallback to HTML/CSS
          if (pageData.html) {
            editorInstance.setComponents(pageData.html);
          }
          if (pageData.css) {
            editorInstance.setStyle(pageData.css);
          }
        }

        setEditor(editorInstance);
      } catch (error) {
        console.error("Error initializing editor:", error);
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

    initEditor();

    // Return cleanup function
    return () => {
      if (currentEditor) {
        try {
          currentEditor.destroy();
        } catch (error) {
          console.warn("Error cleaning up editor:", error);
        }
      }
    };
  }, [pageId, token, navigate]);

  return (
    <div className="editor-container flex flex-col h-screen">
      <Toast ref={toastRef} />
      <Navbar />
      <div ref={editorContainerRef} id="editor" className="flex-grow"></div>
    </div>
  );
}

export default Editor;