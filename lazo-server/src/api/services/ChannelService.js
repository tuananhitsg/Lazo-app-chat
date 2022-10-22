const Channel = require('../models/Channel');
const Member = require('../models/Member');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const messageService = require('../services/MessageService');

const MyError = require('../exception/MyError');

const CREATE_CHANNEL = 'CREATE_CHANNEL';
const UPDATE_CHANNEL = 'UPDATE_CHANNEL';
const DELETE_CHANNEL = 'DELETE_CHANNEL';

class ChannelService {
    getAllByConversationId = async (conversationId, userId) => {
        await Conversation.getByIdAndUserId(conversationId, userId);

        const channels = await Channel.find(
            { conversationId },
            { name: 1, conversationId: 1, createdAt: 1 },
        );

        const channelsResult = [];
        for (const channelEle of channels) {
            const { _id, name, createdAt } = channelEle;

            const numberUnread = await this.getNumberUnread(conversationId, channelEle._id, userId);

            channelsResult.push({
                _id,
                name,
                createdAt,
                numberUnread,
                conversationId,
            });
        }

        return channelsResult;
    };

    getNumberUnread = async (conversationId, channelId, userId) => {
        const member = await Member.findOne({ conversationId, userId });

        const { lastViewOfChannels } = member;
        const index = lastViewOfChannels.findIndex((ele) => ele.channelId + '' == channelId + '');

        if (index !== -1) {
            const { lastView } = lastViewOfChannels[index];

            return await Message.countDocuments({
                createdAt: { $gt: lastView },
                channelId,
            });
        } else {
            return await Message.countDocuments({ channelId });
        }
    };

    add = async (channelRequest, userId) => {
        await this.validateChannelRequest(channelRequest, userId);

        const { name, conversationId } = channelRequest;

        const newChannel = new Channel({
            name,
            conversationId,
        });

        const saveChannel = await newChannel.save();
        await Member.updateMany(
            { conversationId },
            {
                $push: {
                    lastViewOfChannels: {
                        channelId: saveChannel._id,
                        lastView: new Date(),
                    },
                },
            },
        );

        const message = await messageService.addNotifyMessage(
            CREATE_CHANNEL,
            conversationId,
            userId,
        );

        return {
            channel: saveChannel,
            message,
        };
    };

    update = async (channelRequest, userId) => {
        const { _id, name } = channelRequest;

        const channel = await Channel.getById(_id);
        const { conversationId } = channel;

        await this.validateChannelRequest({ name, conversationId }, userId);

        await Channel.updateOne({ _id }, { $set: { name } });

        const message = await messageService.addNotifyMessage(
            UPDATE_CHANNEL,
            conversationId,
            userId
        );

        return {
            channel: {
                _id,
                name,
                conversationId,
            },
            message,
        };
    }

    validateChannelRequest = async (channelRequest, userId) => {
        const { name, conversationId } = channelRequest;

        if (!name || typeof name !== 'string' || name.length === 0 || name.length > 100) {
            throw new MyError('Channel name invalid,  0 < length <= 100 ');
        }

        const { type } = await Conversation.getByIdAndUserId(conversationId, userId);

        if (!type) {
            throw new MyError('Only conversation group');
        }

        if (await Channel.findOne({ name, conversationId })) {
            throw new MyError('Channel name exists');
        }
    };
}

module.exports = new ChannelService();