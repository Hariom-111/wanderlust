require('dotenv').config();
const mongoose = require('mongoose');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const Listing = require('./models/listing'); // adjust path

const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

mongoose.connect(process.env.ATLASDB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to DB"))
.catch(err => console.log(err));

const updateListings = async () => {
    const listings = await Listing.find({ geometry: { $exists: false } });
    for (let listing of listings) {
        if (!listing.location) continue; // skip if no location field
        const response = await geocodingClient.forwardGeocode({
            query: listing.location,
            limit: 1
        }).send();
        if (response.body.features.length) {
            const coords = response.body.features[0].geometry.coordinates;
            listing.geometry = {
                type: "Point",
                coordinates: coords
            };
            await listing.save();
            console.log(`Updated ${listing._id} with coordinates ${coords}`);
        } else {
            console.log(`No coordinates found for ${listing.location}`);
        }
    }
    console.log("All old listings updated!");
    mongoose.connection.close();
};

updateListings();
