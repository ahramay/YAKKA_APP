import { StyleSheet,View,Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import React from "react"
import { Button } from "../../defaults"
import { colors } from "../../../constants"
import { HomeTabScreenProps } from "../../../navigation/navigation.props";

type Props = {
    navigation: HomeTabScreenProps<"Home">["navigation"]
}
export default function DefaultButtonGroup({navigation}:Props){
    return (
        <View className="pt-10 gap-y-10">
        <Button
                  style={styles.purpleBtn}
                  disabled={false}
                  ignoreDisabledOpacity
                  textPreset="xl"
                  preset="small"
                  text="Find a YAKKA"
                  onPress={() =>
                    navigation.navigate("HomeDrawer", {
                      screen: "HomeTabs",
                      params: {
                        screen: "FindYakkas",
                        params: { openAddYakkaModal: false, tab: "recommended" }
                      }
                    })
                  }
                  />
                  
                     <Button
                  style={styles.pinkBtn}
                  disabled={false}
                  ignoreDisabledOpacity
                  textPreset="xl"
                  preset="small"
                  text="Find Group"
                  onPress={() =>
                    navigation.navigate("HomeDrawer", {
                      screen: "HomeTabs",
                      params: {
                        screen: "FindGroups",
                        params: { openAddGroupModal: false, tab: "recommended" }
                      }
                    })
                  }
                  />
                  </View>
    )
}

const styles = StyleSheet.create({
    purpleBtn: {  backgroundColor: colors.listPurple ,height: 140, borderRadius: 10,marginLeft:"auto",marginRight:"auto",
    width: 300,
      alignItems: 'center', justifyContent: 'center'},
      pinkBtn: {  backgroundColor: colors.listPink ,height: 140, borderRadius: 10,marginLeft:"auto",marginRight:"auto",
    width: 300,
      alignItems: 'center', justifyContent: 'center'}
  });
  