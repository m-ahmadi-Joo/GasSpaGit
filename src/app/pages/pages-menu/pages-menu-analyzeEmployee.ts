import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS_AnalyzeEmployee: NbMenuItem[] = [
  {
    title: "کارتابل ورودی",
    children: [
      
      {
        title: "ارجاعات",
        link: "/pages/forms/AnalyzeList",
        icon: "file-text-outline"
      },
      {
        title: "املاک",
        link: "/pages/forms/GasReqList",
        icon: 'home-outline'
      },
      {
        title: "جوشکاران",
        link: "/pages/forms/WeldersList",
        icon: 'people-outline'
      },
      {
        title: "سرویس های دوره ای",
        link: "/pages/forms/PeriodicVisitsList",
        icon: 'edit-2-outline'
      },
      {
        title: "قراردادها",
        link: "/pages/forms/ContractList",
        icon: 'file-text-outline'
      },
      {
        title: "مجریان",
        link: "/pages/forms/ExecutersList",
        icon: 'people-outline'
      },
      {
        title: "مشاوره",
        link: "/pages/forms/ConsultList",
        icon: 'edit-2-outline'
      },
      {
        title: "مهندسان",
        link: "/pages/forms/EngineerList",
        icon: 'people-outline'
      },
    ],
  },
  // {
  //   title: "کارتابل مدیریت",
  //   children: [
  //     {
  //       title: "مدیریت کاربران",
  //       icon: "people-outline",
  //       children: [
  //         {
  //           title: "کاربران",
  //           link: "/pages/admin/mgn/users",
  //           icon: "person-outline"
  //         },
  //       ]
  //     },
  //     {
  //       title: "مدیریت عملیات سیستم",
  //       link: "/pages/admin/ScheduleUpdate",
  //       icon: "briefcase-outline"
  //     },
  //     {
  //     title: "روابط عمومی",
  //       icon: "inbox-outline",
  //       children: [
  //         {
  //           title: "اخبار و اطلاعیه",
  //           link: "/pages/admin/NewsList",
  //           icon: "book-open-outline",
  //         },
  //       ]
  //     },
  //   ]
  // },
];
