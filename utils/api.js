import { Platform } from 'react-native';

const LAN_IP = '192.168.1.206';

export const API_URL = Platform.OS === 'web'
  ? 'http://localhost:3000'
  : `http://${LAN_IP}:3000`;