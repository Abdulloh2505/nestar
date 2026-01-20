import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardArticleService } from './board-article.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { BoardArticle, BoardArticles } from '../../libs/dto/board-article/board-article';
import { AllBoardArticlesInquiry, BoardArticleInput, BoardArticlesInquiry } from '../../libs/dto/board-article/board-article.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { BoardArticleUpdate } from '../../libs/dto/board-article/board-article.update';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Resolver()
export class BoardArticleResolver {
    constructor(private readonly boardArticleService: BoardArticleService) { }//dipendensi injection qildik
    

    @UseGuards(AuthGuard)// FAQAT AUTHENTICATE BULGAN. MEMBERLA  FOYDALANA OLADI
    @Mutation(() => BoardArticle)// BU MUTETION GRAPQL API BUNDAN FOYDALANIB YANGI ARTIKLE HOSIL QILAMIZ
    public async createBoardArticle(// NOMI ARTIKLIMIZNIZ 
        @Args('input') input: BoardArticleInput,// FRONTENTIMIZDA INPUTNI QABUL QILYAPTI, INPUTIMIZNI TIPINI BOARD ARTICLE INPUDA BERAMIZ
        @AuthMember('_id') memberId: ObjectId,//MEMBERIMIZNI ID SINI QABUL QILYAPMIZ
    ): Promise<BoardArticle> {
        console.log('Mutation: createBoardArticle');
        return await this.boardArticleService.createBoardArticle(memberId, input);//objecr argument paz
        //BOARD ARTICLE MODULINI INTENSINI HOSILQILDIK UNI CREATE BORD ARTICLE MATTHITI CHAQIRIB (.  ) ARGUMENT SIFARTIDA PAHQ QILDIK
    }

    @UseGuards(WithoutGuard)// HAMMA buni ishlatsa buladi
    @Query(() => BoardArticle)//BoardArticle DTO bilan qiymat qaytaradi
    public async getBoardArticle(// nomi ostida api hosil qilganmiz
        @Args('articleId') input: string, //Frontebtdan  articleId orqali string valyu keladi
        @AuthMember('_id') memberId: ObjectId,// agar authintecate bulgan member bulsa Object ID ni olib beradi
        // authintecate bulmagan bulsa NULL qaytaradi
    ): Promise<BoardArticle> {
        console.log('Query: getProperty');
        const articleId = shapeIntoMongoObjectId(input);// MONGO aricle ID ga aylantirib oldik
        return await this.boardArticleService.getBoardArticle(memberId, articleId);
        //boardArticleService object  getBoardArticle degan methitini chaqiryapmiz  hamda (. ) path qilyapmiz
    }


    @UseGuards(AuthGuard)
    @Mutation(() => BoardArticle)
    public async updateBoardArticle(
        @Args('input') input: BoardArticleUpdate,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<BoardArticle> {
        console.log('Mutation: updateBoardArticle');
        input._id = shapeIntoMongoObjectId(input._id);
        return await this.boardArticleService.updateBoardArticle(memberId, input);
    }


    @UseGuards(WithoutGuard)//bundan hamma foydalana oladi
    @Query(() => BoardArticles)
    public async getBoardArticles(
        @Args('input') input: BoardArticlesInquiry,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<BoardArticles> {
        console.log('Query: getBoardArticles');
        return await this.boardArticleService.getBoardArticles(memberId, input);
    }

      @UseGuards(AuthGuard)
        @Mutation(() => BoardArticle)
        public async likeTargetBoardArticle
        (@Args("articleId")  
        input: string, @AuthMember('_id') memberId: ObjectId):
         Promise<BoardArticle> {
          console.log("Mutation: likeTargetBoardArticle");
          const likeRefId = shapeIntoMongoObjectId(input);
          return await this.boardArticleService.likeTargetMember(memberId, likeRefId)
         
        }


    /** ADMIN  */
    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Query(() => BoardArticles)// QUERIY GrafQL api
    public async getAllBoardArticlesByAdmin(
        @Args('input') input: AllBoardArticlesInquiry,//clintimizni Admin pageda input nomli malumot talab etiladi
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<BoardArticles> {
        console.log('Query: getAllBoardArticlesByAdmin');
        return await this.boardArticleService.getAllBoardArticlesByAdmin(input);
    }

    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation(() => BoardArticle)
    public async updateBoardArticleByAdmin(
        @Args('input') input: BoardArticleUpdate,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<BoardArticle> {
        console.log('Mutation: updateBoardArticleByAdmin');
        input._id = shapeIntoMongoObjectId(input._id);
        return await this.boardArticleService.updateBoardArticleByAdmin(input);

    }


    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation(() => BoardArticle)
    public async removeBoardArticleByAdmin(
        @Args('articleId') input: string,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<BoardArticle> {
        console.log('Mutation: removeBoardArticleByAdmin');
        const articleId = shapeIntoMongoObjectId(input);
        return await this.boardArticleService.removeBoardArticleByAdmin(articleId);
    }
}
