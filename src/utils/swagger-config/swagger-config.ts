import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder().setTitle('E-mobility Backend App').setDescription('API docs for the app').setVersion('0.0.2').build();
