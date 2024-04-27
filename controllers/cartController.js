const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const axios = require("axios");
const http = require("http");
const https = require("https");

class CartController {
  async create(req, res) {
    // Действия для создания записи в корзине
    let { firstName, lastName, city, phone, email, type, totalCost, cartList } =
      req.body;
    // Преобразование cartList из строки JSON обратно в массив объектов
    const parsedCartList = JSON.parse(cartList);

    // Формирование более читаемого списка товаров
    const readableCartList = parsedCartList
      .map(
        (item, index) =>
          `${index + 1}. Название: ${item.name}, Количество: ${
            item.count
          }, Цена за единицу: ${item.price}`
      )
      .join("\n");

    // Создание транспорта для отправки электронной почты через Gmail.com
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "woodman.rempe@gmail.com",
        pass: "jrxm qqnb pixe ihpw",
      },
    });

    // Опции письма
    const mailOptions = {
      from: "woodman.rempe@gmail.com",
      to: "woodman.mail.me@gmail.com",
      subject: "Новый заказ",
      text: `Поступил новый заказ от клиента.
      
      Список товаров:
      ${readableCartList}
      Полная стоимость: ${totalCost}
      Имя: ${firstName}
      Фамилия: ${lastName}
      Город: ${city}
      Телефон: ${phone}
      E-mail: ${email}
      Лицо: ${type === "1" ? "Частное" : "Юридическое"}`,
    };

    // Отправка письма
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Ошибка при отправке письма:", error);
      } else {
        console.log("Письмо успешно отправлено:", info.response);
      }
    });
    // Добавление отправки уведомления в Telegram
    const telegramToken = "7182476371:AAEE9_XgbZ5RdrH7d7c4mCAyrwelzuiKrfo";
    const chatId = "1254765240";
    const message = `Поступил новый заказ от ${firstName} ${lastName}. Полная стоимость: ${totalCost}. Подробности в почте.`;
    const httpAgent = new http.Agent({ family: 4 });
    const httpsAgent = new https.Agent({ family: 4 });

    axios
      .post(
        `https://api.telegram.org/bot${telegramToken}/sendMessage`,
        {
          chat_id: chatId,
          text: message,
        },
        {
          httpAgent: httpAgent,
          httpsAgent: httpsAgent,
        }
      )
      .then((response) => {
        console.log("Сообщение в Telegram успешно отправлено");
      })
      .catch((error) => {
        console.log("Ошибка при отправке сообщения в Telegram:", error);
      });

    // Возвращение ответа клиенту
    res.send("Запись успешно создана и письмо отправлено.");
  }
}

module.exports = new CartController();
