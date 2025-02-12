const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://sudharsan6078:123@cluster0.xo0jy.mongodb.net/seminarHall',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );

        console.log("Database Connected");
    } catch (error) {
        console.error("Database Connection Failed:", error);
        process.exit(1); // Exit the process if connection fails
    }
};

module.exports = connectDB;