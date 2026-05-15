import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Product from '../models/Product';
import Category from '../models/Category';
import bcrypt from 'bcryptjs';

dotenv.config();

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

const products = [
  // Laptops
  { title: "NovaBook Pro 14", slug: "novabook-pro-14", description: "Creator-grade 14 inch laptop.", category: "Laptops", price: 1599, discount: 10, rating: 4.9, stock: 15, thumbnail: img("photo-1517336714731-489689fd1ca8"), brand: "TechNova", features: ["M3 Chip", "16GB RAM"], tags: ["trending", "featured"], badge: "Best Seller" },
  { title: "NovaBook Air 13", slug: "novabook-air-13", description: "Ultra-thin portable laptop.", category: "Laptops", price: 999, discount: 5, rating: 4.7, stock: 25, thumbnail: img("photo-1496181133206-80ce9b88a853"), brand: "TechNova", features: ["Lightweight", "Retina"], tags: ["new"], badge: "New" },
  { title: "Zenith Gaming G15", slug: "zenith-gaming-g15", description: "High-performance gaming beast.", category: "Laptops", price: 1899, discount: 15, rating: 4.8, stock: 10, thumbnail: img("photo-1603302576837-37561b2e2302"), brand: "Zenith", features: ["RTX 4080", "240Hz"], tags: ["gaming"], badge: "Pro" },
  { title: "Surface Pro Flex", slug: "surface-pro-flex", description: "Versatile 2-in-1 tablet laptop.", category: "Laptops", price: 1299, discount: 0, rating: 4.6, stock: 20, thumbnail: img("photo-1544244015-0df4b3ffc6b0"), brand: "Microsoft", features: ["Touchscreen", "Stylus"], tags: ["office"], badge: "Versatile" },
  { title: "Workstation Elite 16", slug: "workstation-elite-16", description: "Powerful mobile workstation.", category: "Laptops", price: 2499, discount: 20, rating: 4.9, stock: 8, thumbnail: img("photo-1588872657578-7efd1f1555ed"), brand: "HP", features: ["64GB RAM", "4K OLED"], tags: ["featured"], badge: "Elite" },

  // Headphones
  { title: "AuraPods Max", slug: "aurapods-max", description: "Premium noise cancelling headphones.", category: "Headphones", price: 549, discount: 15, rating: 4.9, stock: 30, thumbnail: img("photo-1505740420928-5e560c06d30e"), brand: "Auralux", features: ["ANC", "Spatial Audio"], tags: ["trending"], badge: "Premium" },
  { title: "SonicBuds Pro", slug: "sonicbuds-pro", description: "True wireless earbuds.", category: "Headphones", price: 199, discount: 10, rating: 4.7, stock: 50, thumbnail: img("photo-1588449668365-d15e397f6787"), brand: "Sonic", features: ["Wireless", "IPX7"], tags: ["new"], badge: "Top Pick" },
  { title: "QuietComfort Q35", slug: "quietcomfort-q35", description: "Industry leading noise cancellation.", category: "Headphones", price: 329, discount: 5, rating: 4.8, stock: 40, thumbnail: img("photo-1546435770-a3e426da4717"), brand: "Bose", features: ["Comfort", "Alexa"], tags: ["classic"], badge: "Trusted" },
  { title: "Studio Beats Pro", slug: "studio-beats-pro", description: "Dynamic sound for creators.", category: "Headphones", price: 299, discount: 20, rating: 4.5, stock: 25, thumbnail: img("photo-1524678606370-a47ad25cb82a"), brand: "Beats", features: ["Deep Bass", "Stylish"], tags: ["featured"], badge: "Iconic" },
  { title: "AirFlow Buds", slug: "airflow-buds", description: "Open ear sports headphones.", category: "Headphones", price: 149, discount: 0, rating: 4.4, stock: 60, thumbnail: img("photo-1590658268037-6bf12165a8df"), brand: "AirFlow", features: ["Sports", "Safe"], tags: ["new"], badge: "Sport" },

  // Smart Watches
  { title: "PulseFit X2", slug: "pulsefit-x2", description: "Health focused smart watch.", category: "Smart Watches", price: 299, discount: 10, rating: 4.8, stock: 45, thumbnail: img("photo-1523275335684-37898b6baf30"), brand: "Pulse", features: ["ECG", "Sleep Tracking"], tags: ["trending"], badge: "Fitness" },
  { title: "Galaxy Watch 6", slug: "galaxy-watch-6", description: "Integrated android ecosystem watch.", category: "Smart Watches", price: 349, discount: 5, rating: 4.7, stock: 35, thumbnail: img("photo-1508685096489-7aacd43bd3b1"), brand: "Samsung", features: ["OLED", "WearOS"], tags: ["featured"], badge: "Smart" },
  { title: "Terra Explorer GPS", slug: "terra-explorer-gps", description: "Rugged outdoors adventure watch.", category: "Smart Watches", price: 599, discount: 0, rating: 4.9, stock: 15, thumbnail: img("photo-1517502884422-41eaead166d4"), brand: "Terra", features: ["GPS", "Solar"], tags: ["new"], badge: "Adventurer" },
  { title: "Minimalist One", slug: "minimalist-one", description: "Sleek and simple smart watch.", category: "Smart Watches", price: 159, discount: 20, rating: 4.3, stock: 100, thumbnail: img("photo-1542496658-e33a6d0d50f6"), brand: "Min", features: ["Simple", "Long battery"], tags: ["budget"], badge: "Value" },
  { title: "Luxe Timepiece S", slug: "luxe-timepiece-s", description: "Premium hybrid luxury watch.", category: "Smart Watches", price: 899, discount: 0, rating: 4.9, stock: 5, thumbnail: img("photo-1524592094714-0f0654e20314"), brand: "Luxe", features: ["Titanium", "Mechanical Hybrid"], tags: ["premium"], badge: "Limited" },

  // Keyboards
  { title: "KeyCraft K2 Pro", slug: "keycraft-k2-pro", description: "Mechanical keyboard for professionals.", category: "Keyboards", price: 169, discount: 12, rating: 4.8, stock: 20, thumbnail: img("photo-1587829741301-dc798b83add3"), brand: "KeyCraft", features: ["RGB", "Hot-swap"], tags: ["trending"], badge: "Editor's Choice" },
  { title: "LogiStream MX Keys", slug: "logistream-mx-keys", description: "Silent low profile typing.", category: "Keyboards", price: 129, discount: 0, rating: 4.7, stock: 40, thumbnail: img("photo-1618384887929-16ec33fab9ef"), brand: "Logitech", features: ["Silent", "Multi-device"], tags: ["office"], badge: "Productivity" },
  { title: "Razer Huntsman V3", slug: "razer-huntsman-v3", description: "Optical switches for rapid gaming.", category: "Keyboards", price: 219, discount: 10, rating: 4.8, stock: 15, thumbnail: img("photo-1595225476474-87563907a212"), brand: "Razer", features: ["Optical", "Gaming"], tags: ["gaming"], badge: "Esports" },
  { title: "Ducky One 3 Mini", slug: "ducky-one-3-mini", description: "60% compact mechanical keyboard.", category: "Keyboards", price: 109, discount: 5, rating: 4.6, stock: 30, thumbnail: img("photo-1511467687858-23d96c32e4ae"), brand: "Ducky", features: ["60%", "Customizable"], tags: ["trending"], badge: "Compact" },
  { title: "Velvet Quiet Type", slug: "velvet-quiet-type", description: "The quietest keyboard ever made.", category: "Keyboards", price: 89, discount: 0, rating: 4.2, stock: 50, thumbnail: img("photo-1560850038-f95fb6068939"), brand: "Velvet", features: ["Quiet", "Slim"], tags: ["new"], badge: "Quiet" },

  // Gaming Mouse
  { title: "ArcStrike Wireless", slug: "arcstrike-wireless", description: "Lightweight gaming mouse.", category: "Gaming Mouse", price: 149, discount: 15, rating: 4.9, stock: 25, thumbnail: img("photo-1527814050087-3793815479db"), brand: "Arc", features: ["26K DPI", "Wireless"], tags: ["trending"], badge: "Pro Mouse" },
  { title: "G-Pro X Superlight", slug: "g-pro-x-superlight", description: "The choice of pros.", category: "Gaming Mouse", price: 159, discount: 0, rating: 4.9, stock: 20, thumbnail: img("photo-1615663245857-ac93bb7c39e7"), brand: "Logitech", features: ["63g", "HERO 25K"], tags: ["featured"], badge: "Legendary" },
  { title: "Viper Ultimate", slug: "viper-ultimate", description: "Ambidextrous high speed mouse.", category: "Gaming Mouse", price: 129, discount: 20, rating: 4.7, stock: 35, thumbnail: img("photo-1586333242963-2ca5211951c7"), brand: "Razer", features: ["RGB", "Dock"], tags: ["sale"], badge: "Sale" },
  { title: "Vertical Comfort Pro", slug: "vertical-comfort-pro", description: "Ergonomic vertical mouse for work.", category: "Gaming Mouse", price: 99, discount: 0, rating: 4.5, stock: 45, thumbnail: img("photo-1527860299417-a6fd65c77bd5"), brand: "Ergo", features: ["Vertical", "Ergonomic"], tags: ["office"], badge: "Health" },
  { title: "Pixel Precision", slug: "pixel-precision", description: "Budget gaming mouse.", category: "Gaming Mouse", price: 49, discount: 10, rating: 4.2, stock: 80, thumbnail: img("photo-1527814050087-3793815479db"), brand: "Pixel", features: ["RGB", "Wired"], tags: ["budget"], badge: "Budget" },

  // Monitors
  { title: "ViewEdge 4K 27", slug: "viewedge-4k-27", description: "Stunning 4K resolution.", category: "Monitors", price: 599, discount: 10, rating: 4.8, stock: 12, thumbnail: img("photo-1527443224154-c4a3942d3acf"), brand: "ViewEdge", features: ["4K", "IPS"], tags: ["trending"], badge: "High Res" },
  { title: "Ultrawide Curve 34", slug: "ultrawide-curve-34", description: "Immersive curved screen.", category: "Monitors", price: 899, discount: 5, rating: 4.9, stock: 10, thumbnail: img("photo-1551645120-d70bfe8d9817"), brand: "Curve", features: ["Ultrawide", "144Hz"], tags: ["featured"], badge: "Immersive" },
  { title: "Pro Color 32", slug: "pro-color-32", description: "Accurate colors for designers.", category: "Monitors", price: 1299, discount: 0, rating: 4.9, stock: 5, thumbnail: img("photo-1586210579191-33b45e38fa2c"), brand: "Color", features: ["99% AdobeRGB", "OLED"], tags: ["design"], badge: "Pro Grade" },
  { title: "Swift Frame 24", slug: "swift-frame-24", description: "360Hz gaming monitor.", category: "Monitors", price: 399, discount: 15, rating: 4.7, stock: 18, thumbnail: img("photo-1593640408182-31c70c8268f5"), brand: "Swift", features: ["360Hz", "1ms"], tags: ["gaming"], badge: "Fast" },
  { title: "Office Eco 22", slug: "office-eco-22", description: "Simple office monitor.", category: "Monitors", price: 149, discount: 20, rating: 4.1, stock: 40, thumbnail: img("photo-1527443154391-507e9dc6c5cc"), brand: "Eco", features: ["FHD", "Energy Star"], tags: ["budget"], badge: "Eco" },

  // More extras to reach 30+
  { title: "Arc Console S", slug: "arc-console-s", description: "Next-gen gaming console.", category: "Gaming Mouse", price: 499, discount: 0, rating: 4.9, stock: 10, thumbnail: img("photo-1605906302474-f60df68a64dd"), brand: "Arc", features: ["4K 120fps", "SSD"], tags: ["trending"], badge: "Sold Out Soon" },
  { title: "Nova Charger Duo", slug: "nova-charger-duo", description: "Fast wireless charging station.", category: "Smart Watches", price: 79, discount: 0, rating: 4.6, stock: 100, thumbnail: img("photo-1616432043562-3671ea2e5242"), brand: "TechNova", features: ["15W", "Magnetic"], tags: ["new"], badge: "Essential" },
  { title: "SoundBar Horizon", slug: "soundbar-horizon", description: "Cinematic audio for your desk.", category: "Headphones", price: 249, discount: 10, rating: 4.5, stock: 30, thumbnail: img("photo-1545454675-3531b543be5d"), brand: "Horizon", features: ["Dolby Atmos", "Wireless Sub"], tags: ["featured"], badge: "Theater" },
  { title: "DeskMate XL Pad", slug: "deskmate-xl-pad", description: "Premium wool desk mat.", category: "Keyboards", price: 59, discount: 0, rating: 4.8, stock: 150, thumbnail: img("photo-1516035069371-29a1b244cc32"), brand: "DeskMate", features: ["Wool", "Non-slip"], tags: ["accessories"], badge: "Minimal" }
];

const categories = [
  { name: "Laptops", slug: "laptops", image: img("photo-1517336714731-489689fd1ca8") },
  { name: "Headphones", slug: "headphones", image: img("photo-1505740420928-5e560c06d30e") },
  { name: "Smart Watches", slug: "smart-watches", image: img("photo-1523275335684-37898b6baf30") },
  { name: "Keyboards", slug: "keyboards", image: img("photo-1587829741301-dc798b83add3") },
  { name: "Gaming Mouse", slug: "gaming-mouse", image: img("photo-1527814050087-3793815479db") },
  { name: "Monitors", slug: "monitors", image: img("photo-1527443224154-c4a3942d3acf") }
];

const seedData = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/technova';
    await mongoose.connect(MONGO_URI);

    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();

    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@technova.com',
      password: adminPassword,
      role: 'admin',
      status: 'active'
    });

    // Create User
    const userPassword = await bcrypt.hash('user123', 10);
    await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
      status: 'active'
    });

    await Category.insertMany(categories);
    await Product.insertMany(products);

    console.log('35+ Products Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
