import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const menuData = [
  { name: 'Small Pizza (7")',            description: 'Fresh homemade small pizza 7 inch',                price: 750,  category: 'Pizza',    image: '/pizza-banner-1.png' },
  { name: 'Medium Pizza (11")',          description: 'Fresh homemade medium pizza 11 inch',              price: 1650, category: 'Pizza',    image: '/pizza-banner-1.png' },
  { name: 'Large Pizza (13")',           description: 'Fresh homemade large pizza 13 inch',               price: 2150, category: 'Pizza',    image: '/pizza-banner-1.png' },
  { name: 'Family Pizza (16")',          description: 'Family size pizza 16 inch',                        price: 2650, category: 'Pizza',    image: '/pizza-banner-1.png' },
  { name: 'Party Pizza (18")',           description: 'Party size pizza 18 inch',                         price: 3000, category: 'Pizza',    image: '/pizza-banner-1.png' },
  { name: 'Zinger Burger',              description: 'Crispy fried chicken zinger burger',                price: 500,  category: 'Burger',   image: '/pizza-banner-2.png' },
  { name: 'Zinger Cheese Burger',       description: 'Zinger burger with melted cheese',                 price: 560,  category: 'Burger',   image: '/pizza-banner-2.png' },
  { name: 'Zinger + Cheese + Olive',    description: 'Zinger burger with cheese and olives',             price: 620,  category: 'Burger',   image: '/pizza-banner-2.png' },
  { name: 'Zinger + Cheese + Olive + Kabab', description: 'Loaded zinger with cheese, olive and kabab', price: 700,  category: 'Burger',   image: '/pizza-banner-2.png' },
  { name: 'Classic Zinger Burger',      description: 'Classic crispy zinger burger',                     price: 500,  category: 'Burger',   image: '/pizza-banner-2.png' },
  { name: 'Spicy Zinger Burger',        description: 'Extra spicy zinger burger',                        price: 650,  category: 'Burger',   image: '/pizza-banner-2.png' },
  { name: 'Double Zinger Burger',       description: 'Double patty zinger burger',                       price: 680,  category: 'Burger',   image: '/pizza-banner-2.png' },
  { name: 'Zinger Supreme',             description: 'Supreme zinger burger with all toppings',          price: 680,  category: 'Burger',   image: '/pizza-banner-2.png' },
  { name: 'BBQ Zinger',                 description: 'Zinger burger with BBQ sauce',                     price: 680,  category: 'Burger',   image: '/pizza-banner-2.png' },
  { name: 'Peri Peri Zinger',           description: 'Spicy peri peri zinger burger',                    price: 680,  category: 'Burger',   image: '/pizza-banner-2.png' },
  { name: 'Zinger Wrap',                description: 'Zinger in a soft wrap',                            price: 650,  category: 'Burger',   image: '/pizza-banner-2.png' },
  { name: 'Fish Zinger',                description: 'Crispy fish zinger burger',                        price: 650,  category: 'Burger',   image: '/pizza-banner-2.png' },
  { name: 'Pizza Zinger',               description: 'Pizza-style zinger burger',                        price: 750,  category: 'Burger',   image: '/pizza-banner-2.png' },
  { name: 'Mashroom Zinger',            description: 'Zinger burger with mushroom',                      price: 800,  category: 'Burger',   image: '/pizza-banner-2.png' },
  { name: 'Chicken Patti Burger',       description: 'Chicken patti burger',                             price: 480,  category: 'Burger',   image: '/pizza-banner-2.png' },
  { name: 'Chicken Patti Cheese Burger',description: 'Chicken patti burger with cheese',                 price: 550,  category: 'Burger',   image: '/pizza-banner-2.png' },
  { name: 'Beef Patti Burger',          description: 'Beef patti burger',                                price: 600,  category: 'Burger',   image: '/pizza-banner-2.png' },
  { name: 'Beef Patti Cheese Burger',   description: 'Beef patti burger with cheese',                    price: 650,  category: 'Burger',   image: '/pizza-banner-2.png' },
  { name: 'Chicken Shawarma',           description: 'Tender grilled chicken shawarma',                  price: 350,  category: 'Shawarma', image: '/pizza-banner-2.png' },
  { name: 'Chicken Cheese Shawarma',    description: 'Chicken shawarma with melted cheese',              price: 450,  category: 'Shawarma', image: '/pizza-banner-2.png' },
  { name: 'Olive Shawarma',             description: 'Chicken shawarma with olives',                     price: 420,  category: 'Shawarma', image: '/pizza-banner-2.png' },
  { name: 'Zinger Shawarma',            description: 'Crispy zinger shawarma',                           price: 580,  category: 'Shawarma', image: '/pizza-banner-2.png' },
  { name: 'Zinger Cheese Shawarma',     description: 'Zinger shawarma with cheese',                      price: 650,  category: 'Shawarma', image: '/pizza-banner-2.png' },
  { name: 'Beef Shawarma',              description: 'Grilled beef shawarma',                            price: 680,  category: 'Shawarma', image: '/pizza-banner-2.png' },
  { name: 'Spicy Shawarma',             description: 'Spicy chicken shawarma',                           price: 380,  category: 'Shawarma', image: '/pizza-banner-2.png' },
  { name: 'Mixed Shawarma',             description: 'Mixed chicken and beef shawarma',                  price: 680,  category: 'Shawarma', image: '/pizza-banner-2.png' },
  { name: 'Fish Shawarma',              description: 'Crispy fish shawarma',                             price: 680,  category: 'Shawarma', image: '/pizza-banner-2.png' },
  { name: 'Supreme Shawarma',           description: 'Supreme loaded shawarma',                          price: 750,  category: 'Shawarma', image: '/pizza-banner-2.png' },
  { name: 'Chicken Sandwich',           description: 'Grilled chicken sandwich',                         price: 500,  category: 'Sandwich', image: '/pizza-banner-2.png' },
  { name: 'Club Sandwich',              description: 'Triple decker club sandwich',                      price: 600,  category: 'Sandwich', image: '/pizza-banner-2.png' },
  { name: 'Beef Sandwich',              description: 'Beef patty sandwich',                              price: 600,  category: 'Sandwich', image: '/pizza-banner-2.png' },
  { name: 'Chicken Tikka Sandwich',     description: 'Spiced chicken tikka sandwich',                    price: 600,  category: 'Sandwich', image: '/pizza-banner-2.png' },
  { name: 'Malai Boti Sandwich',        description: 'Creamy malai boti sandwich',                       price: 550,  category: 'Sandwich', image: '/pizza-banner-2.png' },
  { name: 'Egg Sandwich',               description: 'Classic egg sandwich',                             price: 300,  category: 'Sandwich', image: '/pizza-banner-2.png' },
  { name: 'Chicken Fajita Sandwich',    description: 'Chicken fajita sandwich',                          price: 600,  category: 'Sandwich', image: '/pizza-banner-2.png' },
  { name: 'Spicy Chicken Sandwich',     description: 'Spicy chicken sandwich',                           price: 500,  category: 'Sandwich', image: '/pizza-banner-2.png' },
  { name: 'Vegi Sandwich',              description: 'Fresh vegetable sandwich',                         price: 300,  category: 'Sandwich', image: '/pizza-banner-2.png' },
  { name: 'Fish Sandwich',              description: 'Crispy fish fillet sandwich',                      price: 650,  category: 'Sandwich', image: '/pizza-banner-2.png' },
  { name: 'Chicken Supreme Sandwich',   description: 'Supreme loaded chicken sandwich',                  price: 800,  category: 'Sandwich', image: '/pizza-banner-2.png' },
  { name: 'Fries (Small)',              description: 'Crispy golden fries small',                        price: 350,  category: 'Fries',    image: '/pizza-banner-1.png' },
  { name: 'Fries (Large)',              description: 'Crispy golden fries large',                        price: 500,  category: 'Fries',    image: '/pizza-banner-1.png' },
  { name: 'Loaded Fries',               description: 'Fries loaded with cheese and toppings',            price: 600,  category: 'Fries',    image: '/pizza-banner-1.png' },
  { name: 'Pizza Fries',                description: 'Fries with pizza toppings',                        price: 700,  category: 'Fries',    image: '/pizza-banner-1.png' },
  { name: 'Soft Drink (345ml)',         description: 'Cold soft drink 345ml can',                        price: 100,  category: 'Drinks',   image: '/pizza-banner-1.png' },
  { name: 'Soft Drink (500ml)',         description: 'Cold soft drink 500ml bottle',                     price: 150,  category: 'Drinks',   image: '/pizza-banner-1.png' },
  { name: 'Soft Drink (1L)',            description: 'Cold soft drink 1 litre',                          price: 180,  category: 'Drinks',   image: '/pizza-banner-1.png' },
  { name: 'Soft Drink (1.5L)',          description: 'Cold soft drink 1.5 litre',                        price: 240,  category: 'Drinks',   image: '/pizza-banner-1.png' },
  { name: 'Chicken Paratha Roll',       description: 'Tender chicken paratha roll',                      price: 480,  category: 'Paratha',  image: '/pizza-banner-2.png' },
  { name: 'Chicken Cheese Paratha Roll',description: 'Chicken paratha with melted cheese',               price: 550,  category: 'Paratha',  image: '/pizza-banner-2.png' },
  { name: 'Zinger Paratha Roll',        description: 'Crispy zinger in paratha',                         price: 650,  category: 'Paratha',  image: '/pizza-banner-2.png' },
  { name: 'Zinger Cheese Paratha Roll', description: 'Zinger paratha with cheese and olive',             price: 700,  category: 'Paratha',  image: '/pizza-banner-2.png' },
  { name: 'Beef Paratha Roll',          description: 'Grilled beef paratha roll',                        price: 600,  category: 'Paratha',  image: '/pizza-banner-2.png' },
  { name: 'Chapli Paratha Roll',        description: 'Chapli kabab paratha roll',                        price: 650,  category: 'Paratha',  image: '/pizza-banner-2.png' },
  { name: 'Seekh Kabab Paratha Roll',   description: 'Spiced seekh kabab paratha',                       price: 650,  category: 'Paratha',  image: '/pizza-banner-2.png' },
  { name: 'Aloo Paratha Roll',          description: 'Classic aloo paratha roll',                        price: 300,  category: 'Paratha',  image: '/pizza-banner-2.png' },
  { name: 'Fish Paratha Roll',          description: 'Crispy fish paratha roll',                         price: 650,  category: 'Paratha',  image: '/pizza-banner-2.png' },
]

const dealsData = [
  { name: 'Pizza Deal One',     description: '2 Small Pizza (7") + Fries + Large Drink',                                         image: '/pizza-banner-1.png', originalPrice: 2050,  discountedPrice: 1750, discountPercentage: 15, items: ['pizza-small','pizza-small','fries-small','drink-soft-15l'] },
  { name: 'Pizza Deal Two',     description: '2 Medium Pizza (11") + 1 Fries + 2 Large Drink',                                   image: '/pizza-banner-1.png', originalPrice: 4050,  discountedPrice: 3400, discountPercentage: 16, items: ['pizza-medium','pizza-medium','fries-small','drink-soft-15l','drink-soft-15l'] },
  { name: 'Pizza Deal Three',   description: '2 Large Pizza (13") + 1 Fries + 2 Large Drink',                                   image: '/pizza-banner-1.png', originalPrice: 5050,  discountedPrice: 4200, discountPercentage: 17, items: ['pizza-large','pizza-large','fries-small','drink-soft-15l','drink-soft-15l'] },
  { name: 'Pizza Deal Four',    description: '2 Family Pizza (16") + 2 Fries + 2 Drink 1.5 Liter',                              image: '/pizza-banner-1.png', originalPrice: 6400,  discountedPrice: 5150, discountPercentage: 20, items: ['pizza-family','pizza-family','fries-small','fries-small','drink-soft-15l','drink-soft-15l'] },
  { name: 'Pizza Deal Five',    description: '2 Party Pizza (18") + 2 Large Drink 1.5 Ltr',                                     image: '/pizza-banner-1.png', originalPrice: 7100,  discountedPrice: 5650, discountPercentage: 20, items: ['pizza-party','pizza-party','drink-soft-15l','drink-soft-15l'] },
  { name: 'Special Deal One',   description: 'Large Pizza (13") + Zinger Burger + Fries + Large Drink',                         image: '/pizza-banner-2.png', originalPrice: 3450,  discountedPrice: 2550, discountPercentage: 26, items: ['pizza-large','burger-zinger','fries-small','drink-soft-15l'] },
  { name: 'Special Deal Two',   description: '2 Large Pizza (13") + 2 Zinger Burger + 2 Fries + 2 Large Drink',                image: '/pizza-banner-2.png', originalPrice: 6700,  discountedPrice: 4999, discountPercentage: 25, items: ['pizza-large','pizza-large','burger-zinger','burger-zinger','fries-small','fries-small','drink-soft-15l','drink-soft-15l'] },
  { name: 'Special Deal Three', description: '2 Medium Pizza (11") + 2 Zinger Burger + Shawarma + 2 Large Drink',              image: '/pizza-banner-2.png', originalPrice: 5700,  discountedPrice: 4550, discountPercentage: 20, items: ['pizza-medium','pizza-medium','burger-zinger','burger-zinger','shawarma-chicken','drink-soft-15l','drink-soft-15l'] },
  { name: 'Couple Deal',        description: '1 Small Pizza (7") + 1 Zinger Burger + 1 Drink Half Liter',                      image: '/pizza-banner-1.png', originalPrice: 1520,  discountedPrice: 1250, discountPercentage: 18, items: ['pizza-small','burger-zinger','drink-soft-500'] },
  { name: 'Family Deal One',    description: '1 Large Pizza (13") + 2 Zinger Burger + 1 Fries + 1 Large Drink',                image: '/pizza-banner-2.png', originalPrice: 4000,  discountedPrice: 2999, discountPercentage: 25, items: ['pizza-large','burger-zinger','burger-zinger','fries-small','drink-soft-15l'] },
  { name: 'Family Deal Two',    description: '2 Large Pizza (13") + 2 Zinger Burger + 2 Fries + 2 Large Drink',                image: '/pizza-banner-2.png', originalPrice: 6700,  discountedPrice: 4999, discountPercentage: 25, items: ['pizza-large','pizza-large','burger-zinger','burger-zinger','fries-small','fries-small','drink-soft-15l','drink-soft-15l'] },
  { name: 'Big Deal',           description: '3 Large Pizza (13") + 3 Zinger Burger + 3 Fries + 3 Large Drink',                image: '/pizza-banner-1.png', originalPrice: 10050, discountedPrice: 7999, discountPercentage: 20, items: ['pizza-large','pizza-large','pizza-large','burger-zinger','burger-zinger','burger-zinger','fries-small','fries-small','fries-small','drink-soft-15l','drink-soft-15l','drink-soft-15l'] },
  { name: 'Office Deal',        description: '2 Family Pizza (16") + 4 Zinger Burger + 4 Fries + 4 Large Drink',               image: '/pizza-banner-2.png', originalPrice: 10100, discountedPrice: 7999, discountPercentage: 21, items: ['pizza-family','pizza-family','burger-zinger','burger-zinger','burger-zinger','burger-zinger','fries-small','fries-small','fries-small','fries-small','drink-soft-15l','drink-soft-15l','drink-soft-15l','drink-soft-15l'] },
  { name: 'Party Deal',         description: '4 Large Pizza (13") + 5 Zinger Burger + 4 Large Fries + 5 Large Drink',          image: '/pizza-banner-1.png', originalPrice: 13040, discountedPrice: 9999, discountPercentage: 23, items: ['pizza-large','pizza-large','pizza-large','pizza-large','burger-zinger','burger-zinger','burger-zinger','burger-zinger','burger-zinger','fries-large','fries-large','fries-large','fries-large','drink-soft-15l','drink-soft-15l','drink-soft-15l','drink-soft-15l','drink-soft-15l'] },
  { name: 'Student Deal',       description: '1 Medium Pizza (11") + 1 Zinger Burger + 1 Fries + 2 Small Drinks',             image: '/pizza-banner-2.png', originalPrice: 2810,  discountedPrice: 1999, discountPercentage: 29, items: ['pizza-medium','burger-zinger','fries-small','drink-soft-345','drink-soft-345'] },
  { name: 'Friends Deal',       description: '2 Medium Pizza (11") + 2 Zinger Burger + 2 Large Drink',                         image: '/pizza-banner-1.png', originalPrice: 5700,  discountedPrice: 4650, discountPercentage: 18, items: ['pizza-medium','pizza-medium','burger-zinger','burger-zinger','drink-soft-15l','drink-soft-15l'] },
  { name: 'Kids Deal',          description: '1 Small Pizza (7") + 1 Patty Burger + 2 Small Fries',                            image: '/pizza-banner-2.png', originalPrice: 2300,  discountedPrice: 1599, discountPercentage: 30, items: ['pizza-small','burger-chicken-patti','fries-small','fries-small'] },
  { name: 'Zinger Deal One',    description: '2 Zinger Burger + 1 Fries + 2 Small Drink (345ml)',                              image: '/pizza-banner-2.png', originalPrice: 2050,  discountedPrice: 1600, discountPercentage: 22, items: ['burger-zinger','burger-zinger','fries-small','drink-soft-345','drink-soft-345'] },
  { name: 'Zinger Deal Two',    description: '3 Zinger Burger + 3 Fries + 3 Small Drink 345ml',                                image: '/pizza-banner-2.png', originalPrice: 3600,  discountedPrice: 2900, discountPercentage: 19, items: ['burger-zinger','burger-zinger','burger-zinger','fries-small','fries-small','fries-small','drink-soft-345','drink-soft-345','drink-soft-345'] },
  { name: 'Paratha Deal One',   description: '2 Paratha Roll + 1 Fries + 1 Small Drinks',                                      image: '/pizza-banner-2.png', originalPrice: 1410,  discountedPrice: 1150, discountPercentage: 18, items: ['paratha-chicken','paratha-chicken','fries-small','drink-soft-345'] },
  { name: 'Paratha Deal Two',   description: '3 Paratha Roll + 2 Fries + 3 Small Drink 345ml',                                 image: '/pizza-banner-2.png', originalPrice: 2740,  discountedPrice: 2150, discountPercentage: 22, items: ['paratha-chicken','paratha-chicken','paratha-chicken','fries-small','fries-small','drink-soft-345','drink-soft-345','drink-soft-345'] },
  { name: 'All In One Deal',    description: '1 Small Pizza + 1 Zinger Burger + 1 Shawarma + 1 Paratha Roll + 4 Small Drink',  image: '/pizza-banner-1.png', originalPrice: 2630,  discountedPrice: 2150, discountPercentage: 18, items: ['pizza-small','burger-zinger','shawarma-chicken','paratha-chicken','drink-soft-345','drink-soft-345','drink-soft-345','drink-soft-345'] },
  { name: 'Deal Is Deal',       description: '1 Medium Pizza + 1 Zinger Burger + 1 Shawarma + 1 Paratha Roll + 4 Small Drink', image: '/pizza-banner-1.png', originalPrice: 3530,  discountedPrice: 2750, discountPercentage: 22, items: ['pizza-medium','burger-zinger','shawarma-chicken','paratha-chicken','drink-soft-345','drink-soft-345','drink-soft-345','drink-soft-345'] },
  { name: 'Eat Big Pay Small',  description: '2 Small Pizza + 2 Zinger Burger + 2 Shawarma + 1 Paratha Roll + 4 Small Drink',  image: '/pizza-banner-1.png', originalPrice: 4860,  discountedPrice: 3800, discountPercentage: 22, items: ['pizza-small','pizza-small','burger-zinger','burger-zinger','shawarma-chicken','shawarma-chicken','paratha-chicken','drink-soft-345','drink-soft-345','drink-soft-345','drink-soft-345'] },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10)
  const testPassword = await bcrypt.hash('password', 10)

  await prisma.user.upsert({
    where: { email: 'admin@pizza1981.com' },
    update: {},
    create: { 
      email: 'admin@pizza1981.com', 
      password: adminPassword,
      name: 'Admin User', 
      phone: '033-9911-1107', 
      address: 'Shop No. G-9, Eden Mall, Multan Road, Lahore', 
      role: 'ADMIN' 
    },
  })

  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: { 
      email: 'test@example.com', 
      password: testPassword,
      name: 'Test User', 
      phone: '0300-1234567', 
      address: 'DHA Phase 5, Lahore', 
      role: 'USER' 
    },
  })

  const users = await Promise.all([
    prisma.user.upsert({ where: { email: 'ali@example.com' },   update: {}, create: { email: 'ali@example.com',   name: 'Ali Hassan',   phone: '0300-1111111', address: 'DHA Phase 1, Lahore' } }),
    prisma.user.upsert({ where: { email: 'sara@example.com' },  update: {}, create: { email: 'sara@example.com',  name: 'Sara Khan',    phone: '0300-2222222', address: 'Gulberg III, Lahore' } }),
    prisma.user.upsert({ where: { email: 'usman@example.com' }, update: {}, create: { email: 'usman@example.com', name: 'Usman Malik',  phone: '0300-3333333', address: 'Model Town, Lahore' } }),
  ])

  // ── Riders ──────────────────────────────────────────────────────────────
  await prisma.rider.deleteMany({})
  const riders = await Promise.all([
    prisma.rider.create({ data: { name: 'Asif Raza',    phone: '0311-1111111', available: true } }),
    prisma.rider.create({ data: { name: 'Bilal Ahmed',  phone: '0311-2222222', available: true } }),
    prisma.rider.create({ data: { name: 'Kamran Ali',   phone: '0311-3333333', available: true } }),
    prisma.rider.create({ data: { name: 'Zubair Khan',  phone: '0311-4444444', available: false } }),
    prisma.rider.create({ data: { name: 'Hamza Tariq',  phone: '0311-5555555', available: true } }),
  ])

  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.menuItem.deleteMany({})
  await prisma.deal.deleteMany({})
  await prisma.deliveryArea.deleteMany({})

  const menuItems = await Promise.all(
    menuData.map((item) => prisma.menuItem.create({ data: { ...item, available: true } }))
  )

  const deals = await Promise.all(
    dealsData.map((d) => prisma.deal.create({ data: { ...d, available: true } }))
  )

  // ── Delivery Areas ──────────────────────────────────────────────────────
  const areasData = [
    { name: 'Eden Value Homes',                      deliveryFee: 100 },
    { name: 'Jazac City',                            deliveryFee: 120 },
    { name: 'Park View City',                        deliveryFee: 150 },
    { name: 'EME DHA Lahore',                        deliveryFee: 200 },
    { name: 'Rail Town',                             deliveryFee: 130 },
    { name: 'P & Society',                           deliveryFee: 140 },
    { name: 'Green Fort 2',                          deliveryFee: 110 },
    { name: 'Chung',                                 deliveryFee: 180 },
    { name: 'Izmir Town',                            deliveryFee: 120 },
    { name: 'Iqbal Avenue Housing Society',          deliveryFee: 130 },
    { name: 'Green View Society',                    deliveryFee: 120 },
    { name: 'Chaman Park',                           deliveryFee: 100 },
    { name: 'Rajboot Town',                          deliveryFee: 150 },
    { name: 'Muhafiz Town',                          deliveryFee: 160 },
    { name: 'PASCO Society',                         deliveryFee: 140 },
    { name: 'Lahore Canal Bank Phase 1',             deliveryFee: 170 },
    { name: 'Eden Canal Villas',                     deliveryFee: 100 },
    { name: 'Etihad Town',                           deliveryFee: 130 },
    { name: 'Excise and Taxation Society',           deliveryFee: 150 },
    { name: 'Doctors Society',                       deliveryFee: 140 },
    { name: 'Green Fort 1',                          deliveryFee: 110 },
    { name: 'Executive Apartments',                  deliveryFee: 120 },
    { name: 'Atchison Colony',                       deliveryFee: 200 },
    { name: 'Sultan Town',                           deliveryFee: 160 },
    { name: 'Ali Town',                              deliveryFee: 150 },
    { name: 'Nawab Town',                            deliveryFee: 170 },
    { name: 'Abdalians Cooperative Housing Society', deliveryFee: 180 },
    { name: 'Johar Town B Block',                    deliveryFee: 130 },
    { name: 'Judicial Colony Phase 1',               deliveryFee: 140 },
    { name: 'Canal Berg Society',                    deliveryFee: 160 },
    { name: 'Canal View Society',                    deliveryFee: 150 },
    { name: 'Johar Town J Block',                    deliveryFee: 130 },
    { name: 'Johar Town J3 Block',                   deliveryFee: 130 },
    { name: 'Johar Town H Block',                    deliveryFee: 130 },
    { name: 'Johar Town G1 Block',                   deliveryFee: 130 },
    { name: 'Johar Town Q Block',                    deliveryFee: 140 },
    { name: 'Johar Town P Block',                    deliveryFee: 140 },
    { name: 'Johar Town R1 Block',                   deliveryFee: 140 },
    { name: 'Johar Town R2 Block',                   deliveryFee: 140 },
    { name: 'Johar Town R3 Block',                   deliveryFee: 140 },
    { name: 'Johar Town D1 Block',                   deliveryFee: 130 },
    { name: 'Punjab University New Campus',          deliveryFee: 160 },
    { name: 'Ghosha-e-Ahbab Phase 2',               deliveryFee: 120 },
    { name: 'Mansoorab',                             deliveryFee: 170 },
    { name: 'Mustafa Town',                          deliveryFee: 180 },
    { name: 'Azam Garden',                           deliveryFee: 190 },
    { name: 'Hanjarwal',                             deliveryFee: 200 },
    { name: 'Ahbab Colony',                          deliveryFee: 120 },
    { name: 'Gulzar Colony',                         deliveryFee: 130 },
    { name: 'Saif Town',                             deliveryFee: 150 },
    { name: 'Gulshan Town',                          deliveryFee: 140 },
    { name: 'Munir Garden',                          deliveryFee: 130 },
    { name: 'Maraghazar Colony',                     deliveryFee: 120 },
    { name: 'Ghosia Park',                           deliveryFee: 110 },
  ]
  const areas = await Promise.all(
    areasData.map(a => prisma.deliveryArea.create({ data: { ...a, active: true } }))
  )

  const statuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']
  for (let i = 0; i < 15; i++) {
    const user = users[i % users.length]
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 7))
    const order = await prisma.order.create({
      data: { userId: user.id, status: statuses[Math.floor(Math.random() * statuses.length)] as any, total: Math.floor(Math.random() * 3000) + 800, deliveryFee: 200, address: user.address || 'Lahore', phone: user.phone || '0300-0000000', createdAt: date },
    })
    const numItems = Math.floor(Math.random() * 3) + 1
    for (let j = 0; j < numItems; j++) {
      const item = menuItems[Math.floor(Math.random() * menuItems.length)]
      await prisma.orderItem.create({ data: { orderId: order.id, menuItemId: item.id, quantity: Math.floor(Math.random() * 2) + 1, price: item.price } })
    }
  }

  console.log('✅ Seeded successfully!')
  console.log(`- ${menuItems.length} menu items`)
  console.log(`- ${deals.length} deals`)
  console.log(`- ${areas.length} delivery areas`)
  console.log(`- ${riders.length} riders`)
  console.log(`- ${users.length + 2} users (including admin and test user)`)
  console.log(`- 15 sample orders`)
  console.log('\n📝 Login Credentials:')
  console.log('   👤 User: test@example.com / password')
  console.log('   🔐 Admin: admin@pizza1981.com / admin123')
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
