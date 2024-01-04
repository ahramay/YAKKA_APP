import React, { useEffect, useRef, useState } from "react";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useMutation } from "react-query";
import io, { connect, Socket } from "socket.io-client";
import { refreshToken } from "../api/auth/refreshToken";
import { baseUrl, getToken } from "../api/config";
import { MutationKeys, QueryKeys } from "../constants/queryKeys";
import { queryClient } from "../reactQuery/queryClient";
import { Message } from "../types/types";

const socket = io(baseUrl.split("/api/")[0], {
  autoConnect: false
});

enum SocketEvents {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  CONNECT_ERROR = "connect_error",
  PRIVATE_MESSAGE = "private_message",
  TYPING = "typing",
  STOP_TYPING = "stop_typing",
  MESSAGE_READ = "message_read"
}

const useChat = (chatId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const [friendTyping, setFriendTyping] = useState(false);

  const addMessage = (message: Message) => {
    setMessages(messages => [message, ...messages]);
    socket.emit(SocketEvents.MESSAGE_READ);
    queryClient.refetchQueries(QueryKeys.CHATS);
  };

  // Initialize the socket
  useEffect(() => {
    socket.on(SocketEvents.CONNECT_ERROR, async err => {
      if (err.message === "invalid_token") {
      }
    });

    // When a new private_message event comes in, add it to the list
    socket.on(SocketEvents.PRIVATE_MESSAGE, (message: any) => {
      addMessage(message);
    });

    socket.on(SocketEvents.CONNECT, () => {
      setConnected(true);
      socket.emit(SocketEvents.MESSAGE_READ);
      queryClient.refetchQueries(QueryKeys.CHATS);
    });

    socket.on(SocketEvents.DISCONNECT, () => {
      setConnected(false);
    });

    socket.on(SocketEvents.TYPING, () => {
      setFriendTyping(true);
    });

    socket.on(SocketEvents.STOP_TYPING, () => {
      setFriendTyping(false);
    });

    connect();

    return () => {
      socket.close();
    };
  }, []);

  const clearMessages = () => {
    setMessages([]);
  };

  const sendMessage = (message: Pick<Message, "content" | "type">) => {
    const messageObj = {
      content: message.content,
      type: message.type
    };
    socket.emit(SocketEvents.PRIVATE_MESSAGE, messageObj);
    addMessage({
      ...messageObj,

      senderId: "me",
      sentAt: new Date().toString()
    });
  };

  const handleTyping = () => {
    if (timeout.current) {
      // If already typing, reset the timeout
      clearTimeout(timeout.current);
    } else {
      socket.emit(SocketEvents.TYPING);
    }
    timeout.current = setTimeout(() => {
      socket.emit(SocketEvents.STOP_TYPING);
      timeout.current = null;
    }, 1000);
  };

  const connect = async () => {
    socket.auth = { token: await getToken(), chatId };
    socket.connect();
  };

  return {
    socket,
    messages,
    sendMessage,
    connected,
    handleTyping,
    friendTyping,
    clearMessages,
    setMessages
  };
};

export default useChat;
