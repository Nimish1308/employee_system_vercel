require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = 5000;
const app = express();

// app.use(cors({
//     origin: function (origin, callback) {
//         console.log("Origin:", origin); // Add this
//         if (origin === 'https://employee-system-record-frontend.vercel.app') {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE']
// }));

const allowedOrigins = [
    'https://employee-system-record-frontend.vercel.app',
    'http://localhost:3000'
];

// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             console.warn(`CORS blocked for origin: ${origin}`);
//             callback(null, false); // Don't throw, just deny
//         }
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// Must be before any route
// app.options('*', cors()); // Handle preflight requests


app.use(cors())

app.use(express.json({ limit: '10mb' }));

const URI = process.env.MONGODB_URI;
//DB Connection & Creation
mongoose.connect(URI).then(() => {
    console.log(`DB Connected`);

}).catch(() => {
    console.error(`DB Connection Failed`);

})

const empSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    gender: {
        type: String,
        required: true
    },

    field: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    photo: {
        type: String,
        required: false
    },

    lastUpdated: {
        type: Date,
        default: Date.now
    }

},
    { timestamps: true }
)

// Middleware to update `lastUpdated` on each save
empSchema.pre('save', function (next) {
    this.lastUpdated = new Date();
    next();
});

const Emp = mongoose.model("employee", empSchema);

//API
app.get("/", (req, res) => {
    res.send(`API is running`);
})

//create
app.post("/create", async (req, res) => {
    try {
        const empBody = req.body;
        const empObject = new Emp(empBody);
        const empSave = await empObject.save();
        res.send(empSave)
    } catch (error) {
        res.send(error)
    }
})

//Find by id
app.get("/findbyid/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Emp.findById({ _id: id });
        res.send(data);
    } catch (error) {
        res.send(error)
    }
})

//Find all
app.get("/find", async (req, res) => {
    try {
        const data = await Emp.find({});
        res.send(data);
    } catch (error) {
        res.send(error)
    }
})

//Update
app.put("/update/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Emp.findByIdAndUpdate({ _id: id }, req.body, { new: true });
        res.send(data);
    } catch (error) {
        res.send(error)
    }
})

//Delete
app.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Emp.findByIdAndDelete({ _id: id });
        res.send(data);
    } catch (error) {
        res.send(error)
    }
})
app.listen(PORT, () => {
    console.log(`Server is running at port no: ${PORT}`);

})


