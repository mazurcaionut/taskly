import { Text, View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Duration, isBefore, intervalToDuration } from "date-fns";
import { TimeSegment } from "../../components/TimeSegment";
import { getFromStorage, saveToStorage } from "../../utils/storage";

const frequency = 10 * 1000;

const countdownStorageKey = "taskly-countdown";

type PersistedCountdownState = {
    currentNotificationId: string | undefined;
    completedAtTimestamps: number[];
};

type CountdownStatus = {
    isOverdue: boolean;
    distance: Duration;
};

export default function CounterScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [countdownState, setCountdownState] = useState<PersistedCountdownState>();
    const [status, setStatus] = useState<CountdownStatus>({
        isOverdue: false,
        distance: {},
    });

    const lastCompletedTimestamp = countdownState?.completedAtTimestamps[0];

    useEffect(() => {
        const init = async () => {
            const value = await getFromStorage(countdownStorageKey);
            setCountdownState(value);

            // Initialize status right after getting the stored value
            if (value?.completedAtTimestamps[0]) {
                const timestamp = value.completedAtTimestamps[0] + frequency;
                const isOverdue = isBefore(timestamp, Date.now());
                const distance = intervalToDuration(
                    isOverdue
                        ? { start: timestamp, end: Date.now() }
                        : { start: Date.now(), end: timestamp }
                );
                setStatus({ isOverdue, distance });
            }

            setIsLoading(false);
        };
        init();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const timestamp = lastCompletedTimestamp
                ? lastCompletedTimestamp + frequency
                : Date.now();
            const isOverdue = isBefore(timestamp, Date.now());
            const distance = intervalToDuration(
                isOverdue
                    ? { start: timestamp, end: Date.now() }
                    : {
                          start: Date.now(),
                          end: timestamp,
                      }
            );
            setStatus({ isOverdue, distance });
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [lastCompletedTimestamp]);

    const scheduleNotification = async () => {
        let pushNotificationId;

        const result = await registerForPushNotificationsAsync();
        if (result === "granted") {
            pushNotificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "The thing is due",
                },
                trigger: {
                    seconds: frequency / 1000,
                },
            });
        } else {
            if (Device.isDevice) {
                Alert.alert(
                    "Unable to schedule notification",
                    "Enable the notification permission for Expo Go in settings"
                );
            }
        }
        if (countdownState?.currentNotificationId) {
            await Notifications.cancelScheduledNotificationAsync(
                countdownState?.currentNotificationId
            );
        }

        const newCountdownState: PersistedCountdownState = {
            currentNotificationId: pushNotificationId,
            completedAtTimestamps: countdownState
                ? [Date.now(), ...countdownState.completedAtTimestamps]
                : [Date.now()],
        };

        setCountdownState(newCountdownState);
        await saveToStorage(countdownStorageKey, newCountdownState);
    };

    if (isLoading) {
        return (
            <View style={styles.activityIndicatorContainer}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <View style={[styles.container, status.isOverdue ? styles.containerLate : undefined]}>
            {status.isOverdue ? (
                <Text style={[styles.heading, styles.whiteText]}>Thing overdue by</Text>
            ) : (
                <Text style={styles.heading}>Thing due in</Text>
            )}
            <View style={styles.row}>
                <TimeSegment
                    unit="Days"
                    number={status.distance.days ?? 0}
                    textStyle={status.isOverdue ? styles.whiteText : undefined}
                />
                <TimeSegment
                    unit="Hours"
                    number={status.distance.hours ?? 0}
                    textStyle={status.isOverdue ? styles.whiteText : undefined}
                />
                <TimeSegment
                    unit="Minutes"
                    number={status.distance.minutes ?? 0}
                    textStyle={status.isOverdue ? styles.whiteText : undefined}
                />
                <TimeSegment
                    unit="Seconds"
                    number={status.distance.seconds ?? 0}
                    textStyle={status.isOverdue ? styles.whiteText : undefined}
                />
            </View>
            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={scheduleNotification}
            >
                <Text style={styles.buttonText}>I've done the thing!</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: theme.colorBlack,
        padding: 12,
        borderRadius: 6,
    },
    buttonText: {
        color: theme.colorWhite,
        letterSpacing: 1,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    row: {
        flexDirection: "row",
        marginBottom: 24,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 24,
    },
    containerLate: {
        backgroundColor: theme.colorRed,
    },
    whiteText: {
        color: theme.colorWhite,
    },
    activityIndicatorContainer: {
        backgroundColor: theme.colorWhite,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
});
