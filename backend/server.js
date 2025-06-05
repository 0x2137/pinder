require('./src/config/env');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./src/config/db');

const authRoutes        = require('./src/routes/auth');
const profileRoutes     = require('./src/routes/profiles');
const userRoutes        = require('./src/routes/users');
const preferencesRoutes = require('./src/routes/preferences');
const matchRoutes       = require('./src/routes/match');
const discoveryRoutes   = require('./src/routes/discovery');
const { sendError }     = require('./src/utils/response');

async function createApp() {
    const app = express();

    app.use(cors());
    app.use(helmet());
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100
        })
    );
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    await connectDB();

    app.use('/api/auth', authRoutes);
    app.use('/api/profiles', profileRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/preferences', preferencesRoutes);
    app.use('/api/match', matchRoutes);
    app.use('/api/discovery', discoveryRoutes);

    app.use((err, req, res, next) => {
        console.error(err);
        return sendError(res, 500, 'Something went wrong');
    });

    return app;
}

async function bootstrap() {
    const app = await createApp();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

if (require.main === module) {
    bootstrap().catch(err => console.error(err));
}

module.exports = { createApp };
