export const topBarBlock = {
    id: 'top-bar-block',
    label: 'Barre Supérieure',
    category: 'Custom Layout',
    content: `
      <div style="background-color: #e0e6ed; padding: 10px; display: flex; align-items: center; justify-content: space-between; font-family: Arial, sans-serif;">
        <!-- Icônes à gauche (précédent / suivant) -->
        <div style="display: flex; gap: 8px;">
          <!-- Remplacez src par l'URL de vos icônes -->
          <button style="border: none; background: none;">
            <img src="https://via.placeholder.com/20/000000?text=<" alt="Précédent">
          </button>
          <button style="border: none; background: none;">
            <img src="https://via.placeholder.com/20/000000?text=>" alt="Suivant">
          </button>
        </div>
        <!-- Titre principal -->
        <span style="font-weight: bold;">
          Souscriptions / Rachats : Code : SUNU - La dernière VL fixée : 751 596.2788018550 - La dernière date VL : 09/01/2025
        </span>
        <!-- Icône loupe à droite -->
        <button style="border: none; background: none;">
          <img src="https://via.placeholder.com/20/000000?text=%F0%9F%94%8D" alt="Rechercher">
        </button>
      </div>
    `,
  };
  