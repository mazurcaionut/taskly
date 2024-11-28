import { StatusBar } from "expo-status-bar";
import { PixelRatio, StyleSheet, Text, View } from "react-native";
import { theme } from "./theme";

export default function App() {
    return (
        <View style={styles.container}>
            <View style={styles.itemContainer}>
                <Text style={styles.itemText}>Coffee</Text>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colorWhite,
        justifyContent: "center",
    },
    itemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colorCerulean,
        paddingHorizontal: 8,
        paddingVertical: 16,
    },
    itemText: { fontSize: 18, fontWeight: "200" },
});
