import { View, Text, Image } from 'react-native'
import React from 'react'

export default function UserProfileImage({imageUrl}:{
    imageUrl: string
}) {
  return (
    <Image
      source={{
        uri: imageUrl
      }}
      className="w-14 h-14 rounded-full bg-gray-200"
    />
  );
}