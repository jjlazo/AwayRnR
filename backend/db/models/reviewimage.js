'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    static associate(models) {
      // define association here
      ReviewImage.belongsTo(models.Review, { foreignKey: 'reviewId' });
    }
  }
  ReviewImage.init({
    reviewId: {
      type: DataTypes.INTEGER
    },
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ReviewImage',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return ReviewImage;
};
