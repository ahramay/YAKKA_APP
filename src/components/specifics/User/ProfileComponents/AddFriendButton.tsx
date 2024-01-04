import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import Toast from "react-native-toast-message";
import { useMutation } from "react-query";
import { colors } from "../../../../constants";
import { MutationKeys } from "../../../../constants/queryKeys";
import { useProfile } from "../../../../hooks/ReactQuery/useProfile";
import { GetProfileResponse } from "../../../../types/types";
import { goFetchLite } from "../../../../utils/goFetchLite";
import { Button } from "../../../defaults";
import { ButtonProps } from "../../../defaults/Button/Button.props";
import { Tick } from "../../../generics/Icons/Tick";

type AddFriendProps = {
  user: GetProfileResponse;
};
export const AddFriendButton = ({
  user,
  ...rest
}: AddFriendProps & Partial<ButtonProps>) => {
  const { refetch } = useProfile(user.id);
  const addFriendMutation = useMutation(
    MutationKeys.ADD_FRIEND,
    () =>
      goFetchLite(`friends/requests/send/${user.id}`, {
        method: "POST"
      }),
    {
      onSuccess: () => {
        //@ts-ignore
        Toast.show({
          text1: `You sent a friend request to ${user.firstName} ${user.lastName}`
        });
        refetch();
      }
    }
  );

  return (
    <>
      {user.friendStatus !== "ACCEPTED" && (
        <Button
          hitSlop={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
          }}
          className="z-50 ml-4"
          preset="small"
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderColor: colors.lightGrey,
            backgroundColor: colors.background,
            height: "auto",
            paddingRight: 3,
            borderWidth: 1
          }}
          textSize="md"
          textWeight="400"
          textColor={"greyText"}
          disabled={user.friendStatus === "PENDING"}
          text={
            user.friendStatus === "PENDING"
              ? "Pending Invitation"
              : "Add Friend"
          }
          onPress={() => addFriendMutation.mutate()}
          childrenRight={
            user.friendStatus === "PENDING" ? (
              <Tick dimmed svgProps={{ style: { marginLeft: 5 } }} />
            ) : (
              <Ionicons
                name="add-circle"
                size={26}
                style={{ marginLeft: 5 }}
                color={colors.greenYakka}
              />
            )
          }
          {...rest}
        />
      )}
    </>
  );
};
