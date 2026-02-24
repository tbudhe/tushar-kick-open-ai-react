import React from 'react';
import Carousel from '../carousel/carousel';
import AdminSidebarLayout, { MenuSection } from '../layout/admin-sidebar-layout';
import { CarouselItem } from '../carousel/carousel';

const CarouselShowcase: React.FC = () => {
  const sampleJobs: CarouselItem[] = [
    {
      id: '1',
      title: 'Senior React Developer',
      company: 'Tech Corp',
      description: 'Build scalable web applications with React and TypeScript',
    },
    {
      id: '2',
      title: 'Full Stack Engineer',
      company: 'StartUp Inc',
      description: 'Work on both frontend and backend systems',
    },
    {
      id: '3',
      title: 'DevOps Engineer',
      company: 'Cloud Systems',
      description: 'Manage infrastructure and deployment pipelines',
    },
    {
      id: '4',
      title: 'Data Scientist',
      company: 'AI Solutions',
      description: 'Build machine learning models and analytics',
    },
  ];

  const menuSections: MenuSection[] = [
    {
      title: 'Components',
      items: [
        {
          id: 'overview',
          label: 'Overview',
          details: [
            'Carousel: A reusable React component for displaying rotating content.',
            'Features: Auto-slide functionality, manual navigation, keyboard accessible.',
            'Use Cases: Job listings, product showcases, testimonials, image galleries.',
            'Props: items (array), title (string), autoSlide (boolean), autoSlideInterval (number).',
          ],
        },
        {
          id: 'features',
          label: 'Features',
          details: [
            'Auto-slide: Automatically rotates through items at set intervals.',
            'Manual Navigation: Previous/Next buttons for user control.',
            'Dot Indicators: Quick jump to specific slides.',
            'Keyboard Support: Navigate with arrow keys.',
            'Responsive Design: Works on mobile, tablet, and desktop.',
            'Smooth Animations: Transitions between slides.',
          ],
        },
        {
          id: 'props',
          label: 'Props & Configuration',
          subcategories: [
            {
              id: 'props-details',
              label: 'Available Props',
              details: [
                'items: Array of CarouselItem objects to display.',
                'title: Optional title for the carousel section.',
                'autoSlide: Boolean to enable/disable auto-rotation (default: true).',
                'autoSlideInterval: Milliseconds between auto-slides (default: 6000).',
              ],
            },
            {
              id: 'item-structure',
              label: 'CarouselItem Structure',
              details: [
                'id: Unique identifier for the item.',
                'title: Main heading or title text.',
                'company: Organization or source name.',
                'description: Detailed content or description.',
              ],
            },
          ],
        },
        {
          id: 'usage',
          label: 'Usage Example',
          details: [
            'import Carousel from "../carousel/carousel";',
            'const items = [{id: "1", title: "Item 1", company: "Org", description: "..."}];',
            '<Carousel items={items} title="Featured Items" autoSlide={true} />',
            'Component handles all carousel logic internally.',
            'Customize interval: autoSlideInterval={5000} for 5 seconds.',
          ],
        },
        {
          id: 'styling',
          label: 'Styling & Customization',
          details: [
            'Uses DaisyUI classes for consistent theming.',
            'Tailwind CSS integration for responsive design.',
            'Smooth transitions with CSS animations.',
            'Hover effects on items and buttons.',
            'Customizable colors via CSS variables.',
            'Mobile-friendly with responsive grid.',
          ],
        },
      ],
    },
  ];

  return (
    <div className="carousel-showcase-wrapper">
      <AdminSidebarLayout
        sections={menuSections}
        appName="Carousel Component"
      />

      {/* Carousel Demos */}
      <div className="carousel-demo-overlay">
        <div className="carousel-demo-content">
          <h2>Live Carousel Examples</h2>

          <div className="demo-section">
            <h3>Auto-slide Carousel (6 seconds)</h3>
            <Carousel
              items={sampleJobs}
              title="Featured Jobs"
              autoSlide={true}
              autoSlideInterval={6000}
            />
          </div>

          <div className="demo-section">
            <h3>Manual Navigation Only</h3>
            <Carousel
              items={sampleJobs}
              title="Browse Jobs"
              autoSlide={false}
            />
          </div>

          <div className="demo-section">
            <h3>Fast Auto-slide (3 seconds)</h3>
            <Carousel
              items={sampleJobs}
              title="Quick Preview"
              autoSlide={true}
              autoSlideInterval={3000}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselShowcase;
