import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';
import { graphqlUploadExpress } from "graphql-upload";
import * as express from 'express';

async function bootstrap() {   //bootstrap function bu defin qismi
  const app = await NestFactory.create(AppModule); //boostrap ishga tushganda payti NestFactoriyni create degan methhoti chaqiryapmiz va  Appmodulni argument sifatida path qilyapmiz
  //va natijani kutib constanta Appga tenglaymiz
  // constanta App bu EXpress + NestJS = qorishmasi
  app.useGlobalPipes(new ValidationPipe());// NOTUG"RI malumotlarni filtrlash vazifaasinin bajaradi kelentda kelgan malumotni API ga kirishdan oldin tekshirdi
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors({origin: true, credentials: true });

  app.use(graphqlUploadExpress({ maxFileSize: 15000000, maxFiles: 10 }));
  app.use('/uploads', express.static('./uploads'));
  await app.listen(process.env.PORT_API ?? 3000);//bu EXPRESS ni METH-ti
}
bootstrap(); //bootstrap function bu call qismi


/**VALIDATION 4ga bulinadi
 FRONTEND VALIDATION
 BACKEND VALIDATION
 DATABASE VALIDATION
 DTO
 */
  