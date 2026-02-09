
import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Palette, 
  Wifi, 
  Volume2, 
  Info, 
  ChevronRight, 
  Check,
  Search,
  Sun,
  Laptop,
  Network,
  Moon,
  Clock,
  Globe
} from 'lucide-react';

type Category = 'system' | 'personalization' | 'network' | 'sound' | 'time' | 'about';

interface SettingsProps {
  userName: string;
  wallpaper: string;
  setWallpaper: (url: string) => void;
  brightness: number;
  setBrightness: (val: number) => void;
  volume: number;
  setVolume: (val: number) => void;
  wifiEnabled: boolean;
  setWifiEnabled: (enabled: boolean) => void;
  connectedWifi: string;
  setConnectedWifi: (val: string) => void;
  accentColor: string;
  setAccentColor: (val: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  initialCategory?: Category;
  language: string;
  setLanguage: (lang: string) => void;
}

const WALLPAPERS = [
  'https://images.unsplash.com/photo-1635350736475-c8cef4b21906?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
];

const THEME_COLORS = [
  '#0078d4', // Windows Blue
  '#4a148c', // Purple
  '#1b5e20', // Green
  '#b71c1c', // Red
  '#e65100', // Orange
  '#008272', // Teal
  '#004e8c', // Dark Blue
  '#c30052', // Magenta
];

const WIFI_NETWORKS = [
  { name: "Neighbour's wifi", strength: 'Medium' },
  { name: 'Cool wifi', strength: 'Strong' },
];

const LANGUAGES = [
  { code: 'en-US', name: 'English (United States)', region: 'United States' },
  { code: 'en-GB', name: 'English (United Kingdom)', region: 'United Kingdom' },
  { code: 'zh-CN', name: '中文 (简体)', region: 'China' },
  { code: 'zh-TW', name: '中文 (繁體)', region: 'Taiwan' },
  { code: 'es-ES', name: 'Español (España)', region: 'España' },
  { code: 'es-MX', name: 'Español (México)', region: 'México' },
  { code: 'fr-FR', name: 'Français (France)', region: 'France' },
  { code: 'de-DE', name: 'Deutsch (Deutschland)', region: 'Deutschland' },
  { code: 'ru-RU', name: 'Русский (Россия)', region: 'Россия' },
  { code: 'ja-JP', name: '日本語 (Japan)', region: 'Japan' },
  { code: 'pt-BR', name: 'Português (Brasil)', region: 'Brasil' },
  { code: 'pt-PT', name: 'Português (Portugal)', region: 'Portugal' },
  { code: 'it-IT', name: 'Italiano (Italia)', region: 'Italia' },
  { code: 'ko-KR', name: '한국어 (Korea)', region: 'Korea' },
  { code: 'ar-SA', name: 'العربية (Saudi Arabia)', region: 'Saudi Arabia' },
  { code: 'hi-IN', name: 'हिन्दी (India)', region: 'India' },
  { code: 'nl-NL', name: 'Nederlands (Nederland)', region: 'Nederland' },
  { code: 'tr-TR', name: 'Türkçe (Türkiye)', region: 'Türkiye' },
  { code: 'pl-PL', name: 'Polski (Polska)', region: 'Polska' },
  { code: 'sv-SE', name: 'Svenska (Sverige)', region: 'Sverige' },
  { code: 'id-ID', name: 'Bahasa Indonesia (Indonesia)', region: 'Indonesia' },
  { code: 'vi-VN', name: 'Tiếng Việt (Vietnam)', region: 'Vietnam' },
  { code: 'th-TH', name: 'ไทย (Thailand)', region: 'Thailand' },
  { code: 'uk-UA', name: 'Українська (Ukraine)', region: 'Ukraine' },
  { code: 'el-GR', name: 'Ελληνικά (Greece)', region: 'Greece' },
  { code: 'he-IL', name: 'עברית (Israel)', region: 'Israel' },
  { code: 'fi-FI', name: 'Suomi (Suomi)', region: 'Suomi' },
  { code: 'no-NO', name: 'Norsk bokmål (Norge)', region: 'Norge' },
  { code: 'da-DK', name: 'Dansk (Danmark)', region: 'Danmark' },
  { code: 'cs-CZ', name: 'Čeština (Česká republika)', region: 'Česká republika' },
  { code: 'hu-HU', name: 'Magyar (Magyarország)', region: 'Magyarország' },
  { code: 'ro-RO', name: 'Română (România)', region: 'România' },
];

const translations: Record<string, any> = {
    'en-US': { system: 'System', pers: 'Personalization', net: 'Network & internet', sound: 'Sound', time: 'Time & language', about: 'About', display: 'Display', mode: 'Choose your mode', find: 'Find a setting' },
    'en-GB': { system: 'System', pers: 'Personalisation', net: 'Network & internet', sound: 'Sound', time: 'Time & language', about: 'About', display: 'Display', mode: 'Choose your mode', find: 'Find a setting' },
    'zh-CN': { system: '系统', pers: '个性化', net: '网络和互联网', sound: '声音', time: '时间和语言', about: '关于', display: '显示', mode: '选择模式', find: '查找设置' },
    'zh-TW': { system: '系統', pers: '個人化', net: '網路和網際網路', sound: '聲音', time: '時間與語言', about: '關於', display: '顯示器', mode: '選擇模式', find: '尋找設定' },
    'es-ES': { system: 'Sistema', pers: 'Personalización', net: 'Red e Internet', sound: 'Sonido', time: 'Hora e idioma', about: 'Información', display: 'Pantalla', mode: 'Elige tu modo', find: 'Buscar una configuración' },
    'es-MX': { system: 'Sistema', pers: 'Personalización', net: 'Red e Internet', sound: 'Sonido', time: 'Hora e idioma', about: 'Acerca de', display: 'Pantalla', mode: 'Elige tu modo', find: 'Buscar una configuración' },
    'fr-FR': { system: 'Système', pers: 'Personnalisation', net: 'Réseau et Internet', sound: 'Son', time: 'Heure et langue', about: 'Informations', display: 'Écran', mode: 'Choisissez votre mode', find: 'Trouver un paramètre' },
    'de-DE': { system: 'System', pers: 'Personalisierung', net: 'Netzwerk und Internet', sound: 'Sound', time: 'Zeit und Sprache', about: 'Info', display: 'Anzeige', mode: 'Wählen Sie Ihren Modus', find: 'Einstellung suchen' },
    'ru-RU': { system: 'Система', pers: 'Персонализация', net: 'Сеть и Интернет', sound: 'Звук', time: 'Время и язык', about: 'О системе', display: 'Дисплей', mode: 'Выберите режим', find: 'Найти настройку' },
    'ja-JP': { system: 'システム', pers: '個人用設定', net: 'ネットワークとインターネット', sound: 'サウンド', time: '時刻と言語', about: 'バージョン情報', display: 'ディスプレイ', mode: 'モードを選択', find: '設定の検索' },
    'pt-BR': { system: 'Sistema', pers: 'Personalização', net: 'Rede e Internet', sound: 'Som', time: 'Hora e idioma', about: 'Sobre', display: 'Vídeo', mode: 'Escolha seu modo', find: 'Localizar uma configuração' },
    'pt-PT': { system: 'Sistema', pers: 'Personalização', net: 'Rede e Internet', sound: 'Som', time: 'Hora e idioma', about: 'Sobre', display: 'Ecrã', mode: 'Escolha o seu modo', find: 'Localizar uma definição' },
    'it-IT': { system: 'Sistema', pers: 'Personalizzazione', net: 'Rete e Internet', sound: 'Suono', time: 'Data e ora', about: 'Informazioni', display: 'Schermo', mode: 'Scegli la modalità', find: 'Trova un\'impostazione' },
    'ko-KR': { system: '시스템', pers: '개인 설정', net: '네트워크 및 인터넷', sound: '소리', time: '시간 및 언어', about: '정보', display: '디스플레이', mode: '모드 선택', find: '설정 찾기' },
    'ar-SA': { system: 'النظام', pers: 'إضفاء طابع شخصي', net: 'الشبكة والإنترنت', sound: 'الصوت', time: 'الوقت واللغة', about: 'حول', display: 'شاشة العرض', mode: 'اختر وضعك', find: 'البحث عن إعداد' },
    'hi-IN': { system: 'सिस्टम', pers: 'वैयक्तिकरण', net: 'नेटवर्क और इंटरनेट', sound: 'ध्वनि', time: 'समय और भाषा', about: 'के बारे में', display: 'प्रदर्शन', mode: 'अपना मोड चुनें', find: 'एक सेटिंग खोजें' },
    'nl-NL': { system: 'Systeem', pers: 'Persoonlijke instellingen', net: 'Netwerk en internet', sound: 'Geluid', time: 'Tijd en taal', about: 'Info', display: 'Beeldscherm', mode: 'Kies uw modus', find: 'Instelling zoeken' },
    'tr-TR': { system: 'Sistem', pers: 'Kişiselleştirme', net: 'Ağ ve internet', sound: 'Ses', time: 'Zaman ve dil', about: 'Hakkında', display: 'Ekran', mode: 'Modunuzu seçin', find: 'Bir ayar bulun' },
    'pl-PL': { system: 'System', pers: 'Personalizacja', net: 'Sieć i internet', sound: 'Dźwięk', time: 'Czas i język', about: 'Informacje', display: 'Ekran', mode: 'Wybierz tryb', find: 'Znajdź ustawienie' },
    'sv-SE': { system: 'System', pers: 'Anpassning', net: 'Nätverk och internet', sound: 'Ljud', time: 'Tid och språk', about: 'Om', display: 'Bildskärm', mode: 'Välj läge', find: 'Hitta en inställning' },
    'id-ID': { system: 'Sistem', pers: 'Personalisasi', net: 'Jaringan & internet', sound: 'Suara', time: 'Waktu & bahasa', about: 'Tentang', display: 'Layar', mode: 'Pilih mode Anda', find: 'Cari pengaturan' },
    'vi-VN': { system: 'Hệ thống', pers: 'Cá nhân hóa', net: 'Mạng & internet', sound: 'Âm thanh', time: 'Giờ & ngôn ngữ', about: 'Giới thiệu', display: 'Màn hình', mode: 'Chọn chế độ', find: 'Tìm cài đặt' },
    'th-TH': { system: 'ระบบ', pers: 'การตั้งค่าส่วนบุคคล', net: 'เครือข่ายและอินเทอร์เน็ต', sound: 'เสียง', time: 'เวลาและภาษา', about: 'เกี่ยวกับ', display: 'หน้าจอ', mode: 'เลือกโหมดของคุณ', find: 'ค้นหาการตั้งค่า' },
    'uk-UA': { system: 'Система', pers: 'Персоналізація', net: 'Мережа та Інтернет', sound: 'Звук', time: 'Час і мова', about: 'Про систему', display: 'Дисплей', mode: 'Виберіть режим', find: 'Знайти налаштування' },
    'el-GR': { system: 'Σύστημα', pers: 'Εξατομίκευση', net: 'Δίκτυο & διαδίκτυο', sound: 'Ήχος', time: 'Ώρα & γλώσσα', about: 'Πληροφορίες', display: 'Οθόνη', mode: 'Επιλέξτε λειτουργία', find: 'Βρείτε μια ρύθμιση' },
    'he-IL': { system: 'מערכת', pers: 'התאמה אישית', net: 'רשת ואינטרנט', sound: 'שמע', time: 'זמן ושפה', about: 'אודות', display: 'צג', mode: 'בחר מצב', find: 'חפש הגדרה' },
    'fi-FI': { system: 'Järjestelmä', pers: 'Mukauttaminen', net: 'Verkko ja internet', sound: 'Ääni', time: 'Aika ja kieli', about: 'Tietoja', display: 'Näyttö', mode: 'Valitse tila', find: 'Etsi asetus' },
    'no-NO': { system: 'System', pers: 'Personalisering', net: 'Nettverk og internett', sound: 'Lyd', time: 'Tid og språk', about: 'Om', display: 'Skjerm', mode: 'Velg modus', find: 'Finn en innstilling' },
    'da-DK': { system: 'System', pers: 'Personlig tilpasning', net: 'Netværk og internet', sound: 'Lyd', time: 'Tid og sprog', about: 'Om', display: 'Skærm', mode: 'Vælg tilstand', find: 'Find en indstilling' },
    'cs-CZ': { system: 'Systém', pers: 'Přizpůsobení', net: 'Síť a internet', sound: 'Zvuk', time: 'Čas a jazyk', about: 'O systému', display: 'Displej', mode: 'Zvolte režim', find: 'Najít nastavení' },
    'hu-HU': { system: 'Rendszer', pers: 'Személyre szabás', net: 'Hálózat és internet', sound: 'Hang', time: 'Idő és nyelv', about: 'Névjegy', display: 'Kijelző', mode: 'Mód kiválasztása', find: 'Beállítás keresése' },
    'ro-RO': { system: 'Sistem', pers: 'Personalizare', net: 'Rețea și internet', sound: 'Sunet', time: 'Timp și limbă', about: 'Despre', display: 'Afișaj', mode: 'Alegeți modul', find: 'Găsiți o setare' },
};

const Settings: React.FC<SettingsProps> = ({ 
  userName, 
  wallpaper, 
  setWallpaper, 
  brightness, 
  setBrightness, 
  volume, 
  setVolume,
  wifiEnabled,
  setWifiEnabled,
  connectedWifi,
  setConnectedWifi,
  accentColor,
  setAccentColor,
  isDarkMode,
  setIsDarkMode,
  initialCategory,
  language,
  setLanguage
}) => {
  const [activeCategory, setActiveCategory] = useState<Category>('system');
  const [searchQuery, setSearchQuery] = useState('');

  const t = translations[language] || translations['en-US'];

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const sidebarItems = [
    { id: 'system', label: t.system, icon: <Monitor size={18} /> },
    { id: 'personalization', label: t.pers, icon: <Palette size={18} /> },
    { id: 'network', label: t.net, icon: <Network size={18} /> },
    { id: 'sound', label: t.sound, icon: <Volume2 size={18} /> },
    { id: 'time', label: t.time, icon: <Clock size={18} /> },
    { id: 'about', label: t.about, icon: <Info size={18} /> },
  ];

  const containerClasses = isDarkMode ? 'bg-[#1c1c1c] text-white' : 'bg-slate-50 text-slate-800';
  const sidebarClasses = isDarkMode ? 'bg-[#252525] border-white/5' : 'bg-slate-100/50 border-slate-200';
  const cardClasses = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/50 border-slate-200';

  const renderContent = () => {
    switch (activeCategory) {
      case 'system':
        return (
          <div className="space-y-8 animate-start">
            <h2 className="text-2xl font-bold">{t.system}</h2>
            
            <section className={`${cardClasses} rounded-xl border p-6 space-y-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    <Sun size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t.display}</h3>
                    <p className="text-xs opacity-60">Brightness, night light, display profile</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Brightness</span>
                  <span className="text-xs font-bold opacity-60">{brightness}%</span>
                </div>
                <input 
                  type="range" 
                  min="10" max="100" 
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200/20 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor }}
                />
              </div>
            </section>
          </div>
        );

      case 'personalization':
        return (
          <div className="space-y-8 animate-start">
            <h2 className="text-2xl font-bold">{t.pers}</h2>
            
            {/* Mode Toggle */}
            <section className={`${cardClasses} rounded-xl border p-6 space-y-4`}>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t.mode}</h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsDarkMode(false)}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${!isDarkMode ? 'bg-white text-slate-900 border-white shadow-lg' : 'bg-white/5 border-transparent text-white hover:bg-white/10'}`}
                  style={{ borderColor: !isDarkMode ? accentColor : undefined }}
                >
                  <Sun size={20} />
                  <span className="font-semibold text-sm">Light</span>
                  {!isDarkMode && <Check size={16} className="ml-auto" style={{ color: accentColor }} />}
                </button>
                <button 
                  onClick={() => setIsDarkMode(true)}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${isDarkMode ? 'bg-white/10 border-white shadow-lg' : 'bg-white/40 border-transparent text-slate-700 hover:bg-white/60'}`}
                  style={{ borderColor: isDarkMode ? accentColor : undefined }}
                >
                  <Moon size={20} />
                  <span className="font-semibold text-sm">Dark</span>
                  {isDarkMode && <Check size={16} className="ml-auto" style={{ color: accentColor }} />}
                </button>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Select Background</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {WALLPAPERS.map((url, i) => (
                  <button 
                    key={i}
                    onClick={() => setWallpaper(url)}
                    className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      wallpaper === url ? 'ring-4 ring-offset-2' : 'border-transparent'
                    }`}
                    style={{ ringColor: wallpaper === url ? accentColor : 'transparent', borderColor: wallpaper === url ? accentColor : 'transparent' }}
                  >
                    <img src={url} alt={`Wallpaper ${i}`} className="w-full h-full object-cover" />
                    {wallpaper === url && (
                      <div className="absolute top-2 right-2 text-white p-1 rounded-full shadow-lg" style={{ backgroundColor: accentColor }}>
                        <Check size={12} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            <section className={`${cardClasses} rounded-xl border p-6 space-y-4`}>
               <h3 className="font-semibold">Theme Colors</h3>
               <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                 {THEME_COLORS.map(color => (
                   <button 
                    key={color} 
                    onClick={() => setAccentColor(color)}
                    className="w-full aspect-square rounded-full border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center group"
                    style={{ backgroundColor: color }}
                   >
                     {accentColor === color && (
                       <div className="bg-white/30 rounded-full p-1 border border-white/50">
                         <Check size={14} className="text-white" />
                       </div>
                     )}
                   </button>
                 ))}
               </div>
            </section>
          </div>
        );

      case 'network':
        return (
          <div className="space-y-8 animate-start">
            <h2 className="text-2xl font-bold">{t.net}</h2>

            <section className={`${cardClasses} rounded-xl border p-6 flex items-center justify-between`}>
               <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg transition-colors ${wifiEnabled ? 'text-white' : 'bg-slate-100 text-slate-500'}`} style={{ backgroundColor: wifiEnabled ? accentColor : undefined }}>
                  <Wifi size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">Wi-Fi</h3>
                  <p className="text-xs opacity-60">{wifiEnabled ? `Connected to ${connectedWifi}` : 'Disconnected'}</p>
                </div>
              </div>
              <button 
                onClick={() => setWifiEnabled(!wifiEnabled)}
                className="w-12 h-6 rounded-full relative transition-colors bg-slate-400"
                style={{ backgroundColor: wifiEnabled ? accentColor : undefined }}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${wifiEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </section>

            {wifiEnabled && (
              <section className="space-y-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">Available Networks</h3>
                <div className={`${cardClasses} rounded-xl border overflow-hidden`}>
                  {WIFI_NETWORKS.map((net, i) => (
                    <div 
                      key={i} 
                      onClick={() => setConnectedWifi(net.name)}
                      className={`flex items-center justify-between p-4 hover:bg-white/10 cursor-pointer transition-colors border-b border-slate-100/10 last:border-0`}
                    >
                      <div className="flex items-center gap-3">
                        <Wifi size={16} className={connectedWifi === net.name ? '' : 'text-slate-600'} style={{ color: connectedWifi === net.name ? accentColor : undefined }} />
                        <span className={`text-sm font-medium ${connectedWifi === net.name ? '' : 'opacity-80'}`} style={{ color: connectedWifi === net.name ? accentColor : undefined }}>{net.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {connectedWifi === net.name && <span className="text-[10px] font-bold uppercase" style={{ color: accentColor }}>Connected</span>}
                        <ChevronRight size={14} className="opacity-40" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        );

      case 'time':
        return (
          <div className="space-y-8 animate-start">
            <h2 className="text-2xl font-bold">{t.time}</h2>

            <section className={`${cardClasses} rounded-xl border p-6 space-y-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                    <Globe size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Language & region</h3>
                    <p className="text-xs opacity-60">Windows display language, preferred languages, regional format</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100/10">
                 <div>
                    <label className="text-sm font-medium block mb-2">Windows display language</label>
                    <div className={`${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-white border-slate-200'} border rounded-lg overflow-hidden h-64 overflow-y-auto custom-scrollbar`}>
                       {LANGUAGES.map(lang => (
                          <button
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)}
                            className={`w-full flex items-center justify-between p-3 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${language === lang.code ? 'bg-black/5 dark:bg-white/5' : ''}`}
                          >
                             <div>
                                <div className="text-sm font-medium">{lang.name}</div>
                                <div className="text-xs opacity-60">{lang.region}</div>
                             </div>
                             {language === lang.code && <Check size={16} style={{ color: accentColor }} />}
                          </button>
                       ))}
                    </div>
                    <p className="text-[10px] opacity-50 mt-2">
                       Some apps may need to be restarted to see language changes.
                    </p>
                 </div>
              </div>
            </section>
            
            <section className={`${cardClasses} rounded-xl border p-6 flex items-center justify-between`}>
               <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">Date & time</h3>
                  <p className="text-xs opacity-60">
                     Current time: {new Date().toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </section>
          </div>
        );

      default:
        return <div className="p-10 text-center opacity-50">Content for {activeCategory} is coming soon.</div>;
    }
  };

  return (
    <div className={`flex h-full select-text overflow-hidden ${containerClasses}`}>
      {/* Sidebar */}
      <div className={`w-64 border-r p-4 flex flex-col gap-6 ${sidebarClasses}`}>
        <div className="flex items-center gap-3 px-3 py-2">
           <div className="w-10 h-10 rounded-full bg-slate-300 overflow-hidden border-2 border-white/20 shadow-sm">
             <img src={`https://picsum.photos/seed/${userName}/40/40`} alt="User" />
           </div>
           <div className="flex flex-col overflow-hidden">
             <span className="text-xs font-bold truncate">{userName}</span>
             <span className="text-[10px] opacity-60 font-medium">Local Account</span>
           </div>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder={t.find}
            className={`w-full border rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/30 outline-none transition-shadow ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {sidebarItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveCategory(item.id as Category)}
              className={`flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeCategory === item.id 
                  ? 'text-white shadow-lg' 
                  : 'text-slate-600 hover:bg-white/10 hover:shadow-sm'
              }`}
              style={{ backgroundColor: activeCategory === item.id ? accentColor : undefined, boxShadow: activeCategory === item.id ? `0 10px 15px -3px ${accentColor}40` : undefined }}
            >
              <span className={activeCategory === item.id ? 'text-white' : 'text-slate-400'}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-10 max-w-4xl mx-auto w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default Settings;
