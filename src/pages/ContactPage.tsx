import React from 'react';
import GoogleMap from '../components/GoogleMap';
import { MapPin, Phone, Mail, Linkedin } from 'lucide-react';

const ContactPage: React.FC = () => {
  const GOOGLE_MAPS_API_KEY = "AIzaSyA3VvqWQtoTo1BRW-jz77pEpikJe6BQ6Lo";

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Our Office</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin className="mr-2 mt-1 flex-shrink-0" />
              <p>
                FDM Singapore Consulting PTE Ltd<br />
                South Beach Tower #26-11<br />
                38 Beach Road<br />
                Singapore 189767
              </p>
            </div>
            <div className="flex items-center">
              <Phone className="mr-2" />
              <p>+65 1234 5678</p>
            </div>
            <div className="flex items-center">
              <Mail className="mr-2" />
              <p>kevin.yeong@fdmsingapore.com</p>
            </div>
            <div className="flex items-center">
              <Linkedin className="mr-2" />
              <a href="https://www.linkedin.com/company/fdm-group/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                FDM Group on LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="h-[400px] rounded-lg overflow-hidden shadow-lg">
          <GoogleMap 
            apiKey={GOOGLE_MAPS_API_KEY}
            latitude={1.2956544}
            longitude={103.8564952}
            zoom={15}
            markerTitle="FDM Singapore Office"
          />
        </div>
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
        <p className="max-w-2xl mx-auto">
          We'd love to hear from you! Whether you have a question about our services, 
          want to join our team, or need assistance, our friendly staff is here to help.
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
