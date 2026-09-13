import { MenuItem, DailyDeal, DiscountCode, OrderRecord } from '../types';

export const RESTAURANT_CONFIG = {
  name: 'EATISTAN',
  tagline: 'Pir Jo Goth • POS Billing',
  branch: 'Pir Jo Goth Main Branch',
  address: 'Near Main Chowk, Pir Jo Goth, Sindh',
  phone: '03058483082',
  whatsappNumber: '923058483082',
  currency: 'Rs',
  timings: '11:00 AM – 02:00 AM',
  taxRatePercent: 0
};

export const MENU_ITEMS: MenuItem[] = [
  // -------------------------------------------------------------
  // 1. CLASSIC PIZZAS
  // -------------------------------------------------------------
  {
    id: 'pizza-fajita',
    name: 'Fajita Pizza',
    category: 'classic_pizza',
    description: 'Tender marinated fajita chicken cubes, green peppers, sweet onions & 100% pure melted mozzarella.',
    basePrice: 450,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    sizes: [
      { name: 'Small', priceModifier: 0 },
      { name: 'Medium', priceModifier: 450 }, // 450 + 450 = 900
      { name: 'Large', priceModifier: 850 }   // 450 + 850 = 1300
    ],
    available: true
  },
  {
    id: 'pizza-bbq-tikka',
    name: 'Bar B.Q Tika Pizza',
    category: 'classic_pizza',
    description: 'Charcoal grilled spicy chicken tikka chunks with rings of onions and rich signature BBQ pizza sauce.',
    basePrice: 450,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    sizes: [
      { name: 'Small', priceModifier: 0 },
      { name: 'Medium', priceModifier: 450 }, // 900
      { name: 'Large', priceModifier: 850 }   // 1300
    ],
    available: true
  },
  {
    id: 'pizza-veggie',
    name: 'Veggie Pizza',
    category: 'classic_pizza',
    description: 'Fresh sliced mushrooms, bell peppers, tomatoes, black olives, sweet corn & mozzarella cheese.',
    basePrice: 450,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    sizes: [
      { name: 'Small', priceModifier: 0 },
      { name: 'Medium', priceModifier: 450 },
      { name: 'Large', priceModifier: 850 }
    ],
    available: true
  },
  {
    id: 'pizza-malai-tikka',
    name: 'Malai Tika Pizza',
    category: 'classic_pizza',
    description: 'Mouthwatering creamy malai boti chicken chunks, white garlic herb drizzle and rich mozzarella.',
    basePrice: 450,
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    sizes: [
      { name: 'Small', priceModifier: 0 },
      { name: 'Medium', priceModifier: 450 },
      { name: 'Large', priceModifier: 850 }
    ],
    available: true
  },
  {
    id: 'pizza-tandori-blast',
    name: 'Tandori Blast Pizza',
    category: 'classic_pizza',
    description: 'Fiery hot tandoori chicken chunks, spicy jalapeños, red onions and extra kick of traditional spices.',
    basePrice: 500,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
    isSpicy: true,
    sizes: [
      { name: 'Small', priceModifier: 0 },
      { name: 'Medium', priceModifier: 500 }, // 1000
      { name: 'Large', priceModifier: 900 }   // 1400
    ],
    available: true
  },
  {
    id: 'pizza-afghani-feast',
    name: 'Afghani Feast Pizza',
    category: 'classic_pizza',
    description: 'Mild spiced authentic Afghani chicken, mild herbs, sweet peppers and creamy mozzarella.',
    basePrice: 500,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    sizes: [
      { name: 'Small', priceModifier: 0 },
      { name: 'Medium', priceModifier: 500 },
      { name: 'Large', priceModifier: 900 }
    ],
    available: true
  },
  {
    id: 'pizza-peri-peri',
    name: 'Peri Peri Pizza',
    category: 'classic_pizza',
    description: 'Portuguese peri-peri seasoned juicy chicken, spicy jalapeños, capsicum and tangy peri sauce.',
    basePrice: 500,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    isSpicy: true,
    sizes: [
      { name: 'Small', priceModifier: 0 },
      { name: 'Medium', priceModifier: 500 },
      { name: 'Large', priceModifier: 900 }
    ],
    available: true
  },

  // -------------------------------------------------------------
  // 2. SPECIALTY PIZZAS
  // -------------------------------------------------------------
  {
    id: 'pizza-calzone',
    name: 'Calzone Pizza',
    category: 'specialty_pizza',
    description: 'Italian oven-baked folded turnover pizza stuffed with spiced chicken, herbs and melted cheese.',
    basePrice: 400,
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&q=80',
    sizes: [
      { name: 'Small', priceModifier: 0 },
      { name: 'Medium', priceModifier: 400 }, // 800
      { name: 'Large', priceModifier: 700 }   // 1100
    ],
    available: true
  },
  {
    id: 'pizza-cheese-lover',
    name: 'Cheese Lover Pizza',
    category: 'specialty_pizza',
    description: 'Triple layer of shredded mozzarella, cheddar, and gouda cheeses melted to golden bubbly perfection.',
    basePrice: 600,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    sizes: [
      { name: 'Small', priceModifier: 0 },
      { name: 'Medium', priceModifier: 600 }, // 1200
      { name: 'Large', priceModifier: 1200 }  // 1800
    ],
    available: true
  },
  {
    id: 'pizza-creamy-hot',
    name: 'Creamy Hot Pizza',
    category: 'specialty_pizza',
    description: 'Hot jalapeño base paired with silky rich creamy sauce, chicken chunks, sweet onions and oregano.',
    basePrice: 600,
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=600&q=80',
    isSpicy: true,
    sizes: [
      { name: 'Small', priceModifier: 0 },
      { name: 'Medium', priceModifier: 600 }, // 1200
      { name: 'Large', priceModifier: 1100 }  // 1700
    ],
    available: true
  },
  {
    id: 'pizza-supreme',
    name: 'Supreme Pizza',
    category: 'specialty_pizza',
    description: 'Loaded with seasoned chicken boti, smoked sausages, mushrooms, black olives, onions and peppers.',
    basePrice: 650,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    sizes: [
      { name: 'Small', priceModifier: 0 },
      { name: 'Medium', priceModifier: 550 }, // 1200
      { name: 'Large', priceModifier: 1050 }  // 1700
    ],
    available: true
  },
  {
    id: 'pizza-peperoni',
    name: 'Peperoni Pizza',
    category: 'specialty_pizza',
    description: 'Classic crispy seasoned beef pepperoni rounds, Italian tomato concasse and full mozzarella cover.',
    basePrice: 650,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
    sizes: [
      { name: 'Small', priceModifier: 0 },
      { name: 'Medium', priceModifier: 650 }, // 1300
      { name: 'Large', priceModifier: 1250 }  // 1900
    ],
    available: true
  },
  {
    id: 'pizza-super-supreme',
    name: 'Super Supreme Pizza',
    category: 'specialty_pizza',
    description: 'Eatistan all-star pizza featuring double meat, double toppings, premium cheese and Italian herbs.',
    basePrice: 650,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    sizes: [
      { name: 'Small', priceModifier: 0 },
      { name: 'Medium', priceModifier: 650 }, // 1300
      { name: 'Large', priceModifier: 1150 }  // 1800
    ],
    available: true
  },
  {
    id: 'pizza-lava-burst',
    name: 'Lava (Cheese Burst) Pizza',
    category: 'specialty_pizza',
    description: 'Molten liquid cheese overflowing inside the crust, topped with spiced chicken, olives and mushrooms.',
    basePrice: 800,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    sizes: [
      { name: 'Small', priceModifier: 0 },
      { name: 'Medium', priceModifier: 800 },  // 1600
      { name: 'Large', priceModifier: 1600 }   // 2400
    ],
    available: true
  },
  {
    id: 'pizza-crown-crust',
    name: 'Crown Crust Special',
    category: 'specialty_pizza',
    description: 'Scalloped crown-shaped crust pockets filled with cream cheese or kabab balls, centered with loaded toppings.',
    basePrice: 1200,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    sizes: [
      { name: 'Medium', priceModifier: 0 },   // 1200
      { name: 'Large', priceModifier: 500 }   // 1700
    ],
    available: true
  },

  // -------------------------------------------------------------
  // 3. BURGERS & ZINGERS
  // -------------------------------------------------------------
  {
    id: 'burger-zinger',
    name: 'Zinger Burger',
    category: 'burgers',
    description: 'Golden crunchy fried chicken breast fillet, iceberg lettuce & spicy signature mayo in toasted sesame bun.',
    basePrice: 380,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    isSpicy: true,
    available: true
  },
  {
    id: 'burger-veggie',
    name: 'Veggie Burger',
    category: 'burgers',
    description: 'Crispy seasoned vegetable and herb patty, fresh garden vegetables, creamy mayo and pickled cucumbers.',
    basePrice: 380,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'burger-grill',
    name: 'Grill Burger',
    category: 'burgers',
    description: 'Fire-grilled tender chicken fillet with smoky BBQ glaze, crisp lettuce and caramelized onions.',
    basePrice: 400,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'burger-veggie-cheese',
    name: 'Veggie Cheese Hot Burger',
    category: 'burgers',
    description: 'Crispy spiced vegetable patty topped with melted cheddar cheese slice, hot chili sauce and fresh salad.',
    basePrice: 400,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'burger-zinger-cheese',
    name: 'Zinger Cheese Hot Burger',
    category: 'burgers',
    description: 'Crunchy zinger fillet crowned with molten cheddar cheese, pickled jalapeño rings and chili garlic sauce.',
    basePrice: 500,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    isSpicy: true,
    available: true
  },
  {
    id: 'burger-monster',
    name: 'Monster Burger',
    category: 'burgers',
    description: 'Double stacked jumbo patties, signature secret sauce, pickles, shredded lettuce and double toasted buns.',
    basePrice: 550,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    available: true
  },
  {
    id: 'burger-monster-cheese',
    name: 'Monster Cheese Burger',
    category: 'burgers',
    description: 'The ultimate king burger: Double patties stacked with double melted cheddar cheese, fried egg and special dressing.',
    basePrice: 650,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    available: true
  },

  // -------------------------------------------------------------
  // 4. FRIED CHICKEN & WINGS
  // -------------------------------------------------------------
  {
    id: 'chicken-qtr-half',
    name: 'Qtr Breast (Half Portion)',
    category: 'fried_chicken',
    description: 'Crispy golden fried quarter breast piece served with garlic dip and fresh dinner roll.',
    basePrice: 350,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'chicken-hot-wing',
    name: 'Hot Wing (06 Pieces)',
    category: 'fried_chicken',
    description: '6 pieces crunchy hot chicken wings tossed in secret spice rub with cool dipping sauce.',
    basePrice: 450,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    isSpicy: true,
    available: true
  },
  {
    id: 'chicken-qtr-leg',
    name: 'Qtr Breast (Leg Piece)',
    category: 'fried_chicken',
    description: 'Juicy tender golden fried chicken leg quarter with fries and homemade garlic mayo.',
    basePrice: 500,
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'chicken-qtr-chest',
    name: 'Qtr Breast (Chest Piece)',
    category: 'fried_chicken',
    description: 'Generous meaty chicken chest quarter fried to deep crunchy crispiness.',
    basePrice: 550,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    available: true
  },
  {
    id: 'chicken-hot-shot',
    name: 'Hot Shot (05 Pieces)',
    category: 'fried_chicken',
    description: '5 pieces boneless tender crunchy chicken bites packed with spicy seasonings.',
    basePrice: 550,
    image: 'https://images.unsplash.com/photo-1527477378393-4a11f5922e37?auto=format&fit=crop&w=600&q=80',
    available: true
  },

  // -------------------------------------------------------------
  // 5. WRAPS & PARATHAS
  // -------------------------------------------------------------
  {
    id: 'roll-chicken',
    name: 'Chicken Roll',
    category: 'wraps',
    description: 'Charcoal grilled chicken pieces with onions and green chutney wrapped in crispy golden paratha.',
    basePrice: 250,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'roll-chatni',
    name: 'Chatni Roll',
    category: 'wraps',
    description: 'Grilled spiced chicken drizzled with tangy tamarind mint chatni and crunchy onion slices.',
    basePrice: 250,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'roll-mayo',
    name: 'Mayo Roll',
    category: 'wraps',
    description: 'Smoky chicken chunks layered with thick creamy mayonnaise in fresh flaky paratha.',
    basePrice: 300,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'roll-bbq',
    name: 'BB.Q Roll',
    category: 'wraps',
    description: 'Authentic seekh BBQ chicken coated in sweet & smoky barbecue sauce.',
    basePrice: 300,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'roll-mayo-garlic',
    name: 'Mayo Garlic Roll',
    category: 'wraps',
    description: 'Hot chicken strips smothered in homemade garlic mayo sauce in hot crispy paratha.',
    basePrice: 350,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    available: true
  },
  {
    id: 'roll-kabab',
    name: 'Kabab Roll',
    category: 'wraps',
    description: 'Spiced minced chicken kabab skewer rolled with sliced onions and secret sauce.',
    basePrice: 350,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'roll-pizza-paratha',
    name: 'Pizza Paratha',
    category: 'wraps',
    description: 'Fusion specialty: Paratha filled with pizza sauce, melted mozzarella, chicken tikka and herbs.',
    basePrice: 380,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    available: true
  },
  {
    id: 'roll-chicken-cheese',
    name: 'Chicken Cheese Roll',
    category: 'wraps',
    description: 'Tender chicken boti with generous melted mozzarella and cheddar cheese inside paratha.',
    basePrice: 380,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    available: true
  },
  {
    id: 'roll-zinger',
    name: 'Zinger Roll',
    category: 'wraps',
    description: 'Crispy crunchy zinger chicken strips, lettuce, garlic mayo rolled in crispy flaky paratha.',
    basePrice: 380,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    available: true
  },

  // -------------------------------------------------------------
  // 6. PASTA & NOODLES
  // -------------------------------------------------------------
  {
    id: 'pasta-macaroni',
    name: 'Macaroni',
    category: 'pasta',
    description: 'Desi spiced elbow macaroni with sauteed chicken bits, capsicum and tomato herb sauce.',
    basePrice: 400,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    sizes: [
      { name: 'Regular', priceModifier: 0 },
      { name: 'Large', priceModifier: 300 } // 700
    ],
    available: true
  },
  {
    id: 'pasta-white',
    name: 'White Pasta',
    category: 'pasta',
    description: 'Silky rich white bechamel cream sauce with tender penne pasta, mushrooms and chicken.',
    basePrice: 450,
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d628169e?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    sizes: [
      { name: 'Regular', priceModifier: 0 },
      { name: 'Large', priceModifier: 450 } // 900
    ],
    available: true
  },
  {
    id: 'pasta-red',
    name: 'Red Pasta',
    category: 'pasta',
    description: 'Italian style red pomodoro sauce with aromatic basil, chicken chunks and parmesan finish.',
    basePrice: 450,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    sizes: [
      { name: 'Regular', priceModifier: 0 },
      { name: 'Large', priceModifier: 350 } // 800
    ],
    available: true
  },
  {
    id: 'pasta-creamy-hot',
    name: 'Creamy Hot Pasta',
    category: 'pasta',
    description: 'Spicy chili infused creamy garlic sauce, tender chicken strips and mozzarella gratin.',
    basePrice: 450,
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d628169e?auto=format&fit=crop&w=600&q=80',
    isSpicy: true,
    sizes: [
      { name: 'Regular', priceModifier: 0 },
      { name: 'Large', priceModifier: 350 } // 800
    ],
    available: true
  },
  {
    id: 'pasta-alfredo',
    name: 'Alfredo Pasta',
    category: 'pasta',
    description: 'Classic rich fettuccine or penne in creamy parmesan butter sauce with sliced grilled chicken.',
    basePrice: 650,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    sizes: [
      { name: 'Regular', priceModifier: 0 },
      { name: 'Large', priceModifier: 450 } // 1100
    ],
    available: true
  },
  {
    id: 'pasta-lasagna',
    name: 'Lasagna',
    category: 'pasta',
    description: 'Layers of tender pasta sheets, rich bolognese chicken sauce, creamy bechamel and baked golden cheese.',
    basePrice: 650,
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    sizes: [
      { name: 'Regular', priceModifier: 0 },
      { name: 'Large', priceModifier: 450 } // 1100
    ],
    available: true
  },

  // -------------------------------------------------------------
  // 7. FRIES & SIDES
  // -------------------------------------------------------------
  {
    id: 'fries-plain',
    name: 'Plain Fries',
    category: 'sides',
    description: 'Golden, crispy crinkle cut potato fries lightly salted.',
    basePrice: 150,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    sizes: [
      { name: 'Small', priceModifier: 0 },
      { name: 'Large', priceModifier: 50 } // 200
    ],
    available: true
  },
  {
    id: 'fries-mayo',
    name: 'Mayo Fries',
    category: 'sides',
    description: 'Hot crisp fries generously drizzled with signature creamy garlic mayo.',
    basePrice: 300,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
    sizes: [
      { name: 'Small', priceModifier: 0 },
      { name: 'Large', priceModifier: 200 } // 500
    ],
    available: true
  },
  {
    id: 'fries-bbq',
    name: 'BB.Q Fries',
    category: 'sides',
    description: 'Crinkle cut fries topped with smoky barbecue sauce and seasoned chicken bits.',
    basePrice: 350,
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80',
    sizes: [
      { name: 'Small', priceModifier: 0 },
      { name: 'Large', priceModifier: 250 } // 600
    ],
    available: true
  },
  {
    id: 'fries-loaded',
    name: 'Loaded Fries',
    category: 'sides',
    description: 'Crispy fries smothered in warm cheese sauce, spiced chicken cubes, jalapeños & garlic dip.',
    basePrice: 400,
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    sizes: [
      { name: 'Small', priceModifier: 0 },
      { name: 'Large', priceModifier: 300 } // 700
    ],
    available: true
  },
  {
    id: 'fries-pizza',
    name: 'Pizza Fries',
    category: 'sides',
    description: 'Fries baked with pizza sauce, melted mozzarella, chicken tikka chunks and oregano herbs.',
    basePrice: 450,
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    sizes: [
      { name: 'Small', priceModifier: 0 },
      { name: 'Large', priceModifier: 250 } // 700
    ],
    available: true
  },
  {
    id: 'fries-bbq-loaded',
    name: 'BB.Q Loaded Chicken Fries',
    category: 'sides',
    description: 'Double portion fries loaded with BBQ boti chicken, melted cheese, mayo garlic and jalapeños.',
    basePrice: 550,
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    sizes: [
      { name: 'Small', priceModifier: 0 },
      { name: 'Large', priceModifier: 350 } // 900
    ],
    available: true
  },

  // -------------------------------------------------------------
  // 8. BEVERAGES & NEXT COLA
  // -------------------------------------------------------------
  {
    id: 'drink-next-cola-can',
    name: 'Next Cola 345ml (Can)',
    category: 'drinks',
    description: 'Chilled refreshing Next Cola in 345ml can.',
    basePrice: 90,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    sizes: [
      { name: 'Chilled Can 345ml', priceModifier: 0 },
      { name: 'Twin Pack (2 Cans)', priceModifier: 80 }
    ],
    available: true
  },
  {
    id: 'drink-next-cola-family',
    name: 'Next Cola 1.5 Liter (Family Bottle)',
    category: 'drinks',
    description: 'Chilled 1.5L bottle of Next Cola for gatherings and family sharing.',
    basePrice: 220,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'drink-pakola',
    name: 'Pakola Ice Cream Soda 345ml',
    category: 'drinks',
    description: 'Classic Pakistani green cream soda flavor.',
    basePrice: 90,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'drink-mint-margarita',
    name: 'Fresh Mint Lemonade Cooler',
    category: 'drinks',
    description: 'Fresh crushed mint leaves, lemon juice, black salt & chilled soda.',
    basePrice: 180,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'drink-water',
    name: 'Mineral Water (500ml)',
    category: 'drinks',
    description: 'Chilled clean mineral drinking water.',
    basePrice: 60,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
    available: true
  }
];

export const DAILY_DEALS: DailyDeal[] = [
  {
    id: 'deal-azadi',
    title: 'Eatistan Special Deal 1',
    tag: 'Popular Saver 🔥',
    subtitle: '1 Zinger Burger + 1 Regular Fries + 1 Next Cola Can',
    dealPrice: 550,
    originalPrice: 620,
    itemsIncluded: [
      '1x Zinger Burger (Crispy Fillet)',
      '1x Plain Fries (Small Box)',
      '1x Next Cola 345ml Can'
    ],
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=80',
    validTag: 'Super Saver • Save Rs 70',
    active: true,
    popular: true
  },
  {
    id: 'deal-friday',
    title: 'Pir Jo Goth Pizza Duo',
    tag: 'Pizza Combo 🍕',
    subtitle: '1 Medium Chicken Fajita Pizza + 1 Loaded Fries + 2 Next Colas',
    dealPrice: 1399,
    originalPrice: 1720,
    itemsIncluded: [
      '1x Medium Chicken Fajita Pizza (10")',
      '1x Loaded Cheesy Fries Box',
      '2x Chilled Next Cola 345ml'
    ],
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
    validTag: 'Special Combo • Save Rs 321',
    active: true,
    popular: true
  },
  {
    id: 'deal-midnight',
    title: 'Twin Zinger Feast',
    tag: 'Burger Duo 🍔',
    subtitle: '2 Zinger Cheese Burgers + 1 Mayo Fries + 2 Next Colas',
    dealPrice: 1199,
    originalPrice: 1480,
    itemsIncluded: [
      '2x Zinger Cheese Hot Burgers',
      '1x Mayo Fries Box',
      '2x Next Cola 345ml'
    ],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    validTag: 'Best for 2 • Save Rs 281',
    active: true
  },
  {
    id: 'deal-broast-duo',
    title: 'Eatistan Family Feast',
    tag: 'Mega Deal 🍗🍕',
    subtitle: '1 Large Super Supreme Pizza + 1 Zinger Roll + 1.5L Next Cola',
    dealPrice: 2199,
    originalPrice: 2600,
    itemsIncluded: [
      '1x Large Super Supreme Pizza (13")',
      '1x Zinger Roll (Crispy Paratha)',
      '1x Next Cola 1.5L Family Bottle'
    ],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    validTag: 'Family Platter • Save Rs 401',
    active: true
  }
];

export const DISCOUNT_CODES: DiscountCode[] = [
  {
    code: 'EATISTAN10',
    description: '10% Off on orders above Rs 600',
    type: 'percentage',
    value: 10,
    minOrder: 600
  },
  {
    code: 'WELCOME',
    description: 'Flat Rs 100 Off on orders above Rs 800',
    type: 'flat',
    value: 100,
    minOrder: 800
  },
  {
    code: 'SPECIAL50',
    description: 'Flat Rs 50 Off on orders above Rs 400',
    type: 'flat',
    value: 50,
    minOrder: 400
  },
  {
    code: 'FREEDELIVERY',
    description: 'Free Delivery in Pir Jo Goth on orders above Rs 700',
    type: 'free_delivery',
    value: 100,
    minOrder: 700
  }
];

export const DELIVERY_AREAS = [
  { name: 'Pir Jo Goth City / Main Bazaar', fee: 50, eta: '15-25 mins' },
  { name: 'Station Road & Railway Colony', fee: 60, eta: '20-30 mins' },
  { name: 'Hospital Road & Mohalla Memon', fee: 50, eta: '15-25 mins' },
  { name: 'High School & College Area', fee: 50, eta: '15-25 mins' },
  { name: 'Bachal Shah Mohalla', fee: 70, eta: '20-30 mins' },
  { name: 'Outskirts / Surrounding Villages', fee: 120, eta: '30-45 mins' },
  { name: 'Dine-In Table Service', fee: 0, eta: 'Instant Service' },
  { name: 'Takeaway Counter Pickup', fee: 0, eta: '10-15 mins' }
];

export const INITIAL_SAMPLE_ORDERS: OrderRecord[] = [
  {
    id: 'ord-seed-1041',
    orderNumber: '1041',
    timestamp: Date.now() - 1000 * 60 * 45, // 45 mins ago
    dateFormatted: new Date(Date.now() - 1000 * 60 * 45).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    customer: {
      name: 'Dr. Tariq Memon',
      phone: '03001234567',
      orderType: 'delivery',
      deliveryArea: 'Hospital Road & Mohalla Memon',
      customAddress: 'Near Civil Hospital, House #12, Street 3',
      tableNumber: '',
      paymentMethod: 'cod',
      notes: 'Please send extra garlic sauce and napkins.'
    },
    items: [
      {
        cartItemId: 'item-fajita-med',
        menuItemId: 'pizza-fajita',
        name: 'Fajita Pizza',
        category: 'classic_pizza',
        unitPrice: 900,
        quantity: 1,
        selectedSize: 'Medium'
      },
      {
        cartItemId: 'item-zinger-burger',
        menuItemId: 'burger-zinger',
        name: 'Zinger Burger',
        category: 'burgers',
        unitPrice: 380,
        quantity: 2
      },
      {
        cartItemId: 'item-next-cola',
        menuItemId: 'drink-next-cola-family',
        name: 'Next Cola 1.5 Liter (Family Bottle)',
        category: 'drinks',
        unitPrice: 220,
        quantity: 1
      }
    ],
    subtotal: 1880,
    discountAmount: 100,
    appliedCoupon: 'WELCOME',
    discountDetails: 'Promo Code WELCOME (-Rs 100)',
    deliveryFee: 50,
    taxAmount: 0,
    total: 1830,
    status: 'completed',
    mode: 'admin',
    cashierName: 'Counter Staff'
  },
  {
    id: 'ord-seed-1042',
    orderNumber: '1042',
    timestamp: Date.now() - 1000 * 60 * 20, // 20 mins ago
    dateFormatted: new Date(Date.now() - 1000 * 60 * 20).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    customer: {
      name: 'Naveed Ahmed',
      phone: '03058483082',
      orderType: 'dinein',
      deliveryArea: 'Dine-In Table Service',
      customAddress: '',
      tableNumber: 'Table 4',
      paymentMethod: 'cod',
      notes: 'Make zinger burger extra crispy.'
    },
    items: [
      {
        cartItemId: 'item-deal-azadi',
        dealId: 'deal-azadi',
        name: 'Eatistan Special Deal 1',
        category: 'deals',
        unitPrice: 550,
        quantity: 2,
        isDeal: true,
        dealTag: 'Popular Saver 🔥',
        specialNote: '1x Zinger Burger, 1x Plain Fries, 1x Next Cola Can'
      },
      {
        cartItemId: 'item-loaded-fries',
        menuItemId: 'fries-loaded',
        name: 'Loaded Fries',
        category: 'sides',
        unitPrice: 400,
        quantity: 1,
        selectedSize: 'Small'
      }
    ],
    subtotal: 1500,
    discountAmount: 50,
    adminDiscount: {
      type: 'flat',
      value: 50
    },
    discountDetails: 'Cashier Custom Flat Discount (-Rs 50)',
    deliveryFee: 0,
    taxAmount: 0,
    total: 1450,
    status: 'preparing',
    mode: 'admin',
    cashierName: 'Ali Khan (Admin)'
  }
];
