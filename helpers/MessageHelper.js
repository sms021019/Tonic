import {showMessage} from "react-native-flash-message";
import theme from "../utils/theme";


export function showQuickMessage(message) {
    showMessage({
        message: message,
        type: "info",
        backgroundColor: theme.colors.primary, // background color
        color: theme.colors.white, // text color
        duration: 2500,
    });
}
