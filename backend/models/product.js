const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    composition: {
        type: [String], // Array of strings
        required: true // Assuming composition is mandatory
    },
    dosage: {
        type: String,
        required: true
    },
    packing: {
        type: String,
        required: true
    },
    image: {
        type: [String], // Array of strings for image URLs or paths
        required: true // Assuming images are mandatory
    },
    benefits: {
        type: String,
        required: true
    },
    target: {
        type: [String], // Array of strings for target crops
        required: true // Assuming target crops are mandatory
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Product", productSchema);


// Sample Input : 
// {
//     "_id": "64d7a5f9e1b4f3a3c0d12346",
//     "name": "PRIDE SIZER",
//     "composition": ["xyz", "abc", "pqr"],
//     "dosage": "spray/driching - 0.5 ml to 1 ml/ltr of water",
//     "packing": "500 ml",
//     "image": ["ProductImage1.jpg", "ProductImage2.jpg"],
//     "benefits": "L-free amino acids, auxin, pgp powder, vitamin b12, stabilizer, sea weed extract. It is 100% organic agro-energizer & stimulant. It is a combination of essential amino acids and vitamins proven to be highly bioactive and world-famous for its effectiveness in horticulture belts. It has a unique ability for meeting the nutritional requirements of horticultural crops. Improves fruit quality and fruit shining. Encourages blossoming. Increases plant immunity & resistance to diseases. Produces high yield with organic quality.",
//     "target": ["banana", "custard apple", "guava", "sugarcane"],
//     "price": 1200
// }

