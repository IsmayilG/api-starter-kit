import app from './app';
import { env } from './config/env';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${env.NODE_ENV}`);
    console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('💤 Process terminated.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n👋 SIGINT received. Shutting down...');
    server.close(() => {
        console.log('💤 Process terminated.');
        process.exit(0);
    });
});