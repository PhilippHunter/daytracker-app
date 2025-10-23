import { Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useHeaderHeight } from "@react-navigation/elements";


const FULL_SCREEN_MODAL_CARD_TOP_OFFSET = Platform.select({
  ios: 10, // This value is a constant for all types of iOS devices
  default: 0
})

export function useFullScreenModalHeaderHeight() {
  const { top: topInset } = useSafeAreaInsets()
  const headerHeight = useHeaderHeight()
  return topInset + FULL_SCREEN_MODAL_CARD_TOP_OFFSET + headerHeight
}

