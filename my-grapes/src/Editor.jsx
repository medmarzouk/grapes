import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import grapesjsForms from 'grapesjs-plugin-forms';
import { topBarBlock } from './blocks/TopBarBlock';
import { toolbarBlock } from './blocks/ToolbarBlock';
import { formBlock } from './blocks/FormBlock';
import { footerBlock } from './blocks/FooterBlock';
import Navbar from './components/Navbar';



function Editor() {
  const [editor, setEditor] = useState(null);
  const {pageId}= useParams();
  console.log('pageId :) ')
  useEffect(() => {
    const editorInstance = grapesjs.init({
      container: '#editor',
      height: '100vh',
      plugins: [gjsPresetWebpage, gjsBlocksBasic, grapesjsForms],
      pluginsOpts: {
        gjsPresetWebpage: {},
        gjsBlocksBasic: {},
        grapesjsForms: {},
      },
      storageManager: { autoload: 0 }, // désactive le chargement auto
    });

    // Ajout des blocs personnalisés
    editorInstance.BlockManager.add(topBarBlock.id, topBarBlock);
    editorInstance.BlockManager.add(toolbarBlock.id, toolbarBlock);
    editorInstance.BlockManager.add(formBlock.id, formBlock);
    editorInstance.BlockManager.add(footerBlock.id, footerBlock);

    setEditor(editorInstance);

    return () => {
      editorInstance.destroy();
    };
  }, []);

  return (
    <div>
      
      <Navbar />
      <div id="editor"></div>
    </div>
  );
}

export default Editor;
