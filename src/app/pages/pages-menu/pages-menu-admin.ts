import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS_Admin: NbMenuItem[] = [
  {
    title: "کارتابل ورودی",
    children: [
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
        title: "ارجاعات",
        link: "/pages/forms/AnalyzeList",
        icon: "file-text-outline",
      },
      {
        title: "اطلاعات ارجاع مهندسان",
        link: "/pages/forms/EngineerInfoDetail",
        icon: "file-text-outline",
      },
      {
        title: " تعیین مهندسین ضوابط",
        link: "/pages/forms/EngineerGasRule",
        icon: "file-text-outline",
      },
      {
        title: "جوشکاران",
        link: "/pages/forms/WeldersList",
        icon: "people-outline",
      },
      {
        title: "سرویس های دوره ای",
        link: "/pages/forms/PeriodicVisitsList",
        icon: "edit-2-outline",
      },
      {
        title: "قراردادها",
        link: "/pages/forms/ContractList",
        icon: "file-text-outline",
      },
      {
        title: "مجریان",
        link: "/pages/forms/ExecutersList",
        icon: "people-outline",
      },
      {
        title: "مشاوره",
        link: "/pages/forms/ConsultList",
        icon: "edit-2-outline",
      },
      {
        title: "مهندسان",
        link: "/pages/forms/EngineerList",
        icon: "people-outline",
      },
      {
        title: "تامین کنندگان ",
        link: "/pages/forms/SuppliersList",
        icon: "people-outline",
      },
      {
        title: "کنترل مضاعف",
        link: "/pages/forms/DoubleControlList",
        icon: "edit-2-outline",
      },
      {
        title: "نظارت عالی",
        link: "/pages/forms/GreatSupervisionList",
        icon: "people-outline",
      },
      {
        title: "همکاری مهندسان",
        link: "/pages/forms/EngineerCollaborationForm",
        icon: "file-text-outline",
      },
    ],
  },
  {
    title: "کارتابل مدیریت",
    children: [
      {
        title: "امور مالی",
        icon: "credit-card-outline",
        children: [
          {
            title: "تخفیف ها",
            link: "/pages/admin/PayDiscountList",
            // icon: "book-open-outline"
          },
          {
            title: "تراکنش ها",
            link: "/pages/admin/PayTransactionList",
            // icon: "book-open-outline"
          },
          {
            title: "ریز کارکرد / فیش حقوقی",
            link: "/pages/admin/EngineerPayment",
            // icon: "book-open-outline"
          },
          {
            title: "مدیریت پرداخت مهندسان",
            link: "/pages/admin/EngineerPaymentList",
            // icon: "book-outline"
          }
        ],
      },
      {
        title: "داشبورد ادمین",
        link: "/pages/admin/AdminPanel",
        icon: "home-outline",
      },
      {
      title: "روابط عمومی",
        icon: "inbox-outline",
        children: [
          {
            title: "پیام ها",
            link: "/pages/admin/MessageHandlingList",
            icon: "message-square-outline",
          },
          {
            title: "پیامک ها",
            link: "/pages/admin/SendSmsList",
            icon: "email-outline",
          },
          {
            title: "اخبار و اطلاعیه",
            link: "/pages/admin/NewsList",
            icon: "book-open-outline",
          },
        ]
      },
      {
        title: "تعریف و زمان بندی کارها",
        link: "/pages/admin/ScheduleConfigList",
        icon: "clock-outline",
      },
      {
        title: "مدیریت انصراف بازرسی ها",
        link: "/pages/admin/EngineerRejectionList",
        icon: "stop-circle-outline",
      },
      {
        title: "مدیریت شهر و شهرستان",
        icon: "pin-outline",
        children: [
          {
            title: "مدیریت شهر",
            link: "/pages/admin/TownList",
          },
          {
            title: "مدیریت شهرستان",
            link: "/pages/admin/CityList",
          }
        ],
      },
      {
        title: "مدیریت عملیات سیستم",
        link: "/pages/admin/ScheduleUpdate",
        icon: "briefcase-outline",
      },

      {
        title: "مدیریت کاربران",
        icon: "people-outline",
        children: [
          {
            title: "کاربران",
            link: "/pages/admin/mgn/users",
            icon: "person-outline",
          },
          {
            title: "ردپای کاربران",
            link: "/pages/admin/TableLogs",
            icon: "paper-plane-outline",
          },
          {
            title: "سوابق ورود",
            link: "/pages/admin/UserLogs",
            icon: "calendar-outline",
          },

        ],
      },
      {
        title: "مدیریت آپلودر عکس",
        link: "/pages/admin/FileUploaderList",
        icon: "cloud-upload-outline",
      },
      {
        title:"مدیریت تنظیمات سیستم",
        link: "/pages/admin/SystemSettingList",
        icon: "settings-2-outline",
      },

      {
        title: "مدیریت ارجاعات",
        icon: "settings-outline",
        children: [
          {
            title:"درخواست های بازرسی باز یا بلاک شده",
            link: "/pages/admin/FreeAnalyzeListItemList",
            icon: "upload-outline",
          },
          {
            title: "تنظیمات لیست ارجاعات",
            link: "/pages/admin/AnalyzeListManageList",
            icon: "options-2-outline",
          },
        ],
      },
      {
        title:"مدیریت مناطق مهندسین",
        link: "/pages/admin/ManageEngineerAreas",
        icon: "navigation-outline",
      },
    ],
  },
  {
    title: "کارتابل فشار قوی",
    children: [
      {
        title: " املاک فشار قوی",
        link: "/pages/forms/HPGasReqList",
        icon: 'home-outline'
      },
    ]
  }
];
