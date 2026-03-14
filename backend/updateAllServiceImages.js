import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './models/Service.js';
import Category from './models/Category.js';

dotenv.config();

// Local AI-generated images base URL
const LOCAL = 'http://localhost:5000/uploads/services';

// Mapping: Category Name -> { ServiceTitle: imageURL }
const allImageMappings = {

    // ─── WOMEN'S SALON (Already AI-generated, skip) ───────────────

    // ─── MEN'S SALON ──────────────────────────────────────────────
    "Men's Salon": {
        "Men's Haircut": `${LOCAL}/ms_haircut.png`,
        "Beard Trim & Styling": `${LOCAL}/ms_beard_trim.png`,
        "Head Massage": "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800&auto=format&fit=crop",
        "De-tan Facial": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
        "Hair Color": "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=800&auto=format&fit=crop",
        "Kids Haircut": "https://images.unsplash.com/photo-1592647420148-bfcc177e2117?q=80&w=800&auto=format&fit=crop",
        "Body Massage": "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=800&auto=format&fit=crop",
        "Pedicure for Men": "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop",
        "Hair Spa": "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop",
        "Anti-dandruff Treatment": "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=800&auto=format&fit=crop",
    },

    // ─── AC & APPLIANCE ───────────────────────────────────────────
    "AC & Appliance": {
        "AC Service": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=800&auto=format&fit=crop",
        "AC Repair": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
        "AC Installation": "https://images.unsplash.com/photo-1631545806609-45fa2a5a1647?q=80&w=800&auto=format&fit=crop",
        "Washing Machine Repair": "https://images.unsplash.com/photo-1626806787426-5910b42fdf4e?q=80&w=800&auto=format&fit=crop",
        "Refrigerator Repair": "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=800&auto=format&fit=crop",
        "Microwave Repair": "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=800&auto=format&fit=crop",
        "TV Mounting": "https://images.unsplash.com/photo-1593784991095-a205069533cd?q=80&w=800&auto=format&fit=crop",
        "Geyser Repair": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=800&auto=format&fit=crop",
        "Chimney Cleaning": "https://images.unsplash.com/photo-1556909114-44e3e70034e2?q=80&w=800&auto=format&fit=crop",
        "Water Dispenser Repair": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=800&auto=format&fit=crop",
    },

    // ─── CLEANING ─────────────────────────────────────────────────
    "Cleaning": {
        "Full Home Deep Cleaning": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop",
        "Bathroom Cleaning": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
        "Kitchen Deep Cleaning": "https://images.unsplash.com/photo-1556909114-44e3e70034e2?q=80&w=800&auto=format&fit=crop",
        "Sofa Cleaning": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
        "Carpet Cleaning": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=800&auto=format&fit=crop",
        "Mattress Cleaning": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop",
        "Balcony Cleaning": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
        "Window Cleaning": "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=800&auto=format&fit=crop",
        "Move-in/out Cleaning": "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=800&auto=format&fit=crop",
        "Office Cleaning": "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    },

    // ─── ELECTRICIAN ──────────────────────────────────────────────
    "Electrician": {
        "Switch/Socket Repair": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop",
        "Fan Installation": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=800&auto=format&fit=crop",
        "MCB & Fuse Repair": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=800&auto=format&fit=crop",
        "Inverter Setup": "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop",
        "Light Fitting": "https://images.unsplash.com/photo-1507494924047-60b8ee826ca9?q=80&w=800&auto=format&fit=crop",
        "Wiring/Rewiring": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
        "Chandelier Installation": "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?q=80&w=800&auto=format&fit=crop",
        "Door Bell Installation": "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
        "Electric Panel Work": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
        "AC Wiring": "https://images.unsplash.com/photo-1631545806609-45fa2a5a1647?q=80&w=800&auto=format&fit=crop",
    },

    // ─── PLUMBER ──────────────────────────────────────────────────
    "Plumber": {
        "Tap Leak Repair": "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=800&auto=format&fit=crop",
        "Washbasin Blockage": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800&auto=format&fit=crop",
        "Toilet Pipe Blockage": "https://images.unsplash.com/photo-1564540586988-aa4e53ab3394?q=80&w=800&auto=format&fit=crop",
        "Water Tank Cleaning": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop",
        "Geyser Installation": "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
        "Motor Pump Repair": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop",
        "Flush Tank Repair": "https://images.unsplash.com/photo-1564540586988-aa4e53ab3394?q=80&w=800&auto=format&fit=crop",
        "Pipe Replacement": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=800&auto=format&fit=crop",
        "Shower Installation": "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800&auto=format&fit=crop",
        "Kitchen Sink Fitting": "https://images.unsplash.com/photo-1556909114-44e3e70034e2?q=80&w=800&auto=format&fit=crop",
    },

    // ─── CARPENTER ────────────────────────────────────────────────
    "Carpenter": {
        "Furniture Assembly": "https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=800&auto=format&fit=crop",
        "Door Lock Repair": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=800&auto=format&fit=crop",
        "Curtain Rod Installation": "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
        "Bed Repair": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop",
        "Cabinet Hinge Fix": "https://images.unsplash.com/photo-1556909114-44e3e70034e2?q=80&w=800&auto=format&fit=crop",
        "Sofa Repair": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
        "Wardrobe Dismantling": "https://images.unsplash.com/photo-1558997519-83ea9252edf8?q=80&w=800&auto=format&fit=crop",
        "Window Frame Repair": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
        "Custom Furniture": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=800&auto=format&fit=crop",
        "Wooden Floor Polish": "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=800&auto=format&fit=crop",
    },

    // ─── PEST CONTROL ─────────────────────────────────────────────
    "Pest Control": {
        "General Pest Control": "https://images.unsplash.com/photo-1632935190508-247eda8e6b8e?q=80&w=800&auto=format&fit=crop",
        "Termite Control": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=800&auto=format&fit=crop",
        "Bed Bug Treatment": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop",
        "Cockroach Control": "https://images.unsplash.com/photo-1632935190508-247eda8e6b8e?q=80&w=800&auto=format&fit=crop",
        "Ant Control": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=800&auto=format&fit=crop",
        "Rodent Control": "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?q=80&w=800&auto=format&fit=crop",
        "Mosquito Control": "https://images.unsplash.com/photo-1632935190508-247eda8e6b8e?q=80&w=800&auto=format&fit=crop",
        "Wood Borer Treatment": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=800&auto=format&fit=crop",
        "Commercial Pest Control": "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
        "Herbal Pest Control": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop",
    },

    // ─── PAINTING ─────────────────────────────────────────────────
    "Painting": {
        "Full House Painting": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop",
        "1 RK Painting": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800&auto=format&fit=crop",
        "Touch-up Painting": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=800&auto=format&fit=crop",
        "Texture Wall Painting": "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=800&auto=format&fit=crop",
        "Waterproofing": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
        "Exterior Painting": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
        "Wood Polish & Paint": "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=800&auto=format&fit=crop",
        "Grill/Metal Painting": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
        "Stencil Painting": "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=800&auto=format&fit=crop",
        "Enamel Painting": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800&auto=format&fit=crop",
    },

    // ─── SMART HOME ───────────────────────────────────────────────
    "Smart Home": {
        "Smart Lock Setup": "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
        "Smart Camera Setup": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800&auto=format&fit=crop",
        "Smart Lighting Install": "https://images.unsplash.com/photo-1507494924047-60b8ee826ca9?q=80&w=800&auto=format&fit=crop",
        "Home Theatre Setup": "https://images.unsplash.com/photo-1593784991095-a205069533cd?q=80&w=800&auto=format&fit=crop",
        "WiFi Setup & Extend": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop",
        "Smart Hub Config": "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
        "Smart Switch Install": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop",
        "Video Doorbell Setup": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800&auto=format&fit=crop",
        "Motion Sensor Install": "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
        "Smart Thermostat Setup": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=800&auto=format&fit=crop",
    },

    // ─── SECURITY & CCTV ─────────────────────────────────────────
    "Security & CCTV": {
        "CCTV Installation": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800&auto=format&fit=crop",
        "CCTV Repair": "https://images.unsplash.com/photo-1580910051074-3eb694886f1b?q=80&w=800&auto=format&fit=crop",
        "DVR/NVR Configuration": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=800&auto=format&fit=crop",
        "Biometric Setup": "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
        "Access Control System": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop",
        "Video Door Phone": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800&auto=format&fit=crop",
        "Fire Alarm Setup": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=800&auto=format&fit=crop",
        "IP Camera Networking": "https://images.unsplash.com/photo-1580910051074-3eb694886f1b?q=80&w=800&auto=format&fit=crop",
        "Security Audit": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop",
        "Cable Management": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop",
    },

    // ─── WATER PURIFIER (RO) ─────────────────────────────────────
    "Water Purifier (RO)": {
        "RO General Service": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=800&auto=format&fit=crop",
        "RO Repair": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop",
        "RO Installation": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=800&auto=format&fit=crop",
        "RO Uninstallation": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop",
        "Filter Replacement": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=800&auto=format&fit=crop",
        "Membrane Change": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop",
        "Water Testing": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop",
        "Under Sink RO Setup": "https://images.unsplash.com/photo-1556909114-44e3e70034e2?q=80&w=800&auto=format&fit=crop",
        "Commercial RO Service": "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
        "UV/UF Servicing": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=800&auto=format&fit=crop",
    },

    // ─── SOFA & CARPET ───────────────────────────────────────────
    "Sofa & Carpet": {
        "Fabric Sofa Cleaning": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
        "Leather Sofa Polish": "https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=800&auto=format&fit=crop",
        "Carpet Shampooing": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=800&auto=format&fit=crop",
        "Rug Cleaning": "https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=800&auto=format&fit=crop",
        "Dining Chair Cleaning": "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?q=80&w=800&auto=format&fit=crop",
        "Cushion Cover Wash": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
        "Office Chair Cleaning": "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
        "Mattress Sanitization": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop",
        "Sofa Dry Cleaning": "https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=800&auto=format&fit=crop",
        "Recliner Service": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
    },

    // ─── HOME RENOVATION ─────────────────────────────────────────
    "Home Renovation": {
        "Bathroom Renovation": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800&auto=format&fit=crop",
        "Kitchen Remodeling": "https://images.unsplash.com/photo-1556909114-44e3e70034e2?q=80&w=800&auto=format&fit=crop",
        "Flooring Setup": "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=800&auto=format&fit=crop",
        "False Ceiling": "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
        "Wall Paneling": "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=800&auto=format&fit=crop",
        "Plastering Work": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
        "Tiling Work": "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=800&auto=format&fit=crop",
        "Balcony Enclosure": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
        "Terrace Waterproofing": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
        "Interior Designing": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop",
    },

    // ─── HANDYMAN ─────────────────────────────────────────────────
    "Handyman": {
        "Picture/Mirror Hanging": "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
        "TV Mounting": "https://images.unsplash.com/photo-1593784991095-a205069533cd?q=80&w=800&auto=format&fit=crop",
        "Furniture Moving": "https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=800&auto=format&fit=crop",
        "Minor Repairs": "https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=800&auto=format&fit=crop",
        "Curtain Blind Setup": "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
        "Door Trim Install": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=800&auto=format&fit=crop",
        "Shelf Mounting": "https://images.unsplash.com/photo-1558997519-83ea9252edf8?q=80&w=800&auto=format&fit=crop",
        "Heavy Item Lifting": "https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=800&auto=format&fit=crop",
        "General Assistance": "https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=800&auto=format&fit=crop",
        "Appliance Moving": "https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=800&auto=format&fit=crop",
    },

    // ─── PACKERS & MOVERS ────────────────────────────────────────
    "Packers & Movers": {
        "Local Shifting": "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?q=80&w=800&auto=format&fit=crop",
        "Intercity Moving": "https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=800&auto=format&fit=crop",
        "Vehicle Transport": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800&auto=format&fit=crop",
        "Office Relocation": "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
        "Packing Services": "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?q=80&w=800&auto=format&fit=crop",
        "Unpacking Services": "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=800&auto=format&fit=crop",
        "Loading/Unloading": "https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=800&auto=format&fit=crop",
        "Storage & Warehousing": "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?q=80&w=800&auto=format&fit=crop",
        "Single Item Move": "https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=800&auto=format&fit=crop",
        "Furniture Dismantling": "https://images.unsplash.com/photo-1558997519-83ea9252edf8?q=80&w=800&auto=format&fit=crop",
    },

    // ─── SANITIZATION ────────────────────────────────────────────
    "Sanitization": {
        "Home Sanitization": "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=800&auto=format&fit=crop",
        "Office Sanitization": "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
        "Car Sanitization": "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop",
        "Fogging Service": "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=800&auto=format&fit=crop",
        "Antiviral Disinfection": "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=800&auto=format&fit=crop",
        "Commercial Disinfection": "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
        "Vehicle Fogging": "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop",
        "Warehouse Sanitization": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=800&auto=format&fit=crop",
        "Clinic Disinfection": "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=800&auto=format&fit=crop",
        "School Sanitization": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop",
    },

    // ─── MASSAGE THERAPY ─────────────────────────────────────────
    "Massage Therapy": {
        "Swedish Massage": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop",
        "Deep Tissue Massage": "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=800&auto=format&fit=crop",
        "Head & Shoulder Massage": "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800&auto=format&fit=crop",
        "Foot Reflexology": "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop",
        "Aromatherapy": "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
        "Back Relief Massage": "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=800&auto=format&fit=crop",
        "Sports Massage": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop",
        "Thai Massage": "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800&auto=format&fit=crop",
        "Couples Massage": "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=800&auto=format&fit=crop",
        "Pain Relief Therapy": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop",
    },

    // ─── GARDENING ────────────────────────────────────────────────
    "Gardening": {
        "Lawn Maintenance": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop",
        "Plant Setup": "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=800&auto=format&fit=crop",
        "Garden Cleaning": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop",
        "Weed Control": "https://images.unsplash.com/photo-1592150621744-aca64f48394a?q=80&w=800&auto=format&fit=crop",
        "Fertilization": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop",
        "Tree Trimming": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop",
        "Bonsai Care": "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?q=80&w=800&auto=format&fit=crop",
        "Potted Plant Repotting": "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=800&auto=format&fit=crop",
        "Landscape Design": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop",
        "Sprinkler Repair": "https://images.unsplash.com/photo-1592150621744-aca64f48394a?q=80&w=800&auto=format&fit=crop",
    },

    // ─── CAR CLEANING ────────────────────────────────────────────
    "Car Cleaning": {
        "Hatchback Deep Clean": "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop",
        "Sedan Deep Clean": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop",
        "SUV Deep Clean": "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format&fit=crop",
        "Interior Car Spa": "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=800&auto=format&fit=crop",
        "Exterior Polishing": "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=800&auto=format&fit=crop",
        "Car Sanitization": "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop",
        "Engine Room Wash": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800&auto=format&fit=crop",
        "AC Vent Cleaning": "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=800&auto=format&fit=crop",
        "Seat Cover Wash": "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=800&auto=format&fit=crop",
        "Teflon Coating": "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=800&auto=format&fit=crop",
    },
};

const updateAllImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobpilot');
        console.log('MongoDB connected ✅');

        let totalUpdated = 0;
        let totalNotFound = 0;

        for (const [categoryName, services] of Object.entries(allImageMappings)) {
            const category = await Category.findOne({ name: categoryName });
            if (!category) {
                console.log(`❌ Category not found: ${categoryName}`);
                continue;
            }

            for (const [serviceName, imageUrl] of Object.entries(services)) {
                const result = await Service.findOneAndUpdate(
                    { title: serviceName, category: category._id },
                    { image: imageUrl },
                    { new: true }
                );
                if (result) {
                    totalUpdated++;
                } else {
                    console.log(`⚠️ Not found: ${categoryName} → ${serviceName}`);
                    totalNotFound++;
                }
            }
            console.log(`✅ ${categoryName}: all services updated`);
        }

        console.log(`\n🎉 Image update complete!`);
        console.log(`Total updated: ${totalUpdated}`);
        console.log(`Not found: ${totalNotFound}`);
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateAllImages();
