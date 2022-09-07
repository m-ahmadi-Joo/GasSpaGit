import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS_HPManager: NbMenuItem[] = [
  {
    title: "کارتابل ورودی",
    expanded: true,
    children: [
          {
            title: "املاک",
            link: "/pages/forms/GasReqList"
          },
          // {
          //   title: "مشاوره",
          //   // icon: 'person-outline',
          //   link: "/pages/forms/ConsultList"
          // },
          // {
          //   title: "شکایات",
          //   link: "/pages/forms/ComplaintList",
          //   icon: 'edit-2-outline'
          // },
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
