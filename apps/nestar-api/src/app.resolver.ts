 import { Query, Resolver } from '@nestjs/graphql'

 @Resolver()
 export class AppResolver {
    //DTO + 
    @Query(() => String)
    public sayHello(): string {
        return 'GraphQL API Server';
    }
 }
 