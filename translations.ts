
import { TranslationSchema, Language } from './types';

export const translations: Record<Language, TranslationSchema> = {
  tr: {
    nav: { about: "Hakkımda", projects: "Projeler", academics: "Akademik", contact: "İletişim", blog: "Blog", game: "Oyun", courses: "Kurslar", posts: "Gönderiler" },
    hero: { greeting: "Merhaba, ben Aymen!", description: "Modern web teknolojileriyle kullanıcı dostu, hızlı ve mobil uyumlu arayüzler geliştiriyorum.", viewProjects: "Projelerimi Gör", contactMe: "İletişime Geç" },
    about: { 
      title: "Hakkımda", 
      subtitle: "Profesyonel Özet", 
      summary: "Front-End ve Back-End geliştirme alanlarında uzmanlaşmış bir yazılım geliştiricisiyim. HTML5, CSS3, React, Node.js ve MongoDB ile modern çözümler üretiyorum.", 
      technicalSkills: "Teknik Beceriler", 
      webTech: "Web Teknolojileri", 
      programmingLanguages: "Programlama Dilleri", 
      languages: "Yabancı Diller", 
      cvDownload: "CV'mi İndir", 
      lang_arabic: "Arapça", 
      lang_turkish: "Türkçe", 
      lang_english: "İngilizce",
      biographyGreeting: "Merhaba,",
      biographyParagraphs: [
        "Aymen Ibrahim Hmood, İskenderun Teknik Üniversitesi Bilgisayar Mühendisliği bölümünde öğrenim gören, yapay zekâ, yazılım geliştirme ve veri analitiği alanlarına ilgi duyan bir mühendis adayıdır. Teknolojiye olan tutkusu ve sürekli öğrenme isteği sayesinde akademik ve profesyonel gelişimini kararlılıkla sürdürmektedir.",
        "Web teknolojileri, yapay zekâ uygulamaları, makine öğrenmesi ve veri analizi konularında projeler geliştirmekte; React, JavaScript ve Python gibi modern teknolojileri kullanarak yenilikçi çözümler üretmektedir. Özellikle akademik araştırmalar, yapay zekâ destekli sistemler ve kullanıcı odaklı yazılım geliştirme alanlarında çalışmalar yürütmektedir.",
        "Aymen, teknik bilgi ve becerilerini toplumsal faydaya dönüştürmeyi hedefleyen, ekip çalışmasına yatkın, analitik düşünebilen ve problem çözme yeteneği güçlü bir öğrencidir. Aynı zamanda öğrenci topluluklarında aktif rol alarak liderlik, organizasyon ve iletişim becerilerini geliştirmektedir.",
        "Gelecekte yapay zekâ ve yazılım mühendisliği alanlarında uzmanlaşmayı, uluslararası projelerde yer almayı ve teknoloji aracılığıyla topluma değer katan çözümler üretmeyi amaçlamaktadır."
      ],
      biographyTitle: "Bilgisayar Mühendisi"
    },
    projects: { title: "Projelerim", viewAll: "Hepsini Gör", github: "GitHub", demo: "Canlı Demo", filterAll: "Hepsi", filterWeb: "Web", filterMobile: "Mobil", filterBackend: "Backend" },
    courses: { title: "Online Kurslarım", price: "Ücret", duration: "Süre", enroll: "Kayıt Ol" },
    blog: { title: "Blog & Yazılar", readMore: "Devamını Oku", latestPosts: "Son Yazılar" },
    academics: { title: "Akademik Çalışmalar", education: "Eğitim", degree: "BİLGİSAYAR MÜHENDİSİ", uni: "İskenderun Teknik Üniversitesi", year: "2022 - Mezuniyet: Haziran 2026", certificates: "Sertifikalar ve Başarılar", courses: "Önemli Dersler: Yazılım Mühendisliği, Veri Yapıları, Ağ Sistemleri, Veritabanları" },
    contact: { title: "İletişim", infoTitle: "İletişim Bilgileri", location: "İskenderun, Hatay", nationality: "Irak", formTitle: "Mesaj Gönderin", name: "İsim", email: "E-posta", message: "Mesaj", send: "Gönder", success: "Mesajınız başarıyla gönderildi!", emailLabel: "E-posta", locationLabel: "Adres", connectTitle: "Hadi Bağlantı Kuralım" },
    game: { 
      title: "Oyun Dünyası", 
      start: "Oyuna Başla", 
      score: "Skor", 
      timeLeft: "Süre", 
      gameOver: "Oyun Bitti!", 
      restart: "Tekrar Dene", 
      description: "Kodlardaki hataları (Bug) temizle! Ne kadar hızlıysan o kadar çok puan kazanırsın.", 
      highScore: "En Yüksek Skor", 
      backToPortfolio: "Portfolyoya Dön",
      selectGame: "Bir Oyun Seç",
      debugRush: "Hata Avcısı",
      energyFlow: "Enerji Akışı",
      energyDesc: "Tüm ampulleri yakmak için parçaları döndür ve devreyi tamamla.",
      win: "Harika! Devre Tamamlandı.",
      level: "Seviye"
    },
    posts: {
      title: "Sosyal Akış",
      search: "Gönderilerde ara...",
      all: "Tümü",
      comments: "Yorumlar",
      reactions: "Etkileşimler"
    },
    footer: { rights: "Tüm hakları saklıdır.", subtitle: "Fikirleri dijital deneyimlere dönüştürüyorum" }
  },
  en: {
    nav: { about: "About", projects: "Projects", academics: "Academics", contact: "Contact", blog: "Blog", game: "Game", courses: "Courses", posts: "Posts" },
    hero: { greeting: "Hi, I'm Aymen!", description: "Building user-friendly, fast, and mobile-responsive interfaces using modern web technologies.", viewProjects: "View Projects", contactMe: "Get In Touch" },
    about: { 
      title: "About Me", 
      subtitle: "Professional Summary", 
      summary: "I am a software developer specializing in Front-End and Back-End development. I build modern solutions with HTML5, CSS3, React, Node.js, and MongoDB.", 
      technicalSkills: "Technical Skills", 
      webTech: "Web Technologies", 
      programmingLanguages: "Programming Languages", 
      languages: "Languages", 
      cvDownload: "Download CV", 
      lang_arabic: "Arabic", 
      lang_turkish: "Turkish", 
      lang_english: "English",
      biographyGreeting: "Hi,",
      biographyParagraphs: [
        "Aymen Ibrahim Hmood is a Computer Engineering student at Iskenderun Technical University with a strong passion for Artificial Intelligence, Software Development, and Data Analytics. Driven by curiosity and continuous learning, he is committed to advancing both his academic and professional skills in the field of technology.",
        "He actively develops projects related to web technologies, artificial intelligence, machine learning, and data analysis, utilizing modern technologies such as React, JavaScript, and Python. His interests particularly focus on academic research, AI-powered systems, and user-centered software solutions.",
        "Aymen is recognized for his analytical thinking, problem-solving abilities, teamwork skills, and dedication to creating technology-driven solutions that generate positive social impact. In addition to his technical activities, he actively participates in student organizations, enhancing his leadership, communication, and organizational capabilities.",
        "His long-term goal is to specialize in Artificial Intelligence and Software Engineering, contribute to international projects, and develop innovative technologies that create meaningful value for society."
      ],
      biographyTitle: "Computer Engineer"
    },
    projects: { title: "My Projects", viewAll: "View All", github: "GitHub", demo: "Live Demo", filterAll: "All", filterWeb: "Web", filterMobile: "Mobile", filterBackend: "Backend" },
    courses: { title: "Online Courses", price: "Price", duration: "Duration", enroll: "Enroll Now" },
    blog: { title: "Blog & Articles", readMore: "Read More", latestPosts: "Latest Posts" },
    academics: { title: "Academics", education: "Education", degree: "COMPUTER ENGINEER", uni: "Iskenderun Technical University", year: "2022 - Graduation: June 2026", certificates: "Certificates & Achievements", courses: "Core Courses: Software Engineering, Data Structures, Network Systems, Databases" },
    contact: { title: "Contact", infoTitle: "Contact Info", location: "Iskenderun, Hatay", nationality: "Iraq", formTitle: "Send a Message", name: "Name", email: "Email", message: "Message", send: "Send", success: "Your message has been sent successfully!", emailLabel: "Email", locationLabel: "Located at", connectTitle: "Let's Connect" },
    game: { 
      title: "Game World", 
      start: "Start Game", 
      score: "Score", 
      timeLeft: "Time", 
      gameOver: "Game Over!", 
      restart: "Try Again", 
      description: "Clean up the bugs in the code! The faster you are, the more points you get.", 
      highScore: "High Score", 
      backToPortfolio: "Back to Portfolio",
      selectGame: "Select a Game",
      debugRush: "Debug Rush",
      energyFlow: "Energy Flow",
      energyDesc: "Rotate the pieces to complete the circuit and light up all bulbs.",
      win: "Excellent! Circuit Completed.",
      level: "Level"
    },
    posts: {
      title: "Social Feed",
      search: "Search posts...",
      all: "All",
      comments: "Comments",
      reactions: "Reactions"
    },
    footer: { rights: "All rights reserved.", subtitle: "Transforming ideas into digital experiences" }
  },
  ar: {
    nav: { about: "عني", projects: "المشاريع", academics: "الأكاديمية", contact: "اتصل بي", blog: "مدونة", game: "لعبة", courses: "كورسات", posts: "المنشورات" },
    hero: { greeting: "مرحباً، أنا أيمن!", description: "أقوم ببناء واجهات مستخدم سهلة الاستخدام وسريعة ومتجاوبة مع الجوال باستخدام تقنيات الويب الحديثة.", viewProjects: "عرض المشاريع", contactMe: "تواصل معي" },
    about: { 
      title: "عني", 
      subtitle: "ملخص مهني", 
      summary: "أنا مطور برمجيات متخصص في تطوير الواجهات الأمامية والخلفية. أقوم ببناء حلول حديثة باستخدام HTML5 و CSS3 و React و Node.js و MongoDB.", 
      technicalSkills: "المهارات التقنية", 
      webTech: "تقنيات الويب", 
      programmingLanguages: "لغات البرمجة", 
      languages: "اللغات", 
      cvDownload: "تحميل السيرة الذاتية", 
      lang_arabic: "العربية", 
      lang_turkish: "التركية", 
      lang_english: "الإنجليزية",
      biographyGreeting: "مرحباً،",
      biographyParagraphs: [
        "أيمن إبراهيم حمود هو طالب هندسة حاسوب في جامعة الإسكندرون التقنية، يتمتع بشغف كبير في مجالات الذكاء الاصطناعي وتطوير البرمجيات وتحليل البيانات. يسعى باستمرار إلى تطوير مهاراته الأكاديمية والمهنية من خلال التعلم المستمر والمشاركة في المشاريع التقنية والبحثية.",
        "يعمل على تطوير مشاريع متخصصة في تقنيات الويب والذكاء الاصطناعي وتعلم الآلة وتحليل البيانات، مستخدمًا تقنيات حديثة مثل Python وJavaScript وReact. كما يركز اهتمامه على الأنظمة الذكية، والأبحاث الأكاديمية، وتطوير البرمجيات التي تضع المستخدم في مقدمة أولوياتها.",
        "يتميز أيمن بمهارات التفكير التحليلي وحل المشكلات والعمل الجماعي، إضافةً إلى رغبته في توظيف التكنولوجيا لخدمة المجتمع وتحقيق أثر إيجابي. كما يشارك بفعالية في الأنشطة الطلابية التي تساعده على تنمية مهارات القيادة والتواصل والتنظيم.",
        "يطمح إلى التخصص في مجالي الذكاء الاصطناعي وهندسة البرمجيات، والمساهمة في مشاريع دولية متقدمة، وتطوير حلول تقنية مبتكرة تسهم في بناء مستقبل أفضل للمجتمع."
      ],
      biographyTitle: "مهندس حاسوب"
    },
    projects: { title: "مشاريعي", viewAll: "عرض الكل", github: "GitHub", demo: "عرض حي", filterAll: "الكل", filterWeb: "ويب", filterMobile: "موبايل", filterBackend: "خلفية" },
    courses: { title: "دورات تدريبية", price: "السعر", duration: "المدة", enroll: "سجل الآن" },
    blog: { title: "المدونة والمقالات", readMore: "اقرأ المزيد", latestPosts: "آخر المقالات" },
    academics: { title: "الدراسة الأكاديمية", education: "التعليم", degree: "مهندس حاسوب", uni: "جامعة اسكندرون التقنية", year: "2022 - التخرج: يونيو 2026", certificates: "الشهادات والإنجازات", courses: "المواد الأساسية: هندسة البرمجيات، هياكل البيانات، أنظمة الشبكات، قواعد البيانات" },
    contact: { title: "اتصل بي", infoTitle: "معلومات الاتصال", location: "اسكندرون، هاتاي", nationality: "العراق", formTitle: "أرسل رسالة", name: "الاسم", email: "البريد الإلكتروني", message: "الرسالة", send: "إرسال", success: "تم إرسال رسالتك بنجاح!", emailLabel: "البريد الإلكتروني", locationLabel: "الموقع", connectTitle: "لنبدأ التواصل" },
    game: { 
      title: "عالم الألعاب", 
      start: "ابدأ اللعبة", 
      score: "النتيجة", 
      timeLeft: "الوقت", 
      gameOver: "انتهت اللعبة!", 
      restart: "إعادة المحاولة", 
      description: "قم بتنظيف الأخطاء (Bug) في الكود! كلما كنت أسرع، حصلت على نقاط أكثر.", 
      highScore: "أعلى نتيجة", 
      backToPortfolio: "العودة إلى المعرض",
      selectGame: "اختر لعبة",
      debugRush: "صياد الأخطاء",
      energyFlow: "تدفق الطاقة",
      energyDesc: "قم بتدوير القطع لإكمال الدائرة وإضاءة جميع المصابيح.",
      win: "رائع! اكتملت الدائرة.",
      level: "المستوى"
    },
    posts: {
      title: "المنشورات الاجتماعية",
      search: "البحث في المنشورات...",
      all: "الكل",
      comments: "التعليقات",
      reactions: "التفاعلات"
    },
    footer: { rights: "جميع الحقوق محفوظة.", subtitle: "تحويل الأفكار إلى تجارب رقمية" }
  }
};
