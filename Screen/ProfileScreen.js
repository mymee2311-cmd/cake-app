import React  from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Scrollview,
} from 'react-native';

export default function ProfileScreen({
    onBack,
    onEdit,
    onLogout,
}) {
    return (
        <View style={styles.container}>
            <ScrollView 
               showsVerticalScrollIndicator ={false}
               contentContainerStyle={styles.ScrollViewContent} 
               >
                {/*===================== HEADER ================= */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        style = {styles.Button}
                        onPress = {onBack}
                        activeOpacity ={0.7} 
                    >
                        <Text style={styles.backIcon}>Back</Text>
                    </TouchableOpacity>
                    <Text style ={styles.headerTitle}>
                        Hồ sơ
                    </Text>
                    <View style = {styles.headerRight}/>
                 </View>

                 {/*===================== avatar ================= */}
                    <View style={styles.profileTop}>  

                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                👩‍🍳
                            </Text>
                        </View>

                        <Text style={styles.name}>
                            Owner
                        </Text>

                        <Text style={style.role}>
                            Chủ cửa hàng
                        </Text>

                {/*=====================Information ================= */}
                <Text style={styles.sectionTitle}>
                    Thông tin cá nhân
                </Text>

                <View style={styles.inforCard}>
                    {/*NAME*/}
                    <View style={styles.inforRow}>
                        <View style={styles.inforIcon}>
                              👤
                        </View>

                    <View style={styles.infoContent}>
                        <Text style={styles.inforLabel}>
                            Họ và tên
                        </Text>

                        <Text style={styles.inforValue}>
                            Owner
                        </Text> 
                    </View>
                    
                </View>


                <View style={styles.infoRow}>
                    <View style={styless.infoContent}>
                        <Text style={styles.infoLabel}>
                            Số điện thoại
                        </Text>

                        <Text style={styles.infoValue}>
                            xxxxxxxxxx
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/*EMAIL*/}
                <View style={styles.infoRow}>
                    <View style={styles.infoIcon}>
                        <Text>
                            ✉️
                        </Text>
                    </View>

                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>
                            Email
                        </Text>

                        <Text style={styles.infoValue}>
                            owner@meebakery.com
                        </Text>
                    </View>
                </View>
             </View>

                {/* ===================== Store Information ================= */}
                <Text style ={styles.sectionTitle}>
                    Thông tin cửa hàng
                </Text>

                <View style={styles.infoCard}>
                    {/*Store Name*/}
                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <Text>
                                🏪
                            </Text>
                        </View>

                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>
                                Tên cửa hàng
                            </Text>

                            <Text style={styles.infoValue}>
                                Mee Bakery
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styless.infoIcon}>
                            <Text>
                                📍
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>
                            Địa chỉ
                        </Text>   

                        <Text style={styles.infoValue}>
                            Văn Quán, Hà Nội
                        </Text>                    
                    </View>
                </View>
            </View>

            {/* ===================== EDIT BUTTON =================*/}
            <TouchableOpacity
                style={styles.editButton}
                onPres={onEdit}
                activeOpacity={0.8}
            >
                <Text style={styles.editIcon}>
                    ✏️
                </Text>

                <Text style={styles.editText}>
                    Chỉnh sửa thông tin
                </Text>
            </TouchableOpacity>

            {/*===================== LOGOUT ===================*/}
               </ScrollView>
        </View>
        ); 
}