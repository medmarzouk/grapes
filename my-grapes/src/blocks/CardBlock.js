// blocks/CardBlock.js
export const cardBlock = {
    id: 'card-block',
    label: 'Card Component',
    category: 'Components',
    content: `
      <div class="card" style="width: 18rem; margin: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <img src="https://via.placeholder.com/300x200" class="card-img-top" alt="Card Image">
        <div class="card-body">
          <h5 class="card-title">Card Title</h5>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
      </div>
    `,
    attributes: {
      class: 'fa fa-id-card'
    }
  };