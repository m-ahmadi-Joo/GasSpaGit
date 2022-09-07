import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS_Pishkhan: NbMenuItem[] = [
  {
    title: "کارتابل ورودی",
    expanded: true,
    children: [
      // {
      //   title: "ثبت اطلاعات",
      //   children: [
      {
        title: "املاک",
        link: "/pages/forms/GasReqList",
        icon: "home-outline"
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
