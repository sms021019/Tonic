import {Icon, Input} from "native-base";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import theme from '../utils/theme'

export default function SearchBar(props) {
    let bg = props.bg? props.bg : "white"

    return(
        <Input
            placeholder="Search"
            variant="filled"
            width="80%"
            borderRadius="5"
            py="3"
            px="2"
            bg={bg}
            InputLeftElement= {
                <Icon
                    ml="2"
                    size="5"
                    color="gray.600"
                    as={ <Ionicons name="ios-search" /> }
                />
            }
        />
    )
}