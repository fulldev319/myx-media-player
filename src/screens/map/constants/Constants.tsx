import { Platform } from "react-native";
import { wp } from "../global";

const Constants = {
    APP_NAME: 'Clio',
    FONTFAMILY_MARGINBOTTOM: Platform.OS === 'android' ? wp(-0.9) : 0
}

export default Constants