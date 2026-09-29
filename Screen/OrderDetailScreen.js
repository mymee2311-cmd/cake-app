import React, {useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    TochuableOpacity,
} from 'react-native';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {API_URL} from '../utils/api';
import {formatPrice, formatDateTime, getPaymentLabel} from '../utils/emoji';

/*=========== API ==============*/

const cancelOrderApi = async(orderId) => {
    const res= await fetch ('${API_URL}/api/orders/${orderId}/status', {
        method: 'PUT',
        headers: {'Content- Type' : 'application/json'},
        body: JSON.stringify({status: 'cancelled'}),
    });
    const json= await res.json();
    if(!res.ok || !json.success){
        throw new Error(json.error || 'Không thể hủy dơn');
    }
    return json;
};

/*============ HELPERS ============*/

const getStatusInfo= (status) => {
    switch (status) {
        case 'pedding_payment':
            return {
                label: 'Chờ shop xác nhận ',
                bg: '#FFE8F0',
                color: '#D6336C',
                icon: '💰',
            };
        case 'pedding': 
            return {
                label: 'Chờ xác nhận',
                bg: '#FFF8E8',
                color: '#B8871F',
                icon: '⏳',
            };
        case 'confirmed':
            return {
                label: 'Đã xác nhân',
                bg: '#E3F0FF',
                color: '#3B7BBF',
                icon: '✅',
            };
        case 'delivering':
            return {
                label: 'Đang giao',
                
            }
    }
}