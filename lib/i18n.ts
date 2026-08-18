export const LOCALES = ['az', 'en', 'ru'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'az'
export const LOCALE_COOKIE = 'locale'

export const LOCALE_LABELS: Record<Locale, string> = {
  az: 'AZ',
  en: 'EN',
  ru: 'RU',
}

export const LOCALE_FULL_LABELS: Record<Locale, string> = {
  az: 'Azərbaycan',
  en: 'English',
  ru: 'Русский',
}

export function isValidLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (LOCALES as readonly string[]).includes(v)
}

// Picks the best translated value from an object with the shape:
//   { title: string, titleEn?: string, titleRu?: string }
// Base field (e.g. `title`) is the source language (Azerbaijani) and always populated;
// locale-suffixed fields are optional overrides.
export function pickLocalized<T extends Record<string, unknown>>(
  obj: T | null | undefined,
  baseKey: string,
  locale: Locale,
): string {
  if (!obj) return ''
  const base = obj[baseKey]
  if (locale === 'az') return typeof base === 'string' ? base : ''
  const suffix = locale === 'en' ? 'En' : 'Ru'
  const localized = obj[baseKey + suffix]
  if (typeof localized === 'string' && localized.trim() !== '') return localized
  return typeof base === 'string' ? base : ''
}

// UI string dictionary. Keep keys stable — components reference them by key.
type Dict = {
  viewMenu: string
  callUs: string
  directions: string
  aboutUs: string
  hours: string
  address: string
  contact: string
  menu: string
  backToHome: string
  unavailable: string
  unavailableToday: string
  close: string
  language: string
  serviceCharge: string
  setMenu: string
  includes: string
  login: string
  logout: string
  email: string
  password: string
  loginTitle: string
  loginSubtitle: string
  invalidCredentials: string
  tooManyAttempts: string
  categories: string
  items: string
  settings: string
  addCategory: string
  addItem: string
  editItem: string
  editCategory: string
  delete: string
  cancel: string
  save: string
  saving: string
  saved: string
  confirmDelete: string
  available: string
  reorderHint: string
  themeColors: string
  primaryColor: string
  accentColor: string
  translations: string
  nameInLanguage: (label: string) => string
  titleInLanguage: (label: string) => string
  subtitleInLanguage: (label: string) => string
  descriptionInLanguage: (label: string) => string
  price: string
  priceLabel: string
  priceLabelHint: string
  isSetMenu: string
  isSetMenuHint: string
  socials: string
  currency: string
  currencyHint: string
  updated: string
  error: string
  required: string
  heroBadge: string
}

export const dict: Record<Locale, Dict> = {
  az: {
    viewMenu: 'Menyuya bax',
    callUs: 'Bizə zəng et',
    directions: 'Yol göstər',
    aboutUs: 'Haqqımızda',
    hours: 'İş saatları',
    address: 'Ünvan',
    contact: 'Əlaqə',
    menu: 'Menyu',
    backToHome: 'Ana səhifə',
    unavailable: 'Yoxdur',
    unavailableToday: 'Bu gün yoxdur',
    close: 'Bağla',
    language: 'Dil',
    serviceCharge: 'Xidmət haqqı',
    setMenu: 'SET MENYU',
    includes: 'Daxildir',
    login: 'Daxil ol',
    logout: 'Çıxış',
    email: 'E-poçt',
    password: 'Şifrə',
    loginTitle: 'Admin panelinə giriş',
    loginSubtitle: 'E-poçt və şifrənizi daxil edin',
    invalidCredentials: 'E-poçt və ya şifrə səhvdir',
    tooManyAttempts: 'Çox cəhd edildi. Bir az sonra yenidən yoxlayın.',
    categories: 'Kateqoriyalar',
    items: 'Məhsullar',
    settings: 'Tənzimləmələr',
    addCategory: 'Kateqoriya əlavə et',
    addItem: 'Məhsul əlavə et',
    editItem: 'Məhsulu redaktə et',
    editCategory: 'Kateqoriyanı redaktə et',
    delete: 'Sil',
    cancel: 'Ləğv et',
    save: 'Yadda saxla',
    saving: 'Saxlanılır…',
    saved: 'Yadda saxlandı',
    confirmDelete: 'Silmək istədiyinizə əminsiniz?',
    available: 'Mövcuddur',
    reorderHint: 'Sıralamaq üçün sürüşdürün',
    themeColors: 'Rənglər',
    primaryColor: 'Əsas rəng',
    accentColor: 'Aksent rəng',
    translations: 'Tərcümələr',
    nameInLanguage: (l) => `Ad (${l})`,
    titleInLanguage: (l) => `Başlıq (${l})`,
    subtitleInLanguage: (l) => `Alt başlıq (${l})`,
    descriptionInLanguage: (l) => `Təsvir (${l})`,
    price: 'Qiymət',
    priceLabel: 'Qiymət etiketi',
    priceLabelHint: 'Boş buraxın — avtomatik yaranacaq. Çoxsaylı ölçülər üçün "3.50 / 4.00 ₼" kimi yazın.',
    isSetMenu: 'Set menyu',
    isSetMenuHint: 'Xüsusi kart dizaynında göstərilir',
    socials: 'Sosial şəbəkələr',
    currency: 'Valyuta simvolu',
    currencyHint: 'Məs. ₼ (manat), $, €',
    updated: 'Yeniləndi',
    error: 'Xəta baş verdi',
    required: 'Vacibdir',
    heroBadge: 'Nostalji atmosfer · Klassik dadlar',
  },
  en: {
    viewMenu: 'View menu',
    callUs: 'Call us',
    directions: 'Directions',
    aboutUs: 'About us',
    hours: 'Opening hours',
    address: 'Address',
    contact: 'Contact',
    menu: 'Menu',
    backToHome: 'Home',
    unavailable: 'Unavailable',
    unavailableToday: 'Unavailable today',
    close: 'Close',
    language: 'Language',
    serviceCharge: 'Service charge',
    setMenu: 'SET MENU',
    includes: 'Includes',
    login: 'Sign in',
    logout: 'Sign out',
    email: 'Email',
    password: 'Password',
    loginTitle: 'Sign in to admin',
    loginSubtitle: 'Enter your email and password',
    invalidCredentials: 'Invalid email or password',
    tooManyAttempts: 'Too many attempts. Please try again later.',
    categories: 'Categories',
    items: 'Items',
    settings: 'Settings',
    addCategory: 'Add category',
    addItem: 'Add item',
    editItem: 'Edit item',
    editCategory: 'Edit category',
    delete: 'Delete',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving…',
    saved: 'Saved',
    confirmDelete: 'Are you sure you want to delete this?',
    available: 'Available',
    reorderHint: 'Drag to reorder',
    themeColors: 'Theme colors',
    primaryColor: 'Primary color',
    accentColor: 'Accent color',
    translations: 'Translations',
    nameInLanguage: (l) => `Name (${l})`,
    titleInLanguage: (l) => `Title (${l})`,
    subtitleInLanguage: (l) => `Subtitle (${l})`,
    descriptionInLanguage: (l) => `Description (${l})`,
    price: 'Price',
    priceLabel: 'Price label',
    priceLabelHint: 'Leave empty to auto-format. For multiple sizes, write like "3.50 / 4.00 ₼".',
    isSetMenu: 'Set menu',
    isSetMenuHint: 'Shown in a special card design',
    socials: 'Social links',
    currency: 'Currency symbol',
    currencyHint: 'e.g. ₼ (manat), $, €',
    updated: 'Updated',
    error: 'Something went wrong',
    required: 'Required',
    heroBadge: 'Nostalgic atmosphere · Classic tastes',
  },
  ru: {
    viewMenu: 'Смотреть меню',
    callUs: 'Позвонить',
    directions: 'Как добраться',
    aboutUs: 'О нас',
    hours: 'Часы работы',
    address: 'Адрес',
    contact: 'Контакты',
    menu: 'Меню',
    backToHome: 'Главная',
    unavailable: 'Нет в наличии',
    unavailableToday: 'Сегодня недоступно',
    close: 'Закрыть',
    language: 'Язык',
    serviceCharge: 'Обслуживание',
    setMenu: 'СЕТ МЕНЮ',
    includes: 'В набор входит',
    login: 'Войти',
    logout: 'Выйти',
    email: 'E-mail',
    password: 'Пароль',
    loginTitle: 'Вход в админ-панель',
    loginSubtitle: 'Введите e-mail и пароль',
    invalidCredentials: 'Неверный e-mail или пароль',
    tooManyAttempts: 'Слишком много попыток. Попробуйте позже.',
    categories: 'Категории',
    items: 'Позиции',
    settings: 'Настройки',
    addCategory: 'Добавить категорию',
    addItem: 'Добавить позицию',
    editItem: 'Изменить позицию',
    editCategory: 'Изменить категорию',
    delete: 'Удалить',
    cancel: 'Отмена',
    save: 'Сохранить',
    saving: 'Сохраняется…',
    saved: 'Сохранено',
    confirmDelete: 'Вы уверены, что хотите удалить?',
    available: 'Доступно',
    reorderHint: 'Перетаскивайте для сортировки',
    themeColors: 'Цвета темы',
    primaryColor: 'Основной цвет',
    accentColor: 'Акцентный цвет',
    translations: 'Переводы',
    nameInLanguage: (l) => `Название (${l})`,
    titleInLanguage: (l) => `Название (${l})`,
    subtitleInLanguage: (l) => `Подзаголовок (${l})`,
    descriptionInLanguage: (l) => `Описание (${l})`,
    price: 'Цена',
    priceLabel: 'Метка цены',
    priceLabelHint: 'Оставьте пустым для авто-формата. Для нескольких размеров пишите как «3.50 / 4.00 ₼».',
    isSetMenu: 'Сет-меню',
    isSetMenuHint: 'Отображается в специальном оформлении',
    socials: 'Соцсети',
    currency: 'Символ валюты',
    currencyHint: 'напр. ₼ (манат), $, €',
    updated: 'Обновлено',
    error: 'Что-то пошло не так',
    required: 'Обязательно',
    heroBadge: 'Ностальгическая атмосфера · Классические вкусы',
  },
}

export function t(locale: Locale): Dict {
  return dict[locale]
}
