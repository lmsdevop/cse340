const inventoryUtil = require('../../utilities/');

const validateClassificationName = (req, res, next) => {
    const { classificationName } = req.body;
    if (/^[a-zA-Z0-9]+$/.test(classificationName)) {
        next();
    } else {
        const formHTML = inventoryUtil.getAddClassificationForm(null, 'Classification name cannot contain spaces or special characters.');
        res.send(formHTML);
    }
};

module.exports = {
    validateClassificationName
};