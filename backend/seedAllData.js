import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Service from './models/Service.js';

dotenv.config();

const categoriesData = [
    {
        name: "Women's Salon", icon: "✂️", color: "text-pink-500", bg: "bg-pink-50",
        services: [
            { name: "Haircut & Styling", image: "https://images.unsplash.com/photo-1562322140-8baeececf3ce?q=80&w=800&auto=format&fit=crop" },
            { name: "Full Body Waxing", image: "https://images.unsplash.com/photo-1570773663737-268e217be9fe?q=80&w=800&auto=format&fit=crop" },
            { name: "Basic Facial", image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop" },
            { name: "Premium Glow Facial", image: "https://images.unsplash.com/photo-1512496015851-a1cbf4c5c2d4?q=80&w=800&auto=format&fit=crop" },
            { name: "Manicure & Pedicure", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop" },
            { name: "Threading & Face Waxing", image: "https://images.unsplash.com/photo-1616460144565-5c1a179ee4ed?q=80&w=800&auto=format&fit=crop" },
            { name: "Hair Coloring", image: "https://images.unsplash.com/photo-1595475850900-ea1072b220ff?q=80&w=800&auto=format&fit=crop" },
            { name: "Hair Spa Treatment", image: "https://images.unsplash.com/photo-1590457388796-03f19e4dfdcb?q=80&w=800&auto=format&fit=crop" },
            { name: "Bridal Makeup", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop" },
            { name: "Party Makeup", image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop" }
        ]
    },
    {
        name: "Men's Salon", icon: "💈", color: "text-blue-500", bg: "bg-blue-50",
        services: [
            { name: "Men's Haircut", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop" },
            { name: "Beard Trim & Styling", image: "https://images.unsplash.com/photo-1621605815971-ceb5c4ad20ac?q=80&w=800&auto=format&fit=crop" },
            { name: "Head Massage", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop" },
            { name: "De-tan Facial", image: "https://images.unsplash.com/photo-1512496015851-a1cbf4c5c2d4?q=80&w=800&auto=format&fit=crop" },
            { name: "Hair Color", image: "https://images.unsplash.com/photo-1595475850900-ea1072b220ff?q=80&w=800&auto=format&fit=crop" },
            { name: "Kids Haircut", image: "https://images.unsplash.com/photo-1533142273010-33b8179fb7c7?q=80&w=800&auto=format&fit=crop" },
            { name: "Body Massage", image: "https://images.unsplash.com/photo-1519824145371-296898a58fba?q=80&w=800&auto=format&fit=crop" },
            { name: "Pedicure for Men", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop" },
            { name: "Hair Spa", image: "https://images.unsplash.com/photo-1590457388796-03f19e4dfdcb?q=80&w=800&auto=format&fit=crop" },
            { name: "Anti-dandruff Treatment", image: "https://images.unsplash.com/photo-1562322140-8baeececf3ce?q=80&w=800&auto=format&fit=crop" }
        ]
    },
    {
        name: "AC & Appliance", icon: "❄️", color: "text-cyan-500", bg: "bg-cyan-50",
        services: [
            { name: "AC Service", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop" },
            { name: "AC Repair", image: "https://plus.unsplash.com/premium_photo-1664302152994-6e1d200fa4ca?q=80&w=800&auto=format&fit=crop" },
            { name: "AC Installation", image: "https://images.unsplash.com/photo-1534398079543-7ae6d016b86c?q=80&w=800&auto=format&fit=crop" },
            { name: "Washing Machine Repair", image: "https://images.unsplash.com/photo-1626806787426-5910b42fdf4e?q=80&w=800&auto=format&fit=crop" },
            { name: "Refrigerator Repair", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
            { name: "Microwave Repair", image: "https://images.unsplash.com/photo-1585862306785-f5e970b5550a?q=80&w=800&auto=format&fit=crop" },
            { name: "TV Mounting", image: "https://plus.unsplash.com/premium_photo-1661661858525-46ee23e9cb14?q=80&w=800&auto=format&fit=crop" },
            { name: "Geyser Repair", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
            { name: "Chimney Cleaning", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop" },
            { name: "Water Dispenser Repair", image: "https://images.unsplash.com/photo-1544414349-9fd9a1e0bca5?q=80&w=800&auto=format&fit=crop" }
        ]
    },
    {
        name: "Cleaning", icon: "✨", color: "text-yellow-500", bg: "bg-yellow-50",
        services: [
            { name: "Full Home Deep Cleaning", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop" },
            { name: "Bathroom Cleaning", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
            { name: "Kitchen Deep Cleaning", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
            { name: "Sofa Cleaning", image: "https://images.unsplash.com/photo-1558500213-9f12ab3f4d6d?q=80&w=800&auto=format&fit=crop" },
            { name: "Carpet Cleaning", image: "https://plus.unsplash.com/premium_photo-1663047245899-23fcecf809b0?q=80&w=800&auto=format&fit=crop" },
            { name: "Mattress Cleaning", image: "https://plus.unsplash.com/premium_photo-1663047432085-f6eed36d2c4b?q=80&w=800&auto=format&fit=crop" },
            { name: "Balcony Cleaning", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
            { name: "Window Cleaning", image: "https://plus.unsplash.com/premium_photo-1664302196024-4f400787ca18?q=80&w=800&auto=format&fit=crop" },
            { name: "Move-in/out Cleaning", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop" },
            { name: "Office Cleaning", image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?q=80&w=800&auto=format&fit=crop" }
        ]
    },
    {
        name: "Electrician", icon: "⚡", color: "text-orange-500", bg: "bg-orange-50",
        services: [
            { name: "Switch/Socket Repair", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop" },
            { name: "Fan Installation", image: "https://images.unsplash.com/photo-1608681284561-ebdc7ef6e838?q=80&w=800&auto=format&fit=crop" },
            { name: "MCB & Fuse Repair", image: "https://images.unsplash.com/photo-1622283023608-d2eabdbdccab?q=80&w=800&auto=format&fit=crop" },
            { name: "Inverter Setup", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop" },
            { name: "Light Fitting", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop" },
            { name: "Wiring/Rewiring", image: "https://plus.unsplash.com/premium_photo-1664302152994-6e1d200fa4ca?q=80&w=800&auto=format&fit=crop" },
            { name: "Chandelier Installation", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop" },
            { name: "Door Bell Installation", image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop" },
            { name: "Electric Panel Work", image: "https://images.unsplash.com/photo-1622283023608-d2eabdbdccab?q=80&w=800&auto=format&fit=crop" },
            { name: "AC Wiring", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop" }
        ]
    },
    {
        name: "Plumber", icon: "💧", color: "text-blue-500", bg: "bg-blue-50",
        services: [
            { name: "Tap Leak Repair", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=800&auto=format&fit=crop" },
            { name: "Washbasin Blockage", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
            { name: "Toilet Pipe Blockage", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
            { name: "Water Tank Cleaning", image: "https://plus.unsplash.com/premium_photo-1663047432085-f6eed36d2c4b?q=80&w=800&auto=format&fit=crop" },
            { name: "Geyser Installation", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
            { name: "Motor Pump Repair", image: "https://plus.unsplash.com/premium_photo-1664302152994-6e1d200fa4ca?q=80&w=800&auto=format&fit=crop" },
            { name: "Flush Tank Repair", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
            { name: "Pipe Replacement", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=800&auto=format&fit=crop" },
            { name: "Shower Installation", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
            { name: "Kitchen Sink Fitting", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" }
        ]
    },
    {
        name: "Carpenter", icon: "🔨", color: "text-amber-600", bg: "bg-amber-50",
        services: [
            { name: "Furniture Assembly", image: "https://images.unsplash.com/photo-1540638349517-3abd5afc5847?q=80&w=800&auto=format&fit=crop" },
            { name: "Door Lock Repair", image: "https://plus.unsplash.com/premium_photo-1663047245899-23fcecf809b0?q=80&w=800&auto=format&fit=crop" },
            { name: "Curtain Rod Installation", image: "https://plus.unsplash.com/premium_photo-1663047245899-23fcecf809b0?q=80&w=800&auto=format&fit=crop" },
            { name: "Bed Repair", image: "https://images.unsplash.com/photo-1540638349517-3abd5afc5847?q=80&w=800&auto=format&fit=crop" },
            { name: "Cabinet Hinge Fix", image: "https://plus.unsplash.com/premium_photo-1663047245899-23fcecf809b0?q=80&w=800&auto=format&fit=crop" },
            { name: "Sofa Repair", image: "https://images.unsplash.com/photo-1558500213-9f12ab3f4d6d?q=80&w=800&auto=format&fit=crop" },
            { name: "Wardrobe Dismantling", image: "https://images.unsplash.com/photo-1540638349517-3abd5afc5847?q=80&w=800&auto=format&fit=crop" },
            { name: "Window Frame Repair", image: "https://plus.unsplash.com/premium_photo-1663047245899-23fcecf809b0?q=80&w=800&auto=format&fit=crop" },
            { name: "Custom Furniture", image: "https://images.unsplash.com/photo-1540638349517-3abd5afc5847?q=80&w=800&auto=format&fit=crop" },
            { name: "Wooden Floor Polish", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop" }
        ]
    },
    {
        name: "Pest Control", icon: "🛡️", color: "text-green-500", bg: "bg-green-50",
        services: [
            { name: "General Pest Control", image: "https://images.unsplash.com/photo-1587293852726-694b5544ba4c?q=80&w=800&auto=format&fit=crop" },
            { name: "Termite Control", image: "https://plus.unsplash.com/premium_photo-1663047245899-23fcecf809b0?q=80&w=800&auto=format&fit=crop" },
            { name: "Bed Bug Treatment", image: "https://images.unsplash.com/photo-1587293852726-694b5544ba4c?q=80&w=800&auto=format&fit=crop" },
            { name: "Cockroach Control", image: "https://plus.unsplash.com/premium_photo-1663047245899-23fcecf809b0?q=80&w=800&auto=format&fit=crop" },
            { name: "Ant Control", image: "https://images.unsplash.com/photo-1587293852726-694b5544ba4c?q=80&w=800&auto=format&fit=crop" },
            { name: "Rodent Control", image: "https://plus.unsplash.com/premium_photo-1663047245899-23fcecf809b0?q=80&w=800&auto=format&fit=crop" },
            { name: "Mosquito Control", image: "https://images.unsplash.com/photo-1587293852726-694b5544ba4c?q=80&w=800&auto=format&fit=crop" },
            { name: "Wood Borer Treatment", image: "https://plus.unsplash.com/premium_photo-1663047245899-23fcecf809b0?q=80&w=800&auto=format&fit=crop" },
            { name: "Commercial Pest Control", image: "https://images.unsplash.com/photo-1587293852726-694b5544ba4c?q=80&w=800&auto=format&fit=crop" },
            { name: "Herbal Pest Control", image: "https://images.unsplash.com/photo-1587293852726-694b5544ba4c?q=80&w=800&auto=format&fit=crop" }
        ]
    },
    {
        name: "Painting", icon: "🖌️", color: "text-purple-500", bg: "bg-purple-50",
        services: [
            { name: "Full House Painting", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop" },
            { name: "1 RK Painting", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop" },
            { name: "Touch-up Painting", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800&auto=format&fit=crop" },
            { name: "Texture Wall Painting", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800&auto=format&fit=crop" },
            { name: "Waterproofing", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop" },
            { name: "Exterior Painting", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800&auto=format&fit=crop" },
            { name: "Wood Polish & Paint", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop" },
            { name: "Grill/Metal Painting", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop" },
            { name: "Stencil Painting", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop" },
            { name: "Enamel Painting", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800&auto=format&fit=crop" }
        ]
    },
    {
        name: "Smart Home", icon: "🏠", color: "text-indigo-500", bg: "bg-indigo-50",
        services: [
            { name: "Smart Lock Setup", image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop" },
            { name: "Smart Camera Setup", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800&auto=format&fit=crop" },
            { name: "Smart Lighting Install", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop" },
            { name: "Home Theatre Setup", image: "https://plus.unsplash.com/premium_photo-1661661858525-46ee23e9cb14?q=80&w=800&auto=format&fit=crop" },
            { name: "WiFi Setup & Extend", image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop" },
            { name: "Smart Hub Config", image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop" },
            { name: "Smart Switch Install", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop" },
            { name: "Video Doorbell Setup", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800&auto=format&fit=crop" },
            { name: "Motion Sensor Install", image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop" },
            { name: "Smart Thermostat Setup", image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop" }
        ]
    },
    {
        name: "Security & CCTV", icon: "📹", color: "text-gray-700", bg: "bg-gray-50",
        services: [
            { name: "CCTV Installation", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800&auto=format&fit=crop" },
            { name: "CCTV Repair", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800&auto=format&fit=crop" },
            { name: "DVR/NVR Configuration", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800&auto=format&fit=crop" },
            { name: "Biometric Setup", image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop" },
            { name: "Access Control System", image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop" },
            { name: "Video Door Phone", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800&auto=format&fit=crop" },
            { name: "Fire Alarm Setup", image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop" },
            { name: "IP Camera Networking", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800&auto=format&fit=crop" },
            { name: "Security Audit", image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop" },
            { name: "Cable Management", image: "https://plus.unsplash.com/premium_photo-1664302152994-6e1d200fa4ca?q=80&w=800&auto=format&fit=crop" }
        ]
    },
    {
        name: "Water Purifier (RO)", icon: "🚰", color: "text-cyan-600", bg: "bg-cyan-50",
        services: [
            { name: "RO General Service", image: "https://images.unsplash.com/photo-1544414349-9fd9a1e0bca5?q=80&w=800&auto=format&fit=crop" },
            { name: "RO Repair", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
            { name: "RO Installation", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
            { name: "RO Uninstallation", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
            { name: "Filter Replacement", image: "https://images.unsplash.com/photo-1544414349-9fd9a1e0bca5?q=80&w=800&auto=format&fit=crop" },
            { name: "Membrane Change", image: "https://images.unsplash.com/photo-1544414349-9fd9a1e0bca5?q=80&w=800&auto=format&fit=crop" },
            { name: "Water Testing", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
            { name: "Under Sink RO Setup", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
            { name: "Commercial RO Service", image: "https://images.unsplash.com/photo-1544414349-9fd9a1e0bca5?q=80&w=800&auto=format&fit=crop" },
            { name: "UV/UF Servicing", image: "https://images.unsplash.com/photo-1544414349-9fd9a1e0bca5?q=80&w=800&auto=format&fit=crop" }
        ]
    },
    {
        name: "Sofa & Carpet", icon: "🛋️", color: "text-rose-500", bg: "bg-rose-50",
        services: [
            { name: "Fabric Sofa Cleaning", image: "https://images.unsplash.com/photo-1558500213-9f12ab3f4d6d?q=80&w=800&auto=format&fit=crop" },
            { name: "Leather Sofa Polish", image: "https://images.unsplash.com/photo-1558500213-9f12ab3f4d6d?q=80&w=800&auto=format&fit=crop" },
            { name: "Carpet Shampooing", image: "https://plus.unsplash.com/premium_photo-1663047245899-23fcecf809b0?q=80&w=800&auto=format&fit=crop" },
            { name: "Rug Cleaning", image: "https://plus.unsplash.com/premium_photo-1663047245899-23fcecf809b0?q=80&w=800&auto=format&fit=crop" },
            { name: "Dining Chair Cleaning", image: "https://images.unsplash.com/photo-1558500213-9f12ab3f4d6d?q=80&w=800&auto=format&fit=crop" },
            { name: "Cushion Cover Wash", image: "https://images.unsplash.com/photo-1558500213-9f12ab3f4d6d?q=80&w=800&auto=format&fit=crop" },
            { name: "Office Chair Cleaning", image: "https://images.unsplash.com/photo-1558500213-9f12ab3f4d6d?q=80&w=800&auto=format&fit=crop" },
            { name: "Mattress Sanitization", image: "https://plus.unsplash.com/premium_photo-1663047432085-f6eed36d2c4b?q=80&w=800&auto=format&fit=crop" },
            { name: "Sofa Dry Cleaning", image: "https://images.unsplash.com/photo-1558500213-9f12ab3f4d6d?q=80&w=800&auto=format&fit=crop" },
            { name: "Recliner Service", image: "https://images.unsplash.com/photo-1558500213-9f12ab3f4d6d?q=80&w=800&auto=format&fit=crop" }
        ]
    },
    {
        name: "Home Renovation", icon: "🏗️", color: "text-stone-600", bg: "bg-stone-50",
        services: [
            { name: "Bathroom Renovation", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
            { name: "Kitchen Remodeling", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
            { name: "Flooring Setup", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop" },
            { name: "False Ceiling", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop" },
            { name: "Wall Paneling", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop" },
            { name: "Plastering Work", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop" },
            { name: "Tiling Work", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop" },
            { name: "Balcony Enclosure", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
            { name: "Terrace Waterproofing", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop" },
            { name: "Interior Designing", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop" }
        ]
    },
    {
        name: "Handyman", icon: "🧰", color: "text-teal-600", bg: "bg-teal-50",
        services: [
            { name: "Picture/Mirror Hanging", image: "https://images.unsplash.com/photo-1582030005720-3023eec73fb4?q=80&w=800&auto=format&fit=crop" },
            { name: "TV Mounting", image: "https://plus.unsplash.com/premium_photo-1661661858525-46ee23e9cb14?q=80&w=800&auto=format&fit=crop" },
            { name: "Furniture Moving", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" },
            { name: "Minor Repairs", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop" },
            { name: "Curtain Blind Setup", image: "https://images.unsplash.com/photo-1582030005720-3023eec73fb4?q=80&w=800&auto=format&fit=crop" },
            { name: "Door Trim Install", image: "https://plus.unsplash.com/premium_photo-1663047245899-23fcecf809b0?q=80&w=800&auto=format&fit=crop" },
            { name: "Shelf Mounting", image: "https://images.unsplash.com/photo-1582030005720-3023eec73fb4?q=80&w=800&auto=format&fit=crop" },
            { name: "Heavy Item Lifting", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" },
            { name: "General Assistance", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop" },
            { name: "Appliance Moving", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" }
        ]
    },
    {
        name: "Packers & Movers", icon: "📦", color: "text-blue-600", bg: "bg-blue-50",
        services: [
            { name: "Local Shifting", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" },
            { name: "Intercity Moving", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" },
            { name: "Vehicle Transport", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" },
            { name: "Office Relocation", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" },
            { name: "Packing Services", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" },
            { name: "Unpacking Services", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" },
            { name: "Loading/Unloading", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" },
            { name: "Storage & Warehousing", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" },
            { name: "Single Item Move", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" },
            { name: "Furniture Dismantling", image: "https://images.unsplash.com/photo-1540638349517-3abd5afc5847?q=80&w=800&auto=format&fit=crop" }
        ]
    },
    {
        name: "Sanitization", icon: "🧼", color: "text-emerald-500", bg: "bg-emerald-50",
        services: [
            { name: "Home Sanitization", image: "https://images.unsplash.com/photo-1584820927498-cafe4c14777a?q=80&w=800&auto=format&fit=crop" },
            { name: "Office Sanitization", image: "https://images.unsplash.com/photo-1584820927498-cafe4c14777a?q=80&w=800&auto=format&fit=crop" },
            { name: "Car Sanitization", image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop" },
            { name: "Fogging Service", image: "https://images.unsplash.com/photo-1584820927498-cafe4c14777a?q=80&w=800&auto=format&fit=crop" },
            { name: "Antiviral Disinfection", image: "https://images.unsplash.com/photo-1584820927498-cafe4c14777a?q=80&w=800&auto=format&fit=crop" },
            { name: "Commercial Disinfection", image: "https://images.unsplash.com/photo-1584820927498-cafe4c14777a?q=80&w=800&auto=format&fit=crop" },
            { name: "Vehicle Fogging", image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop" },
            { name: "Warehouse Sanitization", image: "https://images.unsplash.com/photo-1584820927498-cafe4c14777a?q=80&w=800&auto=format&fit=crop" },
            { name: "Clinic Disinfection", image: "https://images.unsplash.com/photo-1584820927498-cafe4c14777a?q=80&w=800&auto=format&fit=crop" },
            { name: "School Sanitization", image: "https://images.unsplash.com/photo-1584820927498-cafe4c14777a?q=80&w=800&auto=format&fit=crop" }
        ]
    },
    {
        name: "Massage Therapy", icon: "💆", color: "text-fuchsia-500", bg: "bg-fuchsia-50",
        services: [
            { name: "Swedish Massage", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop" },
            { name: "Deep Tissue Massage", image: "https://images.unsplash.com/photo-1519824145371-296898a58fba?q=80&w=800&auto=format&fit=crop" },
            { name: "Head & Shoulder Massage", image: "https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=800&auto=format&fit=crop" },
            { name: "Foot Reflexology", image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800&auto=format&fit=crop" },
            { name: "Aromatherapy", image: "https://images.unsplash.com/photo-1519824145371-296898a58fba?q=80&w=800&auto=format&fit=crop" },
            { name: "Back Relief Massage", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop" },
            { name: "Sports Massage", image: "https://images.unsplash.com/photo-1519824145371-296898a58fba?q=80&w=800&auto=format&fit=crop" },
            { name: "Thai Massage", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop" },
            { name: "Couples Massage", image: "https://images.unsplash.com/photo-1519824145371-296898a58fba?q=80&w=800&auto=format&fit=crop" },
            { name: "Pain Relief Therapy", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop" }
        ]
    },
    {
        name: "Gardening", icon: "🌱", color: "text-green-600", bg: "bg-green-50",
        services: [
            { name: "Lawn Maintenance", image: "https://images.unsplash.com/photo-1416879598553-569dce8812c4?q=80&w=800&auto=format&fit=crop" },
            { name: "Plant Setup", image: "https://images.unsplash.com/photo-1416879598553-569dce8812c4?q=80&w=800&auto=format&fit=crop" },
            { name: "Garden Cleaning", image: "https://images.unsplash.com/photo-1584820927498-cafe4c14777a?q=80&w=800&auto=format&fit=crop" },
            { name: "Weed Control", image: "https://images.unsplash.com/photo-1416879598553-569dce8812c4?q=80&w=800&auto=format&fit=crop" },
            { name: "Fertilization", image: "https://images.unsplash.com/photo-1416879598553-569dce8812c4?q=80&w=800&auto=format&fit=crop" },
            { name: "Tree Trimming", image: "https://images.unsplash.com/photo-1416879598553-569dce8812c4?q=80&w=800&auto=format&fit=crop" },
            { name: "Bonsai Care", image: "https://images.unsplash.com/photo-1416879598553-569dce8812c4?q=80&w=800&auto=format&fit=crop" },
            { name: "Potted Plant Repotting", image: "https://images.unsplash.com/photo-1416879598553-569dce8812c4?q=80&w=800&auto=format&fit=crop" },
            { name: "Landscape Design", image: "https://images.unsplash.com/photo-1416879598553-569dce8812c4?q=80&w=800&auto=format&fit=crop" },
            { name: "Sprinkler Repair", image: "https://images.unsplash.com/photo-1416879598553-569dce8812c4?q=80&w=800&auto=format&fit=crop" }
        ]
    },
    {
        name: "Car Cleaning", icon: "🚗", color: "text-blue-400", bg: "bg-blue-50",
        services: [
            { name: "Hatchback Deep Clean", image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop" },
            { name: "Sedan Deep Clean", image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop" },
            { name: "SUV Deep Clean", image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop" },
            { name: "Interior Car Spa", image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop" },
            { name: "Exterior Polishing", image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop" },
            { name: "Car Sanitization", image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop" },
            { name: "Engine Room Wash", image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop" },
            { name: "AC Vent Cleaning", image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop" },
            { name: "Seat Cover Wash", image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop" },
            { name: "Teflon Coating", image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop" }
        ]
    }
];

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobpilot');
        console.log('MongoDB connection SUCCESS');
    } catch (error) {
        console.error('MongoDB connection FAIL', error);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        console.log("Clearing existing Services and Categories...");
        await Service.deleteMany({});
        await Category.deleteMany({});

        console.log("Seeding new Categories and 10 Services each...");

        let totalServicesSeeded = 0;

        for (const catData of categoriesData) {
            const newCat = new Category({
                name: catData.name,
                icon: catData.icon,
                color: catData.color,
                bg: catData.bg
            });
            const savedCat = await newCat.save();

            const servicesToInsert = catData.services.map(serviceObj => {
                const price = Math.floor(Math.random() * (1999 - 299 + 1)) + 299;
                const rating = parseFloat((Math.random() * (5.0 - 4.0) + 4.0).toFixed(1));
                const reviews = Math.floor(Math.random() * 480) + 20;

                return {
                    title: serviceObj.name,
                    category: savedCat._id,
                    price: price,
                    description: `Professional ${serviceObj.name.toLowerCase()} services to meet your needs perfectly. Delivered by expert partners at your doorstep.`,
                    image: serviceObj.image,
                    includes: ["Experienced Professionals", "100% Satisfaction Guarantee", "High Quality Equipment"],
                    excludes: ["Parts/Material Cost", "Major structural changes"],
                    duration: "60 mins",
                    rating: rating,
                    reviews: reviews,
                    benefits: ["Hassle-free service", "Transparent pricing", "On-time arrival"]
                };
            });

            await Service.insertMany(servicesToInsert);
            totalServicesSeeded += servicesToInsert.length;
            console.log(`Seeded category ${catData.name} and its ${servicesToInsert.length} services.`);
        }

        console.log(`\n✅ Data Seeding Completed Successfully!`);
        console.log(`Categories created: ${categoriesData.length}`);
        console.log(`Total Services created: ${totalServicesSeeded}`);
        process.exit();

    } catch (error) {
        console.error("Error with data import", error);
        process.exit(1);
    }
};

seedData();
