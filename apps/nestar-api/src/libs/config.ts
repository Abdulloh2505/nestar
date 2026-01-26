import { ObjectId } from "bson";

export const availableAgentSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews', 'memberRank'];
export const availableMemberSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews'];

export const availableOptions = ['propertyBarter', 'propertyRent'];
export const availablePropertySorts = [
  'createdAt',
  'updatedAt',
  'propertyLikes',
  'propertyViews',
  'propertyRank',
  'propertyPrice',
];

export const availableBoardArticleSorts = ['createdAt', 'updatedAt', 'articleLikes', 'articleViews']
export const availableCommentSorts = ['createdAt', 'updatedAt'];

/**  IMAGE CONFIGURATION  **/

import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { T } from "./types/common";
import { from } from "form-data";

export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForImage = (filename: string) => {
  const ext = path.parse(filename).ext;
  return uuidv4() + ext;
};

export const shapeIntoMongoObjectId = (target: any) => {
  return typeof target === "string" ? new ObjectId(target) : target;
};

export const lookupAuthMemberLiked = (memberId: T, targetRefId: string = '$_id'/**PROPERTYMIZ IDsi */) => {
  return {// bu bacendni ichida ishga tushmayapti Data baseda ishga tushyapti
    $lookup: {// BUNI BIZ KOMPLEX QUERY DEB ATADIK 2 TA DATA SETNI SOLISHTIRADI VA MATCHBULADIGAN BULSA BERADI MALUMOTNI
      from: 'likes',// colection ichida
      let: {
        localLikeRefId: targetRefId,// Propertiy Id siga teg buladi. || Agent ID   || Jone follow qilgan odamlarni Id si
        localMemberId: memberId,// murojat qilayotgam memberrimiz Id si Daniyel 
        localMyFavorite: true,// test. qilish uchun
      },
      pipeline: [
        {
          $match: {
            $expr: {// agar birdan ortiq malumot bulganda EXPr ishlatilaer ekan
              $and: [
                { $eq: ['$likeRefId', '$$localLikeRefId'] },//Like reef Idni Propertiymiz Id siga tenglashtiryapdi
                { $eq: ['$memberId', '$$localMemberId'] }//Memberimizni Id si colectiondagi MemnerId bilan tekshiryapdi
              ],// $$ bitasi dabasniki  2kinchisi localVeriblni olib kilishi uchun
            },
          },
        },
        {
          $project: {// bu kelgan malumotni manashunday shakilda chiqar
            _id: 0,
            memberId: 1,
            likeRefId: 1,
            myFavorite: '$$localMyFavorite',
          },
        },
      ],
      as: 'meLiked',//ohiri shun chanarsan ni bita qilib beryapti
    },
  };
};

interface lookupAuthMemberFollowed {
  followerId: T,
  followingId: string;
}
export const lookupAuthMemberFollowed = (input: lookupAuthMemberFollowed) => {
  const { followerId, followingId } = input;
  return {// BUNI BIZ KOMPLEX QUERY DEB ATADIK 2 TA DATA SETNI SOLISHTIRADI VA MATCHBULADIGAN BULSA BERADI MALUMOTNI
    $lookup: {
      from: 'follows',
      let: {
        localFollowerId: followerId,// bu Daniyel
        localFollowingId: followingId,// BU Jonga follow bulganlar yani [ justin .leo, ali]
        localMyFavorite: true,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$followerId', '$$localFollowerId'] },
                { $eq: ['$followingId', '$$localFollowingId'] }
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
           followerId: 1,
            followingId: 1,
            myFollowing: '$$localMyFavorite',
          },
        },
      ],
      as: 'meFollowed',
    },
  };
};


export const lookupMember = {
  $lookup: {
    from: 'members',//members kolectiondan qidiradi
    localField: 'memberId',//propertiy. member id
    foreignField: '_id',//
    as: 'memberData',//member data kurinishida qaytar
  },
};

export const lookupFollowingData = {
  $lookup: {
    from: 'members',
    localField: 'followingId',
    foreignField: '_id',
    as: 'followingData',
  },
};

export const lookupFollowerData = {
  $lookup: {
    from: 'members',
    localField: 'followerId',
    foreignField: '_id',
    as: 'followerData',
  },
};

export const lookupFavorite = {
  $lookup: {
    from: 'members',//colectionda izla
    localField: 'favoriteProperty.mebemrId',
    foreignField: '_id',//members ._id
    as: 'favoriteProperty.memberData',// like ichidagi favoruteProperty+memberData
  },
};

export const lookupVisit = {
  $lookup: {
    from: 'members',
    localField: 'visitedProperty.memberId',
    foreignField: '_id',
    as: 'visitedProperty.memberData',
  },
};