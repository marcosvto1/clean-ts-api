import express from 'express';
import setupMiddlwares from './middlewares';

const app = express();
setupMiddlwares(app);

export default app;