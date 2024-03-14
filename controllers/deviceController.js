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

  async delete(req, res) {
    try {
      const { id } = req.params;
      const device = await Device.destroy({
        where: { id },
      });
      if (device === 0) {
        return res.status(404).json({ message: "Device not found" });
      }
      return res.status(200).json({ message: "Device deleted successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error deleting device - " + error.message });
    }
  }
  async updatePrice(req, res) {
    try {
      const { id } = req.params;
      const { price } = req.body;
      const device = await Device.findByPk(id);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      device.price = price;
      await device.save();
      return res
        .status(200)
        .json({ message: "Price updated successfully", device });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating price - " + error.message });
    }
  }

  async updateInfo(req, res) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      const info = await DeviceInfo.findByPk(id);
      if (!info) {
        return res.status(404).json({ message: "Info not found" });
      }
      info.title = title;
      info.description = description;
      await info.save();
      return res
        .status(200)
        .json({ message: "Info updated successfully", info });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating info - " + error.message });
    }
  }

  async updateDeviceName(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const device = await Device.findByPk(id);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      device.name = name;
      await device.save();
      return res
        .status(200)
        .json({ message: "Device name updated successfully", device });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating device name - " + error.message });
    }
  }

  async updateDeviceDescription(req, res) {
    try {
      const { id } = req.params;
      const { description } = req.body;
      const device = await Device.findByPk(id);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      device.description = description;
      await device.save();
      return res
        .status(200)
        .json({ message: "Device description updated successfully", device });
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "Error updating device description - " + error.message,
        });
    }
  }

  async updateImage(req, res) {
    try {
      const { id } = req.params;
      const { img } = req.files;
      const fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));
      const device = await Device.findByPk(id);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      device.img = fileName;
      await device.save();
      return res
        .status(200)
        .json({ message: "Image updated successfully", device });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating image - " + error.message });
    }
  }
}

module.exports = new DeviceController();
