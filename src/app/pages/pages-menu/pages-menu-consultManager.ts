import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS_ConsultManager: NbMenuItem[] = [
  {
    title: "کارتابل ورودی",
    // expanded: true,
    children: [
      // {
      //   title: "ثبت اطلاعات",
      //   children: [
      {
        title: "املاک",
        link: "/pages/forms/GasReqList",
        icon: "home-outline"
      },
      {
        title: "مشاوره",
        link: "/pages/forms/ConsultList",
        icon: "edit-2-outline"
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
