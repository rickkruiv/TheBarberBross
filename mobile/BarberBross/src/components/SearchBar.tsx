import { XStack, Input } from 'tamagui'
import { Search } from '@tamagui/lucide-icons-2'
import { forwardRef } from 'react'
import { useTheme } from 'tamagui'

type Props = {
  onFocus?: () => void
  autoFocus?: boolean
}

const SearchBar = forwardRef<any, Props>(({ onFocus, autoFocus }, ref) => {
  const theme = useTheme()

  return (
    <XStack
      width="100%"
      paddingHorizontal="$4"
      paddingVertical="$1"
      borderRadius="$6"
      borderWidth={1}
      borderColor="$border"
      alignItems="center"
      gap="$2"
      backgroundColor="$backgroundSecondary"
    >
      
      <Search size={18} color={theme.textSecondary.val} />

      <Input
        ref={ref}
        flex={1}
        size="$8"
        borderWidth={0}
        padding="$2"
        backgroundColor="transparent"
        placeholder="Search"
        placeholderTextColor="$textSecondary"
        onFocus={onFocus}
        autoFocus={autoFocus}
        fontSize={"$2"}
        outlineColor="transparent"
        focusStyle={{ outlineColor: "transparent" }}
      />
    </XStack>
  )
})

export default SearchBar