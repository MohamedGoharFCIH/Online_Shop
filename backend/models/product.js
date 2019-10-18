const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema =  new Schema({
    name: { type: String, required:true},
    category: { type: String, required:true},
    status: { type: String, required:true},  /* new or old */
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    imagePath: { type: String, required: true },
    descripition: { type:String, required:false},
    sold: { type: Number, default: 0},
    price : {type: Number, required: true, min:1},
    buyer: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: false},
    approved: { type: Number, default: 0}
},
{timestamps: true}
);

module.exports = mongoose.model("Product", productSchema);