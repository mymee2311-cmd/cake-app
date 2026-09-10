import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";

export default function ProfileScreen({
    onBack,
    onEdit,
    onLogout,
    userInfo,
}) {
    return (
        <View style={styles.container}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >

                {/* ===================== HEADER ===================== */}
                <View style={styles.header}>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={onBack}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.backIcon}>‹</Text>
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Hồ sơ
                    </Text>

                    <View style={styles.headerRight} />

                </View>


                {/* ===================== AVATAR ===================== */}
                <View style={styles.profileTop}>

                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            👩‍🍳
                        </Text>
                    </View>

                    <Text style={styles.name}>
                        My
                    </Text>

                    <Text style={styles.role}>
                        Chủ cửa hàng
                    </Text>

                </View>


                {/* ===================== PERSONAL INFORMATION ===================== */}
                <Text style={styles.sectionTitle}>
                    Thông tin cá nhân
                </Text>

                <View style={styles.infoCard}>

                    {/* NAME */}
                    <View style={styles.infoRow}>

                        <View style={styles.infoIcon}>
                            <Text>👤</Text>
                        </View>

                        <View style={styles.infoContent}>

                            <Text style={styles.infoLabel}>
                                Họ và tên
                            </Text>

                            <Text style={styles.infoValue}>
                                 {userInfo.name}
                            </Text>

                        </View>

                    </View>


                    <View style={styles.divider} />


                    {/* PHONE */}
                    <View style={styles.infoRow}>

                        <View style={styles.infoIcon}>
                            <Text>📱</Text>
                        </View>

                        <View style={styles.infoContent}>

                            <Text style={styles.infoLabel}>
                                Số điện thoại
                            </Text>

                            <Text style={styles.infoValue}>
                                {userInfo.phone}
                            </Text>

                        </View>

                    </View>


                    <View style={styles.divider} />


                    {/* EMAIL */}
                    <View style={styles.infoRow}>

                        <View style={styles.infoIcon}>
                            <Text>✉️</Text>
                        </View>

                        <View style={styles.infoContent}>

                            <Text style={styles.infoLabel}>
                                Email
                            </Text>

                            <Text style={styles.infoValue}>
                                {userInfo.mail}
                            </Text>

                        </View>

                    </View>

                </View>


                {/* ===================== STORE INFORMATION ===================== */}
                <Text style={styles.sectionTitle}>
                    Thông tin cửa hàng
                </Text>

                <View style={styles.infoCard}>

                    {/* STORE NAME */}
                    <View style={styles.infoRow}>

                        <View style={styles.infoIcon}>
                            <Text>🏪</Text>
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


                    <View style={styles.divider} />


                    {/* ADDRESS */}
                    <View style={styles.infoRow}>

                        <View style={styles.infoIcon}>
                            <Text>📍</Text>
                        </View>

                        <View style={styles.infoContent}>

                            <Text style={styles.infoLabel}>
                                Địa chỉ
                            </Text>

                            <Text style={styles.infoValue}>
                                {userInfo.address}
                            </Text>

                        </View>

                    </View>

                </View>


                {/* ===================== EDIT BUTTON ===================== */}
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={onEdit}
                    activeOpacity={0.8}
                >

                    <Text style={styles.editIcon}>
                        ✏️
                    </Text>

                    <Text style={styles.editText}>
                        Chỉnh sửa thông tin
                    </Text>

                </TouchableOpacity>


                {/* ===================== LOGOUT ===================== */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={onLogout}
                    activeOpacity={0.8}
                >

                    <Text style={styles.logoutIcon}>
                        ↪
                    </Text>

                    <Text style={styles.logoutText}>
                        Đăng xuất
                    </Text>

                </TouchableOpacity>

            </ScrollView>

        </View>
    );
}


const styles = StyleSheet.create({

    /* ===================== CONTAINER ===================== */

    container: {
        flex: 1,
        backgroundColor: "#CDEFF7",
    },

    content: {
        paddingHorizontal: 20,
        paddingBottom: 35,
    },


    /* ===================== HEADER ===================== */

    header: {
        height: 65,
        paddingTop: 44,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    backButton: {
        width: 45,
        height: 42,
        borderRadius: 13,
        backgroundColor: "#FFFFFF",

        justifyContent: "center",
        alignItems: "center",

        borderWidth: 1,
        borderColor: "#D7EEF2",
    },

    backIcon: {
        fontSize: 32,
        color: "#438A9C",
        marginTop: -3,
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#356F7C",
    },

    headerRight: {
        width: 42,
    },


    /* ===================== PROFILE ===================== */

    profileTop: {
        alignItems: "center",
        marginTop: 12,
        marginBottom: 28,
    },

    avatar: {
        width: 105,
        height: 105,
        borderRadius: 53,

        backgroundColor: "#FFFFFF",

        justifyContent: "center",
        alignItems: "center",

        borderWidth: 1,
        borderColor: "#75AEB9",

        shadowColor: "#438A9C",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 7,

        elevation: 3,
    },

    avatarText: {
        fontSize: 52,
    },

    name: {
        marginTop: 14,
        fontSize: 22,
        fontWeight: "800",
        color: "#438A9C",
    },

    role: {
        marginTop: 5,
        fontSize: 14,
        color: "#7B9EA5",
    },


    /* ===================== SECTION ===================== */

    sectionTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#356F7C",
        marginBottom: 12,
    },


    /* ===================== INFO CARD ===================== */

    infoCard: {
        backgroundColor: "#FFFFFF",

        borderRadius: 18,

        paddingHorizontal: 15,
        marginBottom: 22,

        borderWidth: 1,
        borderColor: "#D7EEF2",

        shadowColor: "#75AEB9",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,

        elevation: 2,
    },

    infoRow: {
        minHeight: 70,

        flexDirection: "row",
        alignItems: "center",
    },

    infoIcon: {
        width: 43,
        height: 43,
        borderRadius: 13,

        backgroundColor: "#E8F7FA",

        justifyContent: "center",
        alignItems: "center",

        marginRight: 13,
    },

    infoContent: {
        flex: 1,
    },

    infoLabel: {
        fontSize: 11,
        color: "#89A5AA",
        marginBottom: 4,
    },

    infoValue: {
        fontSize: 14,
        fontWeight: "700",
        color: "#416F78",
    },

    divider: {
        height: 1,
        backgroundColor: "#E7F2F4",
    },


    /* ===================== EDIT ===================== */

    editButton: {
        height: 52,
        borderRadius: 15,

        backgroundColor: "#75B9C8",

        justifyContent: "center",
        alignItems: "center",

        flexDirection: "row",

        shadowColor: "#5A9EAD",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.16,
        shadowRadius: 6,

        elevation: 3,

        marginBottom: 12,
    },

    editIcon: {
        fontSize: 19,
        color: "#FFFFFF",
        marginRight: 8,
    },

    editText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#FFFFFF",
    },


    /* ===================== LOGOUT ===================== */

    logoutButton: {
        height: 52,
        borderRadius: 15,

        backgroundColor: "#FFFFFF",

        borderWidth: 1,
        borderColor: "#D7EEF2",

        justifyContent: "center",
        alignItems: "center",

        flexDirection: "row",
    },

    logoutIcon: {
        fontSize: 20,
        color: "#438A9C",
        marginRight: 8,
    },

    logoutText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#438A9C",
    },

});