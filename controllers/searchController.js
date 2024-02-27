const { Device } = require("../models/models");
const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");

class SearchController {
  async searchByName(req, res) {
    const { searchTerm } = req.query;

    try {
      const devices = await Device.findAll({
        where: {
          name: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      });
      return res.json(devices);
    } catch (error) {
      console.error("Ошибка при поиске девайсов:", error);
      return next(ApiError.internal("Ошибка при поиске девайсов"));
    }
  }
}

module.exports = new SearchController();
