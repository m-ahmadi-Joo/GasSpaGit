import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS_Owner: NbMenuItem[] = [
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
          icon: 'home-outline'
        },
        {
          title: "قراردادها",
          link: "/pages/forms/ContractList",
          icon: 'file-text-outline'
        },
        {
          title: "مشاوره",
          link: "/pages/forms/ConsultList",
          icon: 'edit-2-outline'
        },
      // {
      //   title: "شکایات",
      //   link: "/pages/forms/ComplaintList",
      //   icon: 'message-square-outline'
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
        },
<<<<<<< HEAD
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
=======
        // {
        //   title: "کارتابل فشار قوی",
        //   children: [
        //     {
        //       title: " املاک فشار قوی",
        //       link: "/pages/forms/HPGasReqList",
        //       icon: 'home-outline'
        //     },
        //   ]
        // }
>>>>>>> a269bfa71fc54170ae9e52028a2a610af2476ecc
];
