const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

class CartController {
  async create(req, res) {
    // Действия для создания записи в корзине
    let { firstName, lastName, city, phone, email, type } = req.body;
    // Создание транспорта для отправки электронной почты через Mail.ru
    const transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        auth: {
          user: "woodman.rempe@gmail.com",
          pass: "jrxm qqnb pixe ihpw",
        },
      })
    );

    // Опции письма
    const mailOptions = {
      from: "woodman.rempe@gmail.com",
      to: "woodman.mail.me@gmail.com",
      subject: "Новый заказ",
      text: `Поступил новый заказ от клиента.
      Имя:${firstName}
      Фамилия:${lastName}
      Город:${city}
      Телефон:${phone}
      E-mail:${email}
      Лицо:${type}`,
    };

    // Отправка письма
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Ошибка при отправке письма:", error);
      } else {
        console.log("Письмо успешно отправлено:", info.response);
      }
    });

    // Возвращение ответа клиенту
    res.send("Запись успешно создана и письмо отправлено.");
  }
}

module.exports = new CartController();
