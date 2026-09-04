import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database...");
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.restaurant.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Seeding restaurants & menu items...");

  // 1. Bella Italia (Italian)
  await prisma.restaurant.create({
    data: {
      name: "Bella Italia",
      slug: "bella-italia",
      address: "124 Culinary Boulevard, Sector 4",
      rating: 4.8,
      cuisine: "Italian, Pasta, Pizza",
      coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
      deliveryTime: 25,
      isPremium: true,
      menuItems: {
        create: [
          {
            name: "Caprese Bruschetta",
            description: "Toasted sourdough bread topped with ripe cherry tomatoes, fresh mozzarella, sweet basil, and balsamic glaze drizzle.",
            price: 9.99,
            category: "Starters",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1572656631137-7935297eff55?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Classic Margherita Pizza",
            description: "Stone-baked thin crust pizza topped with fresh tomato sauce, premium buffalo mozzarella cheese, fresh basil leaves, and olive oil.",
            price: 14.99,
            category: "Main Course",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Fettuccine Alfredo with Mushrooms",
            description: "Rich and creamy Parmigiano-Reggiano sauce tossed with fettuccine pasta, sautéed wild mushrooms, and garlic.",
            price: 16.99,
            category: "Main Course",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Chicken Parmigiana",
            description: "Breaded chicken breast fried crispy, covered in rich marinara sauce and melted mozzarella cheese, served with spaghetti.",
            price: 18.99,
            category: "Main Course",
            isVeg: false,
            imageUrl: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Traditional Tiramisu",
            description: "Delicate espresso-soaked ladyfingers layered with fresh mascarpone cheese custard, dusted with cocoa powder.",
            price: 7.99,
            category: "Desserts",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "San Pellegrino Sparkling Water",
            description: "Chilled premium Italian sparkling natural mineral water (750ml).",
            price: 3.49,
            category: "Beverages",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1608885898957-a599fb16de17?w=500&auto=format&fit=crop&q=60"
          }
        ]
      }
    }
  });

  // 2. Taj Mahal Bistro (Indian)
  await prisma.restaurant.create({
    data: {
      name: "Taj Mahal Bistro",
      slug: "taj-mahal-bistro",
      address: "87 Curry Road, Food District",
      rating: 4.9,
      cuisine: "Indian, Curry, Tandoori",
      coverImage: "https://images.unsplash.com/photo-1585938338392-50a59970d2ee?w=800&auto=format&fit=crop&q=80",
      deliveryTime: 35,
      isPremium: true,
      menuItems: {
        create: [
          {
            name: "Crispy Vegetable Samosas",
            description: "Spiced potato and peas stuffed inside flaky pastry sheets, fried golden brown, served with tamarind chutney.",
            price: 5.99,
            category: "Starters",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Butter Chicken",
            description: "Tender tandoori-roasted boneless chicken simmered in a creamy, buttery tomato sauce infused with aromatic spices.",
            price: 17.99,
            category: "Main Course",
            isVeg: false,
            imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Paneer Tikka Masala",
            description: "Grilled cubes of fresh cottage cheese cooked in a spicy, rich onion-tomato masala curry with bell peppers.",
            price: 15.99,
            category: "Main Course",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Garlic Butter Naan",
            description: "Soft, leavened flatbread brushed with garlic and butter, cooked fresh in a clay tandoor oven.",
            price: 3.49,
            category: "Main Course",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Chilled Mango Lassi",
            description: "Smooth, sweet, and refreshing yogurt drink blended with ripe Alphonso mangoes and cardamom.",
            price: 4.49,
            category: "Beverages",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Warm Gulab Jamun",
            description: "Soft milk solids dumplings fried and soaked in sweet rose-infused cardamom sugar syrup (3 pieces).",
            price: 6.99,
            category: "Desserts",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60"
          }
        ]
      }
    }
  });

  // 3. Golden Dragon (Chinese)
  await prisma.restaurant.create({
    data: {
      name: "Golden Dragon",
      slug: "golden-dragon",
      address: "44 Chinatown Court, Main City",
      rating: 4.6,
      cuisine: "Chinese, Noodles, Dim Sum",
      coverImage: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80",
      deliveryTime: 30,
      isPremium: false,
      menuItems: {
        create: [
          {
            name: "Crispy Vegetable Spring Rolls",
            description: "Crisp outer pastry wrapped around shredded fresh cabbage, carrots, and mushrooms, served with sweet chili sauce.",
            price: 6.49,
            category: "Starters",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Kung Pao Chicken",
            description: "Stir-fried diced chicken with roasted peanuts, dry red chilies, bell peppers, and scallions in a savory, sweet, and spicy sauce.",
            price: 15.49,
            category: "Main Course",
            isVeg: false,
            imageUrl: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Authentic Mapo Tofu",
            description: "Fresh silken tofu cubes cooked in a fiery, hot Sichuan bean sauce with green onions and garlic.",
            price: 13.99,
            category: "Main Course",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Yangzhou Fried Rice",
            description: "Wok-tossed premium Jasmine rice loaded with scrambled eggs, chicken, sweet green peas, and scallions.",
            price: 12.99,
            category: "Main Course",
            isVeg: false,
            imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Chilled Jasmine Green Tea",
            description: "House-brewed unsweetened Jasmine green tea served cold.",
            price: 2.99,
            category: "Beverages",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60"
          }
        ]
      }
    }
  });

  // 4. Burger Craftsman (Fast Food / Burger)
  await prisma.restaurant.create({
    data: {
      name: "Burger Craftsman",
      slug: "burger-craftsman",
      address: "15 Junction Street, Downtown",
      rating: 4.7,
      cuisine: "Burgers, Fast Food, Wings",
      coverImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
      deliveryTime: 20,
      isPremium: false,
      menuItems: {
        create: [
          {
            name: "Truffle Parmesan Fries",
            description: "Gourmet cut golden fries tossed in black truffle oil, freshly grated Parmesan cheese, and chopped parsley.",
            price: 5.49,
            category: "Starters",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Classic Craftsman Cheeseburger",
            description: "Flame-grilled Angus beef patty, cheddar cheese, crisp butter lettuce, tomato, pickles, and our signature sauce on a toasted brioche bun.",
            price: 11.99,
            category: "Main Course",
            isVeg: false,
            imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Bacon Double Smash Burger",
            description: "Two smashed beef patties, double American cheese, crispy applewood smoked bacon, caramelized onions, and BBQ mayo.",
            price: 14.99,
            category: "Main Course",
            isVeg: false,
            imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Spicy Crispy Chicken Burger",
            description: "Buttermilk fried chicken breast, pepper jack cheese, spicy cajun coleslaw, and jalapeños on a toasted brioche bun.",
            price: 12.49,
            category: "Main Course",
            isVeg: false,
            imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Double Chocolate Milkshake",
            description: "Creamy vanilla soft-serve blended with rich dark Belgian chocolate fudge, topped with whipped cream.",
            price: 5.99,
            category: "Beverages",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60"
          }
        ]
      }
    }
  });

  // 5. The Green Garden (Healthy / Salad)
  await prisma.restaurant.create({
    data: {
      name: "The Green Garden",
      slug: "the-green-garden",
      address: "21 Wellness Way, Eco Park",
      rating: 4.8,
      cuisine: "Healthy, Salads, Wraps",
      coverImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
      deliveryTime: 25,
      isPremium: true,
      menuItems: {
        create: [
          {
            name: "Hummus & Warm Pita",
            description: "Creamy house-made chickpeas hummus topped with olive oil and paprika, served with toasted whole wheat pita bread.",
            price: 8.99,
            category: "Starters",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1577906096429-f73df2c3a228?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Quinoa Veggie Buddha Bowl",
            description: "Fluffy red quinoa topped with roasted sweet potato, steamed broccoli, edamame, avocado, and tahini ginger dressing.",
            price: 13.99,
            category: "Main Course",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Grilled Salmon Salad",
            description: "Fresh Atlantic salmon fillet grilled to perfection, served over a bed of baby spinach, cucumbers, and lemon dressing.",
            price: 17.49,
            category: "Main Course",
            isVeg: false,
            imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Organic Acai Berry Smoothie",
            description: "Blended organic acai berries, organic blueberries, bananas, and almond milk, served ice cold.",
            price: 6.99,
            category: "Beverages",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Chia Seed Berry Pudding",
            description: "Organic chia seeds soaked in coconut milk, topped with fresh strawberries, raspberries, and a drizzle of honey.",
            price: 6.49,
            category: "Desserts",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1541795795328-f073b763494e?w=500&auto=format&fit=crop&q=60"
          }
        ]
      }
    }
  });

  // 6. Sakura Sushi (Japanese)
  await prisma.restaurant.create({
    data: {
      name: "Sakura Sushi",
      slug: "sakura-sushi",
      address: "99 Kyoto Boulevard, Central District",
      rating: 4.9,
      cuisine: "Japanese, Sushi, Ramen",
      coverImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80",
      deliveryTime: 35,
      isPremium: true,
      menuItems: {
        create: [
          {
            name: "Salted Edamame",
            description: "Steamed green soybeans in pod, tossed with sea salt.",
            price: 4.99,
            category: "Starters",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Spicy Tuna Roll",
            description: "Fresh diced tuna, spicy mayo, and cucumber rolled in seasoned sushi rice and nori (8 pieces).",
            price: 12.99,
            category: "Main Course",
            isVeg: false,
            imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Rainbow Roll",
            description: "California roll topped with assorted fresh sashimi (tuna, salmon, yellowtail) and avocado (8 pieces).",
            price: 16.99,
            category: "Main Course",
            isVeg: false,
            imageUrl: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Vegetable Tempura Roll",
            description: "Crispy sweet potato, zucchini, and asparagus tempura rolled in rice and toasted sesame seeds (8 pieces).",
            price: 10.99,
            category: "Main Course",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Matcha Green Tea Ice Cream",
            description: "Chilled scoop of premium creamy green tea matcha flavored ice cream.",
            price: 5.99,
            category: "Desserts",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=500&auto=format&fit=crop&q=60"
          }
        ]
      }
    }
  });

  // 7. El Cantina (Mexican)
  await prisma.restaurant.create({
    data: {
      name: "El Cantina",
      slug: "el-cantina",
      address: "5 Plaza de Sol, Fiesta Heights",
      rating: 4.5,
      cuisine: "Mexican, Tacos, Burritos",
      coverImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
      deliveryTime: 30,
      isPremium: false,
      menuItems: {
        create: [
          {
            name: "Chips & Fresh Guacamole",
            description: "Crispy corn tortilla chips served with fresh hand-mashed avocado, tomatoes, onions, cilantro, and lime juice.",
            price: 7.99,
            category: "Starters",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Char-grilled Chicken Quesadilla",
            description: "Large flour tortilla filled with grilled chicken strips, melted pepper jack and cheddar cheese, served with sour cream.",
            price: 12.99,
            category: "Main Course",
            isVeg: false,
            imageUrl: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Street Carne Asada Tacos",
            description: "Three soft corn tortillas topped with grilled marinated steak, diced sweet onions, chopped cilantro, and salsa (3 pieces).",
            price: 13.99,
            category: "Main Course",
            isVeg: false,
            imageUrl: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Black Bean & Roasted Corn Burrito",
            description: "Warm flour tortilla loaded with black beans, corn, rice, salsa, guacamole, and sour cream.",
            price: 11.99,
            category: "Main Course",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1626700051175-6518c4793fde?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Horchata",
            description: "Sweet, milky Mexican beverage flavored with ground rice, almonds, and cinnamon, served over ice.",
            price: 3.99,
            category: "Beverages",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60"
          }
        ]
      }
    }
  });

  // 8. Sweet Velvet Patisserie (Desserts)
  await prisma.restaurant.create({
    data: {
      name: "Sweet Velvet Patisserie",
      slug: "sweet-velvet-patisserie",
      address: "22 Sugar Avenue, Chocolate District",
      rating: 4.9,
      cuisine: "Desserts, Bakery, Cakes",
      coverImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
      deliveryTime: 15,
      isPremium: true,
      menuItems: {
        create: [
          {
            name: "Belgian Chocolate Fudge Cake",
            description: "Moist layer cake filled and covered with rich Belgian chocolate fudge frosting.",
            price: 8.49,
            category: "Desserts",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Strawberry Cream Cheesecake",
            description: "Creamy New York style cheesecake on a graham cracker crust, topped with fresh strawberries and sweet strawberry glaze.",
            price: 7.99,
            category: "Desserts",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Gourmet Macarons Assortment",
            description: "Beautiful box of six assorted classic French macarons: vanilla, pistachio, chocolate, raspberry, lemon, and salted caramel.",
            price: 9.99,
            category: "Desserts",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Iced Salted Caramel Latte",
            description: "Freshly brewed espresso mixed with cold milk, salted caramel syrup, and served over ice.",
            price: 5.49,
            category: "Beverages",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&auto=format&fit=crop&q=60"
          },
          {
            name: "Gourmet Hot Cocoa with Marshmallows",
            description: "Creamy hot chocolate topped with miniature marshmallows and whipped chocolate cream.",
            price: 4.99,
            category: "Beverages",
            isVeg: true,
            imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=60"
          }
        ]
      }
    }
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
