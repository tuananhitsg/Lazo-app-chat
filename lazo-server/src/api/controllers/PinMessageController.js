const pinMessageService = require('../services/PinMessageService');

class PinMessageController {
    constructor(io) {
        this.io = io;
    }

    // [GET] /pin-messages/:conversationId
    getAllPinMessages = async (req, res, next) => {
        const { _id } = req;
        const { conversationId } = req.params;

        try {
            const pinMessages = await pinMessageService.getAll(
                conversationId,
                _id
            );

            res.status(200).json(pinMessages);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /pin-messages/:messageId
    addPinMessage = async (req, res, next) => {
        const { _id } = req;
        const { messageId } = req.params;

        try {
            const { conversationId, message } = await pinMessageService.add(
                messageId,
                _id
            );

            this.io
                .to(conversationId + '')
                .emit('new-message', conversationId, message);
            this.io
                .to(conversationId + '')
                .emit('action-pin-message', conversationId);

            res.status(201).json({ conversationId, message });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = PinMessageController;
