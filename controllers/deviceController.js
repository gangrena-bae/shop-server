const uuid = require("uuid");
const path = require("path");
const { Device, DeviceInfo } = require("../models/models");
const ApiError = require("../error/ApiError");
const { Op } = require("sequelize");

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info, stock, description } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));
      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
        stock,
        description,
      });

      if (info) {
        info = JSON.parse(info);
        info.forEach((i) =>
          DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: device.id,
          })
        );
      }

      return res.json(device);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getAll(req, res, next) {
    let { brandId, typeId, limit, page, searchTerm } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = (page - 1) * limit;
    let devices;
    try {
        let where = {};
        if (searchTerm) {
            where.name = { [Op.iLike]: `%${searchTerm}%` };
        }
        if (brandId) {
            where.brandId = brandId;
        }
        if (typeId) {
            where.typeId = typeId;
        }
        devices = await Device.findAndCountAll({
            where,
            limit,
            offset,
        });
        return res.json(devices);
    } catch (error) {
        console.error("Error fetching devices:", error);
        return res
            .status(500)
            .json({ error: "Error fetching devices - " + error.message });
    }
}

  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: "info" }],
    });

    return res.json(device);
  }
}

module.exports = new DeviceController();
