import React from 'react';
import Hero from '../components/sections/Hero';
import ServicesOverview from '../components/sections/ServicesOverview';
import ServiceSection from '../components/sections/ServiceSection';
import Announcements from '../components/sections/Announcements';
import Contact from '../components/sections/Contact';
import VillageMap from '../components/VillageMap';
import { villageData, officialContacts } from '../data/villageData';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <ServicesOverview categories={villageData} />
      {villageData.map(category => (
        <ServiceSection key={category.id} category={category} />
      ))}
      <Announcements />
      <VillageMap />
      <Contact contacts={officialContacts} />
    </>
  );
};

export default Home;