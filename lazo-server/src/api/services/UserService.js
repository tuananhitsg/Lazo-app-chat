const User = require('../models/User');
const Friend = require('../models/Friend');
const FriendRequest = require('../models/FriendRequest');
const Conversation = require('../models/Conversation');

const NotFoundError = require('../exception/NotFoundError');
const ObjectId = require('mongoose').Types.ObjectId;

const FRIEND_STATUS = ['FRIEND', 'FOLLOWER', 'YOU_FOLLOW', 'NOT_FRIEND'];

class UserService {
    getUserSummaryInfo = async (username) => {
        const user = await User.findOne({ username }, '-_id username name avatar isActived');

        if (!user) {
            throw new NotFoundError('User');
        }

        return user;
    };

    getStatusFriendOfUser = async (_id, searchUsername) => {
        await User.checkById(_id);
        const searchUserResult = await User.findByUsername(searchUsername);
        const searchUserId = searchUserResult._id;

        searchUserResult.status = await this.getFriendStatus(_id, searchUserId);
        searchUserResult.numberCommonGroup = await this.getNumberCommonGroup(_id, searchUserId);
        searchUserResult.numberCommonFriend = await this.getNumberCommonFriend(_id, searchUserId);

        return searchUserResult;
    };

    getStatusFriendOfUserById = async (_id, searchUserId) => {
        await User.checkById(_id);
        const searchUserResult = await User.getById(searchUserId);

        searchUserResult.status = await this.getFriendStatus(_id, searchUserId);
        searchUserResult.numberCommonGroup = await this.getNumberCommonGroup(
            _id,
            searchUserId
        );
        searchUserResult.numberCommonFriend = await this.getNumberCommonFriend(
            _id,
            searchUserId
        );

        return searchUserResult;
    }

    getNumberCommonGroup = async (myId, searchUserId) => {
        return await Conversation.countDocuments({
            type: true,
            members: { $all: [myId, searchUserId] },
        });
    };

    getNumberCommonFriend = async (myId, searchUserId) => {
        let friendIdsOfSearchUser = await Friend.aggregate([
            { $match: { userIds: { $in: [ObjectId(searchUserId)] } } },
            {
                $project: { _id: 0, userIds: 1 },
            },
            {
                $unwind: '$userIds',
            },
            {
                $match: { userIds: { $ne: ObjectId(searchUserId) } },
            },
        ]);
        friendIdsOfSearchUser = friendIdsOfSearchUser.map((friendIdEle) => friendIdEle.userIds);
        
        friendIdsOfSearchUser = friendIdsOfSearchUser.filter(
            (friendIdEle) => friendIdEle + '' != myId,
        );

        const commonFriends = await Friend.find({
            $and: [{ userIds: { $in: [...friendIdsOfSearchUser] } }, { userIds: { $in: [myId] } }],
        });

        return commonFriends.length;
    };

    getFriendStatus = async (myId, searchUserId) => {
        let status = FRIEND_STATUS[3];
        // check xem có bạn bè không
        if (await Friend.existsByIds(myId, searchUserId)) {
            status = FRIEND_STATUS[0];
        }
        // check đối phương  gởi lời mời
        else if (await FriendRequest.existsByIds(searchUserId, myId)) {
            status = FRIEND_STATUS[1];
        }
        // check mình gởi lời mời
        else if (await FriendRequest.existsByIds(myId, searchUserId)) {
            status = FRIEND_STATUS[2];
        }
        return status;
    };
}

module.exports = new UserService();
