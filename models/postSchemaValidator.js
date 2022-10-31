const BaseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML:{
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean != value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.postSchema = Joi.object({
    post: Joi.object({
        image: Joi.string().escapeHTML(),
        title: Joi.string().min(3).required().escapeHTML(),
        description: Joi.string().escapeHTML(),
        city: Joi.string().required().escapeHTML(),
        state: Joi.string().min(2).required().escapeHTML(),
        type: Joi.string().required().escapeHTML(),
        tradeFor: Joi.string().required().escapeHTML()
    }).required()
})

