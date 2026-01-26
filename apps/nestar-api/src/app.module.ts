import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo'
import { AppResolver } from './app.resolver';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';
import { T } from './libs/types/common';
import { SocketModule } from './socket/socket.module';

// APP Module bu markaziy modul hisoblanadi
//Module decorti ekan
@Module({
  imports: [
     ConfigModule.forRoot(), // XAvsizligini taminlash maqsadida .env bilan ishlatish
     GraphQLModule.forRoot({
      driver: ApolloDriver,//Apollo Server dan foydalanishni bildiradi
      playground: true,
      uploads: false,//Fayl yuklash funksiyasini o'chiradi
      autoSchemaFile: true,
      formatError: (error: T) => {
        const graphQLFormattedError = {
         code: error?.extensions.code,
         message:
         error?.extensions?.exception?.response?.message || error?.extensions?.response?.message || error?.message,
        };
        console.log("GRAPHQL GLOBAL ERR:", graphQLFormattedError);
        return graphQLFormattedError
      }
     }), // erorlarni bunday qilishimizda sabab biz tushunarli qilish frontedchigayam errorlarni
     ComponentsModule, //Bu yerda biz modularni bir joyga joylayapmiz MODULARNI YEG"IB BERADIGAN JOY
      DatabaseModule, SocketModule,// TCP conection 
  ],
  controllers: [AppController],  // Bu yerda faqat ishlab turibdi degan mantiqni beradi
  providers: [AppService, AppResolver],//Business logic va GraphQL resolverlar Dependency Injection orqali inject qilinadi
})
export class AppModule {}
