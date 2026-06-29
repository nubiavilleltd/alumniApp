// import type { Product } from '../types/product.types';

// export const MOCK_PRODUCTS: Product[] = [
//   // ── 1. T-Shirt (hasSizes: true, 5 colour variants) ────────────────────────
//   {
//     id: '1',
//     name: 'Official Alumnae T-Shirt',
//     category: 'Apparel',
//     price: 12500,
//     image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
//     description: 'Represent your alma mater with pride. Crafted from premium cotton, perfect for reunions, community events, and everyday wear.',
//     supportNote: 'A portion of proceeds supports alumnae programs, events, and community initiatives.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
//       'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80',
//     ],
//     hasSizes: true,
//     variants: [
//       {
//         color: 'Black', colorHex: '#1a1a1a',
//         images: [
//           'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
//           'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
//         ],
//         sizes: [
//           { size: 'S', stock: 12 }, { size: 'M', stock: 8 }, { size: 'L', stock: 5 },
//           { size: 'XL', stock: 0 }, { size: 'XXL', stock: 3 }, { size: 'XXXL', stock: 0 },
//         ],
//       },
//       {
//         color: 'White', colorHex: '#f5f5f5',
//         images: [
//           'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
//           'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800&q=80',
//         ],
//         sizes: [
//           { size: 'S', stock: 0 }, { size: 'M', stock: 9 }, { size: 'L', stock: 6 },
//           { size: 'XL', stock: 4 }, { size: 'XXL', stock: 0 }, { size: 'XXXL', stock: 2 },
//         ],
//       },
//       {
//         color: 'Navy', colorHex: '#1b3a6b',
//         images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80'],
//         sizes: [
//           { size: 'S', stock: 4 }, { size: 'M', stock: 7 }, { size: 'L', stock: 0 },
//           { size: 'XL', stock: 3 }, { size: 'XXL', stock: 1 }, { size: 'XXXL', stock: 0 },
//         ],
//       },
//       {
//         color: 'Blue', colorHex: '#4a90d9',
//         images: ['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80'],
//         sizes: [
//           { size: 'S', stock: 6 }, { size: 'M', stock: 4 }, { size: 'L', stock: 8 },
//           { size: 'XL', stock: 0 }, { size: 'XXL', stock: 0 }, { size: 'XXXL', stock: 1 },
//         ],
//       },
//       {
//         color: 'Grey', colorHex: '#9e9e9e',
//         images: ['https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=800&q=80'],
//         sizes: [
//           { size: 'S', stock: 3 }, { size: 'M', stock: 5 }, { size: 'L', stock: 2 },
//           { size: 'XL', stock: 6 }, { size: 'XXL', stock: 0 }, { size: 'XXXL', stock: 0 },
//         ],
//       },
//     ],
//   },

//   // ── 2. Keyholder (hasSizes: false, 2 colour variants) ──────────────────────
//   {
//     id: '2',
//     name: 'Alumnae Keyholder',
//     category: 'Accessories',
//     price: 3500,
//     image: 'https://images.unsplash.com/photo-1619995745882-f4128ac82ad6?w=800&q=80',
//     description: 'Elegant engraved keyholder. A perfect everyday carry piece that keeps your keys organised in style.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1609428982714-2c4fcde5b2a0?w=800&q=80',
//       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Silver', colorHex: '#C0C0C0',
//         images: ['https://images.unsplash.com/photo-1619995745882-f4128ac82ad6?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 40 }],
//       },
//       {
//         color: 'Gold', colorHex: '#FFD700',
//         images: ['https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 25 }],
//       },
//     ],
//   },

//   // ── 3. Tote Bag (hasSizes: false, 2 colour variants) ───────────────────────
//   {
//     id: '3',
//     name: 'Alumnae Tote Bag',
//     category: 'Accessories',
//     price: 9500,
//     image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
//     description: 'Durable canvas tote bag for everyday elegance. Spacious enough for your essentials.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
//       'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Beige', colorHex: '#f5f0e8',
//         images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 20 }],
//       },
//       {
//         color: 'Black', colorHex: '#1a1a1a',
//         images: ['https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 14 }],
//       },
//     ],
//   },

//   // ── 4. Tumbler (hasSizes: false, no variants — single colour) ──────────────
//   {
//     id: '4',
//     name: 'Alumnae Tumbler',
//     category: 'Drinkware',
//     price: 12000,
//     image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80',
//     description: 'Premium insulated tumbler that keeps drinks hot or cold for hours. Perfect for long meetings and outdoor events.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80',
//       'https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?w=800&q=80',
//       'https://images.unsplash.com/photo-1611236151328-cb01a64d1be7?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Silver', colorHex: '#C0C0C0',
//         images: ['https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 25 }],
//       },
//     ],
//   },

//   // ── 5. Signature Pen (hasSizes: false, single variant) ─────────────────────
//   {
//     id: '5',
//     name: 'Alumnae Signature Pen',
//     category: 'Office & Stationery',
//     price: 37000,
//     image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&q=80',
//     description: 'A luxury writing instrument for the distinguished alumnae. Smooth ink flow and premium build quality.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&q=80',
//       'https://images.unsplash.com/photo-1612538498456-e861df91d4d0?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Black/Gold', colorHex: '#1a1a1a',
//         images: ['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 100 }],
//       },
//     ],
//   },

//   // ── 6. Cap (hasSizes: false, 2 colour variants) ────────────────────────────
//   {
//     id: '6',
//     name: 'Alumnae Cap',
//     category: 'Apparel',
//     price: 8000,
//     image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
//     description: 'Stylish embroidered alumnae cap. Adjustable strap, one size fits most.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&q=80',
//       'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Navy', colorHex: '#1b3a6b',
//         images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 10 }],
//       },
//       {
//         color: 'Black', colorHex: '#1a1a1a',
//         images: ['https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 8 }],
//       },
//     ],
//   },

//   // ── 7. Umbrella (hasSizes: false, single variant) ──────────────────────────
//   {
//     id: '7',
//     name: 'Alumnae Umbrella',
//     category: 'Lifestyle Essentials',
//     price: 15000,
//     image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80',
//     description: 'Wind-resistant travel umbrella with alumnae branding. Compact and sturdy for all weather.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80',
//       'https://images.unsplash.com/photo-1587302149595-2b60e70ee3e4?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Navy Blue', colorHex: '#1b3a6b',
//         images: ['https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 30 }],
//       },
//     ],
//   },

//   // ── 8. Travel Bag (hasSizes: false, 2 colour variants) ─────────────────────
//   {
//     id: '8',
//     name: 'Alumnae Travel Bag',
//     category: 'Accessories',
//     price: 35000,
//     image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80',
//     description: 'Spacious weekend duffel bag for the modern alumnae on the go. Premium stitching and durable handles.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
//       'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Brown', colorHex: '#8B5E3C',
//         images: ['https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 10 }],
//       },
//       {
//         color: 'Grey', colorHex: '#808080',
//         images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 7 }],
//       },
//     ],
//   },

//   // ── 9. Pin Badge (hasSizes: false, single variant) ─────────────────────────
//   {
//     id: '9',
//     name: 'Alumnae Pin Badge',
//     category: 'Collectibles & Memorabilia',
//     price: 12000,
//     image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80',
//     description: 'Limited edition collectible alumnae pin badge. A timeless memento of your years at FGGC Owerri.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80',
//       'https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Silver', colorHex: '#C0C0C0',
//         images: ['https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 50 }],
//       },
//     ],
//   },

//   // ── 10. Sun Hat (hasSizes: false, single variant) ──────────────────────────
//   {
//     id: '10',
//     name: 'Alumnae Sun Hat',
//     category: 'Apparel',
//     price: 10500,
//     image: 'https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?w=800&q=80',
//     description: 'Wide-brim sun hat. Elegant style for outdoor alumnae events and garden parties.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?w=800&q=80',
//       'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Beige', colorHex: '#d4b896',
//         images: ['https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 22 }],
//       },
//     ],
//   },

//   // ── 11. Coffee Mug (hasSizes: false, 2 colour variants) ────────────────────
//   {
//     id: '11',
//     name: 'Alumnae Coffee Mug',
//     category: 'Drinkware',
//     price: 6000,
//     image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
//     description: 'Start your morning with the alumnae spirit. Classic ceramic mug with a comfortable grip.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
//       'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'White', colorHex: '#f5f5f5',
//         images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 60 }],
//       },
//       {
//         color: 'Black', colorHex: '#1a1a1a',
//         images: ['https://images.unsplash.com/photo-1572119865084-43c285814d63?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 45 }],
//       },
//     ],
//   },

//   // ── 12. Journal (hasSizes: false, single variant) ──────────────────────────
//   {
//     id: '12',
//     name: 'Alumnae Journal',
//     category: 'Office & Stationery',
//     price: 8500,
//     image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
//     description: 'Premium hardcover journal for your thoughts, plans, and cherished memories.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
//       'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
//       'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Navy', colorHex: '#1b3a6b',
//         images: ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 45 }],
//       },
//     ],
//   },

//   // ── 13. Hoodie (hasSizes: true, 3 colour variants) ─────────────────────────
//   {
//     id: '13',
//     name: 'Alumnae Hoodie',
//     category: 'Apparel',
//     price: 22000,
//     image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
//     description: 'Cosy pullover hoodie with embroidered alumnae crest. Perfect for cool evenings and casual outings.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
//       'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80',
//     ],
//     hasSizes: true,
//     variants: [
//       {
//         color: 'Charcoal', colorHex: '#36454F',
//         images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80'],
//         sizes: [
//           { size: 'S', stock: 5 }, { size: 'M', stock: 10 }, { size: 'L', stock: 8 },
//           { size: 'XL', stock: 3 }, { size: 'XXL', stock: 0 },
//         ],
//       },
//       {
//         color: 'Navy', colorHex: '#1b3a6b',
//         images: ['https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80'],
//         sizes: [
//           { size: 'S', stock: 4 }, { size: 'M', stock: 6 }, { size: 'L', stock: 9 },
//           { size: 'XL', stock: 5 }, { size: 'XXL', stock: 2 },
//         ],
//       },
//       {
//         color: 'Burgundy', colorHex: '#800020',
//         images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80'],
//         sizes: [
//           { size: 'S', stock: 0 }, { size: 'M', stock: 3 }, { size: 'L', stock: 7 },
//           { size: 'XL', stock: 4 }, { size: 'XXL', stock: 1 },
//         ],
//       },
//     ],
//   },

//   // ── 14. Water Bottle (hasSizes: false, 3 colour variants) ──────────────────
//   {
//     id: '14',
//     name: 'Alumnae Water Bottle',
//     category: 'Drinkware',
//     price: 8500,
//     image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
//     description: 'BPA-free stainless steel water bottle. Stay hydrated in style with the alumnae logo.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
//       'https://images.unsplash.com/photo-1625708458528-802ec79b1ed8?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'White', colorHex: '#f5f5f5',
//         images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 35 }],
//       },
//       {
//         color: 'Black', colorHex: '#1a1a1a',
//         images: ['https://images.unsplash.com/photo-1625708458528-802ec79b1ed8?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 28 }],
//       },
//       {
//         color: 'Navy', colorHex: '#1b3a6b',
//         images: ['https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 20 }],
//       },
//     ],
//   },

//   // ── 15. Laptop Sleeve (hasSizes: true — by laptop size) ────────────────────
//   {
//     id: '15',
//     name: 'Alumnae Laptop Sleeve',
//     category: 'Office & Stationery',
//     price: 14000,
//     image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
//     description: 'Protective neoprene laptop sleeve with alumnae branding. Fits snugly and protects your device.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
//       'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&q=80',
//     ],
//     hasSizes: true,
//     variants: [
//       {
//         color: 'Navy', colorHex: '#1b3a6b',
//         images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80'],
//         sizes: [
//           { size: '13"', stock: 15 }, { size: '14"', stock: 20 }, { size: '15"', stock: 12 },
//         ],
//       },
//       {
//         color: 'Black', colorHex: '#1a1a1a',
//         images: ['https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&q=80'],
//         sizes: [
//           { size: '13"', stock: 8 }, { size: '14"', stock: 14 }, { size: '15"', stock: 0 },
//         ],
//       },
//     ],
//   },

//   // ── 16. Desk Plaque (hasSizes: false, single variant) ──────────────────────
//   {
//     id: '16',
//     name: 'Alumnae Desk Plaque',
//     category: 'Collectibles & Memorabilia',
//     price: 18000,
//     image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
//     description: 'Engraved wooden desk plaque bearing the alumnae crest. A distinguished addition to any workspace.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
//       'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Walnut', colorHex: '#5C4033',
//         images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 18 }],
//       },
//     ],
//   },

//   // ── 17. Polo Shirt (hasSizes: true, 3 colour variants) ─────────────────────
//   {
//     id: '17',
//     name: 'Alumnae Polo Shirt',
//     category: 'Apparel',
//     price: 16500,
//     image: 'https://images.unsplash.com/photo-1625910513596-b30516dba12b?w=800&q=80',
//     description: 'Classic piqué polo shirt with embroidered alumnae logo. Smart-casual elegance for every occasion.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1625910513596-b30516dba12b?w=800&q=80',
//       'https://images.unsplash.com/photo-1559582930-dd41b30e08f9?w=800&q=80',
//     ],
//     hasSizes: true,
//     variants: [
//       {
//         color: 'White', colorHex: '#f5f5f5',
//         images: ['https://images.unsplash.com/photo-1625910513596-b30516dba12b?w=800&q=80'],
//         sizes: [
//           { size: 'S', stock: 10 }, { size: 'M', stock: 15 }, { size: 'L', stock: 8 },
//           { size: 'XL', stock: 5 }, { size: 'XXL', stock: 2 },
//         ],
//       },
//       {
//         color: 'Navy', colorHex: '#1b3a6b',
//         images: ['https://images.unsplash.com/photo-1559582930-dd41b30e08f9?w=800&q=80'],
//         sizes: [
//           { size: 'S', stock: 6 }, { size: 'M', stock: 12 }, { size: 'L', stock: 10 },
//           { size: 'XL', stock: 0 }, { size: 'XXL', stock: 3 },
//         ],
//       },
//       {
//         color: 'Royal Blue', colorHex: '#4169E1',
//         images: ['https://images.unsplash.com/photo-1591346171742-f8e6429e3c8e?w=800&q=80'],
//         sizes: [
//           { size: 'S', stock: 8 }, { size: 'M', stock: 9 }, { size: 'L', stock: 5 },
//           { size: 'XL', stock: 4 }, { size: 'XXL', stock: 0 },
//         ],
//       },
//     ],
//   },

//   // ── 18. Compact Mirror (hasSizes: false, single variant) ───────────────────
//   {
//     id: '18',
//     name: 'Alumnae Compact Mirror',
//     category: 'Accessories',
//     price: 5500,
//     image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
//     description: 'Elegant pocket mirror with the alumnae crest embossed on the cover. A refined everyday essential.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
//       'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Rose Gold', colorHex: '#B76E79',
//         images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 33 }],
//       },
//     ],
//   },

//   // ── 19. Scarf (hasSizes: false, 3 colour variants) ─────────────────────────
//   {
//     id: '19',
//     name: 'Alumnae Silk Scarf',
//     category: 'Accessories',
//     price: 19500,
//     image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80',
//     description: 'Luxurious silk-blend scarf with the alumnae pattern woven in. Versatile enough to be worn many ways.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80',
//       'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Ivory', colorHex: '#FFFFF0',
//         images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 15 }],
//       },
//       {
//         color: 'Navy', colorHex: '#1b3a6b',
//         images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 12 }],
//       },
//       {
//         color: 'Burgundy', colorHex: '#800020',
//         images: ['https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 10 }],
//       },
//     ],
//   },

//   // ── 20. Phone Case (hasSizes: true — by phone model) ───────────────────────
//   {
//     id: '20',
//     name: 'Alumnae Phone Case',
//     category: 'Accessories',
//     price: 7500,
//     image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
//     description: 'Protective phone case with the alumnae crest design. Slim profile with strong impact protection.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
//       'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
//     ],
//     hasSizes: true,
//     variants: [
//       {
//         color: 'Clear', colorHex: '#e8e8e8',
//         images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80'],
//         sizes: [
//           { size: 'iPhone 14', stock: 20 }, { size: 'iPhone 15', stock: 18 },
//           { size: 'Samsung S23', stock: 12 }, { size: 'Samsung S24', stock: 9 },
//         ],
//       },
//       {
//         color: 'Navy', colorHex: '#1b3a6b',
//         images: ['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80'],
//         sizes: [
//           { size: 'iPhone 14', stock: 15 }, { size: 'iPhone 15', stock: 11 },
//           { size: 'Samsung S23', stock: 8 }, { size: 'Samsung S24', stock: 0 },
//         ],
//       },
//     ],
//   },

//   // ── 21. Desk Calendar (hasSizes: false, single variant) ────────────────────
//   {
//     id: '21',
//     name: 'Alumnae Desk Calendar',
//     category: 'Office & Stationery',
//     price: 6500,
//     image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&q=80',
//     description: 'Beautiful spiral-bound desk calendar featuring alumnae quotes and milestone dates throughout the year.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&q=80',
//       'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Navy/Gold', colorHex: '#1b3a6b',
//         images: ['https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 75 }],
//       },
//     ],
//   },

//   // ── 22. Canvas Backpack (hasSizes: false, 2 colour variants) ───────────────
//   {
//     id: '22',
//     name: 'Alumnae Canvas Backpack',
//     category: 'Accessories',
//     price: 28000,
//     image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
//     description: 'Rugged canvas backpack with multiple compartments and the alumnae logo embossed on the front pocket.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
//       'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Olive', colorHex: '#556B2F',
//         images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 14 }],
//       },
//       {
//         color: 'Black', colorHex: '#1a1a1a',
//         images: ['https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 11 }],
//       },
//     ],
//   },

//   // ── 23. Wristwatch (hasSizes: false, 2 colour variants) ────────────────────
//   {
//     id: '23',
//     name: 'Alumnae Commemorative Watch',
//     category: 'Collectibles & Memorabilia',
//     price: 85000,
//     image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
//     description: 'Limited edition commemorative wristwatch with the alumnae crest on the dial. A treasured keepsake.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
//       'https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=800&q=80',
//       'https://images.unsplash.com/photo-1548171916-c8fd5d56a0b4?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Silver', colorHex: '#C0C0C0',
//         images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 8 }],
//       },
//       {
//         color: 'Gold', colorHex: '#FFD700',
//         images: ['https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 5 }],
//       },
//     ],
//   },

//   // ── 24. Throw Pillow (hasSizes: false, single variant) ─────────────────────
//   {
//     id: '24',
//     name: 'Alumnae Throw Pillow',
//     category: 'Lifestyle Essentials',
//     price: 11000,
//     image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=800&q=80',
//     description: 'Soft decorative throw pillow with alumnae emblem. A warm addition to any home or office.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=800&q=80',
//       'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Navy/White', colorHex: '#1b3a6b',
//         images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 30 }],
//       },
//     ],
//   },

//   // ── 25. Framed Photo Print (hasSizes: true — by frame size) ────────────────
//   {
//     id: '25',
//     name: 'FGGC Owerri Framed Print',
//     category: 'Collectibles & Memorabilia',
//     price: 25000,
//     image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80',
//     description: 'Framed archival print of FGGC Owerri campus scenes. A nostalgic piece for your home or office wall.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80',
//       'https://images.unsplash.com/photo-1582053433976-25c00369fc93?w=800&q=80',
//     ],
//     hasSizes: true,
//     variants: [
//       {
//         color: 'Black Frame', colorHex: '#1a1a1a',
//         images: ['https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80'],
//         sizes: [
//           { size: 'A4', stock: 20 }, { size: 'A3', stock: 12 }, { size: 'A2', stock: 6 },
//         ],
//       },
//       {
//         color: 'Gold Frame', colorHex: '#FFD700',
//         images: ['https://images.unsplash.com/photo-1582053433976-25c00369fc93?w=800&q=80'],
//         sizes: [
//           { size: 'A4', stock: 15 }, { size: 'A3', stock: 8 }, { size: 'A2', stock: 3 },
//         ],
//       },
//     ],
//   },

//   // ── 26. Tote Purse (hasSizes: false, 2 colour variants) ────────────────────
//   {
//     id: '26',
//     name: 'Alumnae Mini Purse',
//     category: 'Accessories',
//     price: 13500,
//     image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
//     description: 'Compact leather-finish mini purse with internal card slots and alumnae monogram.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
//       'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Tan', colorHex: '#D2B48C',
//         images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 18 }],
//       },
//       {
//         color: 'Black', colorHex: '#1a1a1a',
//         images: ['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 22 }],
//       },
//     ],
//   },

//   // ── 27. Sticker Sheet (hasSizes: false, single variant) ────────────────────
//   {
//     id: '27',
//     name: 'Alumnae Sticker Sheet',
//     category: 'Collectibles & Memorabilia',
//     price: 2500,
//     image: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=800&q=80',
//     description: 'A fun sheet of high-quality vinyl stickers celebrating FGGC Owerri icons, mottos, and memories.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=800&q=80',
//       'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Multicolour', colorHex: '#ff6b6b',
//         images: ['https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 200 }],
//       },
//     ],
//   },

//   // ── 28. Yoga Mat (hasSizes: false, 2 colour variants) ──────────────────────
//   {
//     id: '28',
//     name: 'Alumnae Yoga Mat',
//     category: 'Lifestyle Essentials',
//     price: 17000,
//     image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80',
//     description: 'Non-slip eco-friendly yoga mat with alumnae branding. Ideal for wellness enthusiasts.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80',
//       'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Navy', colorHex: '#1b3a6b',
//         images: ['https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 16 }],
//       },
//       {
//         color: 'Purple', colorHex: '#6B21A8',
//         images: ['https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 11 }],
//       },
//     ],
//   },

//   // ── 29. Mousepad (hasSizes: false, single variant) ─────────────────────────
//   {
//     id: '29',
//     name: 'Alumnae Desk Mousepad',
//     category: 'Office & Stationery',
//     price: 5000,
//     image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
//     description: 'Wide-format desk mousepad with non-slip rubber base and alumnae crest design.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
//       'https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=800&q=80',
//     ],
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Navy/White', colorHex: '#1b3a6b',
//         images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80'],
//         sizes: [{ size: 'One Size', stock: 50 }],
//       },
//     ],
//   },

//   // ── 30. Sweatshirt (hasSizes: true, 2 colour variants) ─────────────────────
//   {
//     id: '30',
//     name: 'Alumnae Sweatshirt',
//     category: 'Apparel',
//     price: 18500,
//     image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
//     description: 'Heavyweight fleece-lined sweatshirt with screen-printed alumnae crest. Warm and stylish.',
//     generalImages: [
//       'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
//       'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
//     ],
//     hasSizes: true,
//     variants: [
//       {
//         color: 'Ash Grey', colorHex: '#B2BEB5',
//         images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80'],
//         sizes: [
//           { size: 'S', stock: 7 }, { size: 'M', stock: 12 }, { size: 'L', stock: 9 },
//           { size: 'XL', stock: 4 }, { size: 'XXL', stock: 2 },
//         ],
//       },
//       {
//         color: 'Navy', colorHex: '#1b3a6b',
//         images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80'],
//         sizes: [
//           { size: 'S', stock: 5 }, { size: 'M', stock: 8 }, { size: 'L', stock: 11 },
//           { size: 'XL', stock: 0 }, { size: 'XXL', stock: 3 },
//         ],
//       },
//     ],
//   },
// ];














import type { ApiProduct } from '../types/product.types';

export const API_MOCK_PRODUCTS: ApiProduct[] = [
  {
    id: '1', user_id: '1', product_name: 'Official Alumnae T-Shirt', category: 'Apparel',
    price: '12500.00', description: 'Represent your alma mater with pride. Crafted from premium cotton, perfect for reunions, community events, and everyday wear.',
    has_size: true, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '1', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80' },
      { id: '2', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80' },
      { id: '3', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80' },
      { id: '4', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80' },
      { id: '5', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80' },
      { id: '6', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80' },
    ],
    variants: [
      { id: '1', color: 'Black', size: 'S', quantity: '12', image_id: '1' },
      { id: '2', color: 'Black', size: 'M', quantity: '8', image_id: '1' },
      { id: '3', color: 'Black', size: 'L', quantity: '5', image_id: '1' },
      { id: '4', color: 'Black', size: 'XL', quantity: '0', image_id: '1' },
      { id: '5', color: 'Black', size: 'XXL', quantity: '3', image_id: '1' },
      { id: '6', color: 'White', size: 'S', quantity: '0', image_id: '5' },
      { id: '7', color: 'White', size: 'M', quantity: '9', image_id: '5' },
      { id: '8', color: 'White', size: 'L', quantity: '6', image_id: '5' },
      { id: '9', color: 'White', size: 'XL', quantity: '4', image_id: '5' },
      { id: '10', color: 'Navy', size: 'S', quantity: '4', image_id: '6' },
      { id: '11', color: 'Navy', size: 'M', quantity: '7', image_id: '6' },
      { id: '12', color: 'Navy', size: 'L', quantity: '0', image_id: '6' },
      { id: '13', color: 'Navy', size: 'XL', quantity: '3', image_id: '6' },
    ],
    total_stock: 61,
  },

  {
    id: '2', user_id: '1', product_name: 'Alumnae Hoodie', category: 'Apparel',
    price: '22000.00', description: 'Cosy pullover hoodie with embroidered alumnae crest. Perfect for cool evenings and casual outings.',
    has_size: true, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '7', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80' },
      { id: '8', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80' },
      { id: '9', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80' },
    ],
    variants: [
      { id: '14', color: 'Charcoal', size: 'S', quantity: '5', image_id: '7' },
      { id: '15', color: 'Charcoal', size: 'M', quantity: '10', image_id: '7' },
      { id: '16', color: 'Charcoal', size: 'L', quantity: '8', image_id: '7' },
      { id: '17', color: 'Charcoal', size: 'XL', quantity: '3', image_id: '7' },
      { id: '18', color: 'Navy', size: 'S', quantity: '4', image_id: '8' },
      { id: '19', color: 'Navy', size: 'M', quantity: '6', image_id: '8' },
      { id: '20', color: 'Navy', size: 'L', quantity: '9', image_id: '8' },
      { id: '21', color: 'Burgundy', size: 'M', quantity: '3', image_id: '9' },
      { id: '22', color: 'Burgundy', size: 'L', quantity: '7', image_id: '9' },
      { id: '23', color: 'Burgundy', size: 'XL', quantity: '4', image_id: '9' },
    ],
    total_stock: 59,
  },

  {
    id: '3', user_id: '1', product_name: 'Alumnae Polo Shirt', category: 'Apparel',
    price: '16500.00', description: 'Classic piqué polo shirt with embroidered alumnae logo. Smart-casual elegance for every occasion.',
    has_size: true, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '10', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1625910513596-b30516dba12b?w=800&q=80' },
      { id: '11', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1559582930-dd41b30e08f9?w=800&q=80' },
      { id: '12', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1591346171742-f8e6429e3c8e?w=800&q=80' },
    ],
    variants: [
      { id: '24', color: 'White', size: 'S', quantity: '10', image_id: '10' },
      { id: '25', color: 'White', size: 'M', quantity: '15', image_id: '10' },
      { id: '26', color: 'White', size: 'L', quantity: '8', image_id: '10' },
      { id: '27', color: 'Navy', size: 'S', quantity: '6', image_id: '11' },
      { id: '28', color: 'Navy', size: 'M', quantity: '12', image_id: '11' },
      { id: '29', color: 'Navy', size: 'L', quantity: '10', image_id: '11' },
      { id: '30', color: 'Navy', size: 'XL', quantity: '0', image_id: '11' },
      { id: '31', color: 'Royal Blue', size: 'S', quantity: '8', image_id: '12' },
      { id: '32', color: 'Royal Blue', size: 'M', quantity: '9', image_id: '12' },
      { id: '33', color: 'Royal Blue', size: 'L', quantity: '5', image_id: '12' },
    ],
    total_stock: 83,
  },

  {
    id: '4', user_id: '1', product_name: 'Alumnae Sweatshirt', category: 'Apparel',
    price: '18500.00', description: 'Heavyweight fleece-lined sweatshirt with screen-printed alumnae crest. Warm and stylish.',
    has_size: true, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '13', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80' },
      { id: '14', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80' },
    ],
    variants: [
      { id: '34', color: 'Ash Grey', size: 'S', quantity: '7', image_id: '13' },
      { id: '35', color: 'Ash Grey', size: 'M', quantity: '12', image_id: '13' },
      { id: '36', color: 'Ash Grey', size: 'L', quantity: '9', image_id: '13' },
      { id: '37', color: 'Ash Grey', size: 'XL', quantity: '4', image_id: '13' },
      { id: '38', color: 'Navy', size: 'S', quantity: '5', image_id: '14' },
      { id: '39', color: 'Navy', size: 'M', quantity: '8', image_id: '14' },
      { id: '40', color: 'Navy', size: 'L', quantity: '11', image_id: '14' },
      { id: '41', color: 'Navy', size: 'XXL', quantity: '3', image_id: '14' },
    ],
    total_stock: 59,
  },

  {
    id: '5', user_id: '1', product_name: 'Alumnae Cap', category: 'Apparel',
    price: '8000.00', description: 'Stylish embroidered alumnae cap. Adjustable strap, one size fits most.',
    has_size: false, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '15', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80' },
      { id: '16', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80' },
      { id: '17', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&q=80' },
    ],
    variants: [
      { id: '42', color: 'Navy', size: null, quantity: '10', image_id: '15' },
      { id: '43', color: 'Black', size: null, quantity: '8', image_id: '16' },
      { id: '44', color: 'White', size: null, quantity: '12', image_id: '17' },
    ],
    total_stock: 30,
  },

  {
    id: '6', user_id: '1', product_name: 'Alumnae Sun Hat', category: 'Apparel',
    price: '10500.00', description: 'Wide-brim sun hat. Elegant style for outdoor alumnae events and garden parties.',
    has_size: false, has_color: false, quantity: '22', status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '18', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?w=800&q=80' },
      { id: '19', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80' },
    ],
    variants: [],
    total_stock: 22,
  },

  {
    id: '7', user_id: '1', product_name: 'Alumnae Silk Scarf', category: 'Accessories',
    price: '19500.00', description: 'Luxurious silk-blend scarf with alumnae pattern woven in. Versatile enough to be worn many ways.',
    has_size: false, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '20', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80' },
      { id: '21', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80' },
      { id: '22', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=800&q=80' },
    ],
    variants: [
      { id: '45', color: 'Ivory', size: null, quantity: '15', image_id: '20' },
      { id: '46', color: 'Navy', size: null, quantity: '12', image_id: '21' },
      { id: '47', color: 'Burgundy', size: null, quantity: '10', image_id: '22' },
    ],
    total_stock: 37,
  },

  {
    id: '8', user_id: '1', product_name: 'Alumnae Tote Bag', category: 'Accessories',
    price: '9500.00', description: 'Durable canvas tote bag for everyday elegance. Spacious enough for your essentials.',
    has_size: false, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '23', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80' },
      { id: '24', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80' },
      { id: '25', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80' },
    ],
    variants: [
      { id: '48', color: 'Beige', size: null, quantity: '20', image_id: '23' },
      { id: '49', color: 'Black', size: null, quantity: '14', image_id: '25' },
    ],
    total_stock: 34,
  },

  {
    id: '9', user_id: '1', product_name: 'Alumnae Travel Bag', category: 'Accessories',
    price: '35000.00', description: 'Spacious weekend duffel bag for the modern alumnae on the go. Premium stitching and durable handles.',
    has_size: false, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '26', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80' },
      { id: '27', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80' },
      { id: '28', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80' },
    ],
    variants: [
      { id: '50', color: 'Brown', size: null, quantity: '10', image_id: '26' },
      { id: '51', color: 'Grey', size: null, quantity: '7', image_id: '28' },
    ],
    total_stock: 17,
  },

  {
    id: '10', user_id: '1', product_name: 'Alumnae Canvas Backpack', category: 'Accessories',
    price: '28000.00', description: 'Rugged canvas backpack with multiple compartments and alumnae logo on the front pocket.',
    has_size: false, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '29', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80' },
      { id: '30', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=80' },
    ],
    variants: [
      { id: '52', color: 'Olive', size: null, quantity: '14', image_id: '29' },
      { id: '53', color: 'Black', size: null, quantity: '11', image_id: '30' },
    ],
    total_stock: 25,
  },

  {
    id: '11', user_id: '1', product_name: 'Alumnae Mini Purse', category: 'Accessories',
    price: '13500.00', description: 'Compact leather-finish mini purse with internal card slots and alumnae monogram.',
    has_size: false, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '31', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80' },
      { id: '32', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80' },
    ],
    variants: [
      { id: '54', color: 'Tan', size: null, quantity: '18', image_id: '31' },
      { id: '55', color: 'Black', size: null, quantity: '22', image_id: '32' },
    ],
    total_stock: 40,
  },

  {
    id: '12', user_id: '1', product_name: 'Alumnae Compact Mirror', category: 'Accessories',
    price: '5500.00', description: 'Elegant pocket mirror with alumnae crest embossed on the cover. A refined everyday essential.',
    has_size: false, has_color: false, quantity: '33', status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '33', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80' },
      { id: '34', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80' },
    ],
    variants: [],
    total_stock: 33,
  },

  {
    id: '13', user_id: '1', product_name: 'Alumnae Keyholder', category: 'Accessories',
    price: '3500.00', description: 'Elegant alumnae engraved keyholder. A perfect everyday carry piece.',
    has_size: false, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '35', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1619995745882-f4128ac82ad6?w=800&q=80' },
      { id: '36', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80' },
      { id: '37', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1609428982714-2c4fcde5b2a0?w=800&q=80' },
    ],
    variants: [
      { id: '56', color: 'Silver', size: null, quantity: '40', image_id: '35' },
      { id: '57', color: 'Gold', size: null, quantity: '25', image_id: '36' },
    ],
    total_stock: 65,
  },

  {
    id: '14', user_id: '1', product_name: 'Alumnae Phone Case', category: 'Accessories',
    price: '7500.00', description: 'Protective phone case with alumnae crest design. Slim profile with strong impact protection.',
    has_size: true, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '38', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80' },
      { id: '39', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80' },
    ],
    variants: [
      { id: '58', color: 'Clear', size: 'iPhone 14', quantity: '20', image_id: '38' },
      { id: '59', color: 'Clear', size: 'iPhone 15', quantity: '18', image_id: '38' },
      { id: '60', color: 'Clear', size: 'Samsung S24', quantity: '9', image_id: '38' },
      { id: '61', color: 'Navy', size: 'iPhone 14', quantity: '15', image_id: '39' },
      { id: '62', color: 'Navy', size: 'iPhone 15', quantity: '11', image_id: '39' },
      { id: '63', color: 'Navy', size: 'Samsung S24', quantity: '0', image_id: '39' },
    ],
    total_stock: 73,
  },

  {
    id: '15', user_id: '1', product_name: 'Alumnae Tumbler', category: 'Drinkware',
    price: '12000.00', description: 'Premium insulated tumbler that keeps drinks hot or cold for hours.',
    has_size: false, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '40', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80' },
      { id: '41', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1611236151328-cb01a64d1be7?w=800&q=80' },
      { id: '42', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?w=800&q=80' },
    ],
    variants: [
      { id: '64', color: 'Silver', size: null, quantity: '25', image_id: '40' },
      { id: '65', color: 'Black', size: null, quantity: '18', image_id: '41' },
    ],
    total_stock: 43,
  },

  {
    id: '16', user_id: '1', product_name: 'Alumnae Coffee Mug', category: 'Drinkware',
    price: '6000.00', description: 'Start your morning with the alumnae spirit. Classic ceramic mug with comfortable grip.',
    has_size: false, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '43', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80' },
      { id: '44', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1572119865084-43c285814d63?w=800&q=80' },
      { id: '45', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80' },
    ],
    variants: [
      { id: '66', color: 'White', size: null, quantity: '60', image_id: '43' },
      { id: '67', color: 'Black', size: null, quantity: '45', image_id: '44' },
    ],
    total_stock: 105,
  },

  {
    id: '17', user_id: '1', product_name: 'Alumnae Water Bottle', category: 'Drinkware',
    price: '8500.00', description: 'BPA-free stainless steel water bottle. Stay hydrated in style with the alumnae logo.',
    has_size: false, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '46', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80' },
      { id: '47', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1625708458528-802ec79b1ed8?w=800&q=80' },
      { id: '48', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&q=80' },
    ],
    variants: [
      { id: '68', color: 'White', size: null, quantity: '35', image_id: '46' },
      { id: '69', color: 'Black', size: null, quantity: '28', image_id: '47' },
      { id: '70', color: 'Navy', size: null, quantity: '20', image_id: '48' },
    ],
    total_stock: 83,
  },

  {
    id: '18', user_id: '1', product_name: 'Alumnae Signature Pen', category: 'Office & Stationery',
    price: '37000.00', description: 'A luxury writing instrument for the distinguished alumnae. Smooth ink flow and premium build quality.',
    has_size: false, has_color: false, quantity: '100', status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '49', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&q=80' },
      { id: '50', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1612538498456-e861df91d4d0?w=800&q=80' },
    ],
    variants: [],
    total_stock: 100,
  },

  {
    id: '19', user_id: '1', product_name: 'Alumnae Journal', category: 'Office & Stationery',
    price: '8500.00', description: 'Premium hardcover journal for your thoughts, plans, and cherished memories.',
    has_size: false, has_color: false, quantity: '45', status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '51', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80' },
      { id: '52', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80' },
      { id: '53', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80' },
    ],
    variants: [],
    total_stock: 45,
  },

  {
    id: '20', user_id: '1', product_name: 'Alumnae Laptop Sleeve', category: 'Office & Stationery',
    price: '14000.00', description: 'Protective neoprene laptop sleeve with alumnae branding. Fits snugly and protects your device.',
    has_size: true, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '54', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80' },
      { id: '55', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&q=80' },
    ],
    variants: [
      { id: '71', color: 'Navy', size: '13"', quantity: '15', image_id: '54' },
      { id: '72', color: 'Navy', size: '14"', quantity: '20', image_id: '54' },
      { id: '73', color: 'Navy', size: '15"', quantity: '12', image_id: '54' },
      { id: '74', color: 'Black', size: '13"', quantity: '8', image_id: '55' },
      { id: '75', color: 'Black', size: '14"', quantity: '14', image_id: '55' },
      { id: '76', color: 'Black', size: '15"', quantity: '0', image_id: '55' },
    ],
    total_stock: 69,
  },

  {
    id: '21', user_id: '1', product_name: 'Alumnae Desk Calendar', category: 'Office & Stationery',
    price: '6500.00', description: 'Beautiful spiral-bound desk calendar featuring alumnae quotes and milestone dates.',
    has_size: false, has_color: false, quantity: '75', status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '56', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&q=80' },
      { id: '57', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80' },
    ],
    variants: [],
    total_stock: 75,
  },

  {
    id: '22', user_id: '1', product_name: 'Alumnae Desk Mousepad', category: 'Office & Stationery',
    price: '5000.00', description: 'Wide-format desk mousepad with non-slip rubber base and alumnae crest design.',
    has_size: false, has_color: false, quantity: '50', status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '58', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80' },
      { id: '59', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=800&q=80' },
    ],
    variants: [],
    total_stock: 50,
  },

  {
    id: '23', user_id: '1', product_name: 'Alumnae Umbrella', category: 'Lifestyle Essentials',
    price: '15000.00', description: 'Wind-resistant travel umbrella with alumnae branding. Compact and sturdy for all weather.',
    has_size: false, has_color: false, quantity: '30', status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '60', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80' },
      { id: '61', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1587302149595-2b60e70ee3e4?w=800&q=80' },
    ],
    variants: [],
    total_stock: 30,
  },

  {
    id: '24', user_id: '1', product_name: 'Alumnae Throw Pillow', category: 'Lifestyle Essentials',
    price: '11000.00', description: 'Soft decorative throw pillow with alumnae emblem. A warm addition to any home or office.',
    has_size: false, has_color: false, quantity: '30', status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '62', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=800&q=80' },
      { id: '63', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80' },
    ],
    variants: [],
    total_stock: 30,
  },

  {
    id: '25', user_id: '1', product_name: 'Alumnae Yoga Mat', category: 'Lifestyle Essentials',
    price: '17000.00', description: 'Non-slip eco-friendly yoga mat with alumnae branding. Ideal for wellness enthusiasts.',
    has_size: false, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '64', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80' },
      { id: '65', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80' },
    ],
    variants: [
      { id: '77', color: 'Navy', size: null, quantity: '16', image_id: '64' },
      { id: '78', color: 'Purple', size: null, quantity: '11', image_id: '65' },
    ],
    total_stock: 27,
  },

  {
    id: '26', user_id: '1', product_name: 'Alumnae Pin Badge', category: 'Collectibles & Memorabilia',
    price: '12000.00', description: 'Limited edition collectible alumnae pin badge. A timeless memento of your years at FGGC Owerri.',
    has_size: false, has_color: false, quantity: '50', status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '66', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80' },
      { id: '67', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=800&q=80' },
    ],
    variants: [],
    total_stock: 50,
  },

  {
    id: '27', user_id: '1', product_name: 'Alumnae Desk Plaque', category: 'Collectibles & Memorabilia',
    price: '18000.00', description: 'Engraved wooden desk plaque bearing the alumnae crest. A distinguished addition to any workspace.',
    has_size: false, has_color: false, quantity: '18', status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '68', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
      { id: '69', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80' },
    ],
    variants: [],
    total_stock: 18,
  },

  {
    id: '28', user_id: '1', product_name: 'Alumnae Commemorative Watch', category: 'Collectibles & Memorabilia',
    price: '85000.00', description: 'Limited edition commemorative wristwatch with alumnae crest on the dial. A treasured keepsake.',
    has_size: false, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '70', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80' },
      { id: '71', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=800&q=80' },
      { id: '72', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1548171916-c8fd5d56a0b4?w=800&q=80' },
    ],
    variants: [
      { id: '79', color: 'Silver', size: null, quantity: '8', image_id: '70' },
      { id: '80', color: 'Gold', size: null, quantity: '5', image_id: '71' },
    ],
    total_stock: 13,
  },

  {
    id: '29', user_id: '1', product_name: 'FGGC Owerri Framed Print', category: 'Collectibles & Memorabilia',
    price: '25000.00', description: 'Framed archival print of FGGC Owerri campus scenes. A nostalgic piece for your home or office wall.',
    has_size: true, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '73', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80' },
      { id: '74', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1582053433976-25c00369fc93?w=800&q=80' },
    ],
    variants: [
      { id: '81', color: 'Black Frame', size: 'A4', quantity: '20', image_id: '73' },
      { id: '82', color: 'Black Frame', size: 'A3', quantity: '12', image_id: '73' },
      { id: '83', color: 'Black Frame', size: 'A2', quantity: '6', image_id: '73' },
      { id: '84', color: 'Gold Frame', size: 'A4', quantity: '15', image_id: '74' },
      { id: '85', color: 'Gold Frame', size: 'A3', quantity: '8', image_id: '74' },
      { id: '86', color: 'Gold Frame', size: 'A2', quantity: '3', image_id: '74' },
    ],
    total_stock: 64,
  },

  {
    id: '30', user_id: '1', product_name: 'Alumnae Sticker Sheet', category: 'Collectibles & Memorabilia',
    price: '2500.00', description: 'Fun sheet of high-quality vinyl stickers celebrating FGGC Owerri icons, mottos, and memories.',
    has_size: false, has_color: false, quantity: '200', status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '75', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=800&q=80' },
      { id: '76', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80' },
    ],
    variants: [],
    total_stock: 200,
  },

  {
    id: '31', user_id: '1', product_name: 'Alumnae Cardigan', category: 'Apparel',
    price: '24000.00', description: 'Soft knit cardigan with alumnae crest embroidery. Perfect layering piece for any season.',
    has_size: true, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '77', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80' },
      { id: '78', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80' },
    ],
    variants: [
      { id: '87', color: 'Cream', size: 'S', quantity: '8', image_id: '77' },
      { id: '88', color: 'Cream', size: 'M', quantity: '10', image_id: '77' },
      { id: '89', color: 'Cream', size: 'L', quantity: '6', image_id: '77' },
      { id: '90', color: 'Grey', size: 'S', quantity: '5', image_id: '78' },
      { id: '91', color: 'Grey', size: 'M', quantity: '9', image_id: '78' },
      { id: '92', color: 'Grey', size: 'L', quantity: '7', image_id: '78' },
    ],
    total_stock: 45,
  },

  {
    id: '32', user_id: '1', product_name: 'Alumnae Blazer', category: 'Apparel',
    price: '55000.00', description: 'Tailored blazer with alumnae crest pin. Professional and polished for formal alumnae events.',
    has_size: true, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '79', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80' },
      { id: '80', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=800&q=80' },
    ],
    variants: [
      { id: '93', color: 'Navy', size: 'S', quantity: '4', image_id: '79' },
      { id: '94', color: 'Navy', size: 'M', quantity: '6', image_id: '79' },
      { id: '95', color: 'Navy', size: 'L', quantity: '5', image_id: '79' },
      { id: '96', color: 'Black', size: 'S', quantity: '3', image_id: '80' },
      { id: '97', color: 'Black', size: 'M', quantity: '5', image_id: '80' },
      { id: '98', color: 'Black', size: 'L', quantity: '4', image_id: '80' },
    ],
    total_stock: 27,
  },

  {
    id: '33', user_id: '1', product_name: 'Alumnae Tote Backpack', category: 'Accessories',
    price: '32000.00', description: 'Convertible tote-backpack hybrid with alumnae insignia. Carry it your way.',
    has_size: false, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '81', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80' },
      { id: '82', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80' },
    ],
    variants: [
      { id: '99', color: 'Camel', size: null, quantity: '9', image_id: '81' },
      { id: '100', color: 'Black', size: null, quantity: '13', image_id: '82' },
    ],
    total_stock: 22,
  },

  {
    id: '34', user_id: '1', product_name: 'Alumnae Weekender Bag', category: 'Accessories',
    price: '42000.00', description: 'Large capacity weekender bag with shoe compartment and alumnae monogram.',
    has_size: false, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '83', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1565793979256-f78e55df5f2d?w=800&q=80' },
      { id: '84', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80' },
    ],
    variants: [
      { id: '101', color: 'Tan', size: null, quantity: '7', image_id: '83' },
      { id: '102', color: 'Black', size: null, quantity: '9', image_id: '84' },
    ],
    total_stock: 16,
  },

  {
    id: '35', user_id: '1', product_name: 'Alumnae Perfume', category: 'Lifestyle Essentials',
    price: '48000.00', description: 'Exclusive alumnae signature fragrance. A sophisticated scent that embodies grace and achievement.',
    has_size: false, has_color: false, quantity: '40', status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '85', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80' },
      { id: '86', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80' },
    ],
    variants: [],
    total_stock: 40,
  },

  {
    id: '36', user_id: '1', product_name: 'Alumnae Candle Set', category: 'Lifestyle Essentials',
    price: '15000.00', description: 'Set of 3 scented candles with alumnae crest on frosted glass. A thoughtful gift.',
    has_size: false, has_color: false, quantity: '35', status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '87', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1603905903507-7e7c5b85b9d0?w=800&q=80' },
      { id: '88', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1603905903507-7e7c5b85b9d0?w=800&q=80' },
    ],
    variants: [],
    total_stock: 35,
  },

  {
    id: '37', user_id: '1', product_name: 'Alumnae Photo Album', category: 'Collectibles & Memorabilia',
    price: '14000.00', description: 'Premium hardcover photo album with alumnae crest embossed on cover. Preserve your memories.',
    has_size: false, has_color: false, quantity: '28', status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '89', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80' },
      { id: '90', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80' },
    ],
    variants: [],
    total_stock: 28,
  },

  {
    id: '38', user_id: '1', product_name: 'Alumnae Pen Set (3 Pack)', category: 'Office & Stationery',
    price: '12000.00', description: 'Set of 3 premium ballpoint pens with alumnae logo. Perfect for the office or as a gift.',
    has_size: false, has_color: false, quantity: '60', status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '91', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&q=80' },
      { id: '92', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1612538498456-e861df91d4d0?w=800&q=80' },
    ],
    variants: [],
    total_stock: 60,
  },

  {
    id: '39', user_id: '1', product_name: 'Alumnae Sticky Notes Set', category: 'Office & Stationery',
    price: '3500.00', description: 'Colourful sticky notes with alumnae crest watermark. Stay organised in style.',
    has_size: false, has_color: false, quantity: '150', status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '93', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=800&q=80' },
      { id: '94', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80' },
    ],
    variants: [],
    total_stock: 150,
  },

  {
    id: '40', user_id: '1', product_name: 'Alumnae Laptop Stand', category: 'Office & Stationery',
    price: '22000.00', description: 'Adjustable aluminium laptop stand with alumnae logo etched on the base. Ergonomic and sleek.',
    has_size: false, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '95', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80' },
      { id: '96', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=800&q=80' },
    ],
    variants: [
      { id: '103', color: 'Silver', size: null, quantity: '20', image_id: '95' },
      { id: '104', color: 'Space Grey', size: null, quantity: '15', image_id: '96' },
    ],
    total_stock: 35,
  },

  {
    id: '41', user_id: '1', product_name: 'Alumnae Beaded Bracelet', category: 'Accessories',
    price: '6500.00', description: 'Handcrafted beaded bracelet in alumnae colours. Wear your pride on your wrist.',
    has_size: false, has_color: false, quantity: '80', status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '97', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80' },
      { id: '98', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80' },
    ],
    variants: [],
    total_stock: 80,
  },

  {
    id: '42', user_id: '1', product_name: 'Alumnae Earrings', category: 'Accessories',
    price: '9500.00', description: 'Elegant drop earrings with alumnae crest charm. A perfect accessory for formal events.',
    has_size: false, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '99', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80' },
      { id: '100', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80' },
    ],
    variants: [
      { id: '105', color: 'Gold', size: null, quantity: '25', image_id: '99' },
      { id: '106', color: 'Silver', size: null, quantity: '20', image_id: '100' },
    ],
    total_stock: 45,
  },

  {
    id: '43', user_id: '1', product_name: 'Alumnae Necklace', category: 'Accessories',
    price: '15000.00', description: 'Sterling silver necklace with alumnae pendant. Timeless and elegant.',
    has_size: false, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '101', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80' },
      { id: '102', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80' },
    ],
    variants: [
      { id: '107', color: 'Silver', size: null, quantity: '18', image_id: '101' },
      { id: '108', color: 'Gold', size: null, quantity: '14', image_id: '102' },
    ],
    total_stock: 32,
  },

  {
    id: '44', user_id: '1', product_name: 'Alumnae Teacup Set', category: 'Drinkware',
    price: '18000.00', description: 'Fine bone china teacup and saucer set with alumnae crest. A sophisticated gift for any occasion.',
    has_size: false, has_color: false, quantity: '20', status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '103', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80' },
      { id: '104', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80' },
    ],
    variants: [],
    total_stock: 20,
  },

  {
    id: '45', user_id: '1', product_name: 'Alumnae Flask', category: 'Drinkware',
    price: '11000.00', description: 'Stainless steel hip flask with alumnae crest engraving. Compact and leak-proof.',
    has_size: false, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '105', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1625708458528-802ec79b1ed8?w=800&q=80' },
      { id: '106', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80' },
    ],
    variants: [
      { id: '109', color: 'Silver', size: null, quantity: '22', image_id: '105' },
      { id: '110', color: 'Black', size: null, quantity: '18', image_id: '106' },
    ],
    total_stock: 40,
  },

  {
    id: '46', user_id: '1', product_name: 'Alumnae Shorts', category: 'Apparel',
    price: '9500.00', description: 'Comfortable athletic shorts with alumnae logo. Great for workouts and casual wear.',
    has_size: true, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '107', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=800&q=80' },
      { id: '108', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80' },
    ],
    variants: [
      { id: '111', color: 'Black', size: 'S', quantity: '15', image_id: '107' },
      { id: '112', color: 'Black', size: 'M', quantity: '20', image_id: '107' },
      { id: '113', color: 'Black', size: 'L', quantity: '12', image_id: '107' },
      { id: '114', color: 'Navy', size: 'S', quantity: '10', image_id: '108' },
      { id: '115', color: 'Navy', size: 'M', quantity: '15', image_id: '108' },
      { id: '116', color: 'Navy', size: 'L', quantity: '8', image_id: '108' },
    ],
    total_stock: 80,
  },

  {
    id: '47', user_id: '1', product_name: 'Alumnae Leggings', category: 'Apparel',
    price: '14000.00', description: 'High-waist compression leggings with alumnae logo. Comfortable for workouts and everyday wear.',
    has_size: true, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '109', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80' },
      { id: '110', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80' },
    ],
    variants: [
      { id: '117', color: 'Black', size: 'S', quantity: '18', image_id: '109' },
      { id: '118', color: 'Black', size: 'M', quantity: '22', image_id: '109' },
      { id: '119', color: 'Black', size: 'L', quantity: '14', image_id: '109' },
      { id: '120', color: 'Navy', size: 'S', quantity: '12', image_id: '110' },
      { id: '121', color: 'Navy', size: 'M', quantity: '16', image_id: '110' },
      { id: '122', color: 'Navy', size: 'L', quantity: '10', image_id: '110' },
    ],
    total_stock: 92,
  },

  {
    id: '48', user_id: '1', product_name: 'Alumnae Tote Purse', category: 'Accessories',
    price: '21000.00', description: 'Structured leather-finish tote purse with gold alumnae hardware. From desk to dinner.',
    has_size: false, has_color: true, quantity: null, status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '111', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80' },
      { id: '112', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80' },
    ],
    variants: [
      { id: '123', color: 'Nude', size: null, quantity: '12', image_id: '111' },
      { id: '124', color: 'Black', size: null, quantity: '15', image_id: '112' },
    ],
    total_stock: 27,
  },

  {
    id: '49', user_id: '1', product_name: 'Alumnae Cufflinks', category: 'Accessories',
    price: '16000.00', description: 'Silver-plated cufflinks with alumnae crest. A distinguished touch for formal wear.',
    has_size: false, has_color: false, quantity: '45', status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '113', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80' },
      { id: '114', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80' },
    ],
    variants: [],
    total_stock: 45,
  },

  {
    id: '50', user_id: '1', product_name: 'Alumnae Gift Box', category: 'Collectibles & Memorabilia',
    price: '65000.00', description: 'Curated gift box featuring assorted alumnae merchandise. The perfect gift for a fellow alumnae.',
    has_size: false, has_color: false, quantity: '15', status: 'active',
    created_at: '2026-01-01 00:00:00', updated_at: '2026-01-01 00:00:00',
    images: [
      { id: '115', image_path: '', is_spotlight: true, image_url: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80' },
      { id: '116', image_path: '', is_spotlight: false, image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80' },
    ],
    variants: [],
    total_stock: 15,
  },
];