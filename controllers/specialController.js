const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

class SpecialController {
  async create(req, res) {
    // Действия для создания записи в корзине
    let { name, email, text } = req.body;
    // Создание транспорта для отправки электронной почты через Gmail.com
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
      subject: "Особый заказ",
      text: `Новое сообщение:
      От:${name}. E-mail:${email}.
      Текст сообщения:${text}`,
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

module.exports = new SpecialController();
