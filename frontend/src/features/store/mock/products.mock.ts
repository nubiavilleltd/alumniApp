import { Product } from "../types/product.types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Official Alumnae Premium T-Shirt',
    category: 'Apparel',
    price: 12500,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80',
    description: 'Premium cotton alumnae branded t-shirt with modern fit.',
    hasSizes: true,
    variants: [
      {
        color: 'White',
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80',
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1400&q=80',
        ],
        sizes: [
          { size: 'S', stock: 12 },
          { size: 'M', stock: 8 },
          { size: 'L', stock: 5 },
        ],
      },
      {
        color: 'Black',
        images: [
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1400&q=80',
        ],
        sizes: [
          { size: 'M', stock: 6 },
          { size: 'L', stock: 4 },
        ],
      },
    ],
  },

  {
    id: '2',
    name: 'Alumnae Signature Keyholder',
    category: 'Accessories',
    price: 3500,
    image:
      'https://images.unsplash.com/photo-1619995745882-f4128ac82ad6?auto=format&fit=crop&w=1400&q=80',
    description: 'Elegant alumnae engraved keyholder.',
    hasSizes: false,
    variants: [
      {
        color: 'Gold',
        images: [
          'https://images.unsplash.com/photo-1619995745882-f4128ac82ad6?auto=format&fit=crop&w=1400&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 40 }],
      },
    ],
  },

  {
    id: '3',
    name: 'Alumnae Premium Tote Bag',
    category: 'Accessories',
    price: 9500,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80',
    description: 'Durable tote bag for everyday elegance.',
    hasSizes: false,
    variants: [
      {
        color: 'Beige',
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 20 }],
      },
      {
        color: 'Black',
        images: [
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1400&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 14 }],
      },
    ],
  },

  {
    id: '4',
    name: 'Alumnae Insulated Tumbler',
    category: 'Drinkware',
    price: 12000,
    image:
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=1400&q=80',
    description: 'Keeps your drinks hot or cold for hours.',
    hasSizes: false,
    variants: [
      {
        color: 'Silver',
        images: [
          'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=1400&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 25 }],
      },
    ],
  },

  {
    id: '5',
    name: 'Alumnae Luxury Pen Set',
    category: 'Office & Stationery',
    price: 3700,
    image:
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=1400&q=80',
    description: 'Premium writing experience for alumnae.',
    hasSizes: false,
    variants: [
      {
        color: 'Black',
        images: [
          'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=1400&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 100 }],
      },
    ],
  },

  {
    id: '6',
    name: 'Alumnae Classic Cap',
    category: 'Apparel',
    price: 8000,
    image:
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1400&q=80',
    description: 'Stylish embroidered alumnae cap.',
    hasSizes: true,
    variants: [
      {
        color: 'Black',
        images: [
          'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1400&q=80',
        ],
        sizes: [
          { size: 'M', stock: 10 },
          { size: 'L', stock: 8 },
        ],
      },
      {
        color: 'Navy',
        images: [
          'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1400&q=80',
        ],
        sizes: [
          { size: 'M', stock: 6 },
          { size: 'L', stock: 4 },
        ],
      },
    ],
  },

  {
    id: '7',
    name: 'Alumnae Travel Umbrella',
    category: 'Lifestyle Essentials',
    price: 15000,
    image:
      'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1400&q=80',
    description: 'Wind-resistant travel umbrella.',
    hasSizes: false,
    variants: [
      {
        color: 'Navy Blue',
        images: [
          'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1400&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 30 }],
      },
    ],
  },

  {
    id: '8',
    name: 'Alumnae Weekend Duffel Bag',
    category: 'Accessories',
    price: 35000,
    image:
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=1400&q=80',
    description: 'Spacious travel duffel bag.',
    hasSizes: false,
    variants: [
      {
        color: 'Brown',
        images: [
          'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=1400&q=80',
        ],
        sizes: [{ size: 'One Size', stock: 10 }],
      },
    ],
  },
];