import { notification } from "antd";

export function showDeadlineNotification(title: string, deadline: string) {
  notification.warning({
    message: "Deadline yaqinlashmoqda!",
    description: `${title} topshirig‘i uchun deadline: ${deadline}`,
    duration: 8,
    placement: "topRight"
  });
}

export function showGradedNotification(student: string, assignment: string) {
  notification.success({
    message: "Baho qo‘yildi!",
    description: `${student} uchun ${assignment} topshirig‘i baholandi.`,
    duration: 6,
    placement: "topRight"
  });
}
