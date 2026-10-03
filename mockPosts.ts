import { SocialPost } from './types';

export const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    type: 'announcement',
    category: 'Announcements',
    isPinned: true,
    views: 1240,
    likes: 340,
    reactions: { like: 220, celebrate: 40, support: 10, love: 50, insightful: 15, funny: 5 },
    date: '2026-07-05',
    time: '10:00 AM',
    authorName: 'Aymen Ibrahim Hmood',
    authorRole: 'Computer Engineering Student',
    authorAvatar: 'https://i.imageupload.app/0efdab01b10f156789ab.jpeg',
    hashtags: ['Welcome', 'Portfolio', 'FullStack'],
    title: {
      tr: 'Yeni Sosyal Akış Sayfamıza Hoş Geldiniz! 🚀',
      en: 'Welcome to Our New Social Feed Page! 🚀',
      ar: 'مرحباً بكم في صفحة المنشورات الاجتماعية الجديدة! 🚀'
    },
    content: {
      tr: 'Artık benimle ilgili en güncel gelişmeleri, teknik paylaşımları, iş fırsatlarını, etkinlikleri ve çok daha fazlasını tek bir yerden takip edebilirsiniz. Bu sayfa Instagram, LinkedIn ve X platformlarının en şık özelliklerini bir araya getiriyor. Beğendiğiniz gönderileri doğrudan arkadaşlarınızla paylaşabilirsiniz!',
      en: 'Now you can follow the latest updates, technical posts, job opportunities, events, and much more about me in one place. This page combines the finest features of Instagram, LinkedIn, and X. You can easily share any post with your network!',
      ar: 'الآن يمكنك متابعة آخر التحديثات، المنشورات التقنية، فرص العمل، الفعاليات، وأكثر من ذلك بكثير عني في مكان واحد. تجمع هذه الصفحة بين أرقى ميزات إنستغرام ولينكد إن وإكس. يمكنك بسهولة مشاركة أي منشور مع شبكتك!'
    },
    comments: [
      {
        id: 'comment-1-1',
        userName: 'Elif Yılmaz',
        text: 'Bu harika olmuş! Gerçekten modern ve benzersiz bir arayüz.',
        date: '2026-07-05 10:30 AM',
        likes: 12,
        replies: []
      }
    ]
  },
  {
    id: 'post-2',
    type: 'poll',
    category: 'Technology',
    views: 980,
    likes: 110,
    reactions: { like: 80, celebrate: 5, support: 2, love: 12, insightful: 11, funny: 0 },
    date: '2026-07-04',
    time: '02:15 PM',
    authorName: 'Aymen Ibrahim Hmood',
    authorRole: 'Software Developer',
    authorAvatar: 'https://i.imageupload.app/0efdab01b10f156789ab.jpeg',
    hashtags: ['WebDev', 'Programming', 'Frontend'],
    title: {
      tr: 'Sizin Favori Ön-Yüz Teknolojiniz Hangisi?',
      en: 'Which is Your Favorite Front-End Technology?',
      ar: 'ما هي تقنية الواجهة الأمامية المفضلة لديك؟'
    },
    content: {
      tr: 'Modern web uygulamalarında harika bir kullanıcı deneyimi sunmak için ön yüz seçimi kritik önem taşıyor. Sizin favori kütüphaneniz/framework’ünüz hangisi? Ankete katılarak oyunuzu kullanabilirsiniz!',
      en: 'Choosing the right front-end stack is critical for offering stellar user experiences in modern web applications. Which library or framework is your absolute go-to? Vote in the poll below!',
      ar: 'يعد اختيار واجهة التطوير الأمامية المناسبة أمراً بالغ الأهمية لتقديم تجارب مستخدم ممتازة في تطبيقات الويب الحديثة. ما هي المكتبة أو إطار العمل المفضل لديك؟ شارك بصوتك في الاستطلاع أدناه!'
    },
    pollDetails: {
      question: 'Favorite Front-End Framework?',
      options: [
        { id: 'opt-1', text: 'React.js', votes: 142 },
        { id: 'opt-2', text: 'Vue.js', votes: 45 },
        { id: 'opt-3', text: 'Next.js (React Framework)', votes: 98 },
        { id: 'opt-4', text: 'Svelte / Angular / Others', votes: 21 }
      ],
      totalVotes: 306
    },
    comments: []
  },
  {
    id: 'post-3',
    type: 'project',
    category: 'Projects',
    views: 1150,
    likes: 210,
    reactions: { like: 120, celebrate: 45, support: 5, love: 25, insightful: 15, funny: 0 },
    date: '2026-07-03',
    time: '11:45 AM',
    authorName: 'Aymen Ibrahim Hmood',
    authorRole: 'Computer Engineering Student',
    authorAvatar: 'https://i.imageupload.app/0efdab01b10f156789ab.jpeg',
    hashtags: ['AI', 'React', 'Tailwind', 'NextJS'],
    title: {
      tr: 'Yapay Zeka Destekli Akıllı Asistan Portfolyosu 🤖',
      en: 'AI-Powered Smart Assistant Portfolio 🤖',
      ar: 'بورتفوليو المساعد الذكي المدعوم بالذكاء الاصطناعي 🤖'
    },
    content: {
      tr: 'Yeni projem olan "AI-Powered Smart Assistant" uygulamasını yayına aldım! Bu proje, kullanıcıların sordukları sorulara anında akıllı yanıtlar veren ve kişisel planlama desteği sunan yenilikçi bir web uygulamasıdır. Tailwind CSS ile tamamen esnek tasarlanmış olup tüm ekranlarda kusursuz çalışmaktadır.',
      en: 'I have officially launched my new project "AI-Powered Smart Assistant"! This project is an innovative web application that provides instant, intelligent answers to user queries alongside personalized planning assistance. Styled responsively with Tailwind CSS.',
      ar: 'لقد قمت بإطلاق مشروعي الجديد "المساعد الذكي المدعوم بالذكاء الاصطناعي" رسمياً! هذا المشروع عبارة عن تطبيق ويب مبتكر يقدم إجابات ذكية وفورية لاستفسارات المستخدمين بالإضافة إلى مساعدة في التخطيط الشخصي.'
    },
    projectDetails: {
      name: 'AI Smart Assistant',
      tech: ['React', 'Tailwind CSS', 'Gemini API', 'TypeScript'],
      github: 'https://github.com',
      website: 'https://ais-dev-zyrzr6crdv5roqxtomwfes-30911021263.europe-west3.run.app',
      status: 'Completed'
    },
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'],
    comments: []
  },
  {
    id: 'post-4',
    type: 'job',
    category: 'Jobs',
    views: 890,
    likes: 95,
    reactions: { like: 55, celebrate: 25, support: 10, love: 3, insightful: 2, funny: 0 },
    date: '2026-07-02',
    time: '04:30 PM',
    authorName: 'Aymen Ibrahim Hmood',
    authorRole: 'Computer Engineering Student',
    authorAvatar: 'https://i.imageupload.app/0efdab01b10f156789ab.jpeg',
    hashtags: ['Hiring', 'Internship', 'Frontend', 'React'],
    title: {
      tr: 'Stajyer Ön-Yüz Geliştirici Aranıyor (Remote/Uzaktan)',
      en: 'Frontend Developer Intern Wanted (Remote)',
      ar: 'مطلوب متدرب تطوير واجهات أمامية (عن بعد)'
    },
    content: {
      tr: 'Ekibimize katılacak, React ve Tailwind CSS ile modern kullanıcı arayüzleri geliştirmeye hevesli stajyer çalışma arkadaşları arıyoruz! Projelerimizde aktif rol alacak ve harika bir mentorluk desteği bulacaksınız.',
      en: 'We are seeking energetic and passionate interns eager to learn and code state-of-the-art web interfaces using React and Tailwind CSS. Join our highly supportive development team!',
      ar: 'نحن نبحث عن متدربين نشيطين وشغوفين للتعلم وتطوير واجهات الويب الحديثة باستخدام React و Tailwind CSS. انضم إلى فريقنا البرمجي الداعم للغاية!'
    },
    jobDetails: {
      company: 'Aymen Tech Solutions',
      position: 'Frontend React Intern',
      location: 'Remote (Worldwide)',
      type: 'Internship',
      deadline: '2026-08-15',
      applyLink: 'https://aimnux.netlify.app',
      requirements: [
        'Basic knowledge of HTML, CSS, and modern JavaScript',
        'Familiarity with React.js or Tailwind CSS is a plus',
        'Eager to learn and collaborate with senior devs'
      ],
      salary: 'Paid Stipend'
    },
    comments: []
  },
  {
    id: 'post-5',
    type: 'quote',
    category: 'General',
    views: 650,
    likes: 180,
    reactions: { like: 110, celebrate: 10, support: 5, love: 45, insightful: 10, funny: 0 },
    date: '2026-07-01',
    time: '09:00 AM',
    authorName: 'Aymen Ibrahim Hmood',
    authorRole: 'Software Developer',
    authorAvatar: 'https://i.imageupload.app/0efdab01b10f156789ab.jpeg',
    hashtags: ['Inspiration', 'Coding', 'Success'],
    title: {
      tr: 'Günün İlham Verici Sözü 💡',
      en: 'Inspirational Quote of the Day 💡',
      ar: 'مقولة اليوم الملهمة 💡'
    },
    content: {
      tr: 'Harika bir iş çıkarmanın tek yolu, yaptığınız işi sevmektir.',
      en: 'The only way to do great work is to love what you do.',
      ar: 'الطريقة الوحيدة للقيام بعمل عظيم هي أن تحب ما تفعله.'
    },
    quoteDetails: {
      text: 'The only way to do great work is to love what you do.',
      author: 'Steve Jobs',
      bgStyle: 'bg-gradient-to-tr from-orange-600 via-amber-600 to-red-600'
    },
    comments: []
  },
  {
    id: 'post-6',
    type: 'event',
    category: 'Events',
    views: 1120,
    likes: 142,
    reactions: { like: 92, celebrate: 30, support: 12, love: 5, insightful: 3, funny: 0 },
    date: '2026-06-28',
    time: '01:00 PM',
    authorName: 'Aymen Ibrahim Hmood',
    authorRole: 'Iskenderun Technical University',
    authorAvatar: 'https://i.imageupload.app/0efdab01b10f156789ab.jpeg',
    hashtags: ['Hackathon', 'Coding', 'TechEvent', 'İSTE'],
    title: {
      tr: 'İSTE Bilgisayar Mühendisliği Hackathonu 2026 🏆',
      en: 'ISTE Computer Engineering Hackathon 2026 🏆',
      ar: 'هاكاثون هندسة الحاسوب في جامعة الإسكندرون التقنية 2026 🏆'
    },
    content: {
      tr: 'Üniversitemizde düzenlenecek olan 48 saatlik kesintisiz kodlama etkinliğine hazır mısınız? Kendi ekibinizi kurun, akıllı yapay zeka çözümleri geliştirin ve büyük ödüller için yarışın!',
      en: 'Are you ready for the ultimate 48-hour continuous coding event at our university? Form your team, build innovative smart AI applications, and win fantastic grand prizes!',
      ar: 'هل أنت مستعد لحدث البرمجة المتواصل الأكبر لمدة 48 ساعة في جامعتنا؟ شكل فريقك، ابنِ تطبيقات ذكية مبتكرة، واربح جوائز قيمة كبرى!'
    },
    eventDetails: {
      title: 'İSTE Hackathon 2026',
      date: '2026-07-20 09:00 AM',
      location: 'İSTE Merkez Kampüsü, Hatay',
      organizer: 'Bilgisayar Topluluğu & Aymen Ibrahim',
      regLink: 'https://aimnux.netlify.app'
    },
    comments: []
  },
  {
    id: 'post-7',
    type: 'pdf',
    category: 'Education',
    views: 520,
    likes: 45,
    reactions: { like: 30, celebrate: 5, support: 5, love: 2, insightful: 3, funny: 0 },
    date: '2026-06-25',
    time: '03:40 PM',
    authorName: 'Aymen Ibrahim Hmood',
    authorRole: 'Student Developer',
    authorAvatar: 'https://i.imageupload.app/0efdab01b10f156789ab.jpeg',
    hashtags: ['React', 'CheatSheet', 'PDF', 'Learning'],
    title: {
      tr: 'Ön-Yüz Geliştiriciler İçin Hızlı React Kılavuzu (PDF)',
      en: 'Quick React Cheat Sheet for Frontend Devs (PDF)',
      ar: 'دليل React السريع لمطوري الواجهات الأمامية (PDF)'
    },
    content: {
      tr: 'Yeni başlayanlar ve bilgilerini tazelemek isteyenler için hazırladığım React Hook\'ları ve bileşen yapısı kılavuzunu ücretsiz olarak indirebilirsiniz.',
      en: 'You can download the free React Hook cheatsheet and component layout guide that I prepared for beginners and those who want to refresh their memory.',
      ar: 'يمكنك تنزيل دليل React السريع وهياكل المكونات البرمجية مجاناً، والذي قمت بإعداده للمبتدئين ولأولئك الذين يرغبون في إنعاش معلوماتهم.'
    },
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfTitle: 'React_Hooks_Cheatsheet_2026.pdf',
    comments: []
  },
  {
    id: 'post-8',
    type: 'video',
    category: 'Technology',
    views: 1450,
    likes: 310,
    reactions: { like: 210, celebrate: 40, support: 10, love: 30, insightful: 20, funny: 0 },
    date: '2026-06-20',
    time: '12:30 PM',
    authorName: 'Aymen Ibrahim Hmood',
    authorRole: 'Tech Enthusiast',
    authorAvatar: 'https://i.imageupload.app/0efdab01b10f156789ab.jpeg',
    hashtags: ['TailwindCSS', 'WebDesign', 'PremiumUI'],
    title: {
      tr: 'Sıfırdan Premium Web Tasarımı ve Tailwind Sihri ✨',
      en: 'Premium Web Design from Scratch & Tailwind Magic ✨',
      ar: 'تصميم ويب متميز من الصفر مع سحر Tailwind ✨'
    },
    content: {
      tr: 'Tailwind CSS kullanarak sıfırdan son derece akıcı, modern ve göze hitap eden bir arayüz tasarımının nasıl oluşturulacağını gösteren video rehberimi inceleyin. Tasarımın sınırlarını zorluyoruz!',
      en: 'Check out my step-by-step design video demonstrating how to construct highly fluid, modern, and high-fidelity layouts using Tailwind CSS utility classes.',
      ar: 'شاهد دليل الفيديو التدريجي الخاص بي الذي يوضح كيفية بناء واجهات متجاوبة، حديثة ومتميزة تماماً باستخدام فئات Tailwind CSS.'
    },
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder responsive embed video
    comments: []
  }
];
