import { messageResType } from "@/logger/util";
import { CompressionTypes, Kafka } from "kafkajs";

const kafka = process.env.KAFKA_URL
  ? new Kafka({
      clientId: "my-app",
      brokers: [process.env.KAFKA_URL],
    })
  : null;

export default kafka;

export const sendMsgToKafka = async (msg: messageResType) => {
  if (!kafka) {
    throw new Error("no kafka client");
  }
  const producer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic: "app-log-01",
    compression: CompressionTypes.GZIP,
    messages: [
      {
        value: JSON.stringify(msg),
      },
    ],
  });
  await producer.disconnect();
};
