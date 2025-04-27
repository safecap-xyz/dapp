import React from 'react';
import { Button, Typography, Card, Alert } from './index';

/**
 * A component to showcase all the UI components and styles
 */
export const Showcase: React.FC = () => {
  return (
    <div className="showcase p-6 space-y-8">
      <div className="section">
        <Typography variant="h2" className="mb-4">Typography</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <Typography variant="h1">H1 Heading</Typography>
            <Typography variant="h2">H2 Heading</Typography>
            <Typography variant="h3">H3 Heading</Typography>
            <Typography variant="h4">H4 Heading</Typography>
            <Typography variant="h5">H5 Heading</Typography>
            <Typography variant="h6">H6 Heading</Typography>
          </Card>
          <Card>
            <Typography variant="subtitle1">Subtitle 1</Typography>
            <Typography variant="subtitle2">Subtitle 2</Typography>
            <Typography variant="body1">Body 1 - Regular text for most content</Typography>
            <Typography variant="body2">Body 2 - Smaller text for secondary content</Typography>
            <Typography variant="caption">Caption - Small text for captions</Typography>
            <Typography variant="overline">OVERLINE - UPPERCASE TEXT FOR LABELS</Typography>
          </Card>
        </div>
      </div>

      <div className="section">
        <Typography variant="h2" className="mb-4">Colors</Typography>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <div className="bg-primary-main w-16 h-16 rounded-md shadow-md"></div>
            <Typography variant="caption" className="mt-2">Primary</Typography>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-secondary-main w-16 h-16 rounded-md shadow-md"></div>
            <Typography variant="caption" className="mt-2">Secondary</Typography>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-accent-main w-16 h-16 rounded-md shadow-md"></div>
            <Typography variant="caption" className="mt-2">Accent</Typography>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-neutral-main w-16 h-16 rounded-md shadow-md"></div>
            <Typography variant="caption" className="mt-2">Neutral</Typography>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-success-main w-16 h-16 rounded-md shadow-md"></div>
            <Typography variant="caption" className="mt-2">Success</Typography>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-warning-main w-16 h-16 rounded-md shadow-md"></div>
            <Typography variant="caption" className="mt-2">Warning</Typography>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-error-main w-16 h-16 rounded-md shadow-md"></div>
            <Typography variant="caption" className="mt-2">Error</Typography>
          </div>
        </div>
      </div>

      <div className="section">
        <Typography variant="h2" className="mb-4">Buttons</Typography>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Typography variant="subtitle2" className="mb-2">Button Variants</Typography>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="accent">Accent</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="text">Text</Button>
              </div>
            </div>
            <div>
              <Typography variant="subtitle2" className="mb-2">Button Sizes</Typography>
              <div className="flex flex-wrap gap-2 items-center">
                <Button variant="secondary" size="small">Small</Button>
                <Button variant="secondary" size="medium">Medium</Button>
                <Button variant="secondary" size="large">Large</Button>
              </div>
            </div>
          </div>
          <div>
            <Typography variant="subtitle2" className="mb-2">Button States</Typography>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary">Default</Button>
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="primary" className="opacity-50">Hover/Focus</Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="section">
        <Typography variant="h2" className="mb-4">Cards</Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <Typography variant="h4" className="mb-2">Basic Card</Typography>
            <Typography variant="body2">A standard card component for content display.</Typography>
          </Card>
          <Card hoverable>
            <Typography variant="h4" className="mb-2">Hoverable Card</Typography>
            <Typography variant="body2">This card has a hover effect for better interactivity.</Typography>
          </Card>
          <Card glassEffect>
            <Typography variant="h4" className="mb-2">Glass Effect Card</Typography>
            <Typography variant="body2">This card has a modern glass/blur effect styling.</Typography>
          </Card>
        </div>
      </div>

      <div className="section">
        <Typography variant="h2" className="mb-4">Alerts</Typography>
        <div className="space-y-4">
          <Alert variant="info" title="Information">This is an informational alert message.</Alert>
          <Alert variant="success" title="Success">Operation completed successfully!</Alert>
          <Alert variant="warning" title="Warning">Please be cautious with this action.</Alert>
          <Alert variant="error" title="Error">An error occurred while processing your request.</Alert>
        </div>
      </div>
    </div>
  );
};

export default Showcase;
