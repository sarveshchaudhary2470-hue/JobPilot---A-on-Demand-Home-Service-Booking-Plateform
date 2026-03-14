import mongoose from 'mongoose';
const uri = "mongodb+srv://sarveshchaudhary2470_db_user:pey3TXMIgTn2jBCa@cluster0.p7lcapg.mongodb.net/jobpilot?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri).then(() => {
    console.log("Connected successfully to Atlas!");
    process.exit(0);
}).catch(e => {
    console.error("Connection failed:", e.message);
    process.exit(1);
});
