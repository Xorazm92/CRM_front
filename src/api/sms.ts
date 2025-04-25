import instance from "./axios";

export const sendSms = (phone_number: string, message: string) => {
  return instance.post("/send-sms", { phone_number, message });
};
