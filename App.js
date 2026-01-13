import React, { useState, useEffect } from 'react';
import { 
  Hexagon, 
  Users, 
  Zap, 
  Activity, 
  Search, 
  Phone, 
  MessageSquare, 
  Plus, 
  TrendingUp, 
  MoreVertical,
  Settings,
  X,
  Fingerprint,
  BarChart3,
  Calendar,
  Bell,
  Briefcase,
  FileText,
  PieChart,
  Box,
  ScanLine,
  UserPlus,
  FileBarChart,
  Home,
  Menu,
  QrCode,
  CalendarDays,
  CheckCircle2,
  Clock,
  Camera,
  Save
} from 'lucide-react';

/* --- HƯỚNG DẪN CHO EXPO / REACT NATIVE ---
   1. npm install lucide-react-native
   2. import { Hexagon, Users, ... } from 'lucide-react-native';
*/

// --- Dữ liệu (Mock Data) ---
const STATS = [
  { label: 'Doanh thu', value: '2.4 Tỷ', unit: 'VND', change: '+12%', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Deal Mới', value: '45', unit: 'DEALS', change: '+5', color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Tỉ lệ chốt', value: '32%', unit: '%', change: '-2%', color: 'text-rose-500', bg: 'bg-rose-50' },
];

const MY_APPS = [
  { id: 1, name: 'Nhân sự', icon: Users, color: 'bg-orange-100 text-orange-600' },
  { id: 2, name: 'Kế toán', icon: PieChart, color: 'bg-blue-100 text-blue-600' },
  { id: 3, name: 'Kho', icon: Box, color: 'bg-emerald-100 text-emerald-600' },
  { id: 4, name: 'Báo cáo', icon: FileBarChart, color: 'bg-purple-100 text-purple-600' },
  { id: 5, name: 'Dự án', icon: Briefcase, color: 'bg-pink-100 text-pink-600' },
];

const QUICK_ACTIONS = [
  { id: 'scan', label: 'Quét QR', icon: QrCode },
  { id: 'add_user', label: 'Thêm Khách', icon: UserPlus },
  { id: 'report', label: 'Tạo Báo cáo', icon: FileText },
  { id: 'calendar', label: 'Lịch hẹn', icon: CalendarDays },
];

const LEADS = [
  { 
    id: 1, 
    name: 'Sarah Nguyễn', 
    role: 'CEO @ TechCorp', 
    status: 'Đàm phán', 
    value: '500 Tr',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    tagColor: 'bg-blue-100 text-blue-700'
  },
  { 
    id: 2, 
    name: 'Minh Trần', 
    role: 'Product Lead', 
    status: 'Mới', 
    value: '1.2 Tỷ',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    tagColor: 'bg-emerald-100 text-emerald-700'
  },
  { 
    id: 3, 
    name: 'Jessica Lê', 
    role: 'Director', 
    status: 'Chốt', 
    value: '800 Tr',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    tagColor: 'bg-purple-100 text-purple-700'
  },
  { 
    id: 4, 
    name: 'Hoàng Nam', 
    role: 'Manager', 
    status: 'Tiềm năng', 
    value: '300 Tr',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop',
    tagColor: 'bg-orange-100 text-orange-700'
  },
];

const PIPELINE = [
  { stage: 'Mới', count: 5, color: 'bg-blue-500' },
  { stage: 'Liên hệ', count: 8, color: 'bg-indigo-500' },
  { stage: 'Gặp', count: 3, color: 'bg-violet-500' },
  { stage: 'Đề xuất', count: 2, color: 'bg-fuchsia-500' },
  { stage: 'Chốt', count: 12, color: 'bg-emerald-500' },
];

const NOTIFICATIONS = [
  { id: 1, title: 'Thanh toán thành công', desc: 'Hợp đồng #HD-2024 nhận được 500tr', time: '5p trước', icon: CheckCircle2, color: 'text-emerald-500' },
  { id: 2, title: 'Nhắc nhở cuộc họp', desc: 'Họp với team Marketing lúc 14:00', time: '30p trước', icon: Clock, color: 'text-orange-500' },
  { id: 3, title: 'Lead mới', desc: 'Có 3 khách hàng tiềm năng mới từ Web', time: '1h trước', icon: Users, color: 'text-blue-500' },
];

// --- Base Components ---

const GlassCard = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`relative bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-[20px] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_25px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 ${className}`}
  >
    {children}
  </div>
);

// --- Generic Bottom Sheet ---
const BottomSheet = ({ isOpen, onClose, children, title, height = "h-[85%]" }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    if (isOpen) setMounted(true);
    else setTimeout(() => setMounted(false), 300); // Wait for animation
  }, [isOpen]);

  if (!isOpen && !mounted) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div 
        className={`relative w-full ${height} bg-[#FAFAFA] rounded-t-[32px] shadow-2xl overflow-hidden transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) flex flex-col pointer-events-auto ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Handle */}
        <div className="absolute top-0 inset-x-0 h-8 flex justify-center pt-3 z-30 bg-gradient-to-b from-white/80 to-transparent backdrop-blur-sm cursor-pointer" onClick={onClose}>
            <div className="w-12 h-1.5 bg-slate-300 rounded-full"></div>
        </div>

        {title && (
            <div className="px-6 pt-8 pb-2 border-b border-slate-100 bg-white/50 backdrop-blur-sm z-20">
                <h2 className="text-xl font-bold text-slate-800">{title}</h2>
            </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-8 relative">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Popups Specific Content ---

const NotificationContent = () => (
    <div className="space-y-4">
        {NOTIFICATIONS.map(notif => (
            <div key={notif.id} className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className={`mt-1 p-2 bg-slate-50 rounded-full h-fit ${notif.color}`}>
                    <notif.icon className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 text-sm">{notif.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{notif.desc}</p>
                    <span className="text-[10px] text-slate-400 font-bold mt-2 block">{notif.time}</span>
                </div>
            </div>
        ))}
        <button className="w-full py-3 mt-4 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
            Xem tất cả thông báo
        </button>
    </div>
);

const AddCustomerContent = ({ onClose }) => (
    <div className="space-y-5">
        <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition-all">
                <Camera className="w-8 h-8" />
            </div>
        </div>
        
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Họ và tên</label>
                <input type="text" placeholder="Nhập tên khách hàng" className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-500 font-medium" />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Số điện thoại</label>
                <input type="tel" placeholder="090..." className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-500 font-medium" />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Công ty</label>
                <input type="text" placeholder="Tên doanh nghiệp" className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-500 font-medium" />
            </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ghi chú</label>
                <textarea rows="3" placeholder="Ghi chú thêm..." className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-500 font-medium"></textarea>
            </div>
        </div>

        <button onClick={onClose} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-600/30 active:scale-95 transition-transform flex items-center justify-center gap-2 mt-4">
            <Save className="w-5 h-5" /> Lưu Khách Hàng
        </button>
    </div>
);

const QuickMenuContent = ({ onClose }) => (
    <div className="grid grid-cols-2 gap-4">
        {[
            { label: 'Tạo Deal', icon: TrendingUp, color: 'bg-blue-50 text-blue-600' },
            { label: 'Thêm Công việc', icon: CheckCircle2, color: 'bg-orange-50 text-orange-600' },
            { label: 'Lên Lịch hẹn', icon: Calendar, color: 'bg-purple-50 text-purple-600' },
            { label: 'Ghi chú nhanh', icon: FileText, color: 'bg-emerald-50 text-emerald-600' },
        ].map((item, idx) => (
            <button key={idx} onClick={onClose} className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all active:scale-95">
                <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center mb-3`}>
                    <item.icon className="w-6 h-6" />
                </div>
                <span className="font-bold text-slate-700 text-sm">{item.label}</span>
            </button>
        ))}
    </div>
);

const ScanQRModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="absolute inset-0 z-[60] bg-black flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
            <button onClick={onClose} className="absolute top-8 right-6 p-2 bg-white/20 rounded-full backdrop-blur-md">
                <X className="w-6 h-6" />
            </button>
            <div className="relative w-64 h-64 border-2 border-white/50 rounded-3xl overflow-hidden flex items-center justify-center mb-8">
                 <div className="absolute inset-0 border-[3px] border-blue-500 rounded-3xl animate-pulse"></div>
                 <div className="w-full h-1 bg-blue-400 absolute top-0 animate-[scan_2s_ease-in-out_infinite]" style={{boxShadow: '0 0 20px #60A5FA'}}></div>
                 <ScanLine className="w-16 h-16 text-white/20" />
            </div>
            <p className="font-bold text-lg mb-2">Quét mã QR</p>
            <p className="text-white/60 text-sm">Di chuyển camera đến vùng chứa mã</p>
            
            <style>{`
                @keyframes scan {
                    0% { top: 0; }
                    50% { top: 100%; }
                    100% { top: 0; }
                }
            `}</style>
        </div>
    )
}

// --- Main App ---

export default function FuturisticLightCRM() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Popup States
  const [activePopup, setActivePopup] = useState(null); // 'notifications', 'add_customer', 'quick_menu'
  const [isScanning, setIsScanning] = useState(false);

  const handleQuickAction = (actionId) => {
      if (actionId === 'scan') setIsScanning(true);
      if (actionId === 'add_user') setActivePopup('add_customer');
      // Other actions...
  }

  return (
    <div className="min-h-screen bg-slate-200 flex justify-center items-center p-0 md:p-8 font-sans antialiased text-slate-800">
      
      {/* Device Frame */}
      <div className="w-full h-[100dvh] md:h-[850px] md:max-w-[400px] bg-[#F5F5F7] md:rounded-[48px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden relative flex flex-col md:border-[8px] border-slate-300 ring-1 ring-white/50">
        
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[80px] pointer-events-none mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-[80px] pointer-events-none mix-blend-multiply" />

        {/* --- Header --- */}
        <header className="px-5 pt-10 pb-3 flex justify-between items-center z-10 bg-white/60 backdrop-blur-md sticky top-0 border-b border-white/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-white shadow-sm">
               <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" alt="Profile" />
            </div>
            <div className="flex flex-col">
               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Xin chào</span>
               <span className="text-lg font-extrabold text-slate-800 leading-none">Alex Trần</span>
            </div>
          </div>
          
          <button 
            onClick={() => setActivePopup('notifications')}
            className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 relative active:scale-95 hover:bg-slate-50 transition-transform"
          >
            <Bell className="w-5 h-5" strokeWidth={2.5} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white animate-pulse"></span>
          </button>
        </header>

        {/* --- Scrollable Content --- */}
        <div className="flex-1 overflow-y-auto px-5 py-5 pb-28 hide-scrollbar z-10 relative">
          
          {/* Smart Search */}
          <div className="mb-6 relative">
            <div className="bg-white rounded-[18px] shadow-sm border border-slate-100 h-12 flex items-center px-4 gap-3 overflow-hidden">
               <Search className="w-5 h-5 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Tìm kiếm..." 
                 className="bg-transparent border-none text-slate-800 text-sm placeholder:text-slate-400 w-full focus:outline-none font-medium h-full" 
               />
               <button className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200">
                  <Fingerprint className="w-5 h-5" />
               </button>
            </div>
          </div>

          {/* My Apps */}
          <div className="mb-7">
             <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-slate-800">Ứng dụng</h3>
                <button className="text-blue-600 text-xs font-bold px-2 py-1 rounded hover:bg-blue-50">Xem tất cả</button>
             </div>
             <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 px-1">
                {MY_APPS.map((app) => (
                   <div key={app.id} className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer group active:scale-95 transition-transform">
                      <div className={`w-16 h-16 rounded-[22px] ${app.color} flex items-center justify-center shadow-sm border-2 border-white shadow-slate-200`}>
                         <app.icon className="w-8 h-8" strokeWidth={2} />
                      </div>
                      <span className="text-xs font-semibold text-slate-600 text-center">{app.name}</span>
                   </div>
                ))}
             </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-3 mb-7">
             {QUICK_ACTIONS.map(action => (
                <button 
                    key={action.id} 
                    onClick={() => handleQuickAction(action.id)}
                    className="flex flex-col items-center gap-1.5 group"
                >
                   <div className="w-14 h-14 rounded-[20px] bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-700 group-active:bg-slate-50 group-active:scale-95 transition-all hover:border-blue-200 hover:shadow-md">
                      <action.icon className="w-7 h-7" strokeWidth={1.5} />
                   </div>
                   <span className="text-[11px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors text-center leading-tight">{action.label}</span>
                </button>
             ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <GlassCard className="col-span-2 p-5 bg-gradient-to-br from-white to-blue-50/50 flex items-center justify-between h-28">
               <div>
                   <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1.5">Doanh thu T10</p>
                   <div className="flex items-baseline gap-2">
                      <h2 className="text-3xl font-black text-slate-800 tracking-tight">2.4 <span className="text-blue-600 text-xl">Tỷ</span></h2>
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+12%</span>
                   </div>
               </div>
               <div className="h-full flex items-end pb-1">
                   <div className="flex items-end gap-1.5 h-12">
                      {[40, 60, 45, 80, 50].map((h, i) => (
                         <div key={i} className="w-2.5 bg-blue-500/20 rounded-t-md transition-all hover:bg-blue-500" style={{height: `${h}%`}}></div>
                      ))}
                      <div className="w-2.5 bg-blue-600 rounded-t-md h-full"></div>
                   </div>
               </div>
            </GlassCard>

            {STATS.slice(1).map((stat, idx) => (
              <GlassCard key={idx} className="p-4 flex flex-col justify-between h-28 bg-white">
                <div className="flex justify-between items-start">
                   <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                     <Activity className="w-5 h-5" strokeWidth={2.5} />
                   </div>
                   <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${stat.change.includes('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {stat.change}
                   </span>
                </div>
                <div>
                  <span className="text-xl font-bold text-slate-800">{stat.value}</span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">{stat.label}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Pipeline */}
          <div className="mb-6">
             <div className="flex justify-between items-center mb-3">
               <h3 className="text-sm font-bold text-slate-800">Pipeline</h3>
               <MoreVertical className="w-5 h-5 text-slate-400" />
             </div>
             
             <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 flex justify-between items-end h-36">
                {PIPELINE.map((col, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer w-full">
                    <div className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{col.count}</div>
                    <div 
                      className={`w-3 rounded-full transition-all duration-500 group-hover:w-4 ${col.color} opacity-80`} 
                      style={{ height: `${(col.count / 15) * 100 + 15}px` }}
                    ></div>
                     <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors truncate w-full text-center">{col.stage}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Leads List */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3">Khách hàng</h3>
            <div className="space-y-2.5">
               {LEADS.map((lead) => (
                 <div 
                    key={lead.id} 
                    onClick={() => setSelectedItem(lead)}
                    className="bg-white p-3.5 rounded-[20px] shadow-sm border border-slate-100 flex items-center gap-3.5 cursor-pointer active:scale-[0.98] transition-all hover:shadow-md hover:border-blue-100"
                  >
                    <img src={lead.avatar} className="w-11 h-11 rounded-[16px] object-cover shadow-sm" alt="" />
                    
                    <div className="flex-1 min-w-0">
                       <h4 className="font-bold text-slate-800 text-sm truncate mb-0.5">{lead.name}</h4>
                       <p className="text-xs text-slate-500 font-medium truncate">{lead.role}</p>
                    </div>

                    <div className="text-right">
                       <div className="text-xs font-extrabold text-blue-600">{lead.value}</div>
                       <div className={`mt-1 inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase ${lead.tagColor.replace('text-', 'bg-opacity-20 text-')}`}>
                          {lead.status}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* --- Navigation Island --- */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-[88%]">
          <div className="bg-white/95 backdrop-blur-xl border border-white/60 rounded-[28px] p-2 flex justify-between items-center shadow-[0_15px_40px_-10px_rgba(0,0,0,0.12)]">
            
            <NavButton icon={Home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavButton icon={Users} active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
            
            {/* Center Button (Big Plus) */}
            <div 
                className="relative -mt-10 group cursor-pointer mx-2"
                onClick={() => setActivePopup('quick_menu')}
            >
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-[14px] opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-500/30 border-[5px] border-[#F5F5F7] transform transition-transform group-hover:scale-105 group-active:scale-95">
                 <Plus className={`w-7 h-7 transition-transform duration-300 ${activePopup === 'quick_menu' ? 'rotate-45' : ''}`} strokeWidth={3} />
              </div>
            </div>

            <NavButton icon={BarChart3} active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
            <NavButton icon={Settings} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
            
          </div>
        </div>

        {/* --- POPUPS & MODALS --- */}

        {/* 1. Customer Detail Sheet */}
        <BottomSheet 
            isOpen={!!selectedItem} 
            onClose={() => setSelectedItem(null)}
        >
            {selectedItem && (
                 <div className="flex-1 pt-2">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative mb-3">
                            <div className="w-24 h-24 rounded-[28px] overflow-hidden shadow-xl shadow-blue-500/10 border-4 border-white">
                                <img src={selectedItem.avatar} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md">
                                <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">{selectedItem.name}</h2>
                        <p className="text-sm text-slate-500 font-medium">{selectedItem.role}</p>
                        <div className={`mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedItem.tagColor}`}>
                            {selectedItem.status}
                        </div>
                    </div>
                    {/* Actions */}
                    <div className="flex gap-3 mb-6">
                        <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 active:scale-95 transition-transform flex items-center justify-center gap-2">
                            <Phone className="w-5 h-5" strokeWidth={2.5} /> Gọi điện
                        </button>
                        <button className="flex-1 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2">
                            <MessageSquare className="w-5 h-5" strokeWidth={2.5} /> Nhắn tin
                        </button>
                    </div>
                    {/* AI */}
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-2xl border border-indigo-100">
                         <div className="flex items-center gap-2 mb-2">
                            <div className="bg-indigo-500 text-white p-1 rounded-md">
                                <Zap className="w-4 h-4" strokeWidth={3} />
                            </div>
                            <span className="font-bold text-indigo-900 text-sm">AI Phân tích</span>
                         </div>
                         <p className="text-indigo-800/80 text-xs leading-relaxed font-medium">
                            Khách hàng quan tâm cao. Gửi báo giá trước 5:00 PM hôm nay để tăng khả năng chốt đơn.
                         </p>
                    </div>
                 </div>
            )}
        </BottomSheet>

        {/* 2. Notifications Sheet */}
        <BottomSheet 
            isOpen={activePopup === 'notifications'} 
            onClose={() => setActivePopup(null)}
            title="Thông báo"
            height="h-[60%]"
        >
            <NotificationContent />
        </BottomSheet>

        {/* 3. Add Customer Sheet */}
        <BottomSheet 
            isOpen={activePopup === 'add_customer'} 
            onClose={() => setActivePopup(null)}
            title="Thêm Khách Hàng"
        >
            <AddCustomerContent onClose={() => setActivePopup(null)} />
        </BottomSheet>
        
        {/* 4. Quick Menu Sheet */}
        <BottomSheet 
            isOpen={activePopup === 'quick_menu'} 
            onClose={() => setActivePopup(null)}
            title="Tạo Mới"
            height="h-[50%]"
        >
            <QuickMenuContent onClose={() => setActivePopup(null)} />
        </BottomSheet>

        {/* 5. Scan QR Fullscreen Overlay */}
        <ScanQRModal isOpen={isScanning} onClose={() => setIsScanning(false)} />

      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

// Compact Nav Button (Larger Hit Area)
const NavButton = ({ icon: Icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${active ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
  >
    <Icon className={`w-6 h-6 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
  </button>
);