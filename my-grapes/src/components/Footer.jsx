import React from 'react';
import { Button } from 'primereact/button';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} PROSOFT-INTERNATIONAL. Tous droits réservés.
        </p>
        <div className="flex space-x-4">
          <a
            href="https://www.linkedin.com/company/prosoft-international"
            target="_blank"
            rel="noopener noreferrer"
            className="transition transform hover:scale-110"
          >
            <Button
              icon="pi pi-linkedin"
              className="p-button-rounded p-button-outlined"
              style={{ borderColor: 'white', color: 'white' }}
            />
          </a>
          <a
            href="https://www.prosoftinternational.com.tn"
            target="_blank"
            rel="noopener noreferrer"
            className="transition transform hover:scale-110"
          >
            <Button
              icon="pi pi-globe"
              className="p-button-rounded p-button-outlined"
              style={{ borderColor: 'white', color: 'white' }}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
