import { View, Text, Image } from 'react-native';
import React from 'react';
import { styled } from 'nativewind';

const ProfileContainer = styled(View, 'flex-1 bg-primary items-center justify-center');
const ProfileCard = styled(View, 'bg-white p-6 rounded-lg shadow-lg w-11/12');
const ProfileImage = styled(Image, 'w-24 h-24 rounded-full mx-auto mb-4');
const ProfileName = styled(Text, 'text-xl font-bold text-center mb-2');
const ProfileEmail = styled(Text, 'text-gray-500 text-center mb-4');
const ProfileInfo = styled(View, 'flex-row justify-between mt-4');
const ProfileInfoItem = styled(View, 'items-center');
const ProfileInfoLabel = styled(Text, 'text-gray-600 text-sm');
const ProfileInfoValue = styled(Text, 'font-bold text-lg');

export default function Profile() {
  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileImage source={{ uri: 'https://example.com/user-profile.jpg' }} />
        <ProfileName>John Doe</ProfileName>
        <ProfileEmail>john.doe@example.com</ProfileEmail>
        <ProfileInfo>
          <ProfileInfoItem>
            <ProfileInfoValue>24</ProfileInfoValue>
            <ProfileInfoLabel>Posts</ProfileInfoLabel>
          </ProfileInfoItem>
          <ProfileInfoItem>
            <ProfileInfoValue>300</ProfileInfoValue>
            <ProfileInfoLabel>Followers</ProfileInfoLabel>
          </ProfileInfoItem>
          <ProfileInfoItem>
            <ProfileInfoValue>180</ProfileInfoValue>
            <ProfileInfoLabel>Following</ProfileInfoLabel>
          </ProfileInfoItem>
        </ProfileInfo>
      </ProfileCard>
    </ProfileContainer>
  );
}
