// import type { Product } from '../types/product.types';

// export const MOCK_PRODUCTS: Product[] = [
//   {
//     id: '1',
//     name: 'Official Alumnae T-Shirt',
//     category: 'Apparel',
//     price: 12500,
//     image:
//       'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
//     description:
//       'Represent your alma mater with pride in our official alumnae T-shirt. Crafted from premium cotton, this comfortable and durable shirt is perfect for reunions, community events, casual outings, and everyday wear.',
//     supportNote:
//       'A portion of proceeds from every purchase supports alumnae programs, events, and community initiatives.',
//     hasSizes: true,
//     variants: [
//       {
//         color: 'Black',
//         colorHex: '#1a1a1a',
//         images: [
//           'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
//           'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [
//           { size: 'S', stock: 12 },
//           { size: 'M', stock: 8 },
//           { size: 'L', stock: 5 },
//           { size: 'XL', stock: 0 },
//           { size: 'XXL', stock: 3 },
//           { size: 'XXXL', stock: 0 },
//         ],
//       },
//       {
//         color: 'White',
//         colorHex: '#f5f5f5',
//         images: [
//           'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
//           'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [
//           { size: 'S', stock: 0 },
//           { size: 'M', stock: 9 },
//           { size: 'L', stock: 6 },
//           { size: 'XL', stock: 4 },
//           { size: 'XXL', stock: 0 },
//           { size: 'XXXL', stock: 2 },
//         ],
//       },
//       {
//         color: 'Navy',
//         colorHex: '#1b3a6b',
//         images: [
//           'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [
//           { size: 'S', stock: 4 },
//           { size: 'M', stock: 7 },
//           { size: 'L', stock: 0 },
//           { size: 'XL', stock: 3 },
//           { size: 'XXL', stock: 1 },
//           { size: 'XXXL', stock: 0 },
//         ],
//       },
//       {
//         color: 'Blue',
//         colorHex: '#4a90d9',
//         images: [
//           'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [
//           { size: 'S', stock: 6 },
//           { size: 'M', stock: 4 },
//           { size: 'L', stock: 8 },
//           { size: 'XL', stock: 0 },
//           { size: 'XXL', stock: 0 },
//           { size: 'XXXL', stock: 1 },
//         ],
//       },
//       {
//         color: 'Grey',
//         colorHex: '#9e9e9e',
//         images: [
//           'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [
//           { size: 'S', stock: 3 },
//           { size: 'M', stock: 5 },
//           { size: 'L', stock: 2 },
//           { size: 'XL', stock: 6 },
//           { size: 'XXL', stock: 0 },
//           { size: 'XXXL', stock: 0 },
//         ],
//       },
//     ],
//   },

//   {
//     id: '2',
//     name: 'Alumnae Keyholder',
//     category: 'Accessories',
//     price: 3500,
//     image:
//       'https://images.unsplash.com/photo-1619995745882-f4128ac82ad6?auto=format&fit=crop&w=800&q=80',
//     description: 'Elegant alumnae engraved keyholder. A perfect everyday carry.',
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Silver',
//         colorHex: '#C0C0C0',
//         images: [
//           'https://images.unsplash.com/photo-1619995745882-f4128ac82ad6?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [{ size: 'One Size', stock: 40 }],
//       },
//       {
//         color: 'Gold',
//         colorHex: '#FFD700',
//         images: [
//           'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [{ size: 'One Size', stock: 25 }],
//       },
//     ],
//   },

//   {
//     id: '3',
//     name: 'Alumnae Tote Bag',
//     category: 'Accessories',
//     price: 9500,
//     image:
//       'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
//     description: 'Durable tote bag for everyday elegance. Spacious and stylish.',
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Beige',
//         colorHex: '#f5f0e8',
//         images: [
//           'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
//           'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [{ size: 'One Size', stock: 20 }],
//       },
//       {
//         color: 'Black',
//         colorHex: '#1a1a1a',
//         images: [
//           'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [{ size: 'One Size', stock: 14 }],
//       },
//     ],
//   },

//   {
//     id: '4',
//     name: 'Alumnae Tumbler',
//     category: 'Drinkware',
//     price: 12000,
//     image:
//       'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80',
//     description: 'Keeps your drinks hot or cold for hours. Premium insulated tumbler.',
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Silver',
//         colorHex: '#C0C0C0',
//         images: [
//           'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [{ size: 'One Size', stock: 25 }],
//       },
//       {
//         color: 'Black',
//         colorHex: '#1a1a1a',
//         images: [
//           'https://images.unsplash.com/photo-1611236151328-cb01a64d1be7?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [{ size: 'One Size', stock: 18 }],
//       },
//     ],
//   },

//   {
//     id: '5',
//     name: 'Alumnae Signature Pen',
//     category: 'Office & Stationery',
//     price: 37000,
//     image:
//       'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
//     description: 'Premium writing experience. A luxury pen for the distinguished alumnae.',
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Black/Gold',
//         colorHex: '#1a1a1a',
//         images: [
//           'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
//           'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [{ size: 'One Size', stock: 100 }],
//       },
//     ],
//   },

//   {
//     id: '6',
//     name: 'Alumnae Cap',
//     category: 'Apparel',
//     price: 8000,
//     image:
//       'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
//     description: 'Stylish embroidered alumnae cap. One size fits most.',
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Navy',
//         colorHex: '#1b3a6b',
//         images: [
//           'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [{ size: 'One Size', stock: 10 }],
//       },
//       {
//         color: 'Black',
//         colorHex: '#1a1a1a',
//         images: [
//           'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [{ size: 'One Size', stock: 8 }],
//       },
//     ],
//   },

//   {
//     id: '7',
//     name: 'Alumnae Umbrella',
//     category: 'Lifestyle Essentials',
//     price: 15000,
//     image:
//       'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80',
//     description: 'Wind-resistant travel umbrella with alumnae branding.',
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Navy Blue',
//         colorHex: '#1b3a6b',
//         images: [
//           'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [{ size: 'One Size', stock: 30 }],
//       },
//     ],
//   },

//   {
//     id: '8',
//     name: 'Alumnae Travel Bag',
//     category: 'Accessories',
//     price: 35000,
//     image:
//       'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80',
//     description: 'Spacious travel bag for the modern alumnae on the go.',
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Brown',
//         colorHex: '#8B5E3C',
//         images: [
//           'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80',
//           'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [{ size: 'One Size', stock: 10 }],
//       },
//       {
//         color: 'Grey',
//         colorHex: '#808080',
//         images: [
//           'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [{ size: 'One Size', stock: 7 }],
//       },
//     ],
//   },

//   {
//     id: '9',
//     name: 'Alumnae Pin Badge',
//     category: 'Collectibles & Memorabilia',
//     price: 12000,
//     image:
//       'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80',
//     description: 'Collectible alumnae pin badge. Limited edition memorabilia.',
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Silver',
//         colorHex: '#C0C0C0',
//         images: [
//           'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [{ size: 'One Size', stock: 50 }],
//       },
//     ],
//   },

//   {
//     id: '10',
//     name: 'Alumnae Sun Hat',
//     category: 'Apparel',
//     price: 10500,
//     image:
//       'https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?auto=format&fit=crop&w=800&q=80',
//     description: 'Wide-brim sun hat. Elegant style for outdoor alumnae events.',
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Beige',
//         colorHex: '#d4b896',
//         images: [
//           'https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [{ size: 'One Size', stock: 22 }],
//       },
//     ],
//   },

//   {
//     id: '11',
//     name: 'Alumnae Coffee Mug',
//     category: 'Drinkware',
//     price: 6000,
//     image:
//       'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80',
//     description: 'Start your morning with the alumnae spirit. Classic ceramic mug.',
//     hasSizes: false,
//     variants: [
//       {
//         color: 'White',
//         colorHex: '#f5f5f5',
//         images: [
//           'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [{ size: 'One Size', stock: 60 }],
//       },
//     ],
//   },

//   {
//     id: '12',
//     name: 'Alumnae Journal',
//     category: 'Office & Stationery',
//     price: 8500,
//     image:
//       'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80',
//     description: 'Premium hardcover journal for thoughts, plans, and memories.',
//     hasSizes: false,
//     variants: [
//       {
//         color: 'Navy',
//         colorHex: '#1b3a6b',
//         images: [
//           'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80',
//         ],
//         sizes: [{ size: 'One Size', stock: 45 }],
//       },
//     ],
//   },
// ];










import type { Product } from '../types/product.types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Official Alumnae T-Shirt',
    category: 'Apparel',
    price: 12500,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    description:
      'Represent your alma mater with pride in our official alumnae T-shirt. Crafted from premium cotton, this comfortable and durable shirt is perfect for reunions, community events, casual outings, and everyday wear.',
    supportNote:
      'A portion of proceeds from every purchase supports alumnae programs, events, and community initiatives.',
    // General images shown first in carousel regardless of selected colour
    generalImages: [
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
    ],
    hasSizes: true,
    variants: [
      {
        color: 'Black',
        colorHex: '#1a1a1a',
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [
          { size: 'S', stock: 12 },
          { size: 'M', stock: 8 },
          { size: 'L', stock: 5 },
          { size: 'XL', stock: 0 },
          { size: 'XXL', stock: 3 },
          { size: 'XXXL', stock: 0 },
        ],
      },
      {
        color: 'White',
        colorHex: '#f5f5f5',
        images: [
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [
          { size: 'S', stock: 0 },
          { size: 'M', stock: 9 },
          { size: 'L', stock: 6 },
          { size: 'XL', stock: 4 },
          { size: 'XXL', stock: 0 },
          { size: 'XXXL', stock: 2 },
        ],
      },
      {
        color: 'Navy',
        colorHex: '#1b3a6b',
        images: [
          'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [
          { size: 'S', stock: 4 },
          { size: 'M', stock: 7 },
          { size: 'L', stock: 0 },
          { size: 'XL', stock: 3 },
          { size: 'XXL', stock: 1 },
          { size: 'XXXL', stock: 0 },
        ],
      },
      {
        color: 'Blue',
        colorHex: '#4a90d9',
        images: [
          'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [
          { size: 'S', stock: 6 },
          { size: 'M', stock: 4 },
          { size: 'L', stock: 8 },
          { size: 'XL', stock: 0 },
          { size: 'XXL', stock: 0 },
          { size: 'XXXL', stock: 1 },
        ],
      },
      {
        color: 'Grey',
        colorHex: '#9e9e9e',
        images: [
          'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [
          { size: 'S', stock: 3 },
          { size: 'M', stock: 5 },
          { size: 'L', stock: 2 },
          { size: 'XL', stock: 6 },
          { size: 'XXL', stock: 0 },
          { size: 'XXXL', stock: 0 },
        ],
      },
    ],
  },

  {
    id: '2',
    name: 'Alumnae Keyholder',
    category: 'Accessories',
    price: 3500,
    image:
      'https://images.unsplash.com/photo-1619995745882-f4128ac82ad6?auto=format&fit=crop&w=800&q=80',
    description: 'Elegant alumnae engraved keyholder. A perfect everyday carry.',
    generalImages: [
      'https://images.unsplash.com/photo-1609428982714-2c4fcde5b2a0?auto=format&fit=crop&w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Silver',
        colorHex: '#C0C0C0',
        images: [
          'https://images.unsplash.com/photo-1619995745882-f4128ac82ad6?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 40 }],
      },
      {
        color: 'Gold',
        colorHex: '#FFD700',
        images: [
          'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 25 }],
      },
    ],
  },

  {
    id: '3',
    name: 'Alumnae Tote Bag',
    category: 'Accessories',
    price: 9500,
    image:
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    description: 'Durable tote bag for everyday elegance. Spacious and stylish.',
    generalImages: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Beige',
        colorHex: '#f5f0e8',
        images: [
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 20 }],
      },
      {
        color: 'Black',
        colorHex: '#1a1a1a',
        images: [
          'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 14 }],
      },
    ],
  },

  {
    id: '4',
    name: 'Alumnae Tumbler',
    category: 'Drinkware',
    price: 12000,
    image:
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80',
    description: 'Keeps your drinks hot or cold for hours. Premium insulated tumbler.',
    hasSizes: false,
    variants: [
      {
        color: 'Silver',
        colorHex: '#C0C0C0',
        images: [
          'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 25 }],
      },
      {
        color: 'Black',
        colorHex: '#1a1a1a',
        images: [
          'https://images.unsplash.com/photo-1611236151328-cb01a64d1be7?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 18 }],
      },
    ],
  },

  {
    id: '5',
    name: 'Alumnae Signature Pen',
    category: 'Office & Stationery',
    price: 37000,
    image:
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
    description: 'Premium writing experience. A luxury pen for the distinguished alumnae.',
    hasSizes: false,
    variants: [
      {
        color: 'Black/Gold',
        colorHex: '#1a1a1a',
        images: [
          'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 100 }],
      },
    ],
  },

  {
    id: '6',
    name: 'Alumnae Cap',
    category: 'Apparel',
    price: 8000,
    image:
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    description: 'Stylish embroidered alumnae cap. One size fits most.',
    hasSizes: false,
    variants: [
      {
        color: 'Navy',
        colorHex: '#1b3a6b',
        images: [
          'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 10 }],
      },
      {
        color: 'Black',
        colorHex: '#1a1a1a',
        images: [
          'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 8 }],
      },
    ],
  },

  {
    id: '7',
    name: 'Alumnae Umbrella',
    category: 'Lifestyle Essentials',
    price: 15000,
    image:
      'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80',
    description: 'Wind-resistant travel umbrella with alumnae branding.',
    hasSizes: false,
    variants: [
      {
        color: 'Navy Blue',
        colorHex: '#1b3a6b',
        images: [
          'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 30 }],
      },
    ],
  },

  {
    id: '8',
    name: 'Alumnae Travel Bag',
    category: 'Accessories',
    price: 35000,
    image:
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80',
    description: 'Spacious travel bag for the modern alumnae on the go.',
    generalImages: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    ],
    hasSizes: false,
    variants: [
      {
        color: 'Brown',
        colorHex: '#8B5E3C',
        images: [
          'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 10 }],
      },
      {
        color: 'Grey',
        colorHex: '#808080',
        images: [
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 7 }],
      },
    ],
  },

  {
    id: '9',
    name: 'Alumnae Pin Badge',
    category: 'Collectibles & Memorabilia',
    price: 12000,
    image:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80',
    description: 'Collectible alumnae pin badge. Limited edition memorabilia.',
    hasSizes: false,
    variants: [
      {
        color: 'Silver',
        colorHex: '#C0C0C0',
        images: [
          'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 50 }],
      },
    ],
  },

  {
    id: '10',
    name: 'Alumnae Sun Hat',
    category: 'Apparel',
    price: 10500,
    image:
      'https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?auto=format&fit=crop&w=800&q=80',
    description: 'Wide-brim sun hat. Elegant style for outdoor alumnae events.',
    hasSizes: false,
    variants: [
      {
        color: 'Beige',
        colorHex: '#d4b896',
        images: [
          'https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 22 }],
      },
    ],
  },

  {
    id: '11',
    name: 'Alumnae Coffee Mug',
    category: 'Drinkware',
    price: 6000,
    image:
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80',
    description: 'Start your morning with the alumnae spirit. Classic ceramic mug.',
    hasSizes: false,
    variants: [
      {
        color: 'White',
        colorHex: '#f5f5f5',
        images: [
          'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 60 }],
      },
    ],
  },

  {
    id: '12',
    name: 'Alumnae Journal',
    category: 'Office & Stationery',
    price: 8500,
    image:
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80',
    description: 'Premium hardcover journal for thoughts, plans, and memories.',
    hasSizes: false,
    variants: [
      {
        color: 'Navy',
        colorHex: '#1b3a6b',
        images: [
          'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 45 }],
      },
    ],
  },
];