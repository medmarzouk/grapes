// blocks/CTABlock.js
export const ctaBlock = {
    id: 'cta-section',
    label: 'Call to Action',
    category: 'Sections',
    content: `
      <section class="cta-section" style="background-color: #F8F9FA; padding: 60px 0; text-align: center;">
        <div class="container">
          <div class="row">
            <div class="col-md-8 offset-md-2">
              <h2 style="margin-bottom: 20px;">Ready to Get Started?</h2>
              <p style="margin-bottom: 30px; font-size: 1.1rem;">Join thousands of satisfied customers using our platform.</p>
              <button class="btn btn-success btn-lg">Sign Up Now</button>
            </div>
          </div>
        </div>
      </section>
    `,
    attributes: {
      class: 'fa fa-bullhorn'
    }
  };