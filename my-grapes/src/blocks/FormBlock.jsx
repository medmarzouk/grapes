export const formBlock = {
    id: 'form-block',
    label: 'Formulaire Souscription',
    category: 'Custom Layout',
    content: `
      <div style="background-color: #ffffff; padding: 10px; border: 1px solid #ccc; font-family: Arial, sans-serif;">
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 10px;">
          <label style="font-weight: bold;">Dépôt:</label>
          <select><option>Option 1</option><option>Option 2</option></select>
  
          <label style="font-weight: bold;">Certificat:</label>
          <input type="text" value="0001">
  
          <label style="font-weight: bold;">Nom:</label>
          <input type="text" value="CLIENT GLOBAL">
  
          <label style="font-weight: bold;">Sicav:</label>
          <input type="text" value="SUNU">
  
          <label style="font-weight: bold;">Sens:</label>
          <select><option>Souscription</option></select>
  
          <label style="font-weight: bold;">VL:</label>
          <input type="text" style="background-color: #d1f2eb; font-weight: bold;" value="747726.0025442241">
  
          <label style="font-weight: bold;">Quantité:</label>
          <input type="text" value="126.6117276621">
  
          <label style="font-weight: bold;">Stock:</label>
          <input type="text" value="15903.139963551" disabled>
  
          <label style="font-weight: bold;">Date Transaction:</label>
          <input type="text" value="31/12/2024">
  
          <label style="font-weight: bold;">Frais d'Entrée:</label>
          <input type="text" style="background-color: #d1f2eb; font-weight: bold;" value="0.000">
  
          <label style="font-weight: bold;">Montant:</label>
          <input type="text" style="background-color: #d1f2eb; font-weight: bold;" value="94670881.000">
        </div>
      </div>
    `,
  };
  