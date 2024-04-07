import { getShanghaiDate } from "@/logger/util";
import logger from "@/logger/winston-config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
// console.log("transporter", transporter);
const verify = () => {
  return new Promise((resolve, reject) => {
    transporter.verify((error: any, success: any) => {
      if (error) {
        logger.error(error);
        reject(error);
      } else {
        // logger.info("服务器已准备好接收我们的消息");
        console.log("服务器已准备好接收我们的消息");
        resolve(success);
      }
    });
  });
};

const sendMail = (code: string, email: string) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "HHS系统 发送电子邮件", // 邮件标题
        text: "验证码为：" + code, // 邮件内容，code 为发送的验证码信息，这里的内容可以自定义
        html: `<b>嘿! </b><br> 这是我使用 Nodemailer 发送的第一条消息🎉👏 验证码为：${code}`,
      },
      (error, info) => {
        if (error) {
          logger.error(error);
          reject(error);
        }
        resolve(info);
        // only needed when using pooled connections
        transporter.close();
      }
    );
  });
};

const sendCheckinMail = (flag: boolean, content: string, email: string) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "原神签到结果" + (flag ? "成功" : "失败"), // 邮件标题
        text: "原神签到结果" + (flag ? "成功" : "失败"), // 邮件内容，code 为发送的验证码信息，这里的内容可以自定义
        html: `<div>
        <h1>接口执行结果</h1>
    <pre>
    ${content}
    </pre>
    <div>系统执行时间：<span id="executionTime">${getShanghaiDate()}</span></div>
        </div>`,
      },
      (error, info) => {
        if (error) {
          logger.error(error);
          reject(error);
        }
        // logger.info("Message sent successfully!");
        // console.log(nodemailer.getTestMessageUrl(info));
        resolve(info);
        // only needed when using pooled connections
        transporter.close();
      }
    );
  });
};

const sendEMail = async (code: string, email: string) => {
  try {
    await verify();
    await sendMail(code, email);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const sendCheckinEMail = async (
  flag: boolean,
  content: string,
  email: string
) => {
  try {
    await Promise.all([verify(), sendCheckinMail(flag, content, email)]);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export { sendEMail, sendCheckinEMail };
