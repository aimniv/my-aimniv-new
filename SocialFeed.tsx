import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Heart, Share2, Award, Users, Check, Bookmark, ThumbsUp, 
  Smile, Eye, Clock, ExternalLink, Pin, PlusCircle, Download, FileText, 
  MessageSquare, Briefcase, Calendar, Star, Send, Trash2, Edit, Copy, 
  ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize2, 
  MoreHorizontal, Sparkles, SendHorizontal, Image as ImageIcon, Video as VideoIcon, 
  MapPin, CheckCircle, Flame, AlertCircle, X, ArrowLeft, Github
} from 'lucide-react';
import { SocialPost, Comment, Language, SocialPostType } from './types';
import { INITIAL_POSTS } from './mockPosts';

interface SocialFeedProps {
  lang: Language;
  theme: 'light' | 'dark';
  // Admin mode: create/edit/pin/delete controls and drafts. Only the admin panel turns this on.
  isAdmin: boolean;
  // Rendered inside the admin panel: no page header or back button.
  embedded?: boolean;
  initialPosts?: SocialPost[];
  onAdminPostsChange?: (posts: SocialPost[]) => void;
  onBack?: () => void;
}

// Custom Tooltip Utility
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <div className="group relative inline-block">
    {children}
    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-zinc-950 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-2 rounded absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap z-50 pointer-events-none shadow-md">
      {text}
    </div>
  </div>
);

export const SocialFeed: React.FC<SocialFeedProps> = ({ lang, theme, isAdmin, embedded, initialPosts, onAdminPostsChange, onBack }) => {
  // State variables
  const [posts, setPosts] = useState<SocialPost[]>(() => {
    if (initialPosts) return initialPosts;
    const saved = localStorage.getItem('social_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'oldest'>('newest');

  // Track voted polls locally
  const [votedPolls, setVotedPolls] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('voted_polls');
    return saved ? JSON.parse(saved) : {};
  });

  // Share dropdown states
  const [activeShareId, setActiveShareId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Active full screen image viewer
  const [activeMediaViewer, setActiveMediaViewer] = useState<{
    images: string[];
    currentIndex: number;
  } | null>(null);

  // Creating & Editing states (Admin Modal)
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<SocialPost> | null>(null);

  // Form states for creating/editing posts
  const [formData, setFormData] = useState<{
    id?: string;
    type: SocialPostType;
    category: string;
    isPinned: boolean;
    isDraft: boolean;
    title_tr: string;
    title_en: string;
    title_ar: string;
    content_tr: string;
    content_en: string;
    content_ar: string;
    hashtags: string;
    location: string;
    images: string[];
    videoUrl: string;
    pdfUrl: string;
    pdfTitle: string;
    // Job fields
    jobCompany: string;
    jobPosition: string;
    jobLocation: string;
    jobType: string;
    jobDeadline: string;
    jobApplyLink: string;
    jobRequirements: string;
    jobSalary: string;
    // Event fields
    eventTitle: string;
    eventDate: string;
    eventLocation: string;
    eventOrganizer: string;
    eventRegLink: string;
    // Project fields
    projectName: string;
    projectTech: string;
    projectGithub: string;
    projectWebsite: string;
    projectStatus: string;
    // Poll fields
    pollQuestion: string;
    pollOptions: string; // comma-separated
    // Quote fields
    quoteText: string;
    quoteAuthor: string;
    quoteBgStyle: string;
    // Link fields
    linkUrl: string;
    linkTitle: string;
    linkDescription: string;
    linkImage: string;
  }>({
    type: 'text',
    category: 'Technology',
    isPinned: false,
    isDraft: false,
    title_tr: '', title_en: '', title_ar: '',
    content_tr: '', content_en: '', content_ar: '',
    hashtags: '',
    location: '',
    images: [],
    videoUrl: '',
    pdfUrl: '',
    pdfTitle: '',
    jobCompany: '', jobPosition: '', jobLocation: '', jobType: 'Full-time', jobDeadline: '', jobApplyLink: '', jobRequirements: '', jobSalary: '',
    eventTitle: '', eventDate: '', eventLocation: '', eventOrganizer: '', eventRegLink: '',
    projectName: '', projectTech: '', projectGithub: '', projectWebsite: '', projectStatus: 'Completed',
    pollQuestion: '', pollOptions: 'React, Vue, Angular, Svelte',
    quoteText: '', quoteAuthor: '', quoteBgStyle: 'bg-gradient-to-tr from-orange-600 via-amber-600 to-red-600',
    linkUrl: '', linkTitle: '', linkDescription: '', linkImage: ''
  });

  // Sync to local storage
  const skipFirstPostsSync = useRef(true);
  useEffect(() => {
    localStorage.setItem('social_posts', JSON.stringify(posts));
    // Only the admin's own edits are pushed to the server; the initial load is not an edit.
    if (skipFirstPostsSync.current) { skipFirstPostsSync.current = false; return; }
    if (isAdmin) onAdminPostsChange?.(posts);
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('voted_polls', JSON.stringify(votedPolls));
  }, [votedPolls]);

  // Toast feedback helper
  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  // Vote in Poll
  const handleVote = (postId: string, optionId: string) => {
    if (votedPolls[postId]) return; // already voted

    setPosts(prev => prev.map(p => {
      if (p.id === postId && p.pollDetails) {
        const updatedOptions = p.pollDetails.options.map(opt => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        });
        return {
          ...p,
          pollDetails: {
            ...p.pollDetails,
            options: updatedOptions,
            totalVotes: p.pollDetails.totalVotes + 1
          }
        };
      }
      return p;
    }));

    setVotedPolls(prev => ({ ...prev, [postId]: optionId }));
    triggerToast(lang === 'ar' ? 'تم تسجيل تصويتك' : lang === 'tr' ? 'Oyunuz kaydedildi!' : 'Your vote has been cast!');
  };

  // Categories
  const CATEGORIES = [
    'All', 'Technology', 'Software', 'AI', 'Cybersecurity', 'Students', 'Education', 'Events', 'Announcements', 'Projects', 'General'
  ];

  const POST_TYPES = [
    { value: 'All', label: { tr: 'Tüm Formatlar', en: 'All Formats', ar: 'جميع التنسيقات' } },
    { value: 'text', label: { tr: 'X Gönderisi', en: 'X Post', ar: 'منشور إكس' } },
    { value: 'image', label: { tr: 'Görsel', en: 'Image', ar: 'صورة' } },
    { value: 'gallery', label: { tr: 'Galeri', en: 'Gallery', ar: 'معرض صور' } },
    { value: 'video', label: { tr: 'Video', en: 'Video', ar: 'فيديو' } },
    { value: 'linkedin', label: { tr: 'LinkedIn Tarzı', en: 'LinkedIn Style', ar: 'أسلوب لينكد إن' } },
    { value: 'job', label: { tr: 'İş İlanı', en: 'Job Post', ar: 'فرصة عمل' } },
    { value: 'event', label: { tr: 'Etkinlik', en: 'Event', ar: 'فعالية' } },
    { value: 'project', label: { tr: 'Proje', en: 'Project', ar: 'مشروع' } },
    { value: 'poll', label: { tr: 'Anket', en: 'Poll', ar: 'استطلاع رأي' } },
    { value: 'pdf', label: { tr: 'PDF Belgesi', en: 'PDF Post', ar: 'ملف PDF' } },
    { value: 'quote', label: { tr: 'Alıntı', en: 'Quote', ar: 'اقتباس' } },
  ];

  // Filter and sort computation
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Draft check (Only visible to admin)
      if (post.isDraft && !isAdmin) return false;
      if (post.isArchived) return false;

      // Search match
      const textMatch = 
        post.title[lang]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content[lang]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category match
      const catMatch = selectedCategory === 'All' || post.category === selectedCategory;

      // Type match
      const typeMatch = selectedType === 'All' || post.type === selectedType;

      return textMatch && catMatch && typeMatch;
    }).sort((a, b) => {
      // Pinned posts always stay on top
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        // popular: order by views
        return b.views - a.views;
      }
    });
  }, [posts, searchQuery, selectedCategory, selectedType, sortBy, isAdmin, lang]);

  // Social Sharing Actions
  const handleShare = (post: SocialPost, channel: string) => {
    const postUrl = `${window.location.origin}${window.location.pathname}?post=${post.id}`;
    const text = `${post.title[lang]} - ${post.content[lang].slice(0, 100)}...`;

    let url = '';
    if (channel === 'copy') {
      navigator.clipboard.writeText(postUrl);
      triggerToast(lang === 'ar' ? 'تم نسخ الرابط إلى الحافظة' : lang === 'tr' ? 'Bağlantı kopyalandı!' : 'Link copied to clipboard!');
      setActiveShareId(null);
      return;
    } else if (channel === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n' + postUrl)}`;
    } else if (channel === 'telegram') {
      url = `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(text)}`;
    } else if (channel === 'linkedin') {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
    } else if (channel === 'x') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`;
    } else if (channel === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    }

    if (url) {
      window.open(url, '_blank');
    }
    setActiveShareId(null);
  };

  // Create & Edit form handlers
  const openCreatePost = () => {
    setEditingPost(null);
    setFormData({
      type: 'text',
      category: 'Technology',
      isPinned: false,
      isDraft: false,
      title_tr: '', title_en: '', title_ar: '',
      content_tr: '', content_en: '', content_ar: '',
      hashtags: 'AI, WebDevelopment, Software',
      location: '',
      images: [],
      videoUrl: '',
      pdfUrl: '',
      pdfTitle: '',
      jobCompany: '', jobPosition: '', jobLocation: '', jobType: 'Full-time', jobDeadline: '', jobApplyLink: '', jobRequirements: '', jobSalary: '',
      eventTitle: '', eventDate: '', eventLocation: '', eventOrganizer: '', eventRegLink: '',
      projectName: '', projectTech: 'React, Tailwind, Node', projectGithub: '', projectWebsite: '', projectStatus: 'Completed',
      pollQuestion: '', pollOptions: 'React, Vue, Next.js, Angular',
      quoteText: '', quoteAuthor: '', quoteBgStyle: 'bg-gradient-to-tr from-orange-600 via-amber-600 to-red-600',
      linkUrl: '', linkTitle: '', linkDescription: '', linkImage: ''
    });
    setIsEditorOpen(true);
  };

  const openEditPost = (post: SocialPost) => {
    setEditingPost(post);
    setFormData({
      type: post.type,
      category: post.category,
      isPinned: post.isPinned || false,
      isDraft: post.isDraft || false,
      title_tr: post.title.tr, title_en: post.title.en, title_ar: post.title.ar,
      content_tr: post.content.tr, content_en: post.content.en, content_ar: post.content.ar,
      hashtags: post.hashtags.join(', '),
      location: post.location || '',
      images: post.images || [],
      videoUrl: post.videoUrl || '',
      pdfUrl: post.pdfUrl || '',
      pdfTitle: post.pdfTitle || '',
      jobCompany: post.jobDetails?.company || '',
      jobPosition: post.jobDetails?.position || '',
      jobLocation: post.jobDetails?.location || '',
      jobType: post.jobDetails?.type || 'Full-time',
      jobDeadline: post.jobDetails?.deadline || '',
      jobApplyLink: post.jobDetails?.applyLink || '',
      jobRequirements: post.jobDetails?.requirements.join(', ') || '',
      jobSalary: post.jobDetails?.salary || '',
      eventTitle: post.eventDetails?.title || '',
      eventDate: post.eventDetails?.date || '',
      eventLocation: post.eventDetails?.location || '',
      eventOrganizer: post.eventDetails?.organizer || '',
      eventRegLink: post.eventDetails?.regLink || '',
      projectName: post.projectDetails?.name || '',
      projectTech: post.projectDetails?.tech.join(', ') || '',
      projectGithub: post.projectDetails?.github || '',
      projectWebsite: post.projectDetails?.website || '',
      projectStatus: post.projectDetails?.status || 'Completed',
      pollQuestion: post.pollDetails?.question || '',
      pollOptions: post.pollDetails?.options.map(o => o.text).join(', ') || '',
      quoteText: post.quoteDetails?.text || '',
      quoteAuthor: post.quoteDetails?.author || '',
      quoteBgStyle: post.quoteDetails?.bgStyle || 'bg-gradient-to-tr from-orange-600 via-amber-600 to-red-600',
      linkUrl: post.linkDetails?.url || '',
      linkTitle: post.linkDetails?.title || '',
      linkDescription: post.linkDetails?.description || '',
      linkImage: post.linkDetails?.image || ''
    });
    setIsEditorOpen(true);
  };

  const handleSavePostForm = (e: React.FormEvent) => {
    e.preventDefault();

    const tagList = formData.hashtags.split(',').map(t => t.trim()).filter(Boolean);
    const imagesList = formData.images;

    // Build specific structures based on type
    const jobDetails = formData.type === 'job' ? {
      company: formData.jobCompany,
      position: formData.jobPosition,
      location: formData.jobLocation,
      type: formData.jobType,
      deadline: formData.jobDeadline,
      applyLink: formData.jobApplyLink,
      requirements: formData.jobRequirements.split(',').map(r => r.trim()).filter(Boolean),
      salary: formData.jobSalary || undefined
    } : undefined;

    const eventDetails = formData.type === 'event' ? {
      title: formData.eventTitle,
      date: formData.eventDate,
      location: formData.eventLocation,
      organizer: formData.eventOrganizer,
      regLink: formData.eventRegLink
    } : undefined;

    const projectDetails = formData.type === 'project' ? {
      name: formData.projectName,
      tech: formData.projectTech.split(',').map(t => t.trim()).filter(Boolean),
      github: formData.projectGithub || undefined,
      website: formData.projectWebsite || undefined,
      status: formData.projectStatus
    } : undefined;

    const pollDetails = formData.type === 'poll' ? {
      question: formData.pollQuestion || formData.title_en,
      options: formData.pollOptions.split(',').map((o, idx) => ({
        id: `opt-${idx}`,
        text: o.trim(),
        votes: editingPost?.pollDetails?.options[idx]?.votes || 0
      })).filter(o => o.text),
      totalVotes: editingPost?.pollDetails?.totalVotes || 0
    } : undefined;

    const quoteDetails = formData.type === 'quote' ? {
      text: formData.quoteText,
      author: formData.quoteAuthor,
      bgStyle: formData.quoteBgStyle
    } : undefined;

    const linkDetails = formData.type === 'link' ? {
      url: formData.linkUrl,
      title: formData.linkTitle,
      description: formData.linkDescription,
      image: formData.linkImage || undefined
    } : undefined;

    if (editingPost) {
      // Edit
      setPosts(prev => prev.map(p => {
        if (p.id === editingPost.id) {
          return {
            ...p,
            type: formData.type,
            category: formData.category,
            isPinned: formData.isPinned,
            isDraft: formData.isDraft,
            title: { tr: formData.title_tr, en: formData.title_en, ar: formData.title_ar },
            content: { tr: formData.content_tr, en: formData.content_en, ar: formData.content_ar },
            hashtags: tagList,
            location: formData.location || undefined,
            images: imagesList.length > 0 ? imagesList : undefined,
            videoUrl: formData.videoUrl || undefined,
            pdfUrl: formData.pdfUrl || undefined,
            pdfTitle: formData.pdfTitle || undefined,
            jobDetails,
            eventDetails,
            projectDetails,
            pollDetails,
            quoteDetails,
            linkDetails
          };
        }
        return p;
      }));
      triggerToast('Post updated successfully!');
    } else {
      // Create new
      const newPost: SocialPost = {
        id: `post-${Date.now()}`,
        type: formData.type,
        category: formData.category,
        isPinned: formData.isPinned,
        isDraft: formData.isDraft,
        title: { tr: formData.title_tr, en: formData.title_en, ar: formData.title_ar },
        content: { tr: formData.content_tr, en: formData.content_en, ar: formData.content_ar },
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        authorName: 'Aymen Ibrahim Hmood',
        authorRole: 'Computer Engineering Student',
        authorAvatar: 'https://i.imageupload.app/0efdab01b10f156789ab.jpeg',
        hashtags: tagList,
        location: formData.location || undefined,
        views: 0,
        likes: 0,
        reactions: { like: 0, celebrate: 0, support: 0, love: 0, insightful: 0, funny: 0 },
        comments: [],
        images: imagesList.length > 0 ? imagesList : undefined,
        videoUrl: formData.videoUrl || undefined,
        pdfUrl: formData.pdfUrl || undefined,
        pdfTitle: formData.pdfTitle || undefined,
        jobDetails,
        eventDetails,
        projectDetails,
        pollDetails,
        quoteDetails,
        linkDetails
      };

      setPosts(prev => [newPost, ...prev]);
      triggerToast('New post published successfully!');
    }

    setIsEditorOpen(false);
  };

  const deletePost = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(prev => prev.filter(p => p.id !== postId));
      triggerToast('Post deleted successfully');
    }
  };

  const togglePinPost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, isPinned: !p.isPinned };
      }
      return p;
    }));
    triggerToast('Post pinned status updated');
  };

  // Multiple File uploading utility for local attachments (as Base64)
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls: string[] = [];
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            urls.push(reader.result as string);
            setFormData(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <div className={embedded ? 'relative' : `py-12 sm:py-20 min-h-screen relative overflow-x-hidden ${theme === 'dark' ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[100] bg-orange-600 text-white px-5 py-3 sm:px-6 sm:py-4 rounded-2xl shadow-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2.5 sm:gap-3 animate-bounce">
          <Sparkles size={16} />
          {showToast}
        </div>
      )}

      {/* Media Fullscreen Viewer */}
      {activeMediaViewer && (
        <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4">
          <button 
            onClick={() => setActiveMediaViewer(null)} 
            className="absolute top-6 right-6 text-white hover:text-orange-500 transition-colors bg-white/10 p-3 rounded-full"
          >
            <X size={24} />
          </button>
          
          <button 
            onClick={() => setActiveMediaViewer(prev => prev ? { ...prev, currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length } : null)}
            className="absolute left-6 text-white hover:text-orange-500 transition-colors bg-white/10 p-3 rounded-full"
          >
            <ChevronLeft size={24} />
          </button>

          <img 
            src={activeMediaViewer.images[activeMediaViewer.currentIndex]} 
            alt="Viewer" 
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl" 
          />

          <button 
            onClick={() => setActiveMediaViewer(prev => prev ? { ...prev, currentIndex: (prev.currentIndex + 1) % prev.images.length } : null)}
            className="absolute right-6 text-white hover:text-orange-500 transition-colors bg-white/10 p-3 rounded-full"
          >
            <ChevronRight size={24} />
          </button>

          {/* Download btn */}
          <a 
            href={activeMediaViewer.images[activeMediaViewer.currentIndex]} 
            download="media.png" 
            className="absolute bottom-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full flex items-center gap-2 text-sm font-black uppercase tracking-wider transition-all"
          >
            <Download size={16} /> {lang === 'tr' ? 'İndir' : lang === 'ar' ? 'تحميل' : 'Download'}
          </a>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Title Section */}
        {!embedded && (
        <div className="mb-8 sm:mb-12 text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-orange-600/10 text-orange-600 dark:text-orange-500 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest border border-orange-500/20">
            <Flame size={14} className="animate-pulse" />
            {lang === 'tr' ? 'Sosyal Medya Akışı' : lang === 'ar' ? 'الشبكة الاجتماعية' : 'Premium Multi-Social Feed'}
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter italic break-words">
            {lang === 'tr' ? 'AYMEN GÖNDERİLERİ' : lang === 'ar' ? 'منشورات أيمن' : 'AYMEN\'S SOCIAL FEED'}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-xs sm:text-sm md:text-base px-2 sm:px-0">
            {lang === 'tr' ? 'Instagram\'ın görselliği, LinkedIn\'in profesyonelliği ve X platformunun hızını bir araya getiren premium sosyal paylaşımlar.' 
            : lang === 'ar' ? 'مزيج فريد من جاذبية إنستغرام، ومهنية لينكد إن، وسرعة إكس.' 
            : 'A modern, curated combination of Instagram visuals, LinkedIn professionalism, and X simplicity.'}
          </p>
          <div className="w-16 sm:w-24 h-2 bg-orange-600 rounded-full mx-auto"></div>
        </div>
        )}

        {/* Quick Back Button & Admin controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white/5 dark:bg-zinc-900/40 p-4 rounded-3xl border border-zinc-200/80 dark:border-white/5">
          {embedded ? <div /> : (
          <button 
            onClick={onBack} 
            className="px-6 py-3 bg-zinc-600/10 hover:bg-zinc-600/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <ArrowLeft size={14} /> {lang === 'tr' ? 'Portfolyoya Dön' : lang === 'ar' ? 'العودة للموقع' : 'Back to Portfolio'}
          </button>
          )}

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button 
                onClick={openCreatePost} 
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-orange-600/20"
              >
                <PlusCircle size={14} /> {lang === 'tr' ? 'Gönderi Oluştur' : lang === 'ar' ? 'إنشاء منشور' : 'Create Post'}
              </button>
            )}
          </div>
        </div>

        {/* Grid Search & Categories Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Main Feed Left/Search Filters Column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Search Input */}
            <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-[30px] border border-zinc-200/80 dark:border-white/5 space-y-4 shadow-xl">
              <h3 className="text-sm font-black uppercase tracking-widest text-orange-600">
                {lang === 'tr' ? 'Arama' : lang === 'ar' ? 'البحث' : 'Search Feed'}
              </h3>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="text" 
                  placeholder={lang === 'tr' ? 'Gönderi ara...' : lang === 'ar' ? 'بحث في المنشورات...' : 'Search posts...'}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className={`w-full bg-zinc-100 dark:bg-zinc-800/40 border-b-2 border-transparent focus:border-orange-600 p-4 ${lang === 'ar' ? 'pr-4 pl-12' : 'pl-12 pr-4'} rounded-2xl outline-none font-bold text-sm transition-all`}
                />
              </div>
            </div>

            {/* Post Types Filter Grid */}
            <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-[30px] border border-zinc-200/80 dark:border-white/5 space-y-4 shadow-xl">
              <h3 className="text-sm font-black uppercase tracking-widest text-orange-600">
                {lang === 'tr' ? 'Gönderi Türü' : lang === 'ar' ? 'تنسيق المنشور' : 'Post Format'}
              </h3>
              <div className="flex flex-col gap-1.5">
                {POST_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-between ${
                      selectedType === type.value 
                        ? 'bg-orange-600/10 text-orange-600 border-l-4 border-orange-600' 
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/40 text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    <span>{type.label[lang]}</span>
                    {selectedType === type.value && <Check size={12} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting Dropdown */}
            <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-[30px] border border-zinc-200/80 dark:border-white/5 space-y-4 shadow-xl">
              <h3 className="text-sm font-black uppercase tracking-widest text-orange-600">
                {lang === 'tr' ? 'Sıralama' : lang === 'ar' ? 'الترتيب' : 'Sorting'}
              </h3>
              <div className="flex gap-2">
                {(['newest', 'popular', 'oldest'] as const).map(sort => (
                  <button
                    key={sort}
                    onClick={() => setSortBy(sort)}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg border transition-all ${
                      sortBy === sort 
                        ? 'bg-orange-600 text-white border-transparent' 
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {sort === 'newest' ? (lang === 'tr' ? 'Yeni' : lang === 'ar' ? 'الأحدث' : 'New') 
                     : sort === 'oldest' ? (lang === 'tr' ? 'Eski' : lang === 'ar' ? 'الأقدم' : 'Old') 
                     : (lang === 'tr' ? 'Popüler' : lang === 'ar' ? 'شائع' : 'Popular')}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Social Feed Content Block */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Category horizontal scrolling bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none max-w-full">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border whitespace-nowrap transition-all ${
                    selectedCategory === category 
                      ? 'bg-orange-600 text-white border-transparent shadow-lg shadow-orange-600/20' 
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-300 hover:border-orange-500/50'
                  }`}
                >
                  {category === 'All' ? (lang === 'tr' ? 'Tüm Kategoriler' : lang === 'ar' ? 'جميع التصنيفات' : 'All Topics') : category}
                </button>
              ))}
            </div>

            {/* Posts Stream */}
            <div className="space-y-8">
              {filteredPosts.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 p-16 rounded-[40px] border border-zinc-200 dark:border-zinc-800 text-center space-y-6">
                  <div className="w-20 h-20 bg-orange-600/10 text-orange-600 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle size={36} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight">
                    {lang === 'tr' ? 'Gönderi Bulunamadı' : lang === 'ar' ? 'لم يتم العثور على منشورات' : 'No Posts Found'}
                  </h3>
                  <p className="text-zinc-500 max-w-md mx-auto">
                    {lang === 'tr' ? 'Aradığınız kriterlere uygun herhangi bir paylaşım şu an mevcut değil. Lütfen başka bir arama yapmayı veya filtreyi temizlemeyi deneyin.'
                    : lang === 'ar' ? 'لا توجد أي منشورات تطابق معايير البحث الخاصة بك حالياً. يرجى تجربة فئات أخرى.'
                    : 'We couldn\'t find any social posts matching your filters. Try shifting categories or entering different keywords.'}
                  </p>
                </div>
              ) : (
                filteredPosts.map(post => {
                  return (
                    <article 
                      key={post.id} 
                      className={`relative bg-white dark:bg-zinc-900/60 rounded-[40px] border-2 transition-all duration-300 shadow-2xl overflow-hidden hover:border-orange-600/30 ${
                        post.isPinned 
                          ? 'border-orange-600/50 bg-gradient-to-b from-orange-500/[0.02] to-transparent' 
                          : 'border-zinc-200/80 dark:border-white/5'
                      }`}
                    >
                      {/* Pinned visual flag */}
                      {post.isPinned && (
                        <div className="absolute top-0 right-0 bg-orange-600 text-white px-5 py-1.5 rounded-bl-[20px] text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 z-10">
                          <Pin size={10} className="fill-current" /> {lang === 'tr' ? 'SABİTLENDİ' : lang === 'ar' ? 'مثبت' : 'PINNED'}
                        </div>
                      )}

                      {/* Post Header Card */}
                      <div className="p-6 sm:p-8 flex items-start justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/60">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md border-2 border-orange-600/20">
                            <img src={post.authorAvatar || 'https://i.imageupload.app/0efdab01b10f156789ab.jpeg'} alt="Aymen" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-sm sm:text-base hover:text-orange-500 transition-colors">{post.authorName}</h4>
                              <span className="px-2 py-0.5 bg-orange-600/10 text-orange-600 rounded text-[9px] font-black uppercase tracking-widest">
                                {post.category}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{post.authorRole}</p>
                            <div className="flex items-center gap-2 mt-1 text-zinc-400 dark:text-zinc-500 text-[10px] font-black">
                              <Clock size={10} />
                              <span>{post.date}</span>
                              {post.time && (
                                <>
                                  <span>•</span>
                                  <span>{post.time}</span>
                                </>
                              )}
                              {post.location && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-0.5"><MapPin size={9} /> {post.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Admin and Controls menu */}
                        <div className="flex items-center gap-1.5">
                          {isAdmin && (
                            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/40 p-1.5 rounded-xl border border-zinc-200/80 dark:border-white/5">
                              <button 
                                onClick={() => openEditPost(post)} 
                                className="p-1.5 hover:text-orange-600 text-zinc-500 dark:text-zinc-400 transition-colors"
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                onClick={() => togglePinPost(post.id)} 
                                className={`p-1.5 transition-colors ${post.isPinned ? 'text-orange-600' : 'text-zinc-500'}`}
                              >
                                <Pin size={14} />
                              </button>
                              <button 
                                onClick={() => deletePost(post.id)} 
                                className="p-1.5 hover:text-red-500 text-zinc-500 dark:text-zinc-400 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Post Body Area */}
                      <div className="p-6 sm:p-8 space-y-6">
                        
                        <div className="space-y-3">
                          <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight italic">
                            {post.title[lang] || post.title.en}
                          </h2>
                          <p className="text-zinc-700 dark:text-zinc-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
                            {post.content[lang] || post.content.en}
                          </p>
                        </div>

                        {/* Render Hash Tags */}
                        {post.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {post.hashtags.map(tag => (
                              <button
                                key={tag}
                                onClick={() => setSearchQuery(`#${tag}`)}
                                className="text-xs font-black uppercase text-orange-600 dark:text-orange-500 hover:underline"
                              >
                                #{tag}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* TYPE SPECIFIC RENDERERS */}

                        {/* Image & Gallery Post */}
                        {post.type === 'image' && post.images && post.images[0] && (
                          <div 
                            onClick={() => setActiveMediaViewer({ images: post.images || [], currentIndex: 0 })}
                            className="rounded-3xl overflow-hidden cursor-zoom-in max-h-[450px] border border-zinc-200/80 dark:border-zinc-800 shadow-lg relative group"
                          >
                            <img src={post.images[0]} alt="Post Media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          </div>
                        )}

                        {post.type === 'gallery' && post.images && post.images.length > 0 && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 max-h-[400px] rounded-3xl overflow-hidden">
                              {post.images.slice(0, 4).map((img, idx) => (
                                <div 
                                  key={idx}
                                  onClick={() => setActiveMediaViewer({ images: post.images || [], currentIndex: idx })}
                                  className="relative cursor-zoom-in group h-[190px] border border-zinc-200/80 dark:border-zinc-800"
                                >
                                  <img src={img} alt="Gallery" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                                  {idx === 3 && post.images!.length > 4 && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white text-xl font-black">
                                      +{post.images!.length - 4}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Video Post */}
                        {post.type === 'video' && post.videoUrl && (
                          <div className="rounded-3xl overflow-hidden aspect-video border border-zinc-200/80 dark:border-zinc-800 shadow-lg bg-black">
                            {post.videoUrl.includes('embed') ? (
                              <iframe 
                                src={post.videoUrl} 
                                title="Video Player"
                                className="w-full h-full"
                                allowFullScreen
                              ></iframe>
                            ) : (
                              <video src={post.videoUrl} controls className="w-full h-full"></video>
                            )}
                          </div>
                        )}

                        {/* Job Post details */}
                        {post.type === 'job' && post.jobDetails && (
                          <div className="bg-zinc-100 dark:bg-zinc-800/40 p-6 sm:p-8 rounded-[30px] border border-orange-500/15 space-y-6 shadow-md">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-600/10 px-3 py-1 rounded">
                                  {post.jobDetails.type}
                                </span>
                                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100">{post.jobDetails.position}</h3>
                                <p className="text-sm font-bold text-zinc-500">{post.jobDetails.company}</p>
                              </div>

                              <div className="text-[10px] font-black uppercase text-right text-zinc-400 space-y-1">
                                <div><span className="text-zinc-500">Deadline:</span> {post.jobDetails.deadline}</div>
                                {post.jobDetails.salary && <div><span className="text-zinc-500">Salary:</span> {post.jobDetails.salary}</div>}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-zinc-600 dark:text-zinc-400">
                              <div className="flex items-center gap-2"><MapPin size={14} className="text-orange-500" /> {post.jobDetails.location}</div>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                              <h4 className="text-xs font-black uppercase tracking-wider text-orange-600">{lang === 'tr' ? 'Gereksinimler' : lang === 'ar' ? 'المتطلبات' : 'Requirements'}</h4>
                              <ul className="list-disc list-inside text-xs space-y-1 font-bold text-zinc-500 dark:text-zinc-400">
                                {post.jobDetails.requirements.map((req, rIdx) => <li key={rIdx}>{req}</li>)}
                              </ul>
                            </div>

                            <a 
                              href={post.jobDetails.applyLink} 
                              target="_blank" 
                              rel="noreferrer"
                              className="w-full block text-center py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-600/20"
                            >
                              {lang === 'tr' ? 'Şimdi Başvur' : lang === 'ar' ? 'قدّم الآن' : 'Apply Now'}
                            </a>
                          </div>
                        )}

                        {/* Event Post details */}
                        {post.type === 'event' && post.eventDetails && (
                          <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900/60 dark:to-zinc-900/10 p-6 sm:p-8 rounded-[30px] border border-orange-500/10 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-md">
                            <div className="md:col-span-2 space-y-4">
                              <div className="flex items-center gap-2 bg-orange-600/15 text-orange-600 px-3 py-1 rounded-full w-max text-[9px] font-black uppercase tracking-wider">
                                <Calendar size={10} />
                                {lang === 'tr' ? 'Canlı Etkinlik' : lang === 'ar' ? 'فعالية مباشرة' : 'Live Event'}
                              </div>
                              <h3 className="text-xl font-black uppercase tracking-tight">{post.eventDetails.title}</h3>
                              <p className="text-xs font-bold text-zinc-500"><span className="text-orange-600">{lang === 'tr' ? 'Organizatör:' : lang === 'ar' ? 'المنظم:' : 'Organizer:'}</span> {post.eventDetails.organizer}</p>
                            </div>

                            <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 md:pl-6 pt-4 md:pt-0 space-y-4">
                              <div className="space-y-2 text-xs font-bold text-zinc-600 dark:text-zinc-400">
                                <div><span className="text-orange-600">📅 Tarih:</span> {post.eventDetails.date}</div>
                                <div><span className="text-orange-600">📍 Konum:</span> {post.eventDetails.location}</div>
                              </div>
                              <a 
                                href={post.eventDetails.regLink} 
                                target="_blank" 
                                rel="noreferrer"
                                className="w-full text-center py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-600/15"
                              >
                                {lang === 'tr' ? 'Kayıt Ol' : lang === 'ar' ? 'سجل حضورك' : 'Register Now'}
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Project Showcase details */}
                        {post.type === 'project' && post.projectDetails && (
                          <div className="bg-zinc-100 dark:bg-zinc-800/40 p-6 sm:p-8 rounded-[30px] border border-zinc-200/80 dark:border-zinc-800/60 shadow-inner space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-black uppercase tracking-tight text-orange-600">{post.projectDetails.name}</h3>
                              <span className="px-3 py-1 bg-green-500/15 text-green-500 rounded text-[9px] font-black uppercase tracking-widest">
                                {post.projectDetails.status}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {post.projectDetails.tech.map(t => (
                                <span key={t} className="px-2.5 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                  {t}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                              {post.projectDetails.github && (
                                <a href={post.projectDetails.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-orange-600 transition-colors">
                                  <Github size={14} /> Repository
                                </a>
                              )}
                              {post.projectDetails.website && (
                                <a href={post.projectDetails.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-orange-600 transition-colors">
                                  <ExternalLink size={14} /> Live Demo
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Interactive Poll Component */}
                        {post.type === 'poll' && post.pollDetails && (
                          <div className="bg-zinc-100 dark:bg-zinc-850 p-6 sm:p-8 rounded-[30px] border border-zinc-200/80 dark:border-zinc-800 shadow-md space-y-6">
                            <h3 className="font-extrabold text-base sm:text-lg text-zinc-900 dark:text-zinc-100">
                              {post.pollDetails.question}
                            </h3>

                            <div className="space-y-3">
                              {post.pollDetails.options.map(option => {
                                const userVoteId = votedPolls[post.id];
                                const hasVoted = !!userVoteId;
                                const isUserChoice = userVoteId === option.id;

                                // Percentage math safely
                                const percentage = post.pollDetails!.totalVotes > 0 
                                  ? Math.round((option.votes / post.pollDetails!.totalVotes) * 100) 
                                  : 0;

                                return (
                                  <button
                                    key={option.id}
                                    onClick={() => handleVote(post.id, option.id)}
                                    disabled={hasVoted}
                                    className={`w-full text-left relative overflow-hidden p-4 rounded-xl border transition-all ${
                                      hasVoted 
                                        ? 'border-zinc-300 dark:border-zinc-700 bg-zinc-200/40 dark:bg-zinc-800/20' 
                                        : 'border-zinc-200 hover:border-orange-500/50 hover:bg-zinc-200/50 bg-white dark:bg-zinc-900'
                                    }`}
                                  >
                                    {/* Visual Voted Percentage progress fill */}
                                    {hasVoted && (
                                      <div 
                                        className={`absolute top-0 left-0 bottom-0 ${isUserChoice ? 'bg-orange-600/10' : 'bg-zinc-400/10'} transition-all duration-1000`} 
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    )}

                                    <div className="relative flex items-center justify-between text-xs sm:text-sm font-black uppercase tracking-wider z-10">
                                      <span className="flex items-center gap-2">
                                        {isUserChoice && <CheckCircle size={14} className="text-orange-600" />}
                                        <span className={isUserChoice ? 'text-orange-600 dark:text-orange-500' : ''}>{option.text}</span>
                                      </span>
                                      {hasVoted && <span className="text-zinc-500">{percentage}% ({option.votes})</span>}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>

                            <div className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                              {post.pollDetails.totalVotes} votes
                            </div>
                          </div>
                        )}

                        {/* PDF Post component */}
                        {post.type === 'pdf' && post.pdfUrl && (
                          <div className="bg-zinc-100 dark:bg-zinc-850 p-6 rounded-[30px] border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-red-600/15 text-red-600 rounded-xl flex items-center justify-center">
                                <FileText size={24} />
                              </div>
                              <div>
                                <h3 className="text-sm font-extrabold uppercase tracking-tight max-w-[250px] sm:max-w-md truncate">{post.pdfTitle || 'document.pdf'}</h3>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Interactive PDF document</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <a 
                                href={post.pdfUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-3 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl hover:text-orange-600 border border-zinc-200 dark:border-zinc-700 transition-colors"
                              >
                                <ExternalLink size={16} />
                              </a>
                              <a 
                                href={post.pdfUrl} 
                                download={post.pdfTitle || 'document.pdf'}
                                className="px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                              >
                                Download
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Quote Post styled card */}
                        {post.type === 'quote' && post.quoteDetails && (
                          <div className={`p-8 sm:p-12 rounded-[40px] text-white ${post.quoteDetails.bgStyle || 'bg-gradient-to-tr from-orange-600 to-amber-600'} shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[220px]`}>
                            <div className="absolute top-4 left-6 text-white/10 font-black text-9xl select-none leading-none">“</div>
                            <blockquote className="space-y-4 relative z-10">
                              <p className="text-lg sm:text-2xl font-black italic tracking-wide leading-relaxed">
                                "{post.quoteDetails.text}"
                              </p>
                              <cite className="block text-right text-xs sm:text-sm font-bold uppercase tracking-widest text-white/80">
                                — {post.quoteDetails.author}
                              </cite>
                            </blockquote>
                          </div>
                        )}

                        {/* External Link Post preview */}
                        {post.type === 'link' && post.linkDetails && (
                          <a 
                            href={post.linkDetails.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="block bg-zinc-100 dark:bg-zinc-850 rounded-[30px] border border-zinc-200/80 dark:border-zinc-800 hover:border-orange-500/50 transition-all overflow-hidden shadow-md group"
                          >
                            {post.linkDetails.image && (
                              <div className="h-48 overflow-hidden border-b border-zinc-200/80 dark:border-zinc-800">
                                <img src={post.linkDetails.image} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                              </div>
                            )}
                            <div className="p-6 space-y-2">
                              <div className="text-[10px] font-black uppercase text-orange-600 tracking-widest flex items-center gap-1">
                                <ExternalLink size={10} /> {new URL(post.linkDetails.url).hostname}
                              </div>
                              <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">{post.linkDetails.title}</h3>
                              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 line-clamp-2">{post.linkDetails.description}</p>
                            </div>
                          </a>
                        )}

                      </div>

                      {/* Post Interactions Action Bar - Only Share */}
                      <div className="p-4 sm:px-8 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-end relative bg-zinc-50/50 dark:bg-zinc-900/10">
                        {/* Share dropdown */}
                        <div className="relative">
                          <button 
                            onClick={() => setActiveShareId(prev => prev === post.id ? null : post.id)}
                            className="px-5 py-2.5 bg-orange-600/10 hover:bg-orange-600 text-orange-600 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
                          >
                            <Share2 size={15} />
                            <span>{lang === 'tr' ? 'Paylaş' : lang === 'ar' ? 'مشاركة' : 'Share'}</span>
                          </button>

                          {activeShareId === post.id && (
                            <div className={`absolute bottom-full mb-2 ${lang === 'ar' ? 'left-0' : 'right-0'} bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 shadow-2xl w-48 z-40 space-y-1.5`}>
                              <button onClick={() => handleShare(post, 'copy')} className="w-full text-left px-3 py-2 rounded-xl text-xs font-black uppercase hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2">
                                <Copy size={12} /> Copy Link
                              </button>
                              <button onClick={() => handleShare(post, 'whatsapp')} className="w-full text-left px-3 py-2 rounded-xl text-xs font-black uppercase hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 text-green-500">
                                WhatsApp
                              </button>
                              <button onClick={() => handleShare(post, 'telegram')} className="w-full text-left px-3 py-2 rounded-xl text-xs font-black uppercase hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 text-blue-400">
                                Telegram
                              </button>
                              <button onClick={() => handleShare(post, 'linkedin')} className="w-full text-left px-3 py-2 rounded-xl text-xs font-black uppercase hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 text-blue-600">
                                LinkedIn
                              </button>
                              <button onClick={() => handleShare(post, 'x')} className="w-full text-left px-3 py-2 rounded-xl text-xs font-black uppercase hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 text-zinc-900 dark:text-white">
                                X (Twitter)
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                    </article>
                  );
                })
              )}
            </div>

          </div>

        </div>

      </div>

      {/* ADMIN EDIT / CREATE POST DIALOG / DRAWER */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-200/80 dark:border-zinc-800 p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative space-y-6">
            
            <button 
              onClick={() => setIsEditorOpen(false)} 
              className="absolute top-6 right-6 text-zinc-400 hover:text-orange-600 bg-zinc-100 dark:bg-zinc-800 p-2.5 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-orange-600 italic">
                {editingPost ? 'Edit Social Post' : 'Create New Social Post'}
              </h2>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Publish content across multiple templates</p>
              <div className="w-20 h-1 bg-orange-600 rounded"></div>
            </div>

            <form onSubmit={handleSavePostForm} className="space-y-6 text-xs sm:text-sm">
              
              {/* Type and Category Select Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Post Type</label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({ ...formData, type: e.target.value as SocialPostType })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-orange-600 mt-1"
                  >
                    <option value="text">Twitter/X Text Post</option>
                    <option value="image">Single Image Post</option>
                    <option value="gallery">Instagram Multi Image Gallery</option>
                    <option value="video">Vimeo / YouTube Video</option>
                    <option value="linkedin">LinkedIn Style Update</option>
                    <option value="job">Professional Job Posting</option>
                    <option value="event">Organized Event Announcement</option>
                    <option value="project">Project Showcase</option>
                    <option value="poll">Interactive Poll Question</option>
                    <option value="pdf">PDF File Attachment</option>
                    <option value="quote">Styled Quote Card</option>
                    <option value="link">External Link Preview</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Feed Category</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-orange-600 mt-1"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title Fields per Languages */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Post Title / Header (TR / EN / AR)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input 
                    type="text" placeholder="Başlık (Türkçe)" required
                    value={formData.title_tr} onChange={e => setFormData({ ...formData, title_tr: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none" 
                  />
                  <input 
                    type="text" placeholder="Title (English)" required
                    value={formData.title_en} onChange={e => setFormData({ ...formData, title_en: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none" 
                  />
                  <input 
                    type="text" placeholder="العنوان (العربية)" required
                    value={formData.title_ar} onChange={e => setFormData({ ...formData, title_ar: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-right" 
                  />
                </div>
              </div>

              {/* Content Markdown/Text paragraphs per Language */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Post Content Body (TR / EN / AR)</label>
                <div className="space-y-3">
                  <textarea 
                    rows={2} placeholder="Gönderi içeriği (Türkçe)" required
                    value={formData.content_tr} onChange={e => setFormData({ ...formData, content_tr: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none" 
                  />
                  <textarea 
                    rows={2} placeholder="Post content body (English)" required
                    value={formData.content_en} onChange={e => setFormData({ ...formData, content_en: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none" 
                  />
                  <textarea 
                    rows={2} placeholder="محتوى المنشور (العربية)" required
                    value={formData.content_ar} onChange={e => setFormData({ ...formData, content_ar: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-right" 
                  />
                </div>
              </div>

              {/* DYNAMIC FIELD FIELDS DEPENDING ON ACTIVE POST TYPE */}

              {/* Image & Gallery Fields */}
              {(formData.type === 'image' || formData.type === 'gallery') && (
                <div className="space-y-3 p-6 bg-zinc-100 dark:bg-zinc-800/40 rounded-3xl border border-zinc-200/80 dark:border-white/5">
                  <h4 className="text-xs font-black uppercase text-orange-600">Attachment Uploads</h4>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Drag/Select Local Images</label>
                    <input 
                      type="file" multiple accept="image/*"
                      onChange={handleMediaUpload}
                      className="w-full text-xs font-bold text-zinc-500"
                    />
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {formData.images.map((imgUrl, idx) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden h-16 border border-orange-500/20">
                          <img src={imgUrl} alt="Upload preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                            className="absolute top-1 right-1 bg-black/75 text-white p-0.5 rounded-full hover:bg-orange-600"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Video fields */}
              {formData.type === 'video' && (
                <div className="space-y-3 p-6 bg-zinc-100 dark:bg-zinc-800/40 rounded-3xl border border-zinc-200/80 dark:border-white/5">
                  <h4 className="text-xs font-black uppercase text-orange-600">Video Properties</h4>
                  <input 
                    type="text" placeholder="YouTube or Vimeo URL (e.g., https://www.youtube.com/embed/...)" required
                    value={formData.videoUrl} onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                  />
                </div>
              )}

              {/* PDF field */}
              {formData.type === 'pdf' && (
                <div className="space-y-3 p-6 bg-zinc-100 dark:bg-zinc-800/40 rounded-3xl border border-zinc-200/80 dark:border-white/5">
                  <h4 className="text-xs font-black uppercase text-orange-600">PDF Attachment details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" placeholder="PDF Document Title (e.g. Portfolio_Guide.pdf)" required
                      value={formData.pdfTitle} onChange={e => setFormData({ ...formData, pdfTitle: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                    <input 
                      type="text" placeholder="PDF Download/View URL link" required
                      value={formData.pdfUrl} onChange={e => setFormData({ ...formData, pdfUrl: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                  </div>
                </div>
              )}

              {/* Job fields */}
              {formData.type === 'job' && (
                <div className="space-y-3 p-6 bg-zinc-100 dark:bg-zinc-800/40 rounded-3xl border border-zinc-200/80 dark:border-white/5">
                  <h4 className="text-xs font-black uppercase text-orange-600">Job Specification</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input 
                      type="text" placeholder="Company Name" required
                      value={formData.jobCompany} onChange={e => setFormData({ ...formData, jobCompany: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                    <input 
                      type="text" placeholder="Position (e.g. Intern)" required
                      value={formData.jobPosition} onChange={e => setFormData({ ...formData, jobPosition: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                    <input 
                      type="text" placeholder="Location (e.g. Remote)" required
                      value={formData.jobLocation} onChange={e => setFormData({ ...formData, jobLocation: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input 
                      type="text" placeholder="Employment Type" required
                      value={formData.jobType} onChange={e => setFormData({ ...formData, jobType: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                    <input 
                      type="date" placeholder="Deadline" required
                      value={formData.jobDeadline} onChange={e => setFormData({ ...formData, jobDeadline: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                    <input 
                      type="text" placeholder="Apply Link" required
                      value={formData.jobApplyLink} onChange={e => setFormData({ ...formData, jobApplyLink: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                    <input 
                      type="text" placeholder="Salary (Optional)"
                      value={formData.jobSalary} onChange={e => setFormData({ ...formData, jobSalary: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                  </div>

                  <input 
                    type="text" placeholder="Requirements (Comma-separated: React, Node, SQL)" required
                    value={formData.jobRequirements} onChange={e => setFormData({ ...formData, jobRequirements: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                  />
                </div>
              )}

              {/* Event fields */}
              {formData.type === 'event' && (
                <div className="space-y-3 p-6 bg-zinc-100 dark:bg-zinc-800/40 rounded-3xl border border-zinc-200/80 dark:border-white/5">
                  <h4 className="text-xs font-black uppercase text-orange-600">Event Specification</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input 
                      type="text" placeholder="Event Name / Title" required
                      value={formData.eventTitle} onChange={e => setFormData({ ...formData, eventTitle: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                    <input 
                      type="text" placeholder="Date & Time (e.g. 2026-07-20 09:00 AM)" required
                      value={formData.eventDate} onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                    <input 
                      type="text" placeholder="Physical Address / Location" required
                      value={formData.eventLocation} onChange={e => setFormData({ ...formData, eventLocation: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" placeholder="Organizer name" required
                      value={formData.eventOrganizer} onChange={e => setFormData({ ...formData, eventOrganizer: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                    <input 
                      type="text" placeholder="Registration Link" required
                      value={formData.eventRegLink} onChange={e => setFormData({ ...formData, eventRegLink: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                  </div>
                </div>
              )}

              {/* Project showcase fields */}
              {formData.type === 'project' && (
                <div className="space-y-3 p-6 bg-zinc-100 dark:bg-zinc-800/40 rounded-3xl border border-zinc-200/80 dark:border-white/5">
                  <h4 className="text-xs font-black uppercase text-orange-600">Project Highlight</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input 
                      type="text" placeholder="Project name" required
                      value={formData.projectName} onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                    <input 
                      type="text" placeholder="Technologies Used (Comma-separated)" required
                      value={formData.projectTech} onChange={e => setFormData({ ...formData, projectTech: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                    <select 
                      value={formData.projectStatus} onChange={e => setFormData({ ...formData, projectStatus: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    >
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Active">Active</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" placeholder="GitHub Repository URL link"
                      value={formData.projectGithub} onChange={e => setFormData({ ...formData, projectGithub: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                    <input 
                      type="text" placeholder="Active Live Website Demo link"
                      value={formData.projectWebsite} onChange={e => setFormData({ ...formData, projectWebsite: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                  </div>
                </div>
              )}

              {/* Poll fields */}
              {formData.type === 'poll' && (
                <div className="space-y-3 p-6 bg-zinc-100 dark:bg-zinc-800/40 rounded-3xl border border-zinc-200/80 dark:border-white/5">
                  <h4 className="text-xs font-black uppercase text-orange-600">Interactive Poll Details</h4>
                  <div className="space-y-2">
                    <input 
                      type="text" placeholder="Poll Question (e.g. Which programming language do you use?)" required
                      value={formData.pollQuestion} onChange={e => setFormData({ ...formData, pollQuestion: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                    <input 
                      type="text" placeholder="Options (Comma-separated: Java, JavaScript, Python, C++)" required
                      value={formData.pollOptions} onChange={e => setFormData({ ...formData, pollOptions: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                  </div>
                </div>
              )}

              {/* Quote fields */}
              {formData.type === 'quote' && (
                <div className="space-y-3 p-6 bg-zinc-100 dark:bg-zinc-800/40 rounded-3xl border border-zinc-200/80 dark:border-white/5">
                  <h4 className="text-xs font-black uppercase text-orange-600">Quote Styling</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" placeholder="Quote Content" required
                      value={formData.quoteText} onChange={e => setFormData({ ...formData, quoteText: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                    <input 
                      type="text" placeholder="Author/Source name (e.g. Steve Jobs)" required
                      value={formData.quoteAuthor} onChange={e => setFormData({ ...formData, quoteAuthor: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Backdrop Styling Gradient</label>
                    <select 
                      value={formData.quoteBgStyle} onChange={e => setFormData({ ...formData, quoteBgStyle: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs mt-1" 
                    >
                      <option value="bg-gradient-to-tr from-orange-600 via-amber-600 to-red-600">Orange Energy Sunset</option>
                      <option value="bg-gradient-to-tr from-blue-600 to-purple-700">Cool Professional Blue/Violet</option>
                      <option value="bg-gradient-to-tr from-emerald-600 to-teal-700">Calming Organic Green/Emerald</option>
                      <option value="bg-gradient-to-tr from-zinc-800 to-black border-2 border-white/10">Sleek Noir Slate Black</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Link fields */}
              {formData.type === 'link' && (
                <div className="space-y-3 p-6 bg-zinc-100 dark:bg-zinc-800/40 rounded-3xl border border-zinc-200/80 dark:border-white/5">
                  <h4 className="text-xs font-black uppercase text-orange-600">External URL Metadata</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" placeholder="External URL link (e.g., https://...)" required
                      value={formData.linkUrl} onChange={e => setFormData({ ...formData, linkUrl: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                    <input 
                      type="text" placeholder="Meta Title / Heading preview" required
                      value={formData.linkTitle} onChange={e => setFormData({ ...formData, linkTitle: e.target.value })}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                    />
                  </div>
                  <input 
                    type="text" placeholder="Short description metadata snippet" required
                    value={formData.linkDescription} onChange={e => setFormData({ ...formData, linkDescription: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                  />
                  <input 
                    type="text" placeholder="Optional thumbnail image preview URL"
                    value={formData.linkImage} onChange={e => setFormData({ ...formData, linkImage: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none text-xs" 
                  />
                </div>
              )}

              {/* Common tags and configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Hashtags (Comma-separated)</label>
                  <input 
                    type="text" placeholder="e.g. AI, Code, React" required
                    value={formData.hashtags} onChange={e => setFormData({ ...formData, hashtags: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none mt-1" 
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Location Label</label>
                  <input 
                    type="text" placeholder="e.g. Remote, Hatay, Turkey"
                    value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl font-bold outline-none mt-1" 
                  />
                </div>

                <div className="sm:col-span-1 flex items-center justify-around gap-2 bg-zinc-100 dark:bg-zinc-800/40 p-4 rounded-xl mt-4">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
                    <input 
                      type="checkbox" checked={formData.isPinned}
                      onChange={e => setFormData({ ...formData, isPinned: e.target.checked })}
                      className="rounded accent-orange-600"
                    />
                    <span>Pin Post</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
                    <input 
                      type="checkbox" checked={formData.isDraft}
                      onChange={e => setFormData({ ...formData, isDraft: e.target.checked })}
                      className="rounded accent-orange-600"
                    />
                    <span>Save Draft</span>
                  </label>
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-orange-600/20"
                >
                  {editingPost ? 'Save Changes' : 'Publish to Feed'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditorOpen(false)}
                  className="px-6 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
