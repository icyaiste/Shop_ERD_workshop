import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  console.log('🌱 Seeding database...')

  // 1. Categories
  const Motorcycles = await prisma.category.create({
    data: { name: "Motorcycles" }
  })
  const Gear = await prisma.category.create({
    data: { name: "Gear" }
  })
  const Parts = await prisma.category.create({
    data: { name: "Parts" }
  })
  const Merch = await prisma.category.create({
    data: { name: "Merch" }
  })
    console.log("Created categories")

  // 2. Products
  await prisma.product.createMany({
    data: [
      { name: "Yamaha MT-07", price: 85000, stock: 5, categoryId: Motorcycles.id },
      { name: "Kawasaki Ninja 650", price: 95000, stock: 3, categoryId: Motorcycles.id },

      { name: "Full Face Helmet - AGV K1", price: 7500, stock: 20, categoryId: Gear.id },
      { name: "Motorcycle Jacket - Alpinestars", price: 3200, stock: 10, categoryId: Gear.id },
      { name: "Riding Gloves - Dainese", price: 1000, stock: 25, categoryId: Gear.id },

      { name: "Akrapovic Exhaust System", price: 12000, stock: 7, categoryId: Parts.id },
      { name: "Chain Kit", price: 1500, stock: 15, categoryId: Parts.id },

      { name: "Ducati T-Shirt", price: 300, stock: 50, categoryId: Merch.id },
      { name: "Harley Davidson Cap", price: 200, stock: 40, categoryId: Merch.id }
    ]
  })
  console.log("Created products")

  // 3. Customers
  await prisma.customer.createMany({
    data: [
      { name: "Erik Johansson", email: "erik956@gmail.com" },
      { name: "Anna Svensson", email: "annabjörk@outlook.com" },
      { name: "Lukas Berg", email: "bikerboy@yahoo.com" }
    ]
  })
  console.log("Created customers")

  // 4. Orders
    const eriksOrders = await prisma.customer.findUnique({
        where: { email: "erik956@gmail.com" }
})
        if (!eriksOrders) {
    throw new Error("Erik not found — seed failed")
}
    const order1 = await prisma.order.create({
  data: { customerId: eriksOrders!.id }
 })

  // 5. Order Items
    const products = await prisma.product.findMany({
  where: {
    name: {
      in: [
        "Yamaha MT-07",
        "Full Face Helmet - AGV K1"
      ]
    }
  }
})

const productMap = Object.fromEntries(  
  products.map(p => [p.name, p])
)
//safety check products exist before seeding order items
 if (!productMap["Yamaha MT-07"] || !productMap["Full Face Helmet - AGV K1"]) {
  throw new Error("Products not found — seed failed")
}

await prisma.orderItem.createMany({
  data: [
    {
      orderId: order1.id,
      productId: productMap["Yamaha MT-07"].id,
      quantity: 1
    },
    {
      orderId: order1.id,
      productId: productMap["Full Face Helmet - AGV K1"].id,
      quantity: 1
    }
  ]
})
  console.log('✅ Seeding finished')
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });