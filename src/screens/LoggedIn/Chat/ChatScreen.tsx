import { FlashList } from "@shopify/flash-list";
import { format } from "date-fns";
import * as Notifications from "expo-notifications";
import React, { useEffect } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View
} from "react-native";
import { Flow } from "react-native-animated-spinkit";
import { SafeAreaView } from "react-native-safe-area-context";
import { useInfiniteQuery } from "react-query";
import { Text } from "../../../components";
import { ImageGalleryModal } from "../../../components/defaults/ImageGalleryModal";
import AudioPlayer from "../../../components/specifics/Chat/AudioPlayer";
import ChatTextInput from "../../../components/specifics/Chat/ChatTextInput";
import GreenHeader from "../../../components/specifics/TabScreens/TabHeader";
import { colors } from "../../../constants";
import { QueryKeys } from "../../../constants/queryKeys";
import useChat from "../../../hooks/useChat";
import { HomeTabScreenProps } from "../../../navigation/navigation.props";
import { ChatHistoryResponse } from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";
// Not sure how you do the navigation types so I've whacked an any in there
export default function ChatScreen({
  navigation,
  route
}: HomeTabScreenProps<"Chat">) {
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async notification => {
        // Don't show a notification if the chat is already open

        if (
          notification.request.content.data?.type === "NEW_MESSAGE" &&
          notification.request.content.data?.chatId === route.params.chatId
        ) {
          return {
            shouldShowAlert: false,
            shouldPlaySound: false,
            shouldSetBadge: false
          };
        }
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true
        };
      }
    });
    // Reset the notification handler when the component unmounts
    return () => {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true
        })
      });
    };
  }, []);

  //   const offset = useKeyboardSize();

  const {
    connected,
    sendMessage,
    messages,
    clearMessages,
    handleTyping,
    friendTyping,
    setMessages
  } = useChat(route.params.chatId);

  const [selectedImage, setSelectedImage] = React.useState<string>("");
  const [imageViewerVisible, setImageViewerVisible] =
    React.useState<boolean>(false);
  const messageHistory = useInfiniteQuery<ChatHistoryResponse>(
    QueryKeys.chat(route.params.chatId),

    ({ pageParam }) =>
      goFetchLite(`chats/${route.params.chatId}`, {
        method: "GET",
        params: {
          page: pageParam
        }
      }).then((res: ChatHistoryResponse) => {
        const nextMessages = messages.filter(
          m => !res.messages.find(rm => rm.id === m.id)
        );
        setMessages([...nextMessages, ...res.messages]);
        return res;
      }),

    {
      onSuccess: data => {
        // Remove the websocket messages
        clearMessages();
      },
      getNextPageParam: (lastPage, pages) => lastPage.nextPage ?? undefined,
      keepPreviousData: true
    }
  );

  const messageHistoryArray =
    messageHistory.data?.pages.map(p => p.messages).flat() ?? [];

  return (
    <>
      <GreenHeader
        route={route}
        //@ts-ignore
        navigation={navigation}
        titleStyle={{
          width: 220,
          position: "absolute",
          alignSelf: "center",
          paddingLeft: 20,
          bottom: -10
        }}
        backButtonText="Back"
        title={`${route.params.friend.firstName} ${route.params.friend.lastName}`}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 relative items-center -mt-16 pt-16 bg-white h-full p-4"
      >
        <ImageGalleryModal
          images={[{ images: { uri: selectedImage }, id: 0 }]}
          imageIndex={0}
          visible={imageViewerVisible}
          setVisible={visible => setImageViewerVisible(visible)}
        />

        {/* Chats */}
        <View className="w-full flex-1 my-4">
          <FlashList
            inverted={true}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (messageHistory.hasNextPage) {
                messageHistory.fetchNextPage();
              }
            }}
            estimatedItemSize={100}
            contentContainerStyle={{ paddingBottom: 35 }}
            data={[...messages, ...messageHistoryArray]}
            renderItem={({ item, index }) => {
              const date = new Date(item.sentAt);
              const formattedDate = format(date, "HH:mma");
              return (
                <View
                  style={{
                    flexDirection:
                      item.senderId === route.params.friend.id
                        ? "row-reverse"
                        : "row"
                  }}
                  className={`w-full justify-between items-end ${
                    item.senderId === route.params.friend.id
                      ? "left-3"
                      : "right-3"
                  }`}
                >
                  <View className="flex-1" />

                  <View
                    key={index}
                    style={[
                      {
                        padding: item.type === "TEXT" ? 16 : 4,
                        width: item.type === "AUDIO" ? "80%" : "auto",
                        paddingTop: item.type === "IMAGE" ? 4 : 12
                      },
                      item.senderId === route.params.friend.id
                        ? {
                            backgroundColor: colors.chatBoxBackground
                          }
                        : {
                            backgroundColor: colors.greenYakka
                          }
                    ]}
                    className={`max-w-[80%] min-w-[20%] pb-[22px] rounded-2xl mb-4`}
                  >
                    {item.type === "TEXT" && (
                      <Text
                        size="lg"
                        style={{
                          color:
                            item.senderId === route.params.friend.id
                              ? "black"
                              : "white"
                        }}
                      >
                        {item.content}
                      </Text>
                    )}

                    {item.type === "IMAGE" && (
                      <TouchableOpacity
                        style={{ width: "100%", aspectRatio: 1 / 1.2 }}
                        onPress={() => {
                          setSelectedImage(
                            item.mediaUrl ||
                              `data:image/jpeg;base64,${item.content}`
                          );
                          setImageViewerVisible(true);
                        }}
                      >
                        <Image
                          source={{
                            uri:
                              item.mediaUrl ||
                              `data:image/jpeg;base64,${item.content}`
                          }}
                          resizeMode="cover"
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 16
                          }}
                        />
                      </TouchableOpacity>
                    )}

                    {item.type === "AUDIO" && (
                      <AudioPlayer audioUrl={item.mediaUrl || item.content} />
                    )}
                    <Text
                      size="sm"
                      style={[
                        item.senderId === route.params.friend.id
                          ? { color: colors.greyText }
                          : {
                              color: colors.background
                            }
                      ]}
                      className="pb-6 absolute -bottom-5 right-2 w-24 text-right"
                    >
                      {formattedDate}
                    </Text>
                    {item.senderId === route.params.friend.id ? (
                      <View className="absolute w-[25px] h-[25px] -z-[3] bottom-0 rounded-br-[25px] left-0">
                        <View
                          style={{ backgroundColor: colors.chatBoxBackground }}
                          className="absolute w-[25px] h-[25px] -z-[3] -bottom-2 rounded-br-[25px] left-[-10px]"
                        />
                        <View className="absolute bg-white w-[20px] h-[35px] bottom-[-6px] rounded-br-[18px] left-[-20px]"></View>
                      </View>
                    ) : (
                      <View className="absolute w-[25px] h-[25px] -z-[3] bottom-0 rounded-bl-[25px] right-0">
                        <View
                          style={{
                            backgroundColor: colors.greenYakka
                          }}
                          className="absolute w-[25px] h-[25px] -z-[3] -bottom-2 rounded-bl-[25px] right-[-10px]"
                        />
                        <View className="absolute bg-white w-[20px] h-[35px] bottom-[-6px] rounded-bl-[18px] right-[-20px]" />
                      </View>
                    )}
                  </View>
                </View>
              );
            }}
            // show text typing if friend typing
            ListHeaderComponent={
              friendTyping ? (
                <View className="flex-row items-center space-x-2">
                  <Flow />
                  <Text>{route.params.friend.firstName} is typing...</Text>
                </View>
              ) : null
            }
          />
        </View>

        {/* Text box fixed to the bottom with three icons on the right */}

        <ChatTextInput sendMessage={sendMessage} onChangeText={handleTyping} />
        <SafeAreaView edges={["bottom"]} />
      </KeyboardAvoidingView>
    </>
  );
}
