import React, { useState, useEffect } from "react";
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import firebase from "../database/firebase";

const AgregarCourseScreen = (props) => {
    const [courses, setCourses] = useState([]);
    const [cursos, setCursos] = useState([]);
    const userId = props.route.params.userId; // Obtén el id del curso de las props

    useEffect(() => {
        // Consulta la tabla 'courses' para obtener la lista de cursos
        firebase.db.collection("courses").onSnapshot((querySnapshot) => {
            const coursesData = [];
            querySnapshot.docs.forEach((doc) => {
                const { name, number, credits, profesor } = doc.data();
                coursesData.push({
                    id: doc.id,
                    name,
                    number,
                    credits,
                    profesor,
                });
            });
            setCourses(coursesData);
        });

        // Consulta la tabla 'courseXUser' para obtener los estudiantes ya matriculados en el curso
        firebase.db
            .collection("courseXUser")
            .where("idUser", "==", userId)
            .onSnapshot((querySnapshot) => {
                const courseIds = [];
                querySnapshot.docs.forEach((doc) => {
                    const { idCourse } = doc.data();
                    courseIds.push(idCourse);
                });
                setCursos(courseIds);
            });
    }, []);

    const agregarCurso = (courseId) => {
        // Agrega el usuario al arreglo de estudiantes del curso en la tabla 'courseXUser'
        firebase.db.collection("courseXUser").add({
            idCourse: courseId,
            idUser: userId,
        })
            .then(() => {
                // Después de agregar el estudiante, actualiza el estado 'estudiantes' con la nueva lista de estudiantes matriculados
                setCursos([...cursos, courseId]);
            })
            .catch((error) => {
                console.error("Error al agregar curso:", error);
            });
    };

    return (
        <ScrollView>
            {courses.map((course) => {
                if (!cursos.includes(course.id)) {
                    return (
                        <ListItem
                            key={course.id}
                            bottomDivider
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
                                <ListItem.Subtitle>{course.number}</ListItem.Subtitle>
                            </ListItem.Content>
                            <TouchableOpacity
                                style={styles.agregarContainer}
                                onPress={() => agregarCurso(course.id)}
                            >
                                <Text style={styles.agregarText}>Agregar</Text>
                            </TouchableOpacity>
                        </ListItem>
                    );
                } else {
                    return null;
                }
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    estudianteContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    estudianteText: {
        fontSize: 16,
    },
    agregarButton: {
        backgroundColor: "blue",
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    agregarButtonText: {
        color: "white",
        fontSize: 18,
    },
    agregarContainer: {
        backgroundColor: "blue",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    agregarText: {
        color: "white",
    },
});

export default AgregarCourseScreen;
