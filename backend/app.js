require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const authRoutes = require('./routes/auth');
const linkRoutes = require('./routes/link');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
