import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Schema } from 'mongoose';
import { BoardArticle, BoardArticles } from '../../libs/dto/board-article/board-article';
import { AllBoardArticlesInquiry, BoardArticleInput, BoardArticlesInquiry } from '../../libs/dto/board-article/board-article.input';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { Direction, Message } from '../../libs/enums/common.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { BoardArticleStatus } from '../../libs/enums/board-article.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { BoardArticleUpdate } from '../../libs/dto/board-article/board-article.update';
import { lookupMember, shapeIntoMongoObjectId } from '../../libs/config';

@Injectable()
export class BoardArticleService {
    constructor(
        @InjectModel('BoardArticle') private readonly boardArticleModel: Model<BoardArticle>,//BORT ARTICLENI QAYTARADI
        private readonly memberService: MemberService,
        private readonly viewService: ViewService,
    ) { }

    public async createBoardArticle(memberId: ObjectId, input: BoardArticleInput): Promise<BoardArticle> {
        //createBoardArticle 2 TA PARAMETIRI BOR MEBER ID. HAMDA INPUT
        input.memberId = memberId;// INPUT NI MEBER ID SINI MEMBER ID GA TENGLASHTIRYAPMIZ,
        //TRY CATCH DA FOYDALANISHDAN MAQSAD DATABESE WALIDATIONGA BOG'LIQ HATOLIK BULSAS UZIMIZNI HATOLIGIMIZNI KURSATADI
        try {
            const result = await this.boardArticleModel.create(input);
            //BORDT ARTIKLE SKIMA MODULIMIZNI  create METHITIDAN foydalanib
            await this.memberService.memberStatsEditor({
                //object
                _id: memberId,
                targetKey: 'memberArticles',
                modifier: 1,//statistikani birga oshirdik
            });

            return result;
        } catch (err) {
            console.log('Error, Service.model:', err.message);
            throw new BadRequestException(Message.CREATE_FAILED);
        }
    }


    public async getBoardArticle(memberId: ObjectId, articleId: ObjectId): Promise<BoardArticle> {// asyc bulgani uchun Promisda BoardArticle qaytaradi
        //(memberId: ObjectId, articleId: ObjectId) ObJECT ID tipe bilan belgilangan
        const search: T = {// searching Objectni hosil qilyapmiz
            _id: articleId,
            articleStatus: BoardArticleStatus.ACTIVE,
        };//faqat aktiv articlarni kura oladi foydalanuvchilar


        const targetBoardArticle: BoardArticle = await this.boardArticleModel.findOne(search).lean().exec();
        // bu yerda targetBoardArticle Search qilyapmiz va LEAN biriktiryapmiz sababi targetBoardArticle modify qila olishimiz kerak
        if (!targetBoardArticle) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        if (memberId) {// agar Authunteket bulgan memberbulsa shu mantiqni ishga tushuradi
            const viewInput = { memberId: memberId, viewRefId: articleId, viewGroup: ViewGroup.ARTICLE };
            const newView = await this.viewService.recordView(viewInput);
            if (newView) {
                await this.boardArticleStatsEditor({ _id: articleId, targetKey: 'articleViews', modifier: 1 });
                targetBoardArticle.articleViews++;
            }

            // meLiked
        }

        targetBoardArticle.memberData = await this.memberService.getMember(null, targetBoardArticle.memberId);
        return targetBoardArticle;
    }

    public async updateBoardArticle(memberId: ObjectId, input: BoardArticleUpdate): Promise<BoardArticle> {
        const { _id, articleStatus } = input;//Distraction qilyapmiz 

        const result = await this.boardArticleModel
            .findOneAndUpdate({ _id: _id, memberId: memberId, articleStatus: BoardArticleStatus.ACTIVE }, input, {
                //.findOneAndUpdate chaqiryapmiz hamda 3 ta argumentni pas qilyapmiz
                new: true,
            })
            .exec();

        if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);//update bulmagan bulsa ishlaydi

        if (articleStatus === BoardArticleStatus.DELETE) {//agar biz uchiradigan bulsak 
            await this.memberService.memberStatsEditor({//memberservis modulini intensidan memberStatsEditor ni cahqiri olyapmiz
                _id: memberId,
                targetKey: 'memberArticles',
                modifier: -1,
            });
        }
//FAQAT UZIMIZNIKINI UZGARTIRA OLAMIZ USER BULSAK
        return result;
    }

    public async getBoardArticles(memberId: ObjectId, input: BoardArticlesInquiry): Promise<BoardArticles> {
  const { articleCategory, text } = input.search;// buyerrda Distraction qilyapmiz
  const match: T = { articleStatus: BoardArticleStatus.ACTIVE };// match qilyapmiz article statusi ACTIVE bulganlarni
  const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };// standart sortimizni hosil qilyapmiz

  if (articleCategory) match.articleCategory = articleCategory;//articleCategory talab etilgan bulsa kiritamiz buni destraction dan oldik
  if (text) match.articleTitle = { $regex: new RegExp(text, 'i') };
  if (input.search?.memberId) {
    match.memberId = shapeIntoMongoObjectId(input.search.memberId);
  }

  console.log('match:', match);

  const result = await this.boardArticleModel
    .aggregate([// static methtini ishga tushuryapmizz
      { $match: match },
      { $sort: sort },
      {
        $facet: {// match va sortlarni biriktiri fasedan foydalanyapmiz
          list: [//yangi agrigation
            { $skip: (input.page - 1) * input.limit },
            { $limit: input.limit },
            // meLiked
            lookupMember,
            { $unwind: '$memberData' },
          ],
          metaCounter: [{ $count: 'total' }],//meta counter nomli agrigation
        },
      },
    ])
    .exec();

  if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND); //agar data kelmasa bu hatolikni beradi

  return result[0];
}
/**ADMIN */

public async getAllBoardArticlesByAdmin(input: AllBoardArticlesInquiry): Promise<BoardArticles> {
  const { articleStatus, articleCategory } = input.search;
  const match: T = {};
  const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

  if (articleStatus) match.articleStatus = articleStatus;
  if (articleCategory) match.articleCategory = articleCategory;

  const result = await this.boardArticleModel
    .aggregate([
      { $match: match },
      { $sort: sort },
      {
        $facet: {
          list: [
            { $skip: (input.page - 1) * input.limit },
            { $limit: input.limit },
            lookupMember,
            { $unwind: '$memberData' },
          ],
          metaCounter: [{ $count: 'total' }],
        },
      },
    ])
    .exec();

  if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

  return result[0];
}


public async updateBoardArticleByAdmin(input: BoardArticleUpdate): Promise<BoardArticle> {
  const { _id, articleStatus } = input;

  const result = await this.boardArticleModel
    .findOneAndUpdate({ _id: _id, articleStatus: BoardArticleStatus.ACTIVE }, input, {
      new: true,
    })
    .exec();

  if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

  if (articleStatus === BoardArticleStatus.DELETE) {
    await this.memberService.memberStatsEditor({
      _id: result.memberId,
      targetKey: 'memberArticles',
      modifier: -1,
    });
  }

  return result;
}

public async removeBoardArticleByAdmin(articleId: ObjectId): Promise<BoardArticle> {
  const search: T = { _id: articleId, articleStatus: BoardArticleStatus.DELETE };
  const result = await this.boardArticleModel.findOneAndDelete(search).exec();
  if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

  return result;
}





    public async boardArticleStatsEditor(input: StatisticModifier): Promise<BoardArticle> {
        const { _id, targetKey, modifier } = input;
        return await this.boardArticleModel
            .findByIdAndUpdate(
                _id,
                { $inc: { [targetKey]: modifier } },
                {
                    new: true,
                },
            )
            .exec();
    }
}