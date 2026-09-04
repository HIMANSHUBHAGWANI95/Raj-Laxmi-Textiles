import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up database...");
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.prescription.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Seeding categories...");
  const categories = [
    {
      name: "Prescription Drugs",
      slug: "rx-drugs",
      description: "Medicines requiring a registered doctor's prescription verification.",
      imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
    },
    {
      name: "OTC & Pain Relief",
      slug: "otc",
      description: "Over-the-counter medicines for daily wellness and pain management.",
      imageUrl: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&auto=format&fit=crop&q=60",
    },
    {
      name: "Vitamins & Supplements",
      slug: "supplements",
      description: "Nutritional supplements, vitamins, and minerals for daily strength.",
      imageUrl: "https://images.unsplash.com/photo-1579721591734-5d9e946f18e6?w=500&auto=format&fit=crop&q=60",
    },
    {
      name: "Personal & Skin Care",
      slug: "personal-care",
      description: "Daily personal hygiene, medicated skincare, and hair essentials.",
      imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60",
    },
    {
      name: "First Aid & Devices",
      slug: "devices",
      description: "Thermometers, blood pressure monitors, bandages, and emergency kits.",
      imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=60",
    },
  ];

  const dbCategories = [];
  for (const cat of categories) {
    const dbCat = await prisma.category.create({
      data: cat,
    });
    dbCategories.push(dbCat);
    console.log(`Created Category: ${dbCat.name}`);
  }

  console.log("Seeding products...");
  
  // Find category IDs
  const rxCatId = dbCategories.find(c => c.slug === "rx-drugs")!.id;
  const otcCatId = dbCategories.find(c => c.slug === "otc")!.id;
  const suppCatId = dbCategories.find(c => c.slug === "supplements")!.id;
  const personalCatId = dbCategories.find(c => c.slug === "personal-care")!.id;
  const deviceCatId = dbCategories.find(c => c.slug === "devices")!.id;

  const products = [
    // 1. Prescription Drugs (rxRequired: true)
    {
      name: "Amoxicillin 500mg",
      slug: "amoxicillin-500mg",
      description: "Broad-spectrum antibiotic used to treat bacterial infections like pneumonia, tonsillitis, and UTIs.",
      price: 12.50,
      originalPrice: 18.00,
      stock: 150,
      rxRequired: true,
      imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
      categoryId: rxCatId,
    },
    {
      name: "Lipitor (Atorvastatin) 10mg",
      slug: "lipitor-10mg",
      description: "Statin medication used to prevent cardiovascular disease and lower lipid/cholesterol levels.",
      price: 45.00,
      originalPrice: 60.00,
      stock: 80,
      rxRequired: true,
      imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=60",
      categoryId: rxCatId,
    },
    {
      name: "Metformin 850mg",
      slug: "metformin-850mg",
      description: "First-line medication for the treatment of type 2 diabetes, helping control blood sugar levels.",
      price: 18.90,
      originalPrice: 25.00,
      stock: 200,
      rxRequired: true,
      imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
      categoryId: rxCatId,
    },
    {
      name: "Albuterol Inhaler (Ventolin)",
      slug: "albuterol-inhaler",
      description: "Bronchodilator that relaxes muscles in the airways and increases air flow to the lungs. Used for asthma.",
      price: 28.00,
      originalPrice: 35.00,
      stock: 60,
      rxRequired: true,
      imageUrl: "https://images.unsplash.com/photo-1607619056574-7b8d304b3b8f?w=500&auto=format&fit=crop&q=60",
      categoryId: rxCatId,
    },
    {
      name: "Lexapro (Escitalopram) 10mg",
      slug: "lexapro-10mg",
      description: "Selective serotonin reuptake inhibitor (SSRI) commonly prescribed for depression and generalized anxiety.",
      price: 55.00,
      originalPrice: 75.00,
      stock: 45,
      rxRequired: true,
      imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
      categoryId: rxCatId,
    },

    // 2. OTC & Pain Relief
    {
      name: "Paracetamol (Acetaminophen) 500mg",
      slug: "paracetamol-500mg",
      description: "Effective fever reducer and pain reliever for headaches, muscle aches, arthritis, and backaches.",
      price: 3.50,
      originalPrice: 5.00,
      stock: 500,
      rxRequired: false,
      imageUrl: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&auto=format&fit=crop&q=60",
      categoryId: otcCatId,
    },
    {
      name: "Ibuprofen 200mg Tablets",
      slug: "ibuprofen-200mg",
      description: "Nonsteroidal anti-inflammatory drug (NSAID) used to reduce hormones that cause pain and inflammation.",
      price: 4.20,
      originalPrice: 6.00,
      stock: 400,
      rxRequired: false,
      imageUrl: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&auto=format&fit=crop&q=60",
      categoryId: otcCatId,
    },
    {
      name: "Cetirizine 10mg (Allergy Relief)",
      slug: "cetirizine-10mg",
      description: "24-hour non-drowsy antihistamine that treats symptoms such as sneezing, runny nose, and itchy eyes.",
      price: 6.50,
      originalPrice: 9.00,
      stock: 300,
      rxRequired: false,
      imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
      categoryId: otcCatId,
    },
    {
      name: "Cough & Cold Relief Syrup",
      slug: "cough-syrup",
      description: "Fast-acting syrup to soothe throat irritation and control cough caused by minor bronchial irritation.",
      price: 8.00,
      originalPrice: 11.50,
      stock: 180,
      rxRequired: false,
      imageUrl: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&auto=format&fit=crop&q=60",
      categoryId: otcCatId,
    },
    {
      name: "Antacid Chewable Tablets (Mint)",
      slug: "antacid-tablets",
      description: "Fast relief of heartburn, acid indigestion, sour stomach, and upset stomach associated with these symptoms.",
      price: 5.00,
      originalPrice: 7.00,
      stock: 250,
      rxRequired: false,
      imageUrl: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&auto=format&fit=crop&q=60",
      categoryId: otcCatId,
    },

    // 3. Vitamins & Supplements
    {
      name: "Multivitamin Gummies (Adults)",
      slug: "multivitamin-gummies",
      description: "Delicious daily multivitamin gummies packed with essential vitamins to support immune health and energy.",
      price: 15.99,
      originalPrice: 22.00,
      stock: 120,
      rxRequired: false,
      imageUrl: "https://images.unsplash.com/photo-1579721591734-5d9e946f18e6?w=500&auto=format&fit=crop&q=60",
      categoryId: suppCatId,
    },
    {
      name: "Vitamin C 1000mg with Rose Hips",
      slug: "vitamin-c-1000mg",
      description: "High-potency antioxidant support to boost cellular defense, skin vitality, and general immunity.",
      price: 9.99,
      originalPrice: 14.50,
      stock: 220,
      rxRequired: false,
      imageUrl: "https://images.unsplash.com/photo-1579721591734-5d9e946f18e6?w=500&auto=format&fit=crop&q=60",
      categoryId: suppCatId,
    },
    {
      name: "Fish Oil Omega-3 1000mg",
      slug: "fish-oil-omega-3",
      description: "Supports cardiovascular system health, cognitive function, and joint mobility with clean EPA/DHA fatty acids.",
      price: 19.50,
      originalPrice: 28.00,
      stock: 110,
      rxRequired: false,
      imageUrl: "https://images.unsplash.com/photo-1579721591734-5d9e946f18e6?w=500&auto=format&fit=crop&q=60",
      categoryId: suppCatId,
    },
    {
      name: "Calcium with Vitamin D3",
      slug: "calcium-vitamin-d3",
      description: "Promotes bone density and strength while vitamin D3 enhances calcium absorption for healthy muscle function.",
      price: 12.00,
      originalPrice: 18.00,
      stock: 95,
      rxRequired: false,
      imageUrl: "https://images.unsplash.com/photo-1579721591734-5d9e946f18e6?w=500&auto=format&fit=crop&q=60",
      categoryId: suppCatId,
    },

    // 4. Personal & Skin Care
    {
      name: "Ceramide Moisturizing Cream",
      slug: "moisturizing-cream",
      description: "Hydrates and helps restore the protective skin barrier with essential ceramides and hyaluronic acid.",
      price: 14.00,
      originalPrice: 19.99,
      stock: 130,
      rxRequired: false,
      imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60",
      categoryId: personalCatId,
    },
    {
      name: "Medicated Dandruff Shampoo",
      slug: "dandruff-shampoo",
      description: "Contains 1% Ketoconazole to control flaking, scaling, and itching associated with dandruff.",
      price: 11.50,
      originalPrice: 16.00,
      stock: 90,
      rxRequired: false,
      imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60",
      categoryId: personalCatId,
    },
    {
      name: "Soothing Aloe Vera Gel 99%",
      slug: "aloe-vera-gel",
      description: "Pure aloe vera extract provides cooling relief for sunburns, minor cuts, insect bites, and dry skin.",
      price: 6.00,
      originalPrice: 8.50,
      stock: 180,
      rxRequired: false,
      imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60",
      categoryId: personalCatId,
    },
    {
      name: "Antiseptic Liquid Wash",
      slug: "antiseptic-soap",
      description: "Antibacterial and germicidal hand and body wash to maintain clinical-level hygiene.",
      price: 4.50,
      originalPrice: 6.00,
      stock: 300,
      rxRequired: false,
      imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60",
      categoryId: personalCatId,
    },

    // 5. First Aid & Devices
    {
      name: "Digital Thermometer (Infrared)",
      slug: "digital-thermometer",
      description: "Contactless high-precision infrared thermometer showing body temperature in 1 second with alert screen.",
      price: 15.00,
      originalPrice: 22.00,
      stock: 75,
      rxRequired: false,
      imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=60",
      categoryId: deviceCatId,
    },
    {
      name: "Automatic Blood Pressure Monitor",
      slug: "bp-monitor",
      description: "Upper arm blood pressure monitor with digital display, arrhythmia detection, and double user memory.",
      price: 39.99,
      originalPrice: 55.00,
      stock: 50,
      rxRequired: false,
      imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=60",
      categoryId: deviceCatId,
    },
    {
      name: "Comprehensive First Aid Kit",
      slug: "first-aid-kit",
      description: "120-piece medical kit with bandages, antiseptic pads, blankets, and scissors for office or home emergencies.",
      price: 24.50,
      originalPrice: 35.00,
      stock: 65,
      rxRequired: false,
      imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=60",
      categoryId: deviceCatId,
    },
    {
      name: "Flexible Fabric Bandages (50 Pack)",
      slug: "adhesive-bandages",
      description: "Sterile adhesive bandages to cover and protect minor cuts, scrapes, and blisters with custom flexibility.",
      price: 4.50,
      originalPrice: 6.50,
      stock: 350,
      rxRequired: false,
      imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=60",
      categoryId: deviceCatId,
    },
  ];

  for (const prod of products) {
    const dbProd = await prisma.product.create({
      data: prod,
    });
    console.log(`Created Product: ${dbProd.name}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
