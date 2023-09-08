import {createStackNavigator} from '@react-navigation/stack'
import ChatScreen from '../screens/ChatScreen';
import {ScreenType} from "../utils/utils";

const Stack = createStackNavigator();


export default function ChatNavigator() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name = {ScreenType.CHANNEL}>
                {props => <ChatScreen {...props} chatroomId = {chatroomId}/>}
            </Stack.Screen>
        </Stack.Navigator>
    )
}
