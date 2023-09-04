import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome } from "@expo/vector-icons";

import HomeScreen from "./screens/HomeScreen";
import CreateUserScreen from "./screens/CreateUserScreen";
import UserDetailScreen from "./screens/UserDetailScreen";
import UsersList from "./screens/UsersList";
import CreateCourseScreen from "./screens/CreateCourseScreen";
import CourseDetailScreen from "./screens/CourseDetailScreen";
import CoursesList from "./screens/CoursesList";
import CourseXUserScreen from "./screens/CourseXUserScreen";
import UserXCourseScreen from "./screens/UserXCourseScreen";
import AgregarUserScreen from "./screens/AgregarUserScreen";
import AgregarCourseScreen from "./screens/AgregarCourseScreen";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#621FF7",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: "Registro Cursos-Estudiantes" }}
      />
      <Stack.Screen
        name="UsersList"
        component={UsersList}
        options={{ title: "Lista de estudiantes" }}
      />
      <Stack.Screen
        name="CreateUserScreen"
        component={CreateUserScreen}
        options={{ title: "Ingresar estudiante" }}
      />
      <Stack.Screen
        name="UserDetailScreen"
        component={UserDetailScreen}
        options={{ title: "Detalles de estudiante" }}
      />
      <Stack.Screen
        name="CoursesList"
        component={CoursesList}
        options={{ title: "Lista de cursos" }}
      />
      <Stack.Screen
        name="CreateCourseScreen"
        component={CreateCourseScreen}
        options={{ title: "Ingresar curso" }}
      />
      <Stack.Screen
        name="CourseDetailScreen"
        component={CourseDetailScreen}
        options={{ title: "Detalles de curso" }}
      />
      <Stack.Screen
        name="CourseXUserScreen"
        component={CourseXUserScreen}
        options={{ title: "Cursos del estudiante" }}
      />
      <Stack.Screen
        name="UserXCourseScreen"
        component={UserXCourseScreen}
        options={{ title: "Estudiantes del curso" }}
      />
      <Stack.Screen
        name="AgregarUserScreen"
        component={AgregarUserScreen}
        options={{ title: "Agregar estudiante" }}
      />
      <Stack.Screen
        name="AgregarCourseScreen"
        component={AgregarCourseScreen}
        options={{ title: "Agregar curso" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={MyStack}
          options={({ navigation }) => ({
            headerRight: () => (
              <FontAwesome
                name="home"
                size={30}
                color="#fff"
                style={styles.icon}
                onPress={() => navigation.navigate("HomeScreen")}
              />
            ),
            headerStyle: {
              backgroundColor: "#621FF7",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 15,
  },
});
