import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { View , Image, ActivityIndicator} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { useMutation, useQuery } from "react-query";
import { Button, Text } from "../../defaults";
import { colors } from "../../../constants";
import { useViewGroup } from "../../../hooks/ReactQuery/useViewGroup";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { BasicProfile, GroupType } from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";
import { MutationKeys, QueryKeys } from "../../../constants/queryKeys";
import { YakkaUser } from "../../generics/Icons/YakkaUser";
import useCustomToast from "../../../hooks/useCustomToast";
import {useState} from "react";
import CurvedModal from "../../generics/CurvedModal";
import { FlashList , ListRenderItemInfo} from "@shopify/flash-list";
import { AreYouSure } from "../User/UserActions/AreYouSure";

type InviteToGroupProps = {
  group: GroupType;
  isInviting: boolean;
  setIsInviting: (val: boolean) => void;
};
export const InviteFriends = ({ group,isInviting,setIsInviting}: InviteToGroupProps) => {
  const navigation = useNavigation<RootLoggedInScreenProps<"Profile">>();
  const { toast, errorToast } = useCustomToast();
  const [modal,setModal] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<BasicProfile>();

  const share = () => {};
  // const [isLoading, setIsLoading] = React.useState();

  

  const { data, isLoading, isError, refetch } = useQuery<{
    friends: BasicProfile[];
  }>(
    QueryKeys.FRIENDS,
    () =>
      goFetchLite("users/find/friends", {
        method: "GET"
      }),
    {
      onSuccess: data => {
        console.log(data);
        // setCountryCode(data.countryCode);
      },
      retry: 0,
      onError: (error: any) => {
        if (error?.request?.status !== 404) {
          errorToast("Error fetching emergency contact");
        }
      }
    }
  );

  const addFriend = useMutation(
    (userId: number) => {
      return goFetchLite(`groups/invite`, {
        method: "POST",
        body: {groupId:group.id, userId}
      });
    },
    {
      onSuccess: () => {
        refetch();
        toast("Friend invited");
      }
    }
  );





const modalSwitch = () => {
  setModal(!modal)
}


const renderItem = ({ item, index }: ListRenderItemInfo<BasicProfile>) => {
  return (
    <View className="flex-row bg-white rounded-lg items-center mb-2">
      <View className="flex-1 p-1 gap-y-3 flex-row items-center">
        <Image
          source={{ uri: item.image }}
          className="w-12 h-12 rounded-lg"
        />
        <Text className="mx-4">
          {item?.firstName} {item.lastName}
        </Text>
      </View>
      <TouchableOpacity
        className="pr-4"
        onPress={() => {
          setSelectedUser(item);
          setModal(true);
        }}
      >
        <Ionicons name="add-outline" size={24} color={colors.greenYakka} />
      </TouchableOpacity>
    </View>
  );
};


  return (
    <>
    {isInviting ? (
      <View className="flex-1 justify-center items-start px-4 pt-3">
      <View 
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      >
      
      <Text size="lg" className="text-center font-bold">
        Invite Friends</Text>

      <Button
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderColor: colors.lightGrey,
        backgroundColor: colors.background,
        height: "auto",
        borderWidth: 1,
        minHeight: 32,
        marginTop: 10,
        marginBottom: 10,
      }}
      preset="small"
      disabled={isLoading}
      onPress={() => setIsInviting(!isInviting)}
      >
      {/* <Ionicons
        name="backspace-outline"
        color={colors.greenYakka}
        size={16}
        style={{ marginRight: 4 }}
        /> */}
       <Text
        size="md"
        weight="400"
        style={{
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        {"Cancel"}
      </Text>
    </Button>
      </View>
    
{isInviting && (
  <View className="flex-1 w-full">
        <FlashList
          ListEmptyComponent={
            <Text className="text-center w-full">
              No friends to display yet!
            </Text>
          }
          data={data?.friends}
          renderItem={renderItem}
          />
      </View>
    )}

    <CurvedModal
      title="Invite friend"
      isOpen={modal}
      setIsOpen={setModal}
    >
      {selectedUser && (
        <AreYouSure
        submitText="Invite"
        content={`Are you sure you want to invite ${selectedUser.firstName} ${selectedUser.lastName}?`}
        onPressCancel={() => setModal(false)}
        onPressSubmit={() => {
          addFriend.mutate(selectedUser.id);
        }}
        />
      )}
    </CurvedModal>
  </View>
    ) : (
      <Button
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderColor: colors.lightGrey,
        backgroundColor: colors.background,
        height: "auto",
        borderWidth: 1,
        minHeight: 32,
        marginTop: 10,
        marginLeft: 10
      }}
      preset="small"
      disabled={isLoading}
      onPress={() => setIsInviting(true)}
    >
      <Ionicons
        name="add-outline"
        color={colors.greenYakka}
        size={16}
        style={{ marginRight: 4 }}
      />
      <Text
        size="md"
        weight="400"
        style={{
          opacity: isLoading ? 0.6 : 1
        }}
      >
        {"Invite"}
      </Text>
    </Button>
    )} 
            </>
            );
          };
          