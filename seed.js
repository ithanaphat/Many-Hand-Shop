const mongoose = require('mongoose')
require('dotenv').config()
const Product = require('./models/product')

async function seedProducts() {
  try {
    await mongoose.connect(process.env.URL)
    console.log('Connected to MongoDB')

    // Create sample products
    const sampleProducts = [
      {
        name: "Vintage T-Shirt",
        description: "A beautiful vintage t-shirt is very nice. My mom gave me when I was a child. Perfect condition.",
        price: 1545448,
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
        stock: 5,
        seller: new mongoose.Types.ObjectId(),
        category: "Fashion",
        rating: 4.5,
        reviews: 120
      },
      {
        name: "Film Camera",
        description: "Classic film camera in excellent working condition. Perfect for photography enthusiasts and collectors.",
        price: 85,
        images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500"],
        stock: 2,
        seller: new mongoose.Types.ObjectId(),
        category: "Electronics",
        rating: 4.2,
        reviews: 45
      },
      {
        name: "Jeans",
        description: "Stylish denim jeans in great condition. Perfect for everyday wear. Classic blue color.",
        price: 30,
        images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500"],
        stock: 8,
        seller: new mongoose.Types.ObjectId(),
        category: "Fashion",
        rating: 4.0,
        reviews: 89
      },
      {
        name: "Casual Shirt",
        description: "Comfortable casual shirt perfect for everyday activities. Soft cotton fabric.",
        price: 45,
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"],
        stock: 10,
        seller: new mongoose.Types.ObjectId(),
        category: "Fashion",
        rating: 4.3,
        reviews: 67
      },
      {
        name: "Summer T-Shirt",
        description: "Lightweight summer t-shirt. Perfect for hot weather. Available in various colors.",
        price: 25,
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
        stock: 15,
        seller: new mongoose.Types.ObjectId(),
        category: "Fashion",
        rating: 4.1,
        reviews: 102
      }
    ]

    // Delete existing products
    await Product.deleteMany({})
    
    // Insert sample products
    const result = await Product.insertMany(sampleProducts)
    console.log(`${result.length} products added to database`)

    await mongoose.connection.close()
    console.log('Database seeding completed')
  } catch (err) {
    console.error('Error seeding database:', err)
    process.exit(1)
  }
}

seedProducts()
