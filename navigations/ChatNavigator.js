import {createStackNavigator} from '@react-navigation/stack'
import ChatScreen from '../screens/ChatScreen';
import {ScreenType} from "../utils/utils";

const Stack = createStackNavigator();

export default function ChatNavigator({route}) {
    const {chatroomId} = route.params;

    return (
        // 'HeaderShown' must be initialized to FALSE (To prevent showing unintended header when the screen is loading).
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name = {ScreenType.CHAT}>
                {props => <ChatScreen {...props} chatroomId = {chatroomId}/>}
            </Stack.Screen>
        </Stack.Navigator>
    )
}
