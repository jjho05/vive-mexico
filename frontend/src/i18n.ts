import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to Ola México",
      "discover": "Discover",
      "swipe": "Swipe",
      "scanner": "Scanner",
      "profile": "Profile",
      "home": "Home",
      "menu_scanner_title": "AI Menu Scanner",
      "menu_scanner_subtitle": "Translate and convert prices in real-time.",
      "menu_translated": "Translated Menu",
      "take_photo": "Take menu photo",
      "upload_image": "Upload image",
      "upload_hint": "On PC use Upload. On mobile, the camera button opens the camera.",
      "no_items": "No items detected. Try another photo.",
      "preferences": "Preferences",
      "language_primary": "Primary language",
      "language_help": "Choose your app language",
      "currency_display": "Display currency",
      "currency_help": "Automatic conversion",
      "advanced_settings": "Advanced settings",
      "advanced_help": "Optional features",
      "portal_partner": "Partner portal"
      ,"language_label": "Language"
      ,"search_soon": "Search (coming soon)"
      ,"show_original": "Show original"
      ,"conversion": "Conversion"
      ,"detected_text": "Detected text"
      ,"rescan_camera": "Retake photo (camera)"
      ,"upload_image_short": "Upload image"
      ,"profile_title": "My Profile"
      ,"logout": "Log out"
      ,"translate_language": "Translate language"
      ,"translate_language_help": "For menu and content"
      ,"visit_country": "Visiting country"
      ,"visit_country_help": "Suggests currency"
      ,"merchant_portal": "Merchant Portal"
      ,"merchant_subtitle": "Prepare your business for the World Cup 2026."
      ,"merchant_register_title": "Register your business"
      ,"merchant_register_help": "Tell us about your place so tourists can find you."
      ,"merchant_business_name": "Business name"
      ,"merchant_category": "Category"
      ,"merchant_register_button": "Register business"
      ,"merchant_processing": "Processing..."
      ,"merchant_welcome": "Welcome partner!"
      ,"merchant_welcome_help": "Your business is now part of Ola México."
      ,"go_home": "Go to Home"
      ,"menu_digital": "Your digital menu"
      ,"menu_upload_help": "Upload a photo of your menu or price list."
      ,"menu_upload_button": "Upload menu photo"
      ,"menu_empty": "No items uploaded yet."
      ,"save_changes": "Save changes"
      ,"role_section": "Account type"
      ,"role_tourist": "Tourist"
      ,"role_merchant": "Merchant"
      ,"manage_locations": "Manage locations"
      ,"tourist_register_title": "Tourist registration"
      ,"tourist_register_help": "Save your current location"
      ,"save_location": "Save location"
      ,"delete_registration": "Delete registration"
      ,"view_map": "Open in Maps"
      ,"auth_title": "Sign in or create your account"
      ,"auth_login": "Log in"
      ,"auth_register": "Register"
      ,"auth_email": "Email"
      ,"auth_password": "Password"
      ,"auth_name": "Full name"
      ,"auth_phone": "Phone (optional)"
      ,"auth_processing": "Processing..."
      ,"auth_error": "Something went wrong. Try again."
    }
  },
  es: {
    translation: {
      "welcome": "Bienvenido a Ola México",
      "discover": "Descubrir",
      "swipe": "Deslizar",
      "scanner": "Escáner",
      "profile": "Perfil",
      "home": "Inicio",
      "menu_scanner_title": "Escáner de Menú AI",
      "menu_scanner_subtitle": "Traduce y convierte precios en tiempo real.",
      "menu_translated": "Menú Traducido",
      "take_photo": "Tomar foto del menú",
      "upload_image": "Subir imagen",
      "upload_hint": "En PC usa Subir. En móvil, el botón de cámara abre la cámara.",
      "no_items": "No se detectaron platillos. Intenta con otra foto.",
      "preferences": "Preferencias",
      "language_primary": "Idioma principal",
      "language_help": "Elige el idioma de la app",
      "currency_display": "Moneda a mostrar",
      "currency_help": "Conversión automática",
      "advanced_settings": "Ajustes avanzados",
      "advanced_help": "Funciones opcionales",
      "portal_partner": "Portal socio"
      ,"language_label": "Idioma"
      ,"search_soon": "Buscar (próximamente)"
      ,"show_original": "Mostrar original"
      ,"conversion": "Conversión"
      ,"detected_text": "Texto detectado"
      ,"rescan_camera": "Tomar otra foto (cámara)"
      ,"upload_image_short": "Subir imagen"
      ,"profile_title": "Mi Perfil"
      ,"logout": "Cerrar sesión"
      ,"translate_language": "Idioma a traducir"
      ,"translate_language_help": "Para el menú y contenido"
      ,"visit_country": "País de visita"
      ,"visit_country_help": "Define moneda sugerida"
      ,"merchant_portal": "Portal Comerciante"
      ,"merchant_subtitle": "Prepara tu negocio para el Mundial 2026."
      ,"merchant_register_title": "Registra tu Negocio"
      ,"merchant_register_help": "Cuéntanos sobre tu local para que los turistas puedan encontrarte."
      ,"merchant_business_name": "Nombre del negocio"
      ,"merchant_category": "Categoría"
      ,"merchant_register_button": "Registrar negocio"
      ,"merchant_processing": "Procesando..."
      ,"merchant_welcome": "¡Bienvenido Socio!"
      ,"merchant_welcome_help": "Tu negocio ya es parte de la Ola México."
      ,"go_home": "Ir al Inicio"
      ,"menu_digital": "Tu Menú Digital"
      ,"menu_upload_help": "Sube una foto de tu menú o lista de precios."
      ,"menu_upload_button": "Subir foto del menú"
      ,"menu_empty": "Aún no hay platillos cargados."
      ,"save_changes": "Guardar cambios"
      ,"role_section": "Tipo de cuenta"
      ,"role_tourist": "Turista"
      ,"role_merchant": "Comerciante"
      ,"manage_locations": "Administrar locales"
      ,"tourist_register_title": "Registro de turista"
      ,"tourist_register_help": "Guarda tu ubicación actual"
      ,"save_location": "Guardar ubicación"
      ,"delete_registration": "Eliminar registro"
      ,"view_map": "Ver en Maps"
      ,"auth_title": "Inicia sesión o crea tu cuenta"
      ,"auth_login": "Iniciar sesión"
      ,"auth_register": "Registrarse"
      ,"auth_email": "Correo"
      ,"auth_password": "Contraseña"
      ,"auth_name": "Nombre completo"
      ,"auth_phone": "Teléfono (opcional)"
      ,"auth_processing": "Procesando..."
      ,"auth_error": "Algo salió mal. Intenta de nuevo."
    }
  },
  ko: {
    translation: {
      "welcome": "올라 멕시코에 오신 것을 환영합니다",
      "discover": "발견하다",
      "swipe": "스와이프",
      "scanner": "스캐너",
      "profile": "프로필",
      "home": "홈",
      "menu_scanner_title": "AI 메뉴 스캐너",
      "menu_scanner_subtitle": "실시간으로 번역하고 가격을 변환합니다.",
      "menu_translated": "번역된 메뉴",
      "take_photo": "메뉴 사진 찍기",
      "upload_image": "이미지 업로드",
      "upload_hint": "PC에서는 업로드를 사용하세요. 모바일에서는 카메라 버튼이 카메라를 엽니다.",
      "no_items": "항목을 찾지 못했습니다. 다른 사진을 시도하세요.",
      "preferences": "환경설정",
      "language_primary": "기본 언어",
      "language_help": "앱 언어 선택",
      "currency_display": "표시 통화",
      "currency_help": "자동 환전",
      "advanced_settings": "고급 설정",
      "advanced_help": "선택 기능",
      "portal_partner": "파트너 포털"
      ,"language_label": "언어"
      ,"search_soon": "검색(준비 중)"
      ,"show_original": "원문 표시"
      ,"conversion": "변환"
      ,"detected_text": "감지된 텍스트"
      ,"rescan_camera": "다시 촬영(카메라)"
      ,"upload_image_short": "이미지 업로드"
      ,"profile_title": "내 프로필"
      ,"logout": "로그아웃"
      ,"translate_language": "번역 언어"
      ,"translate_language_help": "메뉴 및 콘텐츠용"
      ,"visit_country": "방문 국가"
      ,"visit_country_help": "권장 통화"
      ,"merchant_portal": "판매자 포털"
      ,"merchant_subtitle": "월드컵 2026을 위한 비즈니스 준비."
      ,"merchant_register_title": "비즈니스 등록"
      ,"merchant_register_help": "가게 정보를 알려주세요."
      ,"merchant_business_name": "상호명"
      ,"merchant_category": "카테고리"
      ,"merchant_register_button": "비즈니스 등록"
      ,"merchant_processing": "처리 중..."
      ,"merchant_welcome": "환영합니다!"
      ,"merchant_welcome_help": "가게가 Ola México에 등록되었습니다."
      ,"go_home": "홈으로"
      ,"menu_digital": "디지털 메뉴"
      ,"menu_upload_help": "메뉴 사진을 업로드하세요."
      ,"menu_upload_button": "메뉴 사진 업로드"
      ,"menu_empty": "등록된 항목이 없습니다."
      ,"save_changes": "변경 저장"
      ,"role_section": "계정 유형"
      ,"role_tourist": "관광객"
      ,"role_merchant": "판매자"
      ,"manage_locations": "지점 관리"
      ,"tourist_register_title": "관광객 등록"
      ,"tourist_register_help": "현재 위치 저장"
      ,"save_location": "위치 저장"
      ,"delete_registration": "등록 삭제"
    }
  },
  de: {
    translation: {
      "welcome": "Willkommen bei Ola México",
      "discover": "Entdecken",
      "swipe": "Wischen",
      "scanner": "Scanner",
      "profile": "Profil",
      "home": "Start",
      "menu_scanner_title": "KI-Menüscanner",
      "menu_scanner_subtitle": "Preise in Echtzeit übersetzen und umrechnen.",
      "menu_translated": "Übersetztes Menü",
      "take_photo": "Menüfoto aufnehmen",
      "upload_image": "Bild hochladen",
      "upload_hint": "Am PC bitte Hochladen nutzen. Auf dem Handy öffnet der Kameraknopf die Kamera.",
      "no_items": "Keine Einträge erkannt. Bitte anderes Foto versuchen.",
      "preferences": "Einstellungen",
      "language_primary": "Hauptsprache",
      "language_help": "App-Sprache wählen",
      "currency_display": "Anzeigewährung",
      "currency_help": "Automatische Umrechnung",
      "advanced_settings": "Erweiterte Einstellungen",
      "advanced_help": "Optionale Funktionen",
      "portal_partner": "Partner-Portal"
      ,"language_label": "Sprache"
      ,"search_soon": "Suche (demnächst)"
      ,"show_original": "Original anzeigen"
      ,"conversion": "Umrechnung"
      ,"detected_text": "Erkannter Text"
      ,"rescan_camera": "Nochmals fotografieren (Kamera)"
      ,"upload_image_short": "Bild hochladen"
      ,"profile_title": "Mein Profil"
      ,"logout": "Abmelden"
      ,"translate_language": "Übersetzungssprache"
      ,"translate_language_help": "Für Menü und Inhalte"
      ,"visit_country": "Besuchsland"
      ,"visit_country_help": "Empfohlene Währung"
      ,"merchant_portal": "Händlerportal"
      ,"merchant_subtitle": "Bereite dein Geschäft für die WM 2026 vor."
      ,"merchant_register_title": "Geschäft registrieren"
      ,"merchant_register_help": "Erzähle uns von deinem Laden."
      ,"merchant_business_name": "Geschäftsname"
      ,"merchant_category": "Kategorie"
      ,"merchant_register_button": "Geschäft registrieren"
      ,"merchant_processing": "Wird verarbeitet..."
      ,"merchant_welcome": "Willkommen!"
      ,"merchant_welcome_help": "Dein Geschäft ist jetzt bei Ola México."
      ,"go_home": "Zur Startseite"
      ,"menu_digital": "Dein digitales Menü"
      ,"menu_upload_help": "Lade ein Foto deines Menüs hoch."
      ,"menu_upload_button": "Menüfoto hochladen"
      ,"menu_empty": "Noch keine Einträge."
      ,"save_changes": "Änderungen speichern"
      ,"role_section": "Kontotyp"
      ,"role_tourist": "Tourist"
      ,"role_merchant": "Händler"
      ,"manage_locations": "Standorte verwalten"
      ,"tourist_register_title": "Touristenregistrierung"
      ,"tourist_register_help": "Aktuellen Standort speichern"
      ,"save_location": "Standort speichern"
      ,"delete_registration": "Registrierung löschen"
    }
  },
  fr: {
    translation: {
      "welcome": "Bienvenue à Ola México",
      "discover": "Découvrir",
      "swipe": "Balayer",
      "scanner": "Scanner",
      "profile": "Profil",
      "home": "Accueil",
      "menu_scanner_title": "Scanner de menu IA",
      "menu_scanner_subtitle": "Traduire et convertir les prix en temps réel.",
      "menu_translated": "Menu traduit",
      "take_photo": "Prendre une photo du menu",
      "upload_image": "Téléverser une image",
      "upload_hint": "Sur PC, utilisez Téléverser. Sur mobile, le bouton caméra ouvre la caméra.",
      "no_items": "Aucun plat détecté. Essayez une autre photo.",
      "preferences": "Préférences",
      "language_primary": "Langue principale",
      "language_help": "Choisissez la langue de l’app",
      "currency_display": "Devise d’affichage",
      "currency_help": "Conversion automatique",
      "advanced_settings": "Paramètres avancés",
      "advanced_help": "Fonctions optionnelles",
      "portal_partner": "Portail partenaire"
      ,"language_label": "Langue"
      ,"search_soon": "Recherche (bientôt)"
      ,"show_original": "Afficher l’original"
      ,"conversion": "Conversion"
      ,"detected_text": "Texte détecté"
      ,"rescan_camera": "Reprendre une photo (caméra)"
      ,"upload_image_short": "Téléverser une image"
      ,"profile_title": "Mon profil"
      ,"logout": "Se déconnecter"
      ,"translate_language": "Langue de traduction"
      ,"translate_language_help": "Pour le menu et le contenu"
      ,"visit_country": "Pays visité"
      ,"visit_country_help": "Suggère la devise"
      ,"merchant_portal": "Portail commerçant"
      ,"merchant_subtitle": "Prépare ton commerce pour la Coupe du monde 2026."
      ,"merchant_register_title": "Enregistrer le commerce"
      ,"merchant_register_help": "Parle-nous de ton établissement."
      ,"merchant_business_name": "Nom du commerce"
      ,"merchant_category": "Catégorie"
      ,"merchant_register_button": "Enregistrer"
      ,"merchant_processing": "Traitement..."
      ,"merchant_welcome": "Bienvenue !"
      ,"merchant_welcome_help": "Ton commerce fait partie d’Ola México."
      ,"go_home": "Aller à l’accueil"
      ,"menu_digital": "Ton menu numérique"
      ,"menu_upload_help": "Téléverse une photo du menu."
      ,"menu_upload_button": "Téléverser le menu"
      ,"menu_empty": "Aucun élément pour l’instant."
      ,"save_changes": "Enregistrer les changements"
      ,"role_section": "Type de compte"
      ,"role_tourist": "Touriste"
      ,"role_merchant": "Commerçant"
      ,"manage_locations": "Gérer les établissements"
      ,"tourist_register_title": "Inscription touriste"
      ,"tourist_register_help": "Enregistrer la position actuelle"
      ,"save_location": "Enregistrer la position"
      ,"delete_registration": "Supprimer l’inscription"
    }
  },
  ar: {
    translation: {
      "welcome": "مرحبًا بكم في أولا مكسيكو",
      "discover": "اكتشف",
      "swipe": "سحب",
      "scanner": "ماسح ضوئي",
      "profile": "الملف الشخصي",
      "home": "الرئيسية",
      "menu_scanner_title": "ماسح قائمة بالذكاء الاصطناعي",
      "menu_scanner_subtitle": "ترجمة الأسعار وتحويلها في الوقت الحقيقي.",
      "menu_translated": "القائمة المترجمة",
      "take_photo": "التقاط صورة للقائمة",
      "upload_image": "رفع صورة",
      "upload_hint": "على الكمبيوتر استخدم الرفع. على الهاتف زر الكاميرا يفتح الكاميرا.",
      "no_items": "لم يتم اكتشاف عناصر. جرّب صورة أخرى.",
      "preferences": "التفضيلات",
      "language_primary": "اللغة الأساسية",
      "language_help": "اختر لغة التطبيق",
      "currency_display": "عملة العرض",
      "currency_help": "تحويل تلقائي",
      "advanced_settings": "الإعدادات المتقدمة",
      "advanced_help": "ميزات اختيارية",
      "portal_partner": "بوابة الشركاء"
      ,"language_label": "اللغة"
      ,"search_soon": "بحث (قريبًا)"
      ,"show_original": "إظهار الأصل"
      ,"conversion": "تحويل"
      ,"detected_text": "النص المكتشف"
      ,"rescan_camera": "التقاط صورة أخرى (كاميرا)"
      ,"upload_image_short": "رفع صورة"
      ,"profile_title": "ملفي"
      ,"logout": "تسجيل الخروج"
      ,"translate_language": "لغة الترجمة"
      ,"translate_language_help": "للقائمة والمحتوى"
      ,"visit_country": "بلد الزيارة"
      ,"visit_country_help": "يقترح العملة"
      ,"merchant_portal": "بوابة التاجر"
      ,"merchant_subtitle": "حضّر عملك لكأس العالم 2026."
      ,"merchant_register_title": "تسجيل النشاط"
      ,"merchant_register_help": "أخبرنا عن مكانك."
      ,"merchant_business_name": "اسم النشاط"
      ,"merchant_category": "الفئة"
      ,"merchant_register_button": "تسجيل النشاط"
      ,"merchant_processing": "جارٍ المعالجة..."
      ,"merchant_welcome": "مرحبًا!"
      ,"merchant_welcome_help": "نشاطك أصبح جزءًا من Ola México."
      ,"go_home": "العودة للرئيسية"
      ,"menu_digital": "قائمتك الرقمية"
      ,"menu_upload_help": "ارفع صورة للقائمة."
      ,"menu_upload_button": "رفع صورة القائمة"
      ,"menu_empty": "لا توجد عناصر بعد."
      ,"save_changes": "حفظ التغييرات"
      ,"role_section": "نوع الحساب"
      ,"role_tourist": "سائح"
      ,"role_merchant": "تاجر"
      ,"manage_locations": "إدارة المواقع"
      ,"tourist_register_title": "تسجيل السائح"
      ,"tourist_register_help": "حفظ موقعك الحالي"
      ,"save_location": "حفظ الموقع"
      ,"delete_registration": "حذف التسجيل"
    }
  },
  pt: {
    translation: {
      "welcome": "Bem-vindo ao Ola México",
      "discover": "Descobrir",
      "swipe": "Deslizar",
      "scanner": "Scanner",
      "profile": "Perfil",
      "home": "Início",
      "menu_scanner_title": "Scanner de menu com IA",
      "menu_scanner_subtitle": "Traduza e converta preços em tempo real.",
      "menu_translated": "Menu traduzido",
      "take_photo": "Tirar foto do menu",
      "upload_image": "Enviar imagem",
      "upload_hint": "No PC use Enviar. No celular, o botão da câmera abre a câmera.",
      "no_items": "Nenhum item detectado. Tente outra foto.",
      "preferences": "Preferências",
      "language_primary": "Idioma principal",
      "language_help": "Escolha o idioma do app",
      "currency_display": "Moeda exibida",
      "currency_help": "Conversão automática",
      "advanced_settings": "Configurações avançadas",
      "advanced_help": "Recursos opcionais",
      "portal_partner": "Portal do parceiro"
      ,"language_label": "Idioma"
      ,"search_soon": "Buscar (em breve)"
      ,"show_original": "Mostrar original"
      ,"conversion": "Conversão"
      ,"detected_text": "Texto detectado"
      ,"rescan_camera": "Tirar outra foto (câmera)"
      ,"upload_image_short": "Enviar imagem"
      ,"profile_title": "Meu perfil"
      ,"logout": "Sair"
      ,"translate_language": "Idioma de tradução"
      ,"translate_language_help": "Para o menu e conteúdo"
      ,"visit_country": "País de visita"
      ,"visit_country_help": "Sugere a moeda"
      ,"merchant_portal": "Portal do comerciante"
      ,"merchant_subtitle": "Prepare seu negócio para a Copa 2026."
      ,"merchant_register_title": "Registrar negócio"
      ,"merchant_register_help": "Fale sobre seu local."
      ,"merchant_business_name": "Nome do negócio"
      ,"merchant_category": "Categoria"
      ,"merchant_register_button": "Registrar negócio"
      ,"merchant_processing": "Processando..."
      ,"merchant_welcome": "Bem-vindo!"
      ,"merchant_welcome_help": "Seu negócio faz parte do Ola México."
      ,"go_home": "Ir para início"
      ,"menu_digital": "Seu menu digital"
      ,"menu_upload_help": "Envie uma foto do menu."
      ,"menu_upload_button": "Enviar foto do menu"
      ,"menu_empty": "Sem itens ainda."
      ,"save_changes": "Salvar alterações"
      ,"role_section": "Tipo de conta"
      ,"role_tourist": "Turista"
      ,"role_merchant": "Comerciante"
      ,"manage_locations": "Gerenciar locais"
      ,"tourist_register_title": "Registro de turista"
      ,"tourist_register_help": "Salvar localização atual"
      ,"save_location": "Salvar localização"
      ,"delete_registration": "Excluir registro"
    }
  },
  no: {
    translation: {
      "welcome": "Velkommen til Ola México",
      "discover": "Oppdag",
      "swipe": "Sveip",
      "scanner": "Skanner",
      "profile": "Profil",
      "home": "Hjem",
      "menu_scanner_title": "AI-menyskanner",
      "menu_scanner_subtitle": "Oversett og konverter priser i sanntid.",
      "menu_translated": "Oversatt meny",
      "take_photo": "Ta bilde av menyen",
      "upload_image": "Last opp bilde",
      "upload_hint": "På PC bruk Last opp. På mobil åpner kameraknappen kameraet.",
      "no_items": "Ingen elementer funnet. Prøv et annet bilde.",
      "preferences": "Innstillinger",
      "language_primary": "Primærspråk",
      "language_help": "Velg app-språk",
      "currency_display": "Visningsvaluta",
      "currency_help": "Automatisk konvertering",
      "advanced_settings": "Avanserte innstillinger",
      "advanced_help": "Valgfrie funksjoner",
      "portal_partner": "Partnerportal"
      ,"language_label": "Språk"
      ,"search_soon": "Søk (kommer snart)"
      ,"show_original": "Vis original"
      ,"conversion": "Konvertering"
      ,"detected_text": "Oppdaget tekst"
      ,"rescan_camera": "Ta nytt bilde (kamera)"
      ,"upload_image_short": "Last opp bilde"
      ,"profile_title": "Min profil"
      ,"logout": "Logg ut"
      ,"translate_language": "Oversettelsesspråk"
      ,"translate_language_help": "For meny og innhold"
      ,"visit_country": "Besøksland"
      ,"visit_country_help": "Foreslår valuta"
      ,"merchant_portal": "Forhandlerportal"
      ,"merchant_subtitle": "Forbered bedriften til VM 2026."
      ,"merchant_register_title": "Registrer bedrift"
      ,"merchant_register_help": "Fortell om stedet ditt."
      ,"merchant_business_name": "Bedriftsnavn"
      ,"merchant_category": "Kategori"
      ,"merchant_register_button": "Registrer bedrift"
      ,"merchant_processing": "Behandler..."
      ,"merchant_welcome": "Velkommen!"
      ,"merchant_welcome_help": "Bedriften er nå en del av Ola México."
      ,"go_home": "Gå til hjem"
      ,"menu_digital": "Din digitale meny"
      ,"menu_upload_help": "Last opp bilde av menyen."
      ,"menu_upload_button": "Last opp menybilde"
      ,"menu_empty": "Ingen elementer ennå."
      ,"save_changes": "Lagre endringer"
      ,"role_section": "Kontotype"
      ,"role_tourist": "Turist"
      ,"role_merchant": "Forhandler"
      ,"manage_locations": "Administrer lokaler"
      ,"tourist_register_title": "Turistregistrering"
      ,"tourist_register_help": "Lagre nåværende posisjon"
      ,"save_location": "Lagre posisjon"
      ,"delete_registration": "Slett registrering"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'ola-mexico-lang',
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
