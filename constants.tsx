
import { Project, BlogPost, Course, SiteProfile, AcademicsInfo, CertificateItem, SkillsData, ContactInfo } from './types';
import { Code, Layers } from 'lucide-react';

export const PROJECTS: Project[] = [
  {
    id: 1,
    category: 'backend',
    title: { 
      tr: "Görev Yönetim Uygulaması", 
      en: "Task Management App", 
      ar: "تطبيق إدارة المهام" 
    },
    description: { 
      tr: "Node.js ve MongoDB tabanlı; görev ekleme, silme, düzenleme işlevlerine sahip bir web uygulaması.", 
      en: "A web application based on Node.js and MongoDB with task adding, deleting, and editing features.", 
      ar: "تطبيق ويب يعتمد على Node.js و MongoDB مع ميزات إضافة المهام وحذفها وتحريرها." 
    },
    tags: ["Node.js", "MongoDB", "Express"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    category: 'web',
    title: { 
      tr: "Kişisel Portfolyo Web Sitesi", 
      en: "Personal Portfolio Website", 
      ar: "موقع البورتفوليو الشخصي" 
    },
    description: { 
      tr: "HTML, CSS, JavaScript ile geliştirilmiş; tasarımı Figma üzerinden planlanmış mobil uyumlu portfolyo sitesi.", 
      en: "A mobile-friendly portfolio site developed with HTML, CSS, and JavaScript, planned via Figma.", 
      ar: "موقع بورتفوليو متوافق مع الجوال تم تطويره باستخدام HTML و CSS و JavaScript ، وتم التخطيط له عبر Figma." 
    },
    tags: ["HTML", "CSS", "JavaScript", "Figma"],
    github: "https://github.com",
    demo: "https://aimnux.netlify.app/",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    category: 'backend',
    title: { 
      tr: "Blog API Sistemi", 
      en: "Blog API System", 
      ar: "نظام واجهة برمجة تطبيقات المدونة" 
    },
    description: { 
      tr: "Express.js ve MongoDB ile inşa edilmiş; JWT doğrulamalı güvenli bir blog içerik yönetim sistemi (API).", 
      en: "A secure blog content management system (API) built with Express.js and MongoDB, featuring JWT authentication.", 
      ar: "نظام إدارة محتوى مدونة آمن (API) تم بناؤه باستخدام Express.js و MongoDB ، ويتميز بمصادقة JWT." 
    },
    tags: ["Express.js", "MongoDB", "JWT"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    category: 'web',
    title: { 
      tr: "E-ticaret Platformu Arayüzü", 
      en: "E-commerce Platform UI", 
      ar: "واجهة منصة التجارة الإلكترونية" 
    },
    description: { 
      tr: "Ürün listeleme, sepet ve ödeme adımları içeren duyarlı e-ticaret sitesi kullanıcı arayüzü.", 
      en: "A responsive e-commerce site user interface including product listing, cart, and payment steps.", 
      ar: "واجهة مستخدم لموقع تجارة إلكترونية متجاوب تتضمن قائمة المنتجات وسلة التسوق وخطوات الدفع." 
    },
    tags: ["React", "Tailwind CSS", "UI/UX"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    category: 'web',
    title: { 
      tr: "Hava Durumu Paneli", 
      en: "Weather Dashboard", 
      ar: "لوحة حالة الطقس" 
    },
    description: { 
      tr: "Kullanıcının belirttiği konumlar için bir genel API'den hava durumu verilerini alır ve görüntüler.", 
      en: "Retrieves and displays weather data from a public API for user-specified locations.", 
      ar: "يسترجع ويعرض بيانات الطقس من واجهة برمجة تطبيقات عامة للمواقع التي يحددها المستخدم." 
    },
    tags: ["JavaScript", "API", "CSS"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    category: 'web',
    title: { 
      tr: "Yemek Tarifi Bulucu Uygulaması", 
      en: "Recipe Finder App", 
      ar: "تطبيق البحث عن وصفات الطعام" 
    },
    description: { 
      tr: "Kullanıcılar, malzemelere veya mutfak türüne göre yemek tarifleri arayabilir.", 
      en: "Users can search for recipes based on ingredients or cuisine type.", 
      ar: "يمكن للمستخدمين البحث عن وصفات بناءً على المكونات أو نوع المطبخ." 
    },
    tags: ["React", "API", "Tailwind"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 7,
    category: 'backend',
    title: { 
      tr: "URL Kısaltma Servisi", 
      en: "URL Shortener Service", 
      ar: "خدمة اختصار الروابط" 
    },
    description: { 
      tr: "Uzun URL'ler için kısa takma adlar oluşturan ve yönlendirme yapan backend servisi.", 
      en: "A backend service that creates short aliases for long URLs and handles redirection.", 
      ar: "خدمة خلفية تنشئ أسماء مستعارة قصيرة لروابط URL الطويلة وتتعامل مع إعادة التوجيه." 
    },
    tags: ["Node.js", "Redis", "Express"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 8,
    category: 'web',
    title: { 
      tr: "Gerçek Zamanlı Sohbet Uygulaması", 
      en: "Real-time Chat App", 
      ar: "تطبيق دردشة في الوقت الفعلي" 
    },
    description: { 
      tr: "Gerçek zamanlı iletişim için WebSockets kullanan basit bir sohbet uygulaması.", 
      en: "A simple chat application using WebSockets for real-time communication.", 
      ar: "تطبيق دردشة بسيط يستخدم WebSockets للتواصل في الوقت الفعلي." 
    },
    tags: ["Socket.io", "Node.js", "React"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 9,
    category: 'web',
    title: { 
      tr: "Quiz Uygulaması", 
      en: "Quiz App", 
      ar: "تطبيق الاختبارات" 
    },
    description: { 
      tr: "Çoktan seçmeli sorular ve skor takibi içeren interaktif bir quiz platformu.", 
      en: "An interactive quiz platform featuring multiple-choice questions and score tracking.", 
      ar: "منصة اختبار تفاعلية تتميز بأسئلة متعددة الخيارات وتتبع النتائج." 
    },
    tags: ["JavaScript", "HTML", "CSS"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 10,
    category: 'web',
    title: { 
      tr: "Film Veritabanı Tarayıcısı", 
      en: "Movie Database Browser", 
      ar: "متصفح قاعدة بيانات الأفلام" 
    },
    description: { 
      tr: "The Movie Database (TMDB) API'sini kullanarak filmlere göz atın, arayın ve ayrıntıları görüntüleyin.", 
      en: "Browse, search, and view details for movies using The Movie Database (TMDB) API.", 
      ar: "تصفح وابحث واعرض تفاصيل الأفلام باستخدام واجهة برمجة تطبيقات The Movie Database (TMDB)." 
    },
    tags: ["React", "TMDB API", "Axios"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 11,
    category: 'web',
    title: { 
      tr: "Fitness Takipçisi", 
      en: "Fitness Tracker", 
      ar: "متتبع اللياقة البدنية" 
    },
    description: { 
      tr: "Antrenmanları kaydedin, ilerlemeyi takip edin ve fitness hedefleri belirleyin.", 
      en: "Record workouts, track progress, and set fitness goals.", 
      ar: "سجل التمارين وتتبع التقدم وحدد أهداف اللياقة البدنية." 
    },
    tags: ["React Native", "Firebase", "Health"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 12,
    category: 'web',
    title: { 
      tr: "Not Alma Uygulaması (PWA)", 
      en: "Note Taking App (PWA)", 
      ar: "تطبيق تدوين الملاحظات (PWA)" 
    },
    description: { 
      tr: "Not almak ve düzenlemek için çevrimdışı özelliklere sahip ilerici bir web uygulaması.", 
      en: "A progressive web application with offline features for taking and organizing notes.", 
      ar: "تطبيق ويب تقدمي مع ميزات غير متصلة بالإنترنت لتدوين الملاحظات وتنظيمها." 
    },
    tags: ["PWA", "React", "IndexedDB"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 13,
    category: 'web',
    title: { 
      tr: "Filtreli Resim Galerisi", 
      en: "Filtered Image Gallery", 
      ar: "معرض صور مفلتر" 
    },
    description: { 
      tr: "Resimlerden oluşan bir galeri görüntüler ve kategoriye göre filtreleme seçenekleri sunar.", 
      en: "Displays a gallery of images and provides filtering options by category.", 
      ar: "يعرض معرضًا للصور ويوفر خيارات تصفية حسب الفئة." 
    },
    tags: ["JavaScript", "Masonry", "CSS"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1500628550463-c8881a54d4d4?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 14,
    category: 'web',
    title: { 
      tr: "Kişisel Finans Yöneticisi", 
      en: "Personal Finance Manager", 
      ar: "مدير التمويل الشخصي" 
    },
    description: { 
      tr: "Gelir ve giderleri takip edin, işlemleri kategorilere ayırın ve finansal özetleri görüntüleyin.", 
      en: "Track income and expenses, categorize transactions, and view financial summaries.", 
      ar: "تتبع الدخل والنفقات ، وصنف المعاملات ، واعرض الملخصات المالية." 
    },
    tags: ["React", "Chart.js", "Firebase"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 15,
    category: 'web',
    title: { 
      tr: "Kod Parçacığı Yöneticisi", 
      en: "Code Snippet Manager", 
      ar: "مدير قصاصات الكود" 
    },
    description: { 
      tr: "Sık kullanılan kod parçacıklarını kaydetmek, düzenlemek ve aramak için bir araç.", 
      en: "A tool for saving, editing, and searching frequently used code snippets.", 
      ar: "أداة لحفظ وتحرير والبحث عن قصاصات الكود المستخدمة بشكل متكرر." 
    },
    tags: ["React", "Prism.js", "Storage"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 16,
    category: 'web',
    title: { 
      tr: "Öğrenci Bilgi Sistemi (OBS)", 
      en: "Student Information System (SIS)", 
      ar: "نظام معلومات الطلاب (OBS)" 
    },
    description: { 
      tr: "Öğrencilerin ders kayıtları, notları ve akademik bilgilerini yönetebilecekleri kapsamlı bir web tabanlı sistem.", 
      en: "A comprehensive web-based system where students can manage course registrations, grades, and academic information.", 
      ar: "نظام شامل يعتمد على الويب حيث يمكن للطلاب إدارة تسجيلات الدورات والدرجات والمعلومات الأكاديمية." 
    },
    tags: ["PHP", "MySQL", "Bootstrap"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1523050335392-9ae824979603?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 17,
    category: 'web',
    title: { 
      tr: "Kargo Takip Sistemi (QR Kodlu)", 
      en: "Cargo Tracking System (QR Code)", 
      ar: "نظام تتبع الشحنات (برمز QR)" 
    },
    description: { 
      tr: "Kargoların QR kod ile takibini sağlayan, gönderi durumu güncellemeleri sunan modern bir lojistik çözümü.", 
      en: "A modern logistics solution that enables cargo tracking with QR codes and provides shipment status updates.", 
      ar: "حل لوجستي حديث يتيح تتبع الشحنات باستخدام رموز QR ويوفر تحديثات حالة الشحن." 
    },
    tags: ["React", "QR Scanner", "Node.js"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&q=80&w=800"
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: { tr: "React 19 ile Gelen Yenilikler", en: "What's New in React 19", ar: "ما الجديد في React 19" },
    excerpt: { tr: "React 19 sürümüyle gelen yeni özellikler ve performans iyileştirmeleri.", en: "New features and performance improvements coming with React 19.", ar: "الميزات الجديدة وتحسينات الأداء القادمة مع إصدار React 19." },
    date: "2024-05-15",
    category: "Web Development"
  },
  {
    id: 2,
    title: { tr: "TypeScript Kullanmanın Avantajları", en: "Benefits of Using TypeScript", ar: "فوائد استخدام TypeScript" },
    excerpt: { tr: "Büyük ölçekli projelerde TypeScript kullanmanın kod kalitesine etkisi.", en: "The impact of using TypeScript on code quality in large-scale projects.", ar: "تأثير استخدام TypeScript على جودة الكود في المشاريع واسعة النطاق." },
    date: "2024-04-20",
    category: "Programming"
  }
];

export const SKILLS: SkillsData = {
  web: ["HTML5", "CSS3", "JavaScript", "ECMAScript", "Bootstrap 4", "jQuery", "SASS", "React", "Next.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Figma"],
  programming: ["Java", "C", "C++", "C#", "Python", "SQL"]
};

export const INITIAL_SKILLS: SkillsData = SKILLS;

export const INITIAL_CERTIFICATES: CertificateItem[] = [
  {
    id: 1,
    title: { tr: "Web Geliştirme Bootcamp", en: "Web Development Bootcamp", ar: "بوتكامب تطوير الويب" },
    description: { tr: "Modern web geliştirme teknolojileri üzerine kapsamlı bir bootcamp programı.", en: "A comprehensive bootcamp program on modern web development technologies.", ar: "برنامج بوتكامب شامل حول تقنيات تطوير الويب الحديثة." },
    iconName: "Code"
  },
  {
    id: 2,
    title: { tr: "Node.js & Backend", en: "Node.js & Backend", ar: "Node.js والخلفية البرمجية" },
    description: { tr: "Node.js, Express ve MongoDB kullanarak backend geliştirme eğitimi.", en: "Backend development training using Node.js, Express, and MongoDB.", ar: "تدريب على تطوير الخلفية البرمجية باستخدام Node.js و Express و MongoDB." },
    iconName: "Layers"
  }
];

export const CERTIFICATES = INITIAL_CERTIFICATES;

export const INITIAL_PROFILE: SiteProfile = {
  name: "Aymen Ibrahim Hmood",
  avatar: "https://i.imageupload.app/0efdab01b10f156789ab.jpeg",
  title: "Bilgisayar Mühendisi",
  signature: "Aymen Ibrahim",
  cvUrl: "https://aimnux.netlify.app/aymen_ibrahim_hmood_cv.pdf",
  heroGreeting: {
    tr: "Merhaba, ben Aymen!",
    en: "Hi, I'm Aymen!",
    ar: "مرحباً، أنا أيمن!"
  },
  heroDescription: {
    tr: "Modern web teknolojileriyle kullanıcı dostu, hızlı ve mobil uyumlu arayüzler geliştiriyorum.",
    en: "Building user-friendly, fast, and mobile-responsive interfaces using modern web technologies.",
    ar: "أقوم ببناء واجهات مستخدم سهلة الاستخدام وسريعة ومتجاوبة مع الجوال باستخدام تقنيات الويب الحديثة."
  },
  bioGreeting: {
    tr: "Merhaba,",
    en: "Hi,",
    ar: "مرحباً،"
  },
  bioParagraphs: {
    tr: [
      "Aymen Ibrahim Hmood, İskenderun Teknik Üniversitesi Bilgisayar Mühendisliği mezuniyeti yolunda, yapay zekâ, yazılım geliştirme ve veri analitiği alanlarına ilgi duyan bir bilgisayar mühendisidir. Teknolojiye olan tutkusu ve sürekli öğrenme isteği sayesinde akademik ve profesyonel gelişimini kararlılıkla sürdürmektedir.",
      "Web teknolojileri, yapay zekâ uygulamaları, makine öğrenmesi ve veri analizi konularında projeler geliştirmekte; React, JavaScript ve Python gibi modern teknolojileri kullanarak yenilikçi çözümler üretmektedir. Özellikle akademik araştırmalar, yapay zekâ destekli sistemler ve kullanıcı odaklı yazılım geliştirme alanlarında çalışmalar yürütmektedir.",
      "Aymen, teknik bilgi ve becerilerini toplumsal faydaya dönüştürmeyi hedefleyen, ekip çalışmasına yatkın, analitik düşünebilen ve problem çözme yeteneği güçlü bir profesyoneldir. Aynı zamanda öğrenci ve teknoloji topluluklarında aktif rol alarak liderlik, organizasyon ve iletişim becerilerini sergilemektedir.",
      "Gelecekte yapay zekâ ve yazılım mühendisliği alanlarında uzmanlaşmayı, uluslararası projelerde yer almayı ve teknoloji aracılığıyla topluma değer katan çözümler üretmeyi amaçlamaktadır."
    ],
    en: [
      "Aymen Ibrahim Hmood is a passionate Computer Engineer focused on Artificial Intelligence, Software Development, and Data Analytics from Iskenderun Technical University. Driven by curiosity and continuous learning, he is committed to advancing both his academic and professional skills in technology.",
      "He actively develops projects related to web technologies, artificial intelligence, machine learning, and data analysis, utilizing modern technologies such as React, JavaScript, and Python. His interests particularly focus on academic research, AI-powered systems, and user-centered software solutions.",
      "Aymen is recognized for his analytical thinking, problem-solving abilities, teamwork skills, and dedication to creating technology-driven solutions that generate positive social impact. In addition to technical activities, he actively participates in tech organizations, enhancing his leadership and communication capabilities.",
      "His long-term goal is to specialize in Artificial Intelligence and Software Engineering, contribute to international projects, and develop innovative technologies that create meaningful value for society."
    ],
    ar: [
      "أيمن إبراهيم حمود هو مهندس حاسوب من جامعة الإسكندرون التقنية، يتمتع بشغف كبير في مجالات الذكاء الاصطناعي وتطوير البرمجيات وتحليل البيانات. يسعى باستمرار إلى تطوير مهاراته الأكاديمية والمهنية من خلال التعلم المستمر والمشاركة في المشاريع التقنية والبحثية.",
      "يعمل على تطوير مشاريع متخصصة في تقنيات الويب والذكاء الاصطناعي وتعلم الآلة وتحليل البيانات، مستخدمًا تقنيات حديثة مثل Python وJavaScript وReact. كما يركز اهتمامه على الأنظمة الذكية، والأبحاث الأكاديمية، وتطوير البرمجيات التي تضع المستخدم في مقدمة أولوياتها.",
      "يتميز أيمن بمهارات التفكير التحليلي وحل المشكلات والعمل الجماعي، إضافةً إلى رغبته في توظيف التكنولوجيا لخدمة المجتمع وتحقيق أثر إيجابي. كما يشارك بفعالية في الأنشطة الطلابية والتقنية التي تساعده على تنمية مهارات القيادة والتواصل والتنظيم.",
      "يطمح إلى التخصص في مجالي الذكاء الاصطناعي وهندسة البرمجيات، والمساهمة في مشاريع دولية متقدمة، وتطوير حلول تقنية مبتكرة تسهم في بناء مستقبل أفضل للمجتمع."
    ]
  }
};

export const INITIAL_ACADEMICS: AcademicsInfo = {
  degree: {
    tr: "BİLGİSAYAR MÜHENDİSİ",
    en: "COMPUTER ENGINEER",
    ar: "مهندس حاسوب"
  },
  uni: {
    tr: "İskenderun Teknik Üniversitesi",
    en: "Iskenderun Technical University",
    ar: "جامعة اسكندرون التقنية"
  },
  year: {
    tr: "2022 - Mezuniyet: Haziran 2026",
    en: "2022 - Graduation: June 2026",
    ar: "2022 - التخرج: يونيو 2026"
  }
};

export const INITIAL_CONTACT: ContactInfo = {
  email: "aymenibrahmood@gmail.com",
  location: {
    tr: "İskenderun, Hatay",
    en: "Iskenderun, Hatay",
    ar: "اسكندرون، هاتاي"
  },
  nationality: {
    tr: "Irak",
    en: "Iraq",
    ar: "العراق"
  },
  github: "https://github.com/aimniv/",
  linkedin: "https://www.linkedin.com/in/aymen-ibrahim-hmood-337977293/",
  instagram: "https://www.instagram.com/aimniv/",
  twitter: "https://x.com/aimn_ibraheem"
};

export const COURSES: Course[] = [
  {
    id: 'course-1',
    name: 'Sıfırdan İleri Seviye Web Geliştirme',
    description: 'HTML5, CSS3, modern JavaScript ve React ile baştan sona profesyonel web projeleri geliştirme rehberi.',
    price: 'Ücretsiz',
    duration: '24 Saat',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    status: 'active'
  },
  {
    id: 'course-2',
    name: 'Modern Full-Stack React & Node.js',
    description: 'REST API, MongoDB, JWT kimlik doğrulama ve responsive UI geliştirme temelleri.',
    price: 'Ücretsiz',
    duration: '32 Saat',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    status: 'active'
  },
  {
    id: 'course-3',
    name: 'Python ile Algoritmalar & Veri Yapıları',
    description: 'Yazılım mülakatlarına hazırlık, problem çözme becerileri ve temel algoritmaların analizi.',
    price: 'Ücretsiz',
    duration: '18 Saat',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    status: 'active'
  }
];
