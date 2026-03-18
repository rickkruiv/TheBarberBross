import { Tabs, TabList, TabSlot, TabTrigger } from "expo-router/ui";
import { StyleSheet } from "react-native";
import TabItem from "../../components/TabItem";
import { usePathname } from "expo-router";
import { useTheme } from "../../theme/ThemeProvider";
import AppHeader from "../../components/AppHeader";

export default function Layout() {
  const pathname = usePathname();
  const { colors } = useTheme();

  return (
    <>
      <AppHeader />
      <Tabs>
        <TabSlot />

        <TabList style={[styles.tabBar, { backgroundColor: colors.background }]}>

          <TabTrigger name="home" href="/home" style={styles.tabTrigger}>
            <TabItem label="Home" icon="home" active={pathname === "/home" || pathname === "/"} />
          </TabTrigger>

          <TabTrigger name="appointments" href="/appointments" style={styles.tabTrigger}>
            <TabItem label="Appointments" icon="time-outline" active={pathname === "/appointments"} />
          </TabTrigger>

          <TabTrigger name="aihaircutview" href="/aihaircutview" style={styles.tabTrigger}>
            <TabItem label="Haircut Preview" icon="sparkles" active={pathname === "/aihaircutview"} />
          </TabTrigger>

          <TabTrigger name="menu" href="/menu" style={styles.tabTrigger}>
            <TabItem label="Menu" icon="person-circle-outline" active={pathname === "/menu"} />
          </TabTrigger>

        </TabList>
      </Tabs>
    </>
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