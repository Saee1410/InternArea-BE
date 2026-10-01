import "dotenv/config";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import internshipRoutes from "./routes/internshipRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import resumeRoutes from "./routes/resumeRoute.js";
import premiumRoute from "./routes/premiumRoute.js";
import resumeOtpRoute from "./routes/resumeOtpRoute.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import frenchLanguageRoute from "./routes/frenchLanguageRoute.js";
import friendRoutes from "./routes/friendRoutes.js";
import publicPostRoutes from "./routes/publicPostRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";  


// ==========================================
// APP INITIALIZATION
// ==========================================

const app = express();

const PORT = process.env.PORT || 8000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
    cors({
        origin: function (origin, callback) {

            const allowedOrigins = [
                "https://intern-area-fe.vercel.app",
                "http://localhost:5173",
            ];

            // Postman / server-to-server requests
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            console.log("❌ CORS BLOCKED ORIGIN:", origin);

            return callback(
                new Error("Not allowed by CORS")
            );
        },

        credentials: true,

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],

        optionsSuccessStatus: 204,
    })
);
app.use(express.json());

// ==========================================
// [DIAGNOSTIC] REQUEST LOGGER
// ==========================================
app.use((req, res, next) => {
    const start = Date.now();
    const origin = req.headers["origin"] || "No-Origin";
    const userAgent = req.headers["user-agent"] || "No-UA";

    console.log(`\n📡 [REQ-START] ${req.method} ${req.originalUrl}`);
    console.log(`   ├─ Origin: ${origin}`);
    console.log(`   ├─ IP: ${req.ip || req.socket.remoteAddress}`);
    console.log(`   └─ User-Agent: ${userAgent}`);

    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`🏁 [REQ-END] ${req.method} ${req.originalUrl} → Status: ${res.statusCode} (${duration}ms)\n`);
    });

    next();
});

// ==========================================
// ENVIRONMENT CHECK
// ==========================================

console.log(
    "Razorpay Key Loaded:",
    !!process.env.RAZORPAY_KEY_ID
);

console.log(
    "Razorpay Secret Loaded:",
    !!process.env.RAZORPAY_KEY_SECRET
);


// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", authRoute);

app.use("/api/internships", internshipRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/premium", premiumRoute);

app.use("/api/admin", adminRoute);

app.use("/api/resumes", resumeRoutes);

app.use("/api/resume-otp", resumeOtpRoute);

app.use("/api/payment", paymentRoutes);

app.use("/api/french-language", frenchLanguageRoute);

app.use("/api/friends", friendRoutes);

app.use("/api/public-posts", publicPostRoutes);

app.use("/api/applications", applicationRoutes);


// ==========================================
// ROOT ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.send("Backend Server Running");
});


// ==========================================
// MONGODB + SERVER
// ==========================================

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {

        console.log("MongoDB Connected Successfully");

        app.listen(PORT, () => {
            console.log(
                `Server running on port ${PORT}`
            );
        });

    })
    .catch((err) => {

        console.error(
            "MongoDB Connection Error:",
            err.message
        );

    });



// import dotenv from "dotenv";

// dotenv.config();

// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";
// import authRoute from "./routes/authRoute.js";
// import adminRoute from "./routes/adminRoute.js";
// import internshipRoutes from "./routes/internshipRoutes.js";
// import jobRoutes from "./routes/jobRoutes.js";
// import profileRoutes from "./routes/profileRoutes.js";
// import resumeRoutes from "./routes/resumeRoute.js";
// import premiumRoute from "./routes/premiumRoute.js";
// import resumeOtpRoute from "./routes/resumeOtpRoute.js";
// import paymentRoutes from "./routes/paymentRoutes.js";


// const app = express();

// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URL)
// .then(() => {
//     console.log("MongoDb Connected");
// })
// .catch((err) => {
//     console.log(err);
// })


// app.use("/api/auth", authRoute);

// app.use("/api/internships", internshipRoutes);

// app.use("/api/jobs",jobRoutes);

// app.use("/api/profile", profileRoutes);

// app.use("/api/premium", premiumRoute);

// app.use("/api/admin", adminRoute);

// app.use("/api/resumes", resumeRoutes);

// app.use("/api/resume-otp", resumeOtpRoute);

// app.use("/api/payment", paymentRoutes);

// app.get("/", (req,res)=>{
//     res.send("Backend Server Running");
// });




// const PORT = process.env.PORT || 8000;

// app.listen(PORT,()=>{
//     console.log(`Server running on port ${PORT}`);
// });