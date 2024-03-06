"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.addColumn("devices", "stock", {
    //   type: Sequelize.BOOLEAN,
    //   allowNull: false,
    //   defaultValue: true,
    // });
    await queryInterface.addColumn("devices", "description", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("devices", "stock");
    await queryInterface.removeColumn("devices", "description");
  },
};
