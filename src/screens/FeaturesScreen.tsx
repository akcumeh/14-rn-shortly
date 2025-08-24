import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { RootDrawerParamList } from '../types/navigation';

type FeaturesScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Features'>;

const colors = {
    shortlyBlue: "hsl(180, 66%, 49%)",
    shortlyPurple: "hsl(257, 27%, 26%)",
    shortlyRedErr: "hsl(0, 87%, 67%)",
    shortlyGrey400: "hsl(0, 0%, 75%)",
    shortlyGrey500: "hsl(257, 7%, 63%)",
    shortlyGrey900: "hsl(255, 11%, 22%)",
    shortlyGrey950: "hsl(260, 8%, 14%)"
};

export default function FeaturesScreen() {
    const navigation = useNavigation<FeaturesScreenNavigationProp>();
    
    return (
        <View style={styles.home}>
            <Text>This is the Features page</Text>
            <TouchableOpacity style={styles.drawerBtn} onPress={() => navigation.openDrawer()}>
                <Text style={styles.drawerBtnText}>Open Drawer</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    home: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    drawerBtn: {
        width: 250,
        padding: 20,
        backgroundColor: colors.shortlyBlue,
        borderRadius: 50,
    },
    drawerBtnText: {
        color: colors.shortlyPurple,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 1,
    }
});