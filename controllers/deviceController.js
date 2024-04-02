const uuid = require("uuid");
const path = require("path");
const { Device, DeviceInfo } = require("../models/models");
const ApiError = require("../error/ApiError");
const { Op } = require("sequelize");
const fs = require("fs");

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info, stock, description } = req.body;
      const files = req.files.img; // img теперь может быть массивом файлов
      let fileNames = [];

      if (Array.isArray(files)) {
        // Если загружено несколько файлов
        files.forEach((file) => {
          const fileName = uuid.v4() + ".jpg";
          file.mv(path.resolve(__dirname, "..", "static", fileName));
          fileNames.push(fileName);
        });
      } else {
        // Если загружен один файл
        const fileName = uuid.v4() + ".jpg";
        files.mv(path.resolve(__dirname, "..", "static", fileName));
        fileNames.push(fileName);
      }

      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: JSON.stringify(fileNames), // Сохраняем массив имен файлов в виде строки JSON
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

    if (device) {
      // Попытка разобрать поле img
      try {
        device.img = JSON.parse(device.img);
      } catch (error) {
        console.error(`Error parsing img field for device ${id}:`, error);
        device.img = []; // Установка значения по умолчанию
      }

      // Попытка разобрать поле additionalFiles
      try {
        device.additionalFiles = JSON.parse(device.additionalFiles);
      } catch (error) {
        console.error(
          `Error parsing additionalFiles field for device ${id}:`,
          error
        );
        device.additionalFiles = []; // Установка значения по умолчанию
      }
    }

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
  async updateDeviceType(req, res) {
    try {
      const { id } = req.params;
      const { typeId } = req.body;

      const device = await Device.findByPk(id);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }

      device.typeId = typeId;
      await device.save();

      return res
        .status(200)
        .json({ message: "Device type updated successfully", device });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating device type - " + error.message });
    }
  }

  // Метод для обновления бренда товара
  async updateDeviceBrand(req, res) {
    try {
      const { id } = req.params;
      const { brandId } = req.body;

      const device = await Device.findByPk(id);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }

      device.brandId = brandId;
      await device.save();

      return res
        .status(200)
        .json({ message: "Device brand updated successfully", device });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating device brand - " + error.message });
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
      return res.status(500).json({
        message: "Error updating device description - " + error.message,
      });
    }
  }

  async updateImage(req, res, next) {
    try {
      const { id } = req.params;
      if (!req.files || !req.files.img) {
        return res.status(400).json({ message: "No image file provided." });
      }
      const device = await Device.findByPk(id);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }

      // Удаление старых изображений
      if (device.img) {
        const existingImages = JSON.parse(device.img);
        existingImages.forEach((img) => {
          const imgPath = path.resolve(__dirname, "..", "static", img);
          if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath); // Удаление файла
          }
        });
      }

      // Продолжение добавления новых изображений...
      const files = req.files.img;
      let fileNames = [];
      const filesToProcess = Array.isArray(files) ? files : [files];
      const uploadPromises = filesToProcess.map((file) => {
        const fileName = uuid.v4() + ".jpg";
        return file
          .mv(path.resolve(__dirname, "..", "static", fileName))
          .then(() => fileName)
          .catch((err) => Promise.reject(err));
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      fileNames = [...uploadedFiles];
      device.img = JSON.stringify(fileNames);
      await device.save();

      return res
        .status(200)
        .json({ message: "Image updated successfully", device });
    } catch (error) {
      console.error("Error updating image:", error);
      return res
        .status(500)
        .json({ message: "Error updating image - " + error.message });
    }
  }
  async updateAdditionalFiles(req, res) {
    try {
      const { id } = req.params;
      if (!req.files || !req.files.additionalFiles) {
        return res
          .status(400)
          .json({ message: "No additional files provided." });
      }
      const device = await Device.findByPk(id);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }

      // Удаление старых дополнительных файлов
      if (device.additionalFiles) {
        const existingFiles = JSON.parse(device.additionalFiles);
        existingFiles.forEach((file) => {
          const filePath = path.resolve(__dirname, "..", "static", file);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Удаление файла
          }
        });
      }

      // Добавление новых дополнительных файлов
      const files = req.files.additionalFiles;
      let fileNames = [];
      const filesToProcess = Array.isArray(files) ? files : [files];
      const uploadPromises = filesToProcess.map((file) => {
        const fileName = uuid.v4() + path.extname(file.name);
        return file
          .mv(path.resolve(__dirname, "..", "static", fileName))
          .then(() => fileName)
          .catch((err) => Promise.reject(err));
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      fileNames = [...uploadedFiles];
      device.additionalFiles = JSON.stringify(fileNames);
      await device.save();

      return res
        .status(200)
        .json({ message: "Additional files updated successfully", device });
    } catch (error) {
      console.error("Error updating additional files:", error);
      return res.status(500).json({
        message: "Error updating additional files - " + error.message,
      });
    }
  }
}

module.exports = new DeviceController();
