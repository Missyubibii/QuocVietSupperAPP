/**
 * Home Screen Mock Data - Pure JSON (SDUI Compliant)
 * NO FUNCTIONS ALLOWED - Use action objects instead
 *
 * Action Object Format:
 * {
 *   type: 'NAVIGATE' | 'API' | 'OPEN_MODAL',
 *   target: string,
 *   payload?: Record<string, any>
 * }
 */

export const homeScreenMock = [
  // ===== HOME HEADER =====
  {
    id: "header",
    type: "HOME_HEADER",
    data: {
      userName: "Alex Trần",
      userAvatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
      notificationCount: 3,
      // ✅ Pure JSON action (not a function)
      notificationAction: {
        type: "NAVIGATE",
        target: "/debug",
        payload: {},
      },
    },
  },

  // ===== QUICK ACTIONS =====
  {
    id: "quick_actions",
    type: "QUICK_ACTIONS",
    data: {
      actions: [
        {
          id: "scan",
          label: "Quét QR",
          icon: "scan-line",
          action: {
            type: "OPEN_MODAL",
            target: "QR_SCANNER",
            payload: {},
          },
        },
        {
          id: "add_user",
          label: "Thêm Khách",
          icon: "user-plus",
          action: {
            type: "OPEN_MODAL",
            target: "ADD_CUSTOMER",
            payload: {},
          },
        },
        {
          id: "report",
          label: "Tạo Báo cáo",
          icon: "file-text",
          action: {
            type: "NAVIGATE",
            target: "/reports",
            payload: {},
          },
        },
        {
          id: "calendar",
          label: "Lịch hẹn",
          icon: "calendar-days",
          action: {
            type: "NAVIGATE",
            target: "/calendar",
            payload: {},
          },
        },
      ],
    },
  },

  // ===== STATS GRID =====
  {
    id: "stats",
    type: "STATS_GRID",
    data: {
      mainStat: {
        label: "Doanh thu T10",
        value: "2.4",
        unit: "Tỷ",
        change: "+12%",
        chartData: [40, 60, 45, 80, 50, 100], // Heights for mini bar chart (0-100)
      },
      subStats: [
        {
          label: "Deal Mới",
          value: "45",
          unit: "DEALS",
          change: "+5",
          color: "text-violet-600",
          bg: "bg-violet-50",
        },
        {
          label: "Tỉ lệ chốt",
          value: "32%",
          unit: "%",
          change: "-2%",
          color: "text-rose-500",
          bg: "bg-rose-50",
        },
      ],
    },
  },

  // ===== LEAD LIST =====
  {
    id: "leads",
    type: "LEAD_LIST",
    data: {
      title: "Khách hàng",
      leads: [
        {
          id: 1,
          name: "Sarah Nguyễn",
          role: "CEO @ TechCorp",
          status: "Đàm phán",
          value: "500 Tr",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
          tagColor: "bg-blue-100 text-blue-700",
          // ✅ Each lead has pure JSON action
          action: {
            type: "NAVIGATE",
            target: "/lead/1",
            payload: { leadId: 1 },
          },
        },
        {
          id: 2,
          name: "Minh Trần",
          role: "Product Lead",
          status: "Mới",
          value: "1.2 Tỷ",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
          tagColor: "bg-emerald-100 text-emerald-700",
          action: {
            type: "NAVIGATE",
            target: "/lead/2",
            payload: { leadId: 2 },
          },
        },
        {
          id: 3,
          name: "Jessica Lê",
          role: "Director",
          status: "Chốt",
          value: "800 Tr",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
          tagColor: "bg-purple-100 text-purple-700",
          action: {
            type: "NAVIGATE",
            target: "/lead/3",
            payload: { leadId: 3 },
          },
        },
        {
          id: 4,
          name: "Hoàng Nam",
          role: "Manager",
          status: "Tiềm năng",
          value: "300 Tr",
          avatar:
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop",
          tagColor: "bg-orange-100 text-orange-700",
          action: {
            type: "NAVIGATE",
            target: "/lead/4",
            payload: { leadId: 4 },
          },
        },
      ],
    },
  },
];
