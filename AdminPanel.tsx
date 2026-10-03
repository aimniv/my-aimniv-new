import React, { useState } from 'react';
import { 
  Language, Announcement, Course, Project, BlogPost, Message, SocialPost,
  SiteProfile, AcademicsInfo, CertificateItem, SkillsData, ContactInfo 
} from './types';
import { 
  LayoutDashboard, Megaphone, BookOpen, Layers, Edit3, Mail, MessageSquare, 
  User, Award, Code, AtSign, Settings, LogOut, Plus, Trash2, Save, ExternalLink,
  Check, ArrowLeft, Download, Upload, RefreshCw, Pin, Image as ImageIcon, Sparkles
} from 'lucide-react';

export interface AdminPanelProps {
  onLogout: () => void;
  onReturnToPortfolio: () => void;
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  blogs: BlogPost[];
  setBlogs: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  profile: SiteProfile;
  setProfile: React.Dispatch<React.SetStateAction<SiteProfile>>;
  academics: AcademicsInfo;
  setAcademics: React.Dispatch<React.SetStateAction<AcademicsInfo>>;
  certificates: CertificateItem[];
  setCertificates: React.Dispatch<React.SetStateAction<CertificateItem[]>>;
  skills: SkillsData;
  setSkills: React.Dispatch<React.SetStateAction<SkillsData>>;
  contact: ContactInfo;
  setContact: React.Dispatch<React.SetStateAction<ContactInfo>>;
  socialPosts: SocialPost[];
  setSocialPosts: React.Dispatch<React.SetStateAction<SocialPost[]>>;
  onSaveAll: () => void;
  onResetDefaults: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onLogout,
  onReturnToPortfolio,
  announcements,
  setAnnouncements,
  courses,
  setCourses,
  projects,
  setProjects,
  blogs,
  setBlogs,
  messages,
  setMessages,
  profile,
  setProfile,
  academics,
  setAcademics,
  certificates,
  setCertificates,
  skills,
  setSkills,
  contact,
  setContact,
  socialPosts,
  setSocialPosts,
  onSaveAll,
  onResetDefaults
}) => {
  const [activeTab, setActiveTab] = useState<
    'dash' | 'profile' | 'academics' | 'skills' | 'courses' | 'projects' | 
    'blogs' | 'announcements' | 'socialPosts' | 'contact' | 'messages' | 'settings'
  >('dash');

  const [activeLangTab, setActiveLangTab] = useState<Language>('tr');
  const [saveToast, setSaveToast] = useState(false);
  const [newWebSkill, setNewWebSkill] = useState('');
  const [newProgSkill, setNewProgSkill] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSaveAll();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Add items helpers
  const addCertificate = () => {
    const newCert: CertificateItem = {
      id: Date.now(),
      title: { tr: 'Yeni Sertifika', en: 'New Certificate', ar: 'شهادة جديدة' },
      description: { tr: 'Sertifika açıklaması', en: 'Certificate description', ar: 'وصف الشهادة' },
      iconName: 'Award'
    };
    setCertificates([...certificates, newCert]);
  };

  const addAnnouncement = () => {
    const newAnn: Announcement = { 
      id: Date.now().toString(), 
      title: 'Yeni Duyuru', 
      content: 'Duyuru metni buraya...', 
      date: new Date().toLocaleDateString('tr-TR'), 
      status: 'published' 
    };
    setAnnouncements([newAnn, ...announcements]);
  };

  const addCourse = () => {
    const newCourse: Course = { 
      id: `course-${Date.now()}`, 
      name: 'Yeni Kurs Adı', 
      description: 'Kurs detayları ve içeriği...', 
      price: 'Ücretsiz', 
      duration: '10 Saat', 
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800', 
      status: 'active' 
    };
    setCourses([newCourse, ...courses]);
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now(),
      title: { tr: 'Yeni Proje', en: 'New Project', ar: 'مشروع جديد' },
      description: { tr: 'Proje hakkında detaylı açıklama...', en: 'Detailed project description...', ar: 'وصف تفصيلي للمشروع...' },
      tags: ['React', 'TypeScript', 'Tailwind'],
      category: 'web',
      github: 'https://github.com',
      demo: '',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
    };
    setProjects([newProject, ...projects]);
  };

  const addBlog = () => {
    const newBlog: BlogPost = {
      id: Date.now(),
      title: { tr: 'Yeni Blog Başlığı', en: 'New Blog Title', ar: 'عنوان المقال الجديد' },
      excerpt: { tr: 'Blog yazısının kısa özeti...', en: 'Short excerpt of the blog...', ar: 'ملخص قصير للمقال...' },
      date: new Date().toISOString().split('T')[0],
      category: 'Yazılım'
    };
    setBlogs([newBlog, ...blogs]);
  };

  const addSocialPost = () => {
    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      type: 'text',
      category: 'Genel',
      isPinned: false,
      views: 1,
      likes: 0,
      reactions: { like: 0, celebrate: 0, support: 0, love: 0, insightful: 0, funny: 0 },
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      authorName: profile.name,
      authorRole: profile.title,
      authorAvatar: profile.avatar,
      hashtags: ['Portfolio', 'Update'],
      title: { tr: 'Yeni Paylaşım', en: 'New Post', ar: 'منشور جديد' },
      content: { tr: 'Paylaşım içeriği...', en: 'Post content...', ar: 'محتوى المنشور...' },
      comments: []
    };
    setSocialPosts([newPost, ...socialPosts]);
  };

  const unreadMessagesCount = messages.filter(m => !m.isRead).length;

  const exportBackupJSON = () => {
    const data = {
      profile, academics, certificates, skills, contact,
      courses, projects, blogs, announcements, messages, socialPosts
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-yedek-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importBackupJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.profile) setProfile(parsed.profile);
          if (parsed.academics) setAcademics(parsed.academics);
          if (parsed.certificates) setCertificates(parsed.certificates);
          if (parsed.skills) setSkills(parsed.skills);
          if (parsed.contact) setContact(parsed.contact);
          if (parsed.courses) setCourses(parsed.courses);
          if (parsed.projects) setProjects(parsed.projects);
          if (parsed.blogs) setBlogs(parsed.blogs);
          if (parsed.announcements) setAnnouncements(parsed.announcements);
          if (parsed.messages) setMessages(parsed.messages);
          if (parsed.socialPosts) setSocialPosts(parsed.socialPosts);
          alert('Yedek başarıyla yüklendi! Lütfen "Değişiklikleri Kaydet" butonuna basarak kalıcı yapın.');
        } catch {
          alert('Geçersiz JSON dosyası!');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row font-jakarta antialiased">
      {/* Toast Alert */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 bg-green-600 text-white rounded-2xl shadow-2xl animate-in slide-in-from-top duration-300">
          <Check size={20} className="stroke-[3]" />
          <span className="font-black text-sm">Tüm Değişiklikler Başarıyla Kaydedildi!</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-zinc-900/60 border-r border-white/5 p-5 flex flex-col justify-between shrink-0 backdrop-blur-xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-orange-600/30">
                A
              </div>
              <div>
                <h2 className="font-black text-sm uppercase tracking-wider">YÖNETİM PANELİ</h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Tam Kontrol Modu</p>
              </div>
            </div>
            <button 
              onClick={onReturnToPortfolio}
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              title="Siteye Dön"
            >
              <ExternalLink size={18} />
            </button>
          </div>

          <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            {[
              { id: 'dash', label: 'Genel Bakış', icon: LayoutDashboard },
              { id: 'profile', label: 'Profil & Biyografi', icon: User },
              { id: 'academics', label: 'Akademik & Sertifikalar', icon: Award },
              { id: 'skills', label: 'Teknik Yetenekler', icon: Code },
              { id: 'courses', label: 'Kurslar', icon: BookOpen, badge: courses.filter(c => c.status === 'active').length },
              { id: 'projects', label: 'Projeler', icon: Layers, badge: projects.length },
              { id: 'blogs', label: 'Blog & Yazılar', icon: Edit3, badge: blogs.length },
              { id: 'announcements', label: 'Duyuru Bandı', icon: Megaphone, badge: announcements.filter(a => a.status === 'published').length },
              { id: 'socialPosts', label: 'Sosyal Akış', icon: MessageSquare, badge: socialPosts.length },
              { id: 'contact', label: 'İletişim & Sosyal', icon: AtSign },
              { id: 'messages', label: 'Gelen Mesajlar', icon: Mail, badge: unreadMessagesCount, badgeColor: 'bg-red-500' },
              { id: 'settings', label: 'Yedekleme & Sıfırla', icon: Settings },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${item.badgeColor || 'bg-white/10 text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-white/5 space-y-2">
          <button 
            onClick={onReturnToPortfolio} 
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl text-xs font-bold transition-all"
          >
            <ArrowLeft size={16} /> Canlı Siteyi Gör
          </button>
          <button 
            onClick={onLogout} 
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold transition-all"
          >
            <LogOut size={16} /> Güvenli Çıkış
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-white/5">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-500">Panel Yönetimi</span>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              {activeTab === 'dash' && 'Genel Bakış & İstatistikler'}
              {activeTab === 'profile' && 'Profil, Giriş & Biyografi'}
              {activeTab === 'academics' && 'Akademik Bilgiler & Sertifikalar'}
              {activeTab === 'skills' && 'Teknik Beceriler & Diller'}
              {activeTab === 'courses' && 'Online Kurs Yönetimi'}
              {activeTab === 'projects' && 'Proje Portfolyosu'}
              {activeTab === 'blogs' && 'Blog & Makaleler'}
              {activeTab === 'announcements' && 'Kayan Duyuru Bandı (Marquee)'}
              {activeTab === 'socialPosts' && 'Sosyal Akış Gönderileri'}
              {activeTab === 'contact' && 'İletişim Bilgileri & Sosyal Medya'}
              {activeTab === 'messages' && 'Gelen İletişim Mesajları'}
              {activeTab === 'settings' && 'Yedekleme, İçe Aktar & Sıfırla'}
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={handleSave} 
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-orange-600/25 active:scale-95"
            >
              <Save size={16} /> Değişiklikleri Kaydet
            </button>
          </div>
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dash' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Quick Status Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Yayındaki Projeler', val: projects.length, icon: Layers, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                { label: 'Aktif Kurslar', val: courses.filter(c => c.status === 'active').length, icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { label: 'Blog Yazıları', val: blogs.length, icon: Edit3, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { label: 'Okunmamış Mesaj', val: unreadMessagesCount, icon: Mail, color: 'text-red-500', bg: 'bg-red-500/10' },
                { label: 'Sertifikalar', val: certificates.length, icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                { label: 'Sosyal Gönderiler', val: socialPosts.length, icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                { label: 'Web Teknolojileri', val: skills.web.length, icon: Code, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
                { label: 'Aktif Duyurular', val: announcements.filter(a => a.status === 'published').length, icon: Megaphone, color: 'text-pink-500', bg: 'bg-pink-500/10' },
              ].map(stat => (
                <div key={stat.label} className="p-6 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-3">
                  <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">{stat.label}</p>
                    <p className="text-3xl font-black text-white">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions & Profile Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-4">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 text-orange-500">
                  <User size={20} /> Profil Özeti
                </h3>
                <div className="flex items-center gap-4 pt-2">
                  <img src={profile.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-orange-600/30" />
                  <div>
                    <h4 className="text-lg font-black">{profile.name}</h4>
                    <p className="text-xs text-orange-500 font-bold uppercase tracking-wider">{profile.title}</p>
                    <p className="text-xs text-zinc-500 mt-1">{contact.email}</p>
                  </div>
                </div>
                <div className="pt-4 flex flex-wrap gap-2">
                  <button onClick={() => setActiveTab('profile')} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-zinc-300 transition-all">
                    Profili Düzenle
                  </button>
                  <button onClick={() => setActiveTab('contact')} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-zinc-300 transition-all">
                    İletişim Bilgileri
                  </button>
                </div>
              </div>

              <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-4">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 text-emerald-500">
                  <Sparkles size={20} /> Hızlı Ekleme İşlemleri
                </h3>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button onClick={() => { setActiveTab('projects'); addProject(); }} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all">
                    <Plus size={14} className="text-orange-500" /> Yeni Proje Ekle
                  </button>
                  <button onClick={() => { setActiveTab('courses'); addCourse(); }} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all">
                    <Plus size={14} className="text-emerald-500" /> Yeni Kurs Ekle
                  </button>
                  <button onClick={() => { setActiveTab('blogs'); addBlog(); }} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all">
                    <Plus size={14} className="text-blue-500" /> Yeni Blog Ekle
                  </button>
                  <button onClick={() => { setActiveTab('announcements'); addAnnouncement(); }} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all">
                    <Plus size={14} className="text-purple-500" /> Duyuru Ekle
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE & HERO & BIOGRAPHY */}
        {activeTab === 'profile' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Language Switcher for Multi-lang Texts */}
            <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 rounded-2xl">
              <span className="text-xs font-bold text-zinc-400">Çoklu Dil Düzenleme Modu:</span>
              <div className="flex gap-2">
                {(['tr', 'en', 'ar'] as Language[]).map(l => (
                  <button 
                    key={l}
                    onClick={() => setActiveLangTab(l)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                      activeLangTab === l ? 'bg-orange-600 text-white shadow-lg' : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {l === 'tr' ? 'Türkçe' : l === 'en' ? 'English' : 'العربية'}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tight text-orange-500">Temel Bilgiler & Görsel</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block mb-2">Ad Soyad</label>
                  <input 
                    value={profile.name} 
                    onChange={e => setProfile({ ...profile, name: e.target.value })} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-bold text-white outline-none focus:border-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block mb-2">Profesyonel Ünvan (Örn: Bilgisayar Mühendisi)</label>
                  <input 
                    value={profile.title} 
                    onChange={e => setProfile({ ...profile, title: e.target.value })} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-bold text-white outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block mb-2">El Yazısı İmza Metni</label>
                  <input 
                    value={profile.signature} 
                    onChange={e => setProfile({ ...profile, signature: e.target.value })} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-bold text-white outline-none focus:border-orange-500 transition-all font-signature text-2xl text-orange-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block mb-2">CV İndirme Bağlantısı / URL</label>
                  <input 
                    value={profile.cvUrl} 
                    onChange={e => setProfile({ ...profile, cvUrl: e.target.value })} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-bold text-white outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Avatar Image & Upload */}
              <div className="p-6 bg-white/5 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
                <img src={profile.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-orange-600/30 shrink-0" />
                <div className="flex-1 space-y-3 w-full">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider block">Profil Fotoğrafı URL veya Yerel Dosya Yükle</label>
                  <input 
                    value={profile.avatar} 
                    onChange={e => setProfile({ ...profile, avatar: e.target.value })} 
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-xs font-mono text-white outline-none focus:border-orange-500" 
                    placeholder="https://..."
                  />
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black uppercase cursor-pointer transition-all">
                    <ImageIcon size={14} /> Bilgisayardan Fotoğraf Yükle
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, url => setProfile({ ...profile, avatar: url }))} />
                  </label>
                </div>
              </div>
            </div>

            {/* Hero Section Texts */}
            <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tight text-orange-500">
                Hero (Giriş) Başlığı & Açıklaması ({activeLangTab.toUpperCase()})
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block mb-2">
                    Hero Karşılama Başlığı (Örn: Merhaba, ben Aymen!)
                  </label>
                  <input 
                    value={profile.heroGreeting?.[activeLangTab] || ''} 
                    onChange={e => setProfile({
                      ...profile,
                      heroGreeting: { ...profile.heroGreeting, [activeLangTab]: e.target.value }
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-base font-black text-white outline-none focus:border-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block mb-2">
                    Hero Alt Açıklama / Slogan
                  </label>
                  <textarea 
                    rows={3}
                    value={profile.heroDescription?.[activeLangTab] || ''} 
                    onChange={e => setProfile({
                      ...profile,
                      heroDescription: { ...profile.heroDescription, [activeLangTab]: e.target.value }
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-medium text-white outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Letter Biography Texts */}
            <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black uppercase tracking-tight text-orange-500">
                  Mektup Kartı Biyografi Paragrafları ({activeLangTab.toUpperCase()})
                </h3>
                <button
                  onClick={() => {
                    const currentParas = profile.bioParagraphs?.[activeLangTab] || [];
                    setProfile({
                      ...profile,
                      bioParagraphs: {
                        ...profile.bioParagraphs,
                        [activeLangTab]: [...currentParas, 'Yeni biyografi paragrafı...']
                      }
                    });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600/10 text-orange-500 hover:bg-orange-600 hover:text-white rounded-xl text-xs font-black uppercase transition-all"
                >
                  <Plus size={14} /> Yeni Paragraf Ekle
                </button>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block mb-2">
                  Mektup Giriş Selamı (Örn: Merhaba,)
                </label>
                <input 
                  value={profile.bioGreeting?.[activeLangTab] || ''} 
                  onChange={e => setProfile({
                    ...profile,
                    bioGreeting: { ...profile.bioGreeting, [activeLangTab]: e.target.value }
                  })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold text-white outline-none focus:border-orange-500 transition-all"
                />
              </div>

              <div className="space-y-4">
                {(profile.bioParagraphs?.[activeLangTab] || []).map((para, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-2xl space-y-2 border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-zinc-500">Paragraf #{idx + 1}</span>
                      <button 
                        onClick={() => {
                          const updated = (profile.bioParagraphs?.[activeLangTab] || []).filter((_, i) => i !== idx);
                          setProfile({
                            ...profile,
                            bioParagraphs: { ...profile.bioParagraphs, [activeLangTab]: updated }
                          });
                        }}
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <textarea 
                      rows={3}
                      value={para} 
                      onChange={e => {
                        const updated = [...(profile.bioParagraphs?.[activeLangTab] || [])];
                        updated[idx] = e.target.value;
                        setProfile({
                          ...profile,
                          bioParagraphs: { ...profile.bioParagraphs, [activeLangTab]: updated }
                        });
                      }}
                      className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-zinc-200 outline-none focus:border-orange-500 transition-all leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ACADEMICS & CERTIFICATES */}
        {activeTab === 'academics' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Language Switcher */}
            <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 rounded-2xl">
              <span className="text-xs font-bold text-zinc-400">Çoklu Dil Düzenleme Modu:</span>
              <div className="flex gap-2">
                {(['tr', 'en', 'ar'] as Language[]).map(l => (
                  <button 
                    key={l}
                    onClick={() => setActiveLangTab(l)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                      activeLangTab === l ? 'bg-orange-600 text-white shadow-lg' : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {l === 'tr' ? 'Türkçe' : l === 'en' ? 'English' : 'العربية'}
                  </button>
                ))}
              </div>
            </div>

            {/* Degree & University Info */}
            <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tight text-orange-500">
                Akademik Derece & Üniversite ({activeLangTab.toUpperCase()})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block mb-2">
                    Bölüm / Derece Başlığı
                  </label>
                  <input 
                    value={academics.degree?.[activeLangTab] || ''} 
                    onChange={e => setAcademics({
                      ...academics,
                      degree: { ...academics.degree, [activeLangTab]: e.target.value }
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-bold text-white outline-none focus:border-orange-500"
                    placeholder="BİLGİSAYAR MÜHENDİSİ"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block mb-2">
                    Üniversite Adı
                  </label>
                  <input 
                    value={academics.uni?.[activeLangTab] || ''} 
                    onChange={e => setAcademics({
                      ...academics,
                      uni: { ...academics.uni, [activeLangTab]: e.target.value }
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-bold text-white outline-none focus:border-orange-500"
                    placeholder="İskenderun Teknik Üniversitesi"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block mb-2">
                    Eğitim Yılı / Mezuniyet Durumu
                  </label>
                  <input 
                    value={academics.year?.[activeLangTab] || ''} 
                    onChange={e => setAcademics({
                      ...academics,
                      year: { ...academics.year, [activeLangTab]: e.target.value }
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-bold text-white outline-none focus:border-orange-500"
                    placeholder="2022 - Mezuniyet: Haziran 2026"
                  />
                </div>
              </div>
            </div>

            {/* Certificates Management */}
            <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-orange-500">Sertifikalar ve Başarılar</h3>
                  <p className="text-xs text-zinc-400">Akademik bölümde listelenen sertifikaları ekleyin veya düzenleyin.</p>
                </div>
                <button
                  onClick={addCertificate}
                  className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black uppercase transition-all"
                >
                  <Plus size={14} /> Yeni Sertifika Ekle
                </button>
              </div>

              <div className="grid gap-4">
                {certificates.map(cert => (
                  <div key={cert.id} className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Award size={18} className="text-orange-500" />
                        <span className="text-xs font-bold text-zinc-400">ID: {cert.id}</span>
                      </div>
                      <button 
                        onClick={() => setCertificates(certificates.filter(c => c.id !== cert.id))}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Başlık (TR)</label>
                        <input 
                          value={cert.title?.tr || ''} 
                          onChange={e => setCertificates(certificates.map(c => c.id === cert.id ? { ...c, title: { ...c.title, tr: e.target.value } } : c))}
                          className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-xs font-bold text-white outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Başlık (EN)</label>
                        <input 
                          value={cert.title?.en || ''} 
                          onChange={e => setCertificates(certificates.map(c => c.id === cert.id ? { ...c, title: { ...c.title, en: e.target.value } } : c))}
                          className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-xs font-bold text-white outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">İkon Tipi</label>
                        <select 
                          value={cert.iconName || 'Award'} 
                          onChange={e => setCertificates(certificates.map(c => c.id === cert.id ? { ...c, iconName: e.target.value } : c))}
                          className="w-full bg-zinc-800 border border-white/10 rounded-lg p-2.5 text-xs font-bold text-white outline-none"
                        >
                          <option value="Award">Award (Ödül)</option>
                          <option value="Code">Code (Kodlama)</option>
                          <option value="Layers">Layers (Katmanlar)</option>
                          <option value="BookOpen">BookOpen (Kitap/Eğitim)</option>
                          <option value="CheckCircle">CheckCircle (Onay)</option>
                          <option value="Cpu">Cpu (İşlemci/Donanım)</option>
                          <option value="Zap">Zap (Enerji/Hızlı)</option>
                          <option value="Shield">Shield (Güvenlik)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Açıklama (TR)</label>
                        <input 
                          value={cert.description?.tr || ''} 
                          onChange={e => setCertificates(certificates.map(c => c.id === cert.id ? { ...c, description: { ...c.description, tr: e.target.value } } : c))}
                          className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-xs text-zinc-300 outline-none focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Açıklama (EN)</label>
                        <input 
                          value={cert.description?.en || ''} 
                          onChange={e => setCertificates(certificates.map(c => c.id === cert.id ? { ...c, description: { ...c.description, en: e.target.value } } : c))}
                          className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-xs text-zinc-300 outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SKILLS */}
        {activeTab === 'skills' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Web Skills */}
            <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-orange-500">Web Teknolojileri</h3>
                  <p className="text-xs text-zinc-400">Front-end, back-end ve web tasarım yetenekleriniz.</p>
                </div>
                <span className="text-xs font-black px-3 py-1 bg-white/5 rounded-full text-zinc-400">
                  {skills.web.length} Yetenek
                </span>
              </div>

              <div className="flex gap-2">
                <input 
                  value={newWebSkill} 
                  onChange={e => setNewWebSkill(e.target.value)} 
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newWebSkill.trim()) {
                      e.preventDefault();
                      setSkills({ ...skills, web: [...skills.web, newWebSkill.trim()] });
                      setNewWebSkill('');
                    }
                  }}
                  placeholder="Yeni web teknolojisi yazıp Enter'a veya Ekle'ye basın (Örn: Next.js)..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-orange-500"
                />
                <button 
                  onClick={() => {
                    if (newWebSkill.trim()) {
                      setSkills({ ...skills, web: [...skills.web, newWebSkill.trim()] });
                      setNewWebSkill('');
                    }
                  }}
                  className="px-5 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black uppercase transition-all"
                >
                  Ekle
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {skills.web.map((skill, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-zinc-200 transition-all"
                  >
                    {skill}
                    <button 
                      onClick={() => setSkills({ ...skills, web: skills.web.filter((_, i) => i !== index) })}
                      className="text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Programming Languages */}
            <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-emerald-500">Programlama Dilleri</h3>
                  <p className="text-xs text-zinc-400">Algoritmalar ve sistem geliştirmede kullandığınız diller.</p>
                </div>
                <span className="text-xs font-black px-3 py-1 bg-white/5 rounded-full text-zinc-400">
                  {skills.programming.length} Dil
                </span>
              </div>

              <div className="flex gap-2">
                <input 
                  value={newProgSkill} 
                  onChange={e => setNewProgSkill(e.target.value)} 
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newProgSkill.trim()) {
                      e.preventDefault();
                      setSkills({ ...skills, programming: [...skills.programming, newProgSkill.trim()] });
                      setNewProgSkill('');
                    }
                  }}
                  placeholder="Yeni programlama dili yazıp Enter'a veya Ekle'ye basın (Örn: Python)..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500"
                />
                <button 
                  onClick={() => {
                    if (newProgSkill.trim()) {
                      setSkills({ ...skills, programming: [...skills.programming, newProgSkill.trim()] });
                      setNewProgSkill('');
                    }
                  }}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase transition-all"
                >
                  Ekle
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {skills.programming.map((skill, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-zinc-200 transition-all"
                  >
                    {skill}
                    <button 
                      onClick={() => setSkills({ ...skills, programming: skills.programming.filter((_, i) => i !== index) })}
                      className="text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: COURSES */}
        {activeTab === 'courses' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-orange-500">Kurs Listesi & Yönetimi</h3>
                <p className="text-xs text-zinc-400">Aktif kurslar sitede otomatik olarak &quot;Kurslar&quot; menüsü ve bölümü açar.</p>
              </div>
              <button 
                onClick={addCourse}
                className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black uppercase transition-all"
              >
                <Plus size={14} /> Yeni Kurs Ekle
              </button>
            </div>

            <div className="grid gap-6">
              {courses.map(course => (
                <div key={course.id} className="p-6 bg-zinc-900/50 border border-white/5 rounded-3xl flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-48 h-36 rounded-2xl overflow-hidden relative shrink-0 border border-white/10">
                    <img src={course.image} alt={course.name} className="w-full h-full object-cover" />
                    <span className={`absolute top-2 right-2 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${course.status === 'active' ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                      {course.status === 'active' ? 'Yayında' : 'Pasif'}
                    </span>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Kurs Adı</label>
                        <input 
                          value={course.name} 
                          onChange={e => setCourses(courses.map(c => c.id === course.id ? { ...c, name: e.target.value } : c))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold text-white outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Fiyat</label>
                          <input 
                            value={course.price} 
                            onChange={e => setCourses(courses.map(c => c.id === course.id ? { ...c, price: e.target.value } : c))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold text-white outline-none focus:border-orange-500"
                            placeholder="Ücretsiz veya 49$"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Süre</label>
                          <input 
                            value={course.duration} 
                            onChange={e => setCourses(courses.map(c => c.id === course.id ? { ...c, duration: e.target.value } : c))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold text-white outline-none focus:border-orange-500"
                            placeholder="20 Saat"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Kurs Açıklaması</label>
                      <textarea 
                        rows={2}
                        value={course.description} 
                        onChange={e => setCourses(courses.map(c => c.id === course.id ? { ...c, description: e.target.value } : c))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-zinc-300 outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
                      <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                        <input 
                          value={course.image} 
                          onChange={e => setCourses(courses.map(c => c.id === course.id ? { ...c, image: e.target.value } : c))}
                          className="flex-1 bg-black/30 border border-white/10 rounded-lg p-2 text-xs text-zinc-400 outline-none"
                          placeholder="Görsel URL..."
                        />
                        <label className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold cursor-pointer transition-all shrink-0">
                          Resim Yükle
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, url => setCourses(courses.map(c => c.id === course.id ? { ...c, image: url } : c)))} />
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <select 
                          value={course.status} 
                          onChange={e => setCourses(courses.map(c => c.id === course.id ? { ...c, status: e.target.value as any } : c))}
                          className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white"
                        >
                          <option value="active">Yayında (Aktif)</option>
                          <option value="inactive">Gizli (Pasif)</option>
                        </select>
                        <button 
                          onClick={() => setCourses(courses.filter(c => c.id !== course.id))}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-orange-500">Projeler ({projects.length})</h3>
                <p className="text-xs text-zinc-400">Canlı demo ve GitHub bağlantılarıyla projelerinizi yönetin.</p>
              </div>
              <button 
                onClick={addProject}
                className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black uppercase transition-all"
              >
                <Plus size={14} /> Yeni Proje Ekle
              </button>
            </div>

            <div className="grid gap-6">
              {projects.map(project => (
                <div key={project.id} className="p-6 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-56 h-40 rounded-2xl overflow-hidden relative shrink-0 border border-white/10">
                      <img src={project.image} alt={project.title.tr} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Başlık (TR)</label>
                          <input 
                            value={project.title?.tr || ''} 
                            onChange={e => setProjects(projects.map(p => p.id === project.id ? { ...p, title: { ...p.title, tr: e.target.value } } : p))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold text-white outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Başlık (EN)</label>
                          <input 
                            value={project.title?.en || ''} 
                            onChange={e => setProjects(projects.map(p => p.id === project.id ? { ...p, title: { ...p.title, en: e.target.value } } : p))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold text-white outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Açıklama (TR)</label>
                          <textarea 
                            rows={2}
                            value={project.description?.tr || ''} 
                            onChange={e => setProjects(projects.map(p => p.id === project.id ? { ...p, description: { ...p.description, tr: e.target.value } } : p))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-zinc-300 outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Açıklama (EN)</label>
                          <textarea 
                            rows={2}
                            value={project.description?.en || ''} 
                            onChange={e => setProjects(projects.map(p => p.id === project.id ? { ...p, description: { ...p.description, en: e.target.value } } : p))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-zinc-300 outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Kategori</label>
                      <select 
                        value={project.category} 
                        onChange={e => setProjects(projects.map(p => p.id === project.id ? { ...p, category: e.target.value as any } : p))}
                        className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2.5 text-xs font-bold text-white"
                      >
                        <option value="web">Web</option>
                        <option value="mobile">Mobil</option>
                        <option value="backend">Backend</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">GitHub Bağlantısı</label>
                      <input 
                        value={project.github} 
                        onChange={e => setProjects(projects.map(p => p.id === project.id ? { ...p, github: e.target.value } : p))}
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-orange-500"
                        placeholder="https://github.com/..."
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Canlı Demo Bağlantısı</label>
                      <input 
                        value={project.demo || ''} 
                        onChange={e => setProjects(projects.map(p => p.id === project.id ? { ...p, demo: e.target.value } : p))}
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-orange-500"
                        placeholder="https://demo.app/..."
                      />
                    </div>

                    <div className="flex items-end justify-between gap-2">
                      <label className="flex-1 px-3 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-center cursor-pointer transition-all">
                        Fotoğraf Değiştir
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, url => setProjects(projects.map(p => p.id === project.id ? { ...p, image: url } : p)))} />
                      </label>
                      <button 
                        onClick={() => setProjects(projects.filter(p => p.id !== project.id))}
                        className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: BLOGS */}
        {activeTab === 'blogs' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-orange-500">Blog & Makaleler ({blogs.length})</h3>
                <p className="text-xs text-zinc-400">Teknoloji ve yazılım içerikli makaleleriniz.</p>
              </div>
              <button 
                onClick={addBlog}
                className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black uppercase transition-all"
              >
                <Plus size={14} /> Yeni Blog Ekle
              </button>
            </div>

            <div className="grid gap-6">
              {blogs.map(blog => (
                <div key={blog.id} className="p-6 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Yazı Başlığı (TR)</label>
                      <input 
                        value={blog.title?.tr || ''} 
                        onChange={e => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, title: { ...b.title, tr: e.target.value } } : b))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold text-white outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Yazı Başlığı (EN)</label>
                      <input 
                        value={blog.title?.en || ''} 
                        onChange={e => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, title: { ...b.title, en: e.target.value } } : b))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold text-white outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Özet (TR)</label>
                      <textarea 
                        rows={2}
                        value={blog.excerpt?.tr || ''} 
                        onChange={e => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, excerpt: { ...b.excerpt, tr: e.target.value } } : b))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-zinc-300 outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Özet (EN)</label>
                      <textarea 
                        rows={2}
                        value={blog.excerpt?.en || ''} 
                        onChange={e => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, excerpt: { ...b.excerpt, en: e.target.value } } : b))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-zinc-300 outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/5">
                    <div className="flex gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Kategori</label>
                        <input 
                          value={blog.category} 
                          onChange={e => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, category: e.target.value } : b))}
                          className="bg-black/30 border border-white/10 rounded-xl p-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Tarih</label>
                        <input 
                          value={blog.date} 
                          onChange={e => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, date: e.target.value } : b))}
                          className="bg-black/30 border border-white/10 rounded-xl p-2 text-xs text-white"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => setBlogs(blogs.filter(b => b.id !== blog.id))}
                      className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-orange-500">Duyuru Bandı (Marquee)</h3>
                <p className="text-xs text-zinc-400">Sayfanın en üstünde turuncu kayan bant olarak gösterilir.</p>
              </div>
              <button 
                onClick={addAnnouncement}
                className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black uppercase transition-all"
              >
                <Plus size={14} /> Yeni Duyuru Ekle
              </button>
            </div>

            <div className="grid gap-4">
              {announcements.map(ann => (
                <div key={ann.id} className="p-6 bg-zinc-900/50 border border-white/5 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2 w-full">
                    <input 
                      value={ann.title} 
                      onChange={e => setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, title: e.target.value } : a))}
                      className="bg-transparent border-b border-white/10 pb-1 outline-none text-lg font-black w-full text-white focus:border-orange-500" 
                      placeholder="Duyuru Başlığı"
                    />
                    <textarea 
                      rows={2}
                      value={ann.content} 
                      onChange={e => setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, content: e.target.value } : a))}
                      className="bg-transparent border-none outline-none text-zinc-400 text-xs w-full resize-none leading-relaxed" 
                      placeholder="Duyuru içeriği metni..."
                    />
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <select 
                      value={ann.status} 
                      onChange={e => setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, status: e.target.value as any } : a))}
                      className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white"
                    >
                      <option value="published">Yayında (Aktif)</option>
                      <option value="draft">Taslak (Gizli)</option>
                    </select>
                    <button 
                      onClick={() => setAnnouncements(announcements.filter(a => a.id !== ann.id))}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: SOCIAL POSTS */}
        {activeTab === 'socialPosts' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-orange-500">Sosyal Akış Gönderileri ({socialPosts.length})</h3>
                <p className="text-xs text-zinc-400">Sosyal akış sayfanızdaki postları ve etkileşimleri yönetin.</p>
              </div>
              <button 
                onClick={addSocialPost}
                className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black uppercase transition-all"
              >
                <Plus size={14} /> Yeni Gönderi Paylaş
              </button>
            </div>

            <div className="grid gap-6">
              {socialPosts.map(post => (
                <div key={post.id} className="p-6 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-white/5 text-zinc-400 text-[10px] font-black uppercase rounded-lg">ID: {post.id}</span>
                      <span className="px-2.5 py-1 bg-orange-600/10 text-orange-500 text-[10px] font-black uppercase rounded-lg">{post.type}</span>
                      <span className="text-zinc-500 text-xs">{post.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSocialPosts(socialPosts.map(p => p.id === post.id ? { ...p, isPinned: !p.isPinned } : p))}
                        className={`p-2 rounded-xl transition-all ${post.isPinned ? 'bg-orange-600 text-white' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
                        title="Sabitle"
                      >
                        <Pin size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('Bu gönderiyi silmek istediğinize emin misiniz?')) {
                            setSocialPosts(socialPosts.filter(p => p.id !== post.id));
                          }
                        }}
                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Başlık (TR)</label>
                      <input 
                        value={post.title?.tr || ''} 
                        onChange={e => setSocialPosts(socialPosts.map(p => p.id === post.id ? { ...p, title: { ...p.title, tr: e.target.value } } : p))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm font-bold text-white outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">Başlık (EN)</label>
                      <input 
                        value={post.title?.en || ''} 
                        onChange={e => setSocialPosts(socialPosts.map(p => p.id === post.id ? { ...p, title: { ...p.title, en: e.target.value } } : p))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm font-bold text-white outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-zinc-500 block mb-1">İçerik (TR)</label>
                    <textarea 
                      rows={3}
                      value={post.content?.tr || ''} 
                      onChange={e => setSocialPosts(socialPosts.map(p => p.id === post.id ? { ...p, content: { ...p.content, tr: e.target.value } } : p))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-300 outline-none focus:border-orange-500 leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-zinc-500">
                    <div className="flex items-center gap-4">
                      <span>👁️ {post.views} Görüntülenme</span>
                      <span>❤️ {post.likes} Beğeni</span>
                      <span>💬 {post.comments?.length || 0} Yorum</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold">Kategori:</span>
                      <input 
                        value={post.category} 
                        onChange={e => setSocialPosts(socialPosts.map(p => p.id === post.id ? { ...p, category: e.target.value } : p))}
                        className="bg-black/30 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: CONTACT & SOCIAL LINKS */}
        {activeTab === 'contact' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tight text-orange-500">İletişim & Lokasyon Bilgileri</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block mb-2">İletişim E-posta Adresi</label>
                  <input 
                    value={contact.email} 
                    onChange={e => setContact({ ...contact, email: e.target.value })} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-bold text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block mb-2">Konum / Şehir</label>
                  <input 
                    value={contact.location?.tr || ''} 
                    onChange={e => setContact({ ...contact, location: { ...contact.location, tr: e.target.value, en: e.target.value } })} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-bold text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block mb-2">Uyruk / Ülke</label>
                  <input 
                    value={contact.nationality?.tr || ''} 
                    onChange={e => setContact({ ...contact, nationality: { ...contact.nationality, tr: e.target.value, en: e.target.value } })} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-bold text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tight text-orange-500">Sosyal Medya Hesapları & Bağlantılar</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block mb-2">GitHub Profil URL</label>
                  <input 
                    value={contact.github} 
                    onChange={e => setContact({ ...contact, github: e.target.value })} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-mono text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block mb-2">LinkedIn Profil URL</label>
                  <input 
                    value={contact.linkedin} 
                    onChange={e => setContact({ ...contact, linkedin: e.target.value })} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-mono text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block mb-2">Instagram Profil URL</label>
                  <input 
                    value={contact.instagram} 
                    onChange={e => setContact({ ...contact, instagram: e.target.value })} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-mono text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block mb-2">Twitter / X Profil URL</label>
                  <input 
                    value={contact.twitter} 
                    onChange={e => setContact({ ...contact, twitter: e.target.value })} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-mono text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: MESSAGES (INBOX) */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-orange-500">Gelen İletişim Mesajları ({messages.length})</h3>
                <p className="text-xs text-zinc-400">İletişim formundan ziyaretçiler tarafından gönderilen mesajlar.</p>
              </div>
              {messages.length > 0 && (
                <button 
                  onClick={() => setMessages(messages.map(m => ({ ...m, isRead: true })))}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-zinc-300 transition-all"
                >
                  Tümünü Okundu İşaretle
                </button>
              )}
            </div>

            <div className="grid gap-4">
              {messages.length === 0 ? (
                <div className="text-center py-24 bg-zinc-900/30 border border-white/5 rounded-3xl space-y-3">
                  <Mail size={40} className="mx-auto text-zinc-600 stroke-[1.5]" />
                  <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Henüz gelen mesaj bulunmuyor.</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`p-6 bg-zinc-900/50 border rounded-3xl space-y-4 transition-all ${!msg.isRead ? 'border-orange-600/40 bg-orange-600/5' : 'border-white/5'}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-black text-white">{msg.name}</h4>
                          {!msg.isRead && (
                            <span className="px-2.5 py-0.5 bg-orange-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                              Yeni
                            </span>
                          )}
                        </div>
                        <a href={`mailto:${msg.email}`} className="text-xs text-orange-500 font-bold hover:underline">
                          {msg.email}
                        </a>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500 font-bold">{msg.date}</span>
                        <a 
                          href={`mailto:${msg.email}?subject=Re:%20Portfolyo%20Mesajı&body=Merhaba%20${encodeURIComponent(msg.name)},%0D%0A%0D%0A`}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase text-zinc-300 transition-all"
                        >
                          Cevapla
                        </a>
                        {!msg.isRead && (
                          <button 
                            onClick={() => setMessages(messages.map(m => m.id === msg.id ? { ...m, isRead: true } : m))}
                            className="px-3 py-1.5 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase"
                          >
                            Okundu
                          </button>
                        )}
                        <button 
                          onClick={() => setMessages(messages.filter(m => m.id !== msg.id))}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 12: BACKUP & SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tight text-orange-500">Veri Yedekleme & Dışa Aktarma</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Tüm portfolyo ayarlarınızı, projelerinizi, biyografinizi, sertifikalarınızı ve mesajlarınızı tek tıkla JSON dosyası olarak bilgisayarınıza indirebilirsiniz.
              </p>
              <button 
                onClick={exportBackupJSON}
                className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20"
              >
                <Download size={16} /> Tüm Verileri İndir (JSON Yedek)
              </button>
            </div>

            <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tight text-blue-500">Yedekten Geri Yükle</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Daha önce indirdiğiniz JSON yedek dosyasını yükleyerek tüm verilerinizi anında geri getirebilirsiniz.
              </p>
              <label className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-wider cursor-pointer transition-all shadow-lg shadow-blue-600/20">
                <Upload size={16} /> JSON Dosyası Seç ve Yükle
                <input type="file" accept=".json" className="hidden" onChange={importBackupJSON} />
              </label>
            </div>

            <div className="p-8 bg-zinc-900/50 border border-red-500/20 rounded-3xl space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tight text-red-500">Fabrika Ayarlarına Sıfırla</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Tüm verileri varsayılan başlangıç haline döndürür. Bu işlem geri alınamaz.
              </p>
              <button 
                onClick={onResetDefaults}
                className="flex items-center gap-2 px-6 py-3.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 rounded-2xl font-black text-xs uppercase tracking-wider transition-all"
              >
                <RefreshCw size={16} /> Tümünü Varsayılana Sıfırla
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
