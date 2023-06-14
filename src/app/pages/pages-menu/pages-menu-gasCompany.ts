import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS_GasCompany: NbMenuItem[] = [
  {
    title: "کارتابل ورودی",
    expanded: true,
    children: [
      {
        title: "املاک",
        link: "/pages/forms/GasReqList",
        icon: "home-outline"
      },
      {
        title: "املاک قدیمی",
        link: "/pages/forms/OldGasReqList",
        icon: 'home-outline'
      },
    ]
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
    }
];
