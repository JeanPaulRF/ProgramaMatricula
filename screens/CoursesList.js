import React, { useState, useEffect } from "react";
import { Button, StyleSheet } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

import firebase from "../database/firebase";

const CourseScreen = (props) => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        firebase.db.collection("courses").onSnapshot((querySnapshot) => {
            const courses = [];
            querySnapshot.docs.forEach((doc) => {
                const { name, number, credits, profesor } = doc.data();
                courses.push({
                    id: doc.id,
                    name,
                    number,
                    credits,
                    profesor,
                });
            });
            setCourses(courses);
        });
    }, []);

    return (
        <ScrollView>
            <Button
                onPress={() => props.navigation.navigate("CreateCourseScreen")}
                title="Crear curso"
            />
            {courses.map((course) => {
                return (
                    <ListItem
                        key={course.id}
                        bottomDivider
                        onPress={() => {
                            props.navigation.navigate("CourseDetailScreen", {
                                courseId: course.id,
                            });
                        }}
                    >
                        <ListItem.Chevron />
                        <Avatar
                            source={{
                                uri:
                                    "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
                            }}
                            rounded
                        />
                        <ListItem.Content>
                            <ListItem.Title>{course.name}</ListItem.Title>
                            <ListItem.Subtitle>Numero: {course.number}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                );
            })}
        </ScrollView>
    );
};

export default CourseScreen;
