import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS_ApplicantAdditionalService: NbMenuItem[] = [
  {
    title: "کارتابل ورودی",
    children: [
      // {
      //   title: "ثبت اطلاعات",
      //   children: [

      {
        title: "سرویس های دوره ای",
        link: "/pages/forms/PeriodicVisitsList",
        icon: 'edit-2-outline'
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
  },
];
