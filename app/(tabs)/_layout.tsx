import { Tabs } from "expo-router";

export default function TabLayout() {

  return (

    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1e2a38",
        },

        headerTintColor: "#fff",

        tabBarStyle: {
          backgroundColor: "#1e2a38",
        },

        tabBarActiveTintColor: "#fff",

        tabBarInactiveTintColor: "#999",
      }}
    >

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "GeoAchados",
        }}
      />

      <Tabs.Screen
        name="objetos"
        options={{
          title: "Objetos",
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
        }}
      />

    </Tabs>
  );
}