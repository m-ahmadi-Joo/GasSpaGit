import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS_Executor: NbMenuItem[] = [
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
      {
        title: "املاک قدیمی",
        link: "/pages/forms/OldGasReqList",
        icon: 'home-outline'
      },
      {
        title: "سرویس های دوره ای",
        link: "/pages/forms/PeriodicVisitsList",
        icon: 'edit-2-outline'
      },
      {
        title: "قراردادها",
        link: "/pages/forms/ContractList",
        icon: "file-text-outline"
      },
      {
        title: "مشاوره",
        link: "/pages/forms/ConsultList",
        icon: "edit-2-outline"
      },
      // {
      //   title: "شکایات",
      //   link: "/pages/forms/ComplaintList",
      //   icon: 'message-square-outline'
      // },
    ]
  } ,
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
