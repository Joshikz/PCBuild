import amdRyzen97900X from '../assets/AMD97900X.webp';
import beQuietPurePower from '../assets/bequietPurePower.webp';
import corsairVengeance from '../assets/CorsairVengeance.webp';
import deepCoolAK620 from '../assets/deepcoolak620.webp';
import gSkillTrident from '../assets/G.SkillTrident.webp';
import intelCorei514600K from '../assets/i514600K.webp';
import intelCorei714700K from '../assets/i714700K.webp';
import msiTomahawk from '../assets/MSITomahawk.webp';
import nzxtH510Flow from '../assets/NZXTH510Flow.webp';
import nvidiaRTX4070 from '../assets/RTX4070.webp';
import amdRX7800XT from '../assets/RX7800XT.webp';
import samsung990PRO from '../assets/Samsung990PRO.webp';
import asusZ790A from '../assets/Z790A.webp';

export const CATEGORIES = [
  'CPU',
  'GPU',
  'RAM',
  'Motherboard',
  'PSU',
  'Storage',
  'Case',
  'Cooling',
];

export const mockProducts = [
  {
    id: 1,
    name: 'Intel Core i7-14700K',
    category: 'CPU',
    price: 369000,
    image: intelCorei714700K,
    description: 'High-performance desktop processor for gaming and heavy multitasking.',
    rating: 4.9,
    reviewsCount: 128,
  },
  {
    id: 2,
    name: 'AMD Ryzen 9 7900X',
    category: 'CPU',
    price: 341000,
    image: amdRyzen97900X,
    description: 'Powerful Ryzen CPU built for productivity and high-frame-rate gaming.',
    rating: 4.8,
    reviewsCount: 94,
  },
  {
    id: 3,
    name: 'NVIDIA GeForce RTX 4070',
    category: 'GPU',
    price: 645000,
    image: nvidiaRTX4070,
    description: 'Excellent 1440p graphics card with strong ray tracing performance.',
    rating: 4.9,
    reviewsCount: 156,
  },
  {
    id: 4,
    name: 'AMD Radeon RX 7800 XT',
    category: 'GPU',
    price: 528000,
    image: amdRX7800XT,
    description: 'Balanced GPU for modern gaming at high refresh rates.',
    rating: 4.7,
    reviewsCount: 111,
  },
  {
    id: 5,
    name: 'Corsair Vengeance 32GB DDR5',
    category: 'RAM',
    price: 149000,
    image: corsairVengeance,
    description: 'Fast DDR5 memory kit for modern gaming and content creation setups.',
    rating: 4.8,
    reviewsCount: 87,
  },
  {
    id: 6,
    name: 'G.Skill Trident Z5 64GB',
    category: 'RAM',
    price: 249000,
    image: gSkillTrident,
    description: 'Large-capacity memory solution for creators and advanced workstations.',
    rating: 4.9,
    reviewsCount: 66,
  },
  {
    id: 7,
    name: 'MSI MAG B650 Tomahawk',
    category: 'Motherboard',
    price: 221000,
    image: msiTomahawk,
    description: 'Durable AM5 motherboard with strong VRM design and expansion options.',
    rating: 4.7,
    reviewsCount: 72,
  },
  {
    id: 8,
    name: 'ASUS ROG Strix Z790-A',
    category: 'Motherboard',
    price: 319000,
    image: asusZ790A,
    description: 'Premium motherboard for Intel builds with robust features and tuning support.',
    rating: 4.8,
    reviewsCount: 83,
  },
  {
    id: 9,
    name: 'be quiet! Pure Power 12 750W',
    category: 'PSU',
    price: 189000,
    image: beQuietPurePower,
    description: 'Quiet and reliable power supply for mainstream performance builds.',
    rating: 4.8,
    reviewsCount: 90,
  },
  {
    id: 10,
    name: 'Samsung 990 Pro 2TB',
    category: 'Storage',
    price: 168000,
    image: samsung990PRO,
    description: 'Ultra-fast NVMe SSD for smooth loading times and responsive storage.',
    rating: 4.9,
    reviewsCount: 142,
  },
  {
    id: 11,
    name: 'NZXT H510 Flow',
    category: 'Case',
    price: 182000,
    image: nzxtH510Flow,
    description: 'Clean and airflow-focused mid-tower case for modern gaming rigs.',
    rating: 4.6,
    reviewsCount: 79,
  },
  {
    id: 12,
    name: 'DeepCool AK620',
    category: 'Cooling',
    price: 126000,
    image: deepCoolAK620,
    description: 'High-performance air cooler with excellent thermal efficiency and value.',
    rating: 4.8,
    reviewsCount: 101,
  },
  {
    id: 13,
    name: 'Intel Core i5-14600K',
    category: 'CPU',
    price: 299000,
    image: intelCorei514600K,
    description: 'High-performance CPU for gaming and content creation.',
    rating: 4.8,
    reviewsCount: 125,
  }
];
