// blocks/HeroBlock.js
export const heroBlock = {
    id: 'hero-section',
    label: 'Hero Section',
    category: 'Sections',
    content: `
      <section id="hero" class="hero-block" style="background-color: #2C3E50; color: white; padding: 80px 0; text-align: center;">
        <div class="container">
          <div class="row">
            <div class="col-md-8 offset-md-2">
              <h1 style="font-size: 3rem; margin-bottom: 20px;">Welcome to Our Website</h1>
              <p style="font-size: 1.25rem; margin-bottom: 30px;">A modern solution for your business needs</p>
              <button class="btn btn-primary btn-lg mr-2">Get Started</button>
              <button class="btn btn-outline-light btn-lg">Learn More</button>
            </div>
          </div>
        </div>
      </section>
    `,
    attributes: {
      class: 'fa fa-star'
    }
  };