import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CategoryList from '../components/CategoryList';
import Banner from '../components/Banner';
import ServiceSection from '../components/ServiceSection';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <main>
                <Hero />
                <CategoryList />
                <Banner />
                <ServiceSection />
            </main>
        </div>
    );
};

export default Home;
