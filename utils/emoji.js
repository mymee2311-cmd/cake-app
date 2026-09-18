
const CATEGORY_EMOJI_MAP = [
  { keyword: 'cookies',   emoji: '🍪' },
  { keyword: 'quy',       emoji: '🍪' },
  { keyword: 'chuối',     emoji: '🍞' },
  { keyword: 'chuoi',     emoji: '🍞' },
  { keyword: 'croissant', emoji: '🥐' },
  { keyword: 'kem',       emoji: '🍰' },
  { keyword: 'hạt',       emoji: '🌰' },
  { keyword: 'hat',       emoji: '🌰' },
];

const DEFAULT_PRODUCT_EMOJI = '🌰';

export function getProductEmoji(categoryName) {
  if (!categoryName) return DEFAULT_PRODUCT_EMOJI;

  const lower = categoryName.toLowerCase();

  for (const item of CATEGORY_EMOJI_MAP) {
    if (lower.includes(item.keyword)) {
      return item.emoji;
    }
  }

  return DEFAULT_PRODUCT_EMOJI;
}

export function getOrderStatusEmoji(status) {
  if (status === 'pending')    return '⏳';
  if (status === 'confirmed')  return '✅';
  if (status === 'delivering') return '🚚';
  if (status === 'completed')  return '🎉';
  if (status === 'cancelled')  return '❌';
  return '❓';
}

export function getOrderStatusLabel(status) {
  if (status === 'pending')    return 'Chờ xác nhận';
  if (status === 'confirmed')  return 'Đã xác nhận';
  if (status === 'delivering') return 'Đang giao';
  if (status === 'completed')  return 'Hoàn thành';
  if (status === 'cancelled')  return 'Đã hủy';
  return 'Không xác định';
}

export function getNotificationEmoji(type) {
  if (type === 'order')  return '📦';
  if (type === 'promo')  return '🎁';
  if (type === 'system') return '⚙️';
  return '🔔';
}

export function getNotificationTypeInfo(type) {
  if (type === 'order') {
    return { icon: '📦', bg: '#E8F0FE', color: '#4A6DB5', label: 'Đơn hàng' };
  }
  if (type === 'promo') {
    return { icon: '🎁', bg: '#FFF3E8', color: '#D18C2F', label: 'Khuyến mãi' };
  }
  if (type === 'system') {
    return { icon: '⚙️', bg: '#F0F0F5', color: '#7C7C8A', label: 'Hệ thống' };
  }
  return { icon: '🔔', bg: '#E8F7FA', color: '#5C929E', label: 'Khác' };
}

export function getPaymentLabel(method) {
  if (method === 'cash') return '💵 Tiền mặt';
  if (method === 'bank') return '🏦 Chuyển khoản';
  if (method === 'momo') return '📱 Momo';
  return method;
}

export const UI_EMOJI = {
  // ============ NAVIGATION ============
  back:           '‹',
  arrowRight:     '›',
  home:           '⌂',

  // ============ TAB / NAV ============
  favorite:       '♡',
  favoriteFull:   '❤️',
  heartEmpty:     '🤍',
  cart:           '🛒',
  order:          '📦',
  notification:   '🔔',

  // ============ ACTIONS ============
  search:         '🔍',
  plus:           '+',
  minus:          '−',
  trash:          '🗑️',
  check:          '✓',
  close:          '✕',
  edit:           '✏️',
  logout:         '↪',
  retry:          '⚠️',
  ownerLogin:     '🔐',
  eye:            '👁️',
  eyeOff:         '🙈',

  // ============ PROFILE ============
  user:           '👤',
  phone:          '📱',
  email:          '✉️',
  address:        '📍',
  store:          '🏪',
  avatar:         '👩‍🍳',
  password:       '🔒',
  welcome:        '👋',

  // ============ PAYMENT ============
  cash:           '💵',
  bank:           '🏦',
  momo:           '📱',
  gift:           '🎁',
  sparkles:       '✨',

  // ============ PRODUCT / CATEGORY ============
  cake:           '🧁',
  cookie:         '🍪',
  bread:          '🍞',
  croissant:      '🥐',
  creamCake:      '🍰',
  nut:            '🌰',
  donut:          '🍩',
  pizza:          '🍕',

  // ============ DASHBOARD / STATS ============
  money:          '💰',
  customers:      '👥',
  revenue:        '💰',
  category:       '🏷️',

  // ============ ORDER STATUS ============
  pending:        '⏳',
  confirmed:      '✅',
  delivering:     '🚚',
  completed:      '🎉',
  cancelled:      '❌',

  // ============ MISC ============
  bell:           '🔔',
  tag:            '🏷️',
  bag:            '🛍️',
  truck:          '🚚',
  box:            '📦',
  clipboard:      '📋',
};

export function formatPrice(price) {
  return Number(price).toLocaleString('vi-VN') + 'đ';
}

export function formatTimeAgo(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
}

export function formatDateTime(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function generateOrderCode() {
  return 'MB' + Math.floor(100000 + Math.random() * 900000);
}