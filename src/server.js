import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import router from './routers/index.js';
import { logger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

dotenv.config();
const PORT = Number(process.env.PORT) || 3000;

export const setupServer = () => {
  const app = express();
  const { serve, setup } = swaggerDocs();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(logger);
  app.use(router);
  app.use('/api-docs', serve, setup); // Використовуйте serve і setup тут
  app.use('*', notFoundHandler);
  app.use(errorHandler);
  app.use('/uploads', express.static(UPLOAD_DIR));
  // app.use('/api-docs', swaggerDocs());

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
