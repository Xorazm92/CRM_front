import menuIcon from "../../images/icons/menu_icon.png";
import notificationIcon from "../../images/icons/notification.png";
import userIcon from "../../images/icons/user.png";
import usersThree from "../../images/icons/users-three.png";
import groupIcon from "../../images/icons/group.png";
import menuSecond from "../../images/icons/menu_second.png";
import cashIcon from "../../images/icons/cash.png";
import settingIcon from "../../images/icons/setting.png";
import courseIcon from "../../images/icons/course.png";
import lessonIcon from "../../images/icons/lesson.png";
import attendanceIcon from "../../images/icons/attendance.png";
import assignmentIcon from "../../images/icons/assignment.png";


// Har bir modul uchun to‘liq va aniq label va keylar
const modules = [
  { key: "groups", label: "Guruhlar", to: "/groups", icon: groupIcon },
  { key: "students", label: "O‘quvchilar", to: "/students", icon: usersThree },
  { key: "teachers", label: "O‘qituvchilar", to: "/teachers", icon: userIcon },
  { key: "courses", label: "Kurslar", to: "/course", icon: courseIcon },
  { key: "lessons", label: "Darslar", to: "/lessons", icon: lessonIcon },
  { key: "attendance", label: "Davomat", to: "/attendance", icon: attendanceIcon },
  { key: "assignments", label: "Topshiriqlar", to: "/assignments", icon: assignmentIcon },
  { key: "payments", label: "To‘lovlar", to: "/payments", icon: cashIcon },
  { key: "schedule", label: "Dars jadvali", to: "/schedule", icon: menuSecond },
  { key: "report", label: "Hisobotlar", to: "/report", icon: menuSecond },
];

const adminPanel = [
  { key: "admin-dashboard", label: "Statistika", to: "/admin", icon: settingIcon },
  { key: "admins", label: "Adminlar", to: "/admins", icon: settingIcon },
  { key: "users-management", label: "Barcha foydalanuvchilar", to: "/users-management", icon: settingIcon },

];

const universal = [
  { key: "dashboard", label: "Bosh sahifa", to: "/", icon: menuIcon },
  // { key: "notifications", label: "Bildirishnomalar", to: "/notifications", icon: notificationIcon }, // OLIB TASHLANDI
  // { key: "profile", label: "Profil", to: "/profile", icon: userIcon }, // PROFIL SIDEBARDAN OLIB TASHLANDI
];

export const getSidebarMenu = (role: string) => {
  switch (role) {
    case "SUPERADMIN":
      return [
        ...universal,
        { type: "group", label: "Modullar", children: modules },
        { type: "group", label: "Admin panel", children: adminPanel },
      ];
    case "ADMIN":
      return [
        ...universal,
        { type: "group", label: "Admin panel", children: adminPanel.slice(0, 2) }, // Statistika, Adminlar
        { type: "group", label: "Modullar", children: modules },
      ];
    case "MANAGER":
      return [
        ...universal,
        { type: "group", label: "Modullar", children: modules },
      ];
    case "TEACHER":
      return [
        ...universal,
        { type: "group", label: "Modullar", children: modules.filter(m =>
          ["groups", "students", "lessons", "attendance", "assignments", "report", "schedule"].includes(m.key)
        ) },
      ];
    case "STUDENT":
      return [
        ...universal,
        { type: "group", label: "Modullar", children: modules.filter(m =>
          ["groups", "lessons", "assignments", "payments", "discounts", "schedule"].includes(m.key)
        ) },
      ];
    default:
      return universal;
  }
};
