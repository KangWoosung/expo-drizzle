import { Text, View } from 'react-native'

type Props = {
  title: string
  subtitle: string
}
export function Header({ subtitle, title }: Props) {
  return (
    <View className="mb-8 mt-10 px-8">
      <Text className="text-4xl font-bold text-foreground">{title}</Text>
      <Text className="font-regular text-lg text-background">{subtitle}</Text>
    </View>
  )
}
