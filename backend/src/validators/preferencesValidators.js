const { body } = require('express-validator');

const GENDERS_PREF      = ['male', 'female', 'nonbinary', 'any'];
const CHILDREN_PREF     = ['doesnt_want', 'want', 'has', 'maybe', 'any'];
const EDUCATION_PREF    = ['HS', 'BS', 'MS', 'PhD', 'Other', 'any'];
const BODY_TYPES_PREF   = ['slim', 'average', 'athletic', 'curvy', 'fat', 'other', 'any'];

module.exports = {
    createOrUpdatePreferences: [
        body('agePref.min')
            .optional()
            .isInt({ min: 18, max: 120 }).withMessage('Min age must be between 18 and 120'),
        body('agePref.max')
            .optional()
            .isInt({ min: 18, max: 120 }).withMessage('Max age must be between 18 and 120'),
        body().custom(body => {
            if (body.agePref && ('min' in body.agePref) && ('max' in body.agePref)) {
                if (body.agePref.min > body.agePref.max) {
                    throw new Error('Min age must be ≤ max age');
                }
            }
            return true;
        }),

        body('genderPref')
            .optional()
            .isIn(GENDERS_PREF).withMessage(`Preferred gender must be one of: ${GENDERS_PREF.join(', ')}`),

        body('havingChildrenPref')
            .optional()
            .isIn(CHILDREN_PREF).withMessage(`Preference on having children must be one of: ${CHILDREN_PREF.join(', ')}`),

        body('educationPref')
            .optional()
            .isIn(EDUCATION_PREF).withMessage(`Preferred education must be one of: ${EDUCATION_PREF.join(', ')}`),

        body('heightPref.min')
            .optional()
            .isInt({ min: 120, max: 220 }).withMessage('Minimal preferred height must be between 120 and 220'),
        body('heightPref.max')
            .optional()
            .isInt({ min: 120, max: 220 }).withMessage('Maximal preferred height must be between 120 and 220'),
        body().custom(body => {
            if (body.heightPref && ('min' in body.heightPref) && ('max' in body.heightPref)) {
                if (body.heightPref.min > body.heightPref.max) {
                    throw new Error('Preferred min height must be ≤ preferred max height');
                }
            }
            return true;
        }),

        body('bodyTypePref')
            .optional()
            .isIn(BODY_TYPES_PREF).withMessage(`Preferred body must be one of: ${BODY_TYPES_PREF.join(', ')}`),

        body('rangePref')
            .optional()
            .isInt({ min: 10, max: 1000 }).withMessage('Preferred distance must be a number (km) between 10 and 1000')
    ]
};
