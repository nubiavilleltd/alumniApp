import type { Product } from '../types/product.types';

export const MOCK_PRODUCTS: Product[] = [
  // ── 1. T-Shirt (hasSizes: true, 5 colour variants) ────────────────────────
  {
    id: '1',
    name: 'Official Alumnae T-Shirt',
    category: 'Apparel',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    description: 'Represent your alma mater with pride. Crafted from premium cotton, perfect for reunions, community events, and everyday wear.',
    supportNote: 'A portion of proceeds supports alumnae programs, events, and community initiatives.',
    generalImages: [
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80',
    ],
    hasSizes: true,
    variants: [
      {
        color: 'Black', colorHex: '#1a1a1a',
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
        ],
        sizes: [
          { size: 'S', stock: 12 }, { size: 'M', stock: 8 }, { size: 'L', stock: 5 },
          { size: 'XL', stock: 0 }, { size: 'XXL', stock: 3 }, { size: 'XXXL', stock: 0 },
        ],
      },
      {
        color: 'White', colorHex: '#f5f5f5',
        images: [
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
          'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800&q=80',
        ],
        sizes: [
          { size: 'S', stock: 0 }, { size: 'M', stock: 9 }, { size: 'L', stock: 6 },
          { size: 'XL', stock: 4 }, { size: 'XXL', stock: 0 }, { size: 'XXXL', stock: 2 },
        ],
      },
      {
        color: 'Navy', colorHex: '#1b3a6b',
        images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80'],
        sizes: [
          { size: 'S', stock: 4 }, { size: 'M', stock: 7 }, { size: 'L', stock: 0 },
          { size: 'XL', stock: 3 }, { size: 'XXL', stock: 1 }, { size: 'XXXL', stock: 0 },
        ],
      },
      {
        color: 'Blue', colorHex: '#4a90d9',
        images: ['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80'],
        sizes: [
          { size: 'S', stock: 6 }, { size: 'M', stock: 4 }, { size: 'L', stock: 8 },
          { size: 'XL', stock: 0 }, { size: 'XXL', stock: 0 }, { size: 'XXXL', stock: 1 },
        ],
      },
      {
        color: 'Grey', colorHex: '#9e9e9e',
        images: ['https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=800&q=80'],
        sizes: [
          { size: 'S', stock: 3 }, { size: 'M', stock: 5 }, { size: 'L', stock: 2 },
          { size: 'XL', stock: 6 }, { size: 'XXL', stock: 0 }, { size: 'XXXL', stock: 0 },
        ],
      },
    ],
  },

  // ── 2. Keyholder (hasSizes: false, 2 colour variants) ──────────────────────
  {
    id: '2',
    name: 'Alumnae Keyholder',
    category: 'Accessories',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1619995745882-f4128ac82ad6?w=800&q=80',
    description: 'Elegant engraved keyholder. A perfect everyday carry piece that keeps your keys organised in style.',
    generalImages: [
      'https://images.unsplash.com/photo-1609428982714-2c4fcde5b2a0?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Silver', colorHex: '#C0C0C0',
        images: ['https://images.unsplash.com/photo-1619995745882-f4128ac82ad6?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 40 }],
      },
      {
        color: 'Gold', colorHex: '#FFD700',
        images: ['https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 25 }],
      },
    ],
  },

  // ── 3. Tote Bag (hasSizes: false, 2 colour variants) ───────────────────────
  {
    id: '3',
    name: 'Alumnae Tote Bag',
    category: 'Accessories',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    description: 'Durable canvas tote bag for everyday elegance. Spacious enough for your essentials.',
    generalImages: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Beige', colorHex: '#f5f0e8',
        images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 20 }],
      },
      {
        color: 'Black', colorHex: '#1a1a1a',
        images: ['https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 14 }],
      },
    ],
  },

  // ── 4. Tumbler (hasSizes: false, no variants — single colour) ──────────────
  {
    id: '4',
    name: 'Alumnae Tumbler',
    category: 'Drinkware',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80',
    description: 'Premium insulated tumbler that keeps drinks hot or cold for hours. Perfect for long meetings and outdoor events.',
    generalImages: [
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80',
      'https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?w=800&q=80',
      'https://images.unsplash.com/photo-1611236151328-cb01a64d1be7?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Silver', colorHex: '#C0C0C0',
        images: ['https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 25 }],
      },
    ],
  },

  // ── 5. Signature Pen (hasSizes: false, single variant) ─────────────────────
  {
    id: '5',
    name: 'Alumnae Signature Pen',
    category: 'Office & Stationery',
    price: 37000,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&q=80',
    description: 'A luxury writing instrument for the distinguished alumnae. Smooth ink flow and premium build quality.',
    generalImages: [
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&q=80',
      'https://images.unsplash.com/photo-1612538498456-e861df91d4d0?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Black/Gold', colorHex: '#1a1a1a',
        images: ['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 100 }],
      },
    ],
  },

  // ── 6. Cap (hasSizes: false, 2 colour variants) ────────────────────────────
  {
    id: '6',
    name: 'Alumnae Cap',
    category: 'Apparel',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
    description: 'Stylish embroidered alumnae cap. Adjustable strap, one size fits most.',
    generalImages: [
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&q=80',
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Navy', colorHex: '#1b3a6b',
        images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 10 }],
      },
      {
        color: 'Black', colorHex: '#1a1a1a',
        images: ['https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 8 }],
      },
    ],
  },

  // ── 7. Umbrella (hasSizes: false, single variant) ──────────────────────────
  {
    id: '7',
    name: 'Alumnae Umbrella',
    category: 'Lifestyle Essentials',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80',
    description: 'Wind-resistant travel umbrella with alumnae branding. Compact and sturdy for all weather.',
    generalImages: [
      'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80',
      'https://images.unsplash.com/photo-1587302149595-2b60e70ee3e4?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Navy Blue', colorHex: '#1b3a6b',
        images: ['https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 30 }],
      },
    ],
  },

  // ── 8. Travel Bag (hasSizes: false, 2 colour variants) ─────────────────────
  {
    id: '8',
    name: 'Alumnae Travel Bag',
    category: 'Accessories',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80',
    description: 'Spacious weekend duffel bag for the modern alumnae on the go. Premium stitching and durable handles.',
    generalImages: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Brown', colorHex: '#8B5E3C',
        images: ['https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 10 }],
      },
      {
        color: 'Grey', colorHex: '#808080',
        images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 7 }],
      },
    ],
  },

  // ── 9. Pin Badge (hasSizes: false, single variant) ─────────────────────────
  {
    id: '9',
    name: 'Alumnae Pin Badge',
    category: 'Collectibles & Memorabilia',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80',
    description: 'Limited edition collectible alumnae pin badge. A timeless memento of your years at FGGC Owerri.',
    generalImages: [
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80',
      'https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Silver', colorHex: '#C0C0C0',
        images: ['https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 50 }],
      },
    ],
  },

  // ── 10. Sun Hat (hasSizes: false, single variant) ──────────────────────────
  {
    id: '10',
    name: 'Alumnae Sun Hat',
    category: 'Apparel',
    price: 10500,
    image: 'https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?w=800&q=80',
    description: 'Wide-brim sun hat. Elegant style for outdoor alumnae events and garden parties.',
    generalImages: [
      'https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Beige', colorHex: '#d4b896',
        images: ['https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 22 }],
      },
    ],
  },

  // ── 11. Coffee Mug (hasSizes: false, 2 colour variants) ────────────────────
  {
    id: '11',
    name: 'Alumnae Coffee Mug',
    category: 'Drinkware',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
    description: 'Start your morning with the alumnae spirit. Classic ceramic mug with a comfortable grip.',
    generalImages: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'White', colorHex: '#f5f5f5',
        images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 60 }],
      },
      {
        color: 'Black', colorHex: '#1a1a1a',
        images: ['https://images.unsplash.com/photo-1572119865084-43c285814d63?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 45 }],
      },
    ],
  },

  // ── 12. Journal (hasSizes: false, single variant) ──────────────────────────
  {
    id: '12',
    name: 'Alumnae Journal',
    category: 'Office & Stationery',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
    description: 'Premium hardcover journal for your thoughts, plans, and cherished memories.',
    generalImages: [
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Navy', colorHex: '#1b3a6b',
        images: ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 45 }],
      },
    ],
  },

  // ── 13. Hoodie (hasSizes: true, 3 colour variants) ─────────────────────────
  {
    id: '13',
    name: 'Alumnae Hoodie',
    category: 'Apparel',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
    description: 'Cosy pullover hoodie with embroidered alumnae crest. Perfect for cool evenings and casual outings.',
    generalImages: [
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
      'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80',
    ],
    hasSizes: true,
    variants: [
      {
        color: 'Charcoal', colorHex: '#36454F',
        images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80'],
        sizes: [
          { size: 'S', stock: 5 }, { size: 'M', stock: 10 }, { size: 'L', stock: 8 },
          { size: 'XL', stock: 3 }, { size: 'XXL', stock: 0 },
        ],
      },
      {
        color: 'Navy', colorHex: '#1b3a6b',
        images: ['https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80'],
        sizes: [
          { size: 'S', stock: 4 }, { size: 'M', stock: 6 }, { size: 'L', stock: 9 },
          { size: 'XL', stock: 5 }, { size: 'XXL', stock: 2 },
        ],
      },
      {
        color: 'Burgundy', colorHex: '#800020',
        images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80'],
        sizes: [
          { size: 'S', stock: 0 }, { size: 'M', stock: 3 }, { size: 'L', stock: 7 },
          { size: 'XL', stock: 4 }, { size: 'XXL', stock: 1 },
        ],
      },
    ],
  },

  // ── 14. Water Bottle (hasSizes: false, 3 colour variants) ──────────────────
  {
    id: '14',
    name: 'Alumnae Water Bottle',
    category: 'Drinkware',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
    description: 'BPA-free stainless steel water bottle. Stay hydrated in style with the alumnae logo.',
    generalImages: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
      'https://images.unsplash.com/photo-1625708458528-802ec79b1ed8?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'White', colorHex: '#f5f5f5',
        images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 35 }],
      },
      {
        color: 'Black', colorHex: '#1a1a1a',
        images: ['https://images.unsplash.com/photo-1625708458528-802ec79b1ed8?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 28 }],
      },
      {
        color: 'Navy', colorHex: '#1b3a6b',
        images: ['https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 20 }],
      },
    ],
  },

  // ── 15. Laptop Sleeve (hasSizes: true — by laptop size) ────────────────────
  {
    id: '15',
    name: 'Alumnae Laptop Sleeve',
    category: 'Office & Stationery',
    price: 14000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
    description: 'Protective neoprene laptop sleeve with alumnae branding. Fits snugly and protects your device.',
    generalImages: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
      'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&q=80',
    ],
    hasSizes: true,
    variants: [
      {
        color: 'Navy', colorHex: '#1b3a6b',
        images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80'],
        sizes: [
          { size: '13"', stock: 15 }, { size: '14"', stock: 20 }, { size: '15"', stock: 12 },
        ],
      },
      {
        color: 'Black', colorHex: '#1a1a1a',
        images: ['https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&q=80'],
        sizes: [
          { size: '13"', stock: 8 }, { size: '14"', stock: 14 }, { size: '15"', stock: 0 },
        ],
      },
    ],
  },

  // ── 16. Desk Plaque (hasSizes: false, single variant) ──────────────────────
  {
    id: '16',
    name: 'Alumnae Desk Plaque',
    category: 'Collectibles & Memorabilia',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    description: 'Engraved wooden desk plaque bearing the alumnae crest. A distinguished addition to any workspace.',
    generalImages: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Walnut', colorHex: '#5C4033',
        images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 18 }],
      },
    ],
  },

  // ── 17. Polo Shirt (hasSizes: true, 3 colour variants) ─────────────────────
  {
    id: '17',
    name: 'Alumnae Polo Shirt',
    category: 'Apparel',
    price: 16500,
    image: 'https://images.unsplash.com/photo-1625910513596-b30516dba12b?w=800&q=80',
    description: 'Classic piqué polo shirt with embroidered alumnae logo. Smart-casual elegance for every occasion.',
    generalImages: [
      'https://images.unsplash.com/photo-1625910513596-b30516dba12b?w=800&q=80',
      'https://images.unsplash.com/photo-1559582930-dd41b30e08f9?w=800&q=80',
    ],
    hasSizes: true,
    variants: [
      {
        color: 'White', colorHex: '#f5f5f5',
        images: ['https://images.unsplash.com/photo-1625910513596-b30516dba12b?w=800&q=80'],
        sizes: [
          { size: 'S', stock: 10 }, { size: 'M', stock: 15 }, { size: 'L', stock: 8 },
          { size: 'XL', stock: 5 }, { size: 'XXL', stock: 2 },
        ],
      },
      {
        color: 'Navy', colorHex: '#1b3a6b',
        images: ['https://images.unsplash.com/photo-1559582930-dd41b30e08f9?w=800&q=80'],
        sizes: [
          { size: 'S', stock: 6 }, { size: 'M', stock: 12 }, { size: 'L', stock: 10 },
          { size: 'XL', stock: 0 }, { size: 'XXL', stock: 3 },
        ],
      },
      {
        color: 'Royal Blue', colorHex: '#4169E1',
        images: ['https://images.unsplash.com/photo-1591346171742-f8e6429e3c8e?w=800&q=80'],
        sizes: [
          { size: 'S', stock: 8 }, { size: 'M', stock: 9 }, { size: 'L', stock: 5 },
          { size: 'XL', stock: 4 }, { size: 'XXL', stock: 0 },
        ],
      },
    ],
  },

  // ── 18. Compact Mirror (hasSizes: false, single variant) ───────────────────
  {
    id: '18',
    name: 'Alumnae Compact Mirror',
    category: 'Accessories',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
    description: 'Elegant pocket mirror with the alumnae crest embossed on the cover. A refined everyday essential.',
    generalImages: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Rose Gold', colorHex: '#B76E79',
        images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 33 }],
      },
    ],
  },

  // ── 19. Scarf (hasSizes: false, 3 colour variants) ─────────────────────────
  {
    id: '19',
    name: 'Alumnae Silk Scarf',
    category: 'Accessories',
    price: 19500,
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80',
    description: 'Luxurious silk-blend scarf with the alumnae pattern woven in. Versatile enough to be worn many ways.',
    generalImages: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80',
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Ivory', colorHex: '#FFFFF0',
        images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 15 }],
      },
      {
        color: 'Navy', colorHex: '#1b3a6b',
        images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 12 }],
      },
      {
        color: 'Burgundy', colorHex: '#800020',
        images: ['https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 10 }],
      },
    ],
  },

  // ── 20. Phone Case (hasSizes: true — by phone model) ───────────────────────
  {
    id: '20',
    name: 'Alumnae Phone Case',
    category: 'Accessories',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
    description: 'Protective phone case with the alumnae crest design. Slim profile with strong impact protection.',
    generalImages: [
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
    ],
    hasSizes: true,
    variants: [
      {
        color: 'Clear', colorHex: '#e8e8e8',
        images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80'],
        sizes: [
          { size: 'iPhone 14', stock: 20 }, { size: 'iPhone 15', stock: 18 },
          { size: 'Samsung S23', stock: 12 }, { size: 'Samsung S24', stock: 9 },
        ],
      },
      {
        color: 'Navy', colorHex: '#1b3a6b',
        images: ['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80'],
        sizes: [
          { size: 'iPhone 14', stock: 15 }, { size: 'iPhone 15', stock: 11 },
          { size: 'Samsung S23', stock: 8 }, { size: 'Samsung S24', stock: 0 },
        ],
      },
    ],
  },

  // ── 21. Desk Calendar (hasSizes: false, single variant) ────────────────────
  {
    id: '21',
    name: 'Alumnae Desk Calendar',
    category: 'Office & Stationery',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&q=80',
    description: 'Beautiful spiral-bound desk calendar featuring alumnae quotes and milestone dates throughout the year.',
    generalImages: [
      'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Navy/Gold', colorHex: '#1b3a6b',
        images: ['https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 75 }],
      },
    ],
  },

  // ── 22. Canvas Backpack (hasSizes: false, 2 colour variants) ───────────────
  {
    id: '22',
    name: 'Alumnae Canvas Backpack',
    category: 'Accessories',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    description: 'Rugged canvas backpack with multiple compartments and the alumnae logo embossed on the front pocket.',
    generalImages: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Olive', colorHex: '#556B2F',
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 14 }],
      },
      {
        color: 'Black', colorHex: '#1a1a1a',
        images: ['https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 11 }],
      },
    ],
  },

  // ── 23. Wristwatch (hasSizes: false, 2 colour variants) ────────────────────
  {
    id: '23',
    name: 'Alumnae Commemorative Watch',
    category: 'Collectibles & Memorabilia',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    description: 'Limited edition commemorative wristwatch with the alumnae crest on the dial. A treasured keepsake.',
    generalImages: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=800&q=80',
      'https://images.unsplash.com/photo-1548171916-c8fd5d56a0b4?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Silver', colorHex: '#C0C0C0',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 8 }],
      },
      {
        color: 'Gold', colorHex: '#FFD700',
        images: ['https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 5 }],
      },
    ],
  },

  // ── 24. Throw Pillow (hasSizes: false, single variant) ─────────────────────
  {
    id: '24',
    name: 'Alumnae Throw Pillow',
    category: 'Lifestyle Essentials',
    price: 11000,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=800&q=80',
    description: 'Soft decorative throw pillow with alumnae emblem. A warm addition to any home or office.',
    generalImages: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=800&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Navy/White', colorHex: '#1b3a6b',
        images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 30 }],
      },
    ],
  },

  // ── 25. Framed Photo Print (hasSizes: true — by frame size) ────────────────
  {
    id: '25',
    name: 'FGGC Owerri Framed Print',
    category: 'Collectibles & Memorabilia',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80',
    description: 'Framed archival print of FGGC Owerri campus scenes. A nostalgic piece for your home or office wall.',
    generalImages: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80',
      'https://images.unsplash.com/photo-1582053433976-25c00369fc93?w=800&q=80',
    ],
    hasSizes: true,
    variants: [
      {
        color: 'Black Frame', colorHex: '#1a1a1a',
        images: ['https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80'],
        sizes: [
          { size: 'A4', stock: 20 }, { size: 'A3', stock: 12 }, { size: 'A2', stock: 6 },
        ],
      },
      {
        color: 'Gold Frame', colorHex: '#FFD700',
        images: ['https://images.unsplash.com/photo-1582053433976-25c00369fc93?w=800&q=80'],
        sizes: [
          { size: 'A4', stock: 15 }, { size: 'A3', stock: 8 }, { size: 'A2', stock: 3 },
        ],
      },
    ],
  },

  // ── 26. Tote Purse (hasSizes: false, 2 colour variants) ────────────────────
  {
    id: '26',
    name: 'Alumnae Mini Purse',
    category: 'Accessories',
    price: 13500,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    description: 'Compact leather-finish mini purse with internal card slots and alumnae monogram.',
    generalImages: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Tan', colorHex: '#D2B48C',
        images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 18 }],
      },
      {
        color: 'Black', colorHex: '#1a1a1a',
        images: ['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 22 }],
      },
    ],
  },

  // ── 27. Sticker Sheet (hasSizes: false, single variant) ────────────────────
  {
    id: '27',
    name: 'Alumnae Sticker Sheet',
    category: 'Collectibles & Memorabilia',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=800&q=80',
    description: 'A fun sheet of high-quality vinyl stickers celebrating FGGC Owerri icons, mottos, and memories.',
    generalImages: [
      'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=800&q=80',
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Multicolour', colorHex: '#ff6b6b',
        images: ['https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 200 }],
      },
    ],
  },

  // ── 28. Yoga Mat (hasSizes: false, 2 colour variants) ──────────────────────
  {
    id: '28',
    name: 'Alumnae Yoga Mat',
    category: 'Lifestyle Essentials',
    price: 17000,
    image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80',
    description: 'Non-slip eco-friendly yoga mat with alumnae branding. Ideal for wellness enthusiasts.',
    generalImages: [
      'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80',
      'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Navy', colorHex: '#1b3a6b',
        images: ['https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 16 }],
      },
      {
        color: 'Purple', colorHex: '#6B21A8',
        images: ['https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 11 }],
      },
    ],
  },

  // ── 29. Mousepad (hasSizes: false, single variant) ─────────────────────────
  {
    id: '29',
    name: 'Alumnae Desk Mousepad',
    category: 'Office & Stationery',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
    description: 'Wide-format desk mousepad with non-slip rubber base and alumnae crest design.',
    generalImages: [
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
      'https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Navy/White', colorHex: '#1b3a6b',
        images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80'],
        sizes: [{ size: 'One Size', stock: 50 }],
      },
    ],
  },

  // ── 30. Sweatshirt (hasSizes: true, 2 colour variants) ─────────────────────
  {
    id: '30',
    name: 'Alumnae Sweatshirt',
    category: 'Apparel',
    price: 18500,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
    description: 'Heavyweight fleece-lined sweatshirt with screen-printed alumnae crest. Warm and stylish.',
    generalImages: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    ],
    hasSizes: true,
    variants: [
      {
        color: 'Ash Grey', colorHex: '#B2BEB5',
        images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80'],
        sizes: [
          { size: 'S', stock: 7 }, { size: 'M', stock: 12 }, { size: 'L', stock: 9 },
          { size: 'XL', stock: 4 }, { size: 'XXL', stock: 2 },
        ],
      },
      {
        color: 'Navy', colorHex: '#1b3a6b',
        images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80'],
        sizes: [
          { size: 'S', stock: 5 }, { size: 'M', stock: 8 }, { size: 'L', stock: 11 },
          { size: 'XL', stock: 0 }, { size: 'XXL', stock: 3 },
        ],
      },
    ],
  },
];