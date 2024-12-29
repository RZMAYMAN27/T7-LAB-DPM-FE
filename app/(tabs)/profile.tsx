import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ActivityIndicator, Button, Dialog, PaperProvider, Portal, Text } from 'react-native-paper';
import API_URL from '@/config/config';

type UserProfile = {
    username: string;
    email: string;
};

const ProfileScreen = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get<{ data: UserProfile }>(`${API_URL}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(response.data.data);
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setDialogVisible(true);
    };

    const confirmLogout = async () => {
        await AsyncStorage.removeItem('token');
        router.replace('/auth/LoginScreen');
    };

    if (loading) {
        return (
            <PaperProvider>
                <ThemedView style={styles.loadingContainer}>
                    <ActivityIndicator animating={true} color="#00FF00" />
                </ThemedView>
            </PaperProvider>
        );
    }

    return (
        <PaperProvider>
            <ImageBackground
                source={require('@/assets/images/favicon.png')} // Replace with a dark-themed image
                style={styles.container}
                resizeMode="cover"
            >
                <ThemedView style={styles.contentContainer}>
                    {profile ? (
                        <View style={styles.profileContainer}>
                            <View style={styles.header}>
                                <ThemedText style={styles.username}>{profile.username}</ThemedText>
                                <ThemedText style={styles.email}>{profile.email}</ThemedText>
                            </View>
                            <View style={styles.infoCard}>
                                <ThemedText style={styles.label}>Username</ThemedText>
                                <ThemedText style={styles.value}>{profile.username}</ThemedText>
                            </View>
                            <View style={styles.infoCard}>
                                <ThemedText style={styles.label}>Email</ThemedText>
                                <ThemedText style={styles.value}>{profile.email}</ThemedText>
                            </View>
                            <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
                                Log Out
                            </Button>
                        </View>
                    ) : (
                        <ThemedText style={styles.noDataText}>No profile data available</ThemedText>
                    )}
                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                            <Dialog.Title>Logout</Dialog.Title>
                            <Dialog.Content>
                                <Text>Are you sure you want to logout?</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
                                <Button onPress={confirmLogout}>OK</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </ThemedView>
            </ImageBackground>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000', // Black background
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    contentContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Transparent black overlay
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        shadowColor: '#00FF00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5, // For Android shadow
    },
    profileContainer: {
        alignItems: 'center',
        width: '100%',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    username: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#00FF00', // Neon green
    },
    email: {
        fontSize: 18,
        color: '#A9A9A9', // Light gray
        marginTop: 8,
    },
    infoCard: {
        width: '100%',
        backgroundColor: '#1C1C1C', // Dark gray
        borderRadius: 10,
        padding: 18,
        marginBottom: 16,
        borderColor: '#00FF00',
        borderWidth: 1,
    },
    label: {
        fontSize: 14,
        color: '#A9A9A9', // Light gray
        marginBottom: 6,
    },
    value: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF', // White text
    },
    logoutButton: {
        marginTop: 24,
        backgroundColor: '#00FF00', // Neon green
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    noDataText: {
        color: '#FFF', // White text
        fontSize: 16,
    },
});

export default ProfileScreen;
