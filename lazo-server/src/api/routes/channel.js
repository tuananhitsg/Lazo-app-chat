const router = require('express').Router();
const ChannelController = require('../controllers/ChannelController');
const channelRouter = (io) => {
    const channelController = new ChannelController(io);

    router.get('/:conversationId', channelController.getAllByConversationId);
    router.post('', channelController.add);
    router.put('', channelController.update);

    return router;
};

module.exports = channelRouter;