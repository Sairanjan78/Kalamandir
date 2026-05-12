require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Find an artist
        let artist = await User.findOne({ role: 'artist' });
        if (!artist) {
            console.log('No artist found, creating one...');
            artist = await User.create({
                name: 'Rohit Dalai',
                email: 'rohit123@gmail.com',
                password: 'password123',
                role: 'artist',
                isApproved: true,
                artistProfile: {
                    bio: 'Master of Pattachitra art.',
                    experience: '10 years',
                    specialty: 'Painting'
                }
            });
        }

        const products = [
            {
                title: 'Radha Krishna Pattachitra',
                description: 'A beautiful hand-painted Pattachitra artwork depicting Radha and Krishna.',
                price: 15000,
                discountedPrice: 12000,
                category: 'Painting',
                stock: 5,
                artistId: artist._id,
                images: [
                    { url: 'https://images.unsplash.com/photo-1578305844855-52c679a7702f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', publicId: 'demo1' }
                ],
                tags: ['Pattachitra', 'Traditional', 'Krishna'],
                isPublished: true,
                rating: 4.8,
                numReviews: 12
            },
            {
                title: 'Brass Nataraja Sculpture',
                description: 'Intricately carved brass sculpture of Lord Nataraja.',
                price: 8500,
                category: 'Sculpture',
                stock: 2,
                artistId: artist._id,
                images: [
                    { url: 'https://images.unsplash.com/photo-1601366526156-f0088cb1f417?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', publicId: 'demo2' }
                ],
                tags: ['Brass', 'Nataraja', 'Sculpture'],
                isPublished: true,
                rating: 5.0,
                numReviews: 8
            },
            {
                title: 'Handwoven Ikat Silk Saree',
                description: 'Authentic pure silk Ikat saree woven by traditional weavers.',
                price: 25000,
                discountedPrice: 22000,
                category: 'Textile',
                stock: 10,
                artistId: artist._id,
                images: [
                    { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', publicId: 'demo3' }
                ],
                tags: ['Ikat', 'Silk', 'Saree', 'Handwoven'],
                isPublished: true,
                rating: 4.5,
                numReviews: 24
            },
            {
                title: 'Blue Pottery Vase',
                description: 'Hand-painted Jaipur blue pottery vase.',
                price: 3500,
                category: 'Pottery',
                stock: 8,
                artistId: artist._id,
                images: [
                    { url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', publicId: 'demo4' }
                ],
                tags: ['Pottery', 'Jaipur', 'Vase'],
                isPublished: true,
                rating: 4.2,
                numReviews: 5
            }
        ];

        // Clear existing products to make it clean
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log('Successfully seeded 4 products!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding products:', err);
        process.exit(1);
    }
};

seedProducts();
