import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS_GASEMPLOYEEEXCEPTSHIRAZ: NbMenuItem[] = [
  {
    title: "کارتابل ورودی",
    // expanded: true,
    children: [
          {
            title: "املاک",
            link: "/pages/forms/GasReqList",
            icon: 'home-outline'
          },
          {
            title: "ارجاعات",
            link: "/pages/forms/AnalyzeList",
            icon: "file-text-outline"
          },
          {
            title: "جوشکاران",
            link: "/pages/forms/WeldersList",
            icon: 'people-outline'
          },
          {
            title: "مشاوره",
            link: "/pages/forms/ConsultList",
            icon: 'edit-2-outline'
          },
          {
            title: "مجریان",
            link: "/pages/forms/ExecutersList",
            icon: 'people-outline'
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
