import { StyleSheet, } from 'react-native'
import { Text, TextProps } from "react-native-paper"
import { Text as NativeText } from "react-native"
import React from 'react'
import { LiveAppState } from '../store/store'

const BaseText = (props: TextProps<typeof NativeText>) => {
  return (
    <Text {...props} theme={LiveAppState.themeValue.get()}> {props.children} </Text>
  )
}

export default BaseText

