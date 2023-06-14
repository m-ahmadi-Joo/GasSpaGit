import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS_GASEMPLOYEEHP: NbMenuItem[] = [
  {
    title: "کارتابل ورودی",
    children: [


      {
        title: "املاک فشارقوی",
        link: "/pages/forms/HPGasReqList",
        icon: 'home-outline'
      },


      {
        title: "مجریان",
        link: "/pages/forms/ExecutersList",
        icon: 'people-outline'
      },
      {
        title: "مهندسان",
        link: "/pages/forms/EngineerList",
        icon: 'people-outline'
      },
    ],
  },
  {
    title: "کارتابل مدیریت",
    children: [
      {
        title: "روابط عمومی",
        icon: "inbox-outline",
        children: [
          {
            title: "اخبار و اطلاعیه",
            link: "/pages/admin/NewsList",
            icon: "book-open-outline",
          },
        ]
      },
    ]
  },
];
