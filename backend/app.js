const cors = require('cors');
const express = require('express');
const UserRoutes = require('./routes/UserRoutes');
const CarRoutes = require('./routes/CarRoutes');

const app = express();

app.use(express.json());
app.use(cors({
    credentials : true,
    oringin : 'http://localhost:3000'
}));

app.use(express.static('public'));

app.use('/users', UserRoutes);
app.use('/cars', CarRoutes);
app.listen(5000);
