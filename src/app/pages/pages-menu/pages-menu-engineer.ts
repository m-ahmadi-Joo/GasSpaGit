import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS_Engineer: NbMenuItem[] = [
  {
    title: "کارتابل ورودی",
    expanded: true,
    children: [
      // {
      //   title: "ثبت اطلاعات",
      //   children: [
      {
        title: "ارجاعات",
        link: "/pages/forms/AnalyzeList",
        icon: "file-text-outline",
      },
      {
        title: "اصلاحیه نقشه",
        link: "/pages/forms/EngineerEditMapList",
        icon: "map-outline",
      },
      {
        title: "املاک",
        link: "/pages/forms/GasReqList",
        icon: "home-outline",
      },
      {
        title: "امور مالی",
        // link: "/pages/forms/EngineerPayment/FinancialDepartment",
        link: "/pages/admin/EngineerPayment/FinancialDepartment",
        icon: "credit-card-outline",
      },
      // {
      //   title: "قراردادها",
      //   link: "/pages/forms/ContractList",
      //   icon: 'file-text-outline'
      // },
      {
        title: "سرویس های دوره ای",
        link: "/pages/forms/PeriodicVisitsList",
        icon: "edit-2-outline",
      },
      {
        title: "مشاوره",
        link: "/pages/forms/ConsultList",
        icon: "edit-2-outline",
      },
      // {
      //   title: "شکایات",
      //   link: "/pages/forms/ComplaintList",
      //   icon: 'message-square-outline'
      // },


      {
        title: "مرخصی ها",
        link: "/pages/forms/EngineerVacationList",
        icon: "file-text-outline",
      },
      {
        title: "پروفایل کاربری",
        link: "/pages/forms/EngineerProfileAndSignatureComponent",
        icon: "file-text-outline",
      },

      // {
      //   title: "همکاری مهندسان",
      //   link: "/pages/forms/EngineerCollaborationForm",
      //   icon: 'file-text-outline'
      // }

      {
        title: "وضعیت مناطق کاری",
        link: "/pages/forms/EngineerAreasStatus",
        icon: 'calendar-outline'
      }
    ],
    //  }
    // ]
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

export const MENU_ITEMS_Engineer_WithCollaboration: NbMenuItem[] = [
  {
    title: "کارتابل ورودی",
    expanded: true,
    children: [
      // {
      //   title: "ثبت اطلاعات",
      //   children: [
      {
        title: "ارجاعات",
        link: "/pages/forms/AnalyzeList",
        icon: "file-text-outline",
      },
      {
        title: "املاک",
        link: "/pages/forms/GasReqList",
        icon: "home-outline",
      },
      {
        title: "املاک قدیمی",
        link: "/pages/forms/OldGasReqList",
        icon: 'home-outline'
      },
      {
        title: "اصلاحیه نقشه",
        link: "/pages/forms/EngineerEditMapList",
        icon: "map-outline",
      },
      {
        title: "امور مالی",
        // link: "/pages/forms/EngineerPayment/FinancialDepartment",
        link: "/pages/admin/EngineerPayment/FinancialDepartment",
        icon: "credit-card-outline",
      },
      // {
      //   title: "قراردادها",
      //   link: "/pages/forms/ContractList",
      //   icon: 'file-text-outline'
      // },
      {
        title: "سرویس های دوره ای",
        link: "/pages/forms/PeriodicVisitsList",
        icon: "edit-2-outline",
      },
      {
        title: "مشاوره",
        link: "/pages/forms/ConsultList",
        icon: "edit-2-outline",
      },
      // {
      //   title: "شکایات",
      //   link: "/pages/forms/ComplaintList",
      //   icon: 'message-square-outline'
      // },


      {
        title: "مرخصی ها",
        link: "/pages/forms/EngineerVacationList",
        icon: "file-text-outline",
      },
      {
        title: "امضاء و عکس پرسنلی",
        link: "/pages/forms/EngineerProfileAndSignatureComponent",
        icon: "file-text-outline",
      },

      {
        title: "همکاری مهندسان",
        link: "/pages/forms/EngineerCollaborationForm",
        icon: 'file-text-outline'
      }
    ],
    //  }
    // ]
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
