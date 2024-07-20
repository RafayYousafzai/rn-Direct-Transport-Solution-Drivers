import { Link } from 'expo-router'
import { View, Text, SafeAreaView } from 'react-native'

export default function index() {
  return (
    <SafeAreaView>
      <Text>index</Text>
      <Link href={"/History"}>go</Link>
      <Link href={"/details"}>go</Link>
    </SafeAreaView>
  )
}