const BASE_URL = 'https://provinces.open-api.vn/api';

/* Mã tỉnh Hà Nội */
const HANOI_CODE = 1;

/* ==================== QUẬN/HUYỆN HÀ NỘI ==================== */
export const getDistricts = async () => {
  try {
    const url = `${BASE_URL}/p/${HANOI_CODE}?depth=2`;

    console.log('Calling Vietnam API:', url);

    const response = await fetch(url);

    if (!response.ok) {
      console.error('Lỗi HTTP:', response.status);
      return [];
    }

    const data = await response.json();

    console.log('Số quận/huyện Hà Nội:', (data.districts || []).length);

    return (data.districts || []).map((d) => ({
      code: d.code,
      name: d.name,
    }));
  } catch (err) {
    console.error('Lỗi lấy quận Hà Nội:', err);
    return [];
  }
};

/* ==================== PHƯỜNG/XÃ THEO QUẬN ==================== */
export const getWards = async (districtCode) => {
  try {
    const url = `${BASE_URL}/d/${districtCode}?depth=2`;

    console.log('Calling Vietnam API:', url);

    const response = await fetch(url);

    if (!response.ok) {
      console.error('Lỗi HTTP:', response.status);
      return [];
    }

    const data = await response.json();

    console.log('Số phường/xã:', (data.wards || []).length);

    return (data.wards || []).map((w) => ({
      code: w.code,
      name: w.name,
    }));
  } catch (err) {
    console.error('Lỗi lấy xã:', err);
    return [];
  }
};