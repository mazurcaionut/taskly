import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { theme } from "../theme";

interface ShoppingListItemProps {
    name?: string;
}

export function ShoppingListItem({ name }: ShoppingListItemProps) {
    const handleDelete = () => {
        Alert.alert(`Are you sure you want to delete ${name}?`, "It will be gone for good", [
            {
                text: "Yes",
                style: "destructive",
                onPress: () => console.log("Deleting"),
            },
            { text: "Cancel", style: "cancel" },
        ]);
    };

    return (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{name}</Text>
            <TouchableOpacity style={styles.button} onPress={handleDelete} activeOpacity={0.8}>
                <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colorCerulean,
        paddingHorizontal: 8,
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    itemText: { fontSize: 18, fontWeight: "200" },
    button: {
        backgroundColor: theme.colorBlack,
        padding: 8,
        borderRadius: 6,
    },
    buttonText: {
        color: theme.colorWhite,
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
});
