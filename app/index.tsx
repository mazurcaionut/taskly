import { StyleSheet, TextInput, ScrollView, FlatList, View, Text } from "react-native";
import { theme } from "../theme";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { useState } from "react";

type ShoppingListItemType = {
    id: string;
    name: string;
};

const initialList: ShoppingListItemType[] = [
    { id: "1", name: "Coffee" },
    { id: "2", name: "Tea" },
    { id: "3", name: "Milk" },
];

const testData = new Array(1000).fill(null).map((_, index) => ({
    id: String(index),
    name: String(index),
}));

export default function App() {
    const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([]);
    const [value, setValue] = useState("");

    const handleSubmit = () => {
        if (value) {
            const newShoppingList = [
                { id: new Date().toTimeString(), name: value },
                ...shoppingList,
            ];
            setShoppingList(newShoppingList);
            setValue("");
        }
    };

    return (
        <FlatList
            data={shoppingList}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            stickyHeaderIndices={[0]}
            ListEmptyComponent={
                <View style={styles.listEmptyContainer}>
                    <Text>Your shopping list is empty</Text>
                </View>
            }
            ListHeaderComponent={
                <TextInput
                    placeholder="E.g. Coffee"
                    style={styles.textInput}
                    value={value}
                    onChangeText={setValue}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                />
            }
            renderItem={({ item }) => <ShoppingListItem name={item.name} />}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colorWhite,
        padding: 12,
    },
    contentContainer: {
        paddingBottom: 24,
    },
    textInput: {
        borderWidth: 2,
        borderColor: theme.colorLightGrey,
        padding: 12,
        marginHorizontal: 12,
        marginBottom: 12,
        fontSize: 18,
        borderRadius: 50,
        backgroundColor: theme.colorWhite,
    },
    listEmptyContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 18,
    },
});
