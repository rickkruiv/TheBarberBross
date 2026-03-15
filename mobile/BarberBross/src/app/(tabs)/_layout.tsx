import { Tabs, TabList, TabSlot, TabTrigger } from "expo-router/ui";
import { StyleSheet } from "react-native";
import TabItem from "../../components/TabItem";
import { usePathname } from "expo-router";
import { useTheme } from "../../theme/ThemeProvider";

export default function Layout() {
  const pathname = usePathname();
  const theme    = useTheme();

  return (
    <Tabs>
      <TabSlot />

      <TabList style={[styles.tabBar, { backgroundColor: theme.colors.background }]}>

        <TabTrigger name="home" href="/home" style={styles.tabTrigger}>
          <TabItem label="Home" icon="home" active={pathname === "/home" || pathname === "/"} />
        </TabTrigger>

        <TabTrigger name="search" href="/search" style={styles.tabTrigger}>
          <TabItem label="Search" icon="search" active={pathname === "/search"} />
        </TabTrigger>

        <TabTrigger name="appointments" href="/appointments" style={styles.tabTrigger}>
          <TabItem label="Appointments" icon="clock-o" active={pathname === "/appointments"} />
        </TabTrigger>

        <TabTrigger name="menu" href="/menu" style={styles.tabTrigger}>
          <TabItem label="Menu" icon="user-circle" active={pathname === "/menu"} />
        </TabTrigger>

      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-around'
  },
  tabTrigger: {
    padding: 10,
  },
});