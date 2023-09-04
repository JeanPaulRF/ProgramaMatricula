import React, { useState } from "react";
import {
    Button,
    View,
    StyleSheet,
    TextInput,
    ScrollView,
} from "react-native";

import firebase from "../database/firebase";

const AddCourseScreen = (props) => {
    const initalState = {
        name: "",
        number: "",
        credits: "",
        profesor: "",
    };

    const [state, setState] = useState(initalState);

    const handleChangeText = (value, name) => {
        setState({ ...state, [name]: value });
    };

    const saveNewCourse = async () => {
        if (state.name === "") {
            alert("please provide a name");
        } else {

            try {
                await firebase.db.collection("courses").add({
                    name: state.name,
                    number: state.number,
                    credits: state.credits,
                    profesor: state.profesor,
                });

                props.navigation.navigate("CoursesList");
            } catch (error) {
                console.log(error)
            }
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Name Input */}
            <View style={styles.inputGroup}>
                <TextInput
                    placeholder="Nombre"
                    onChangeText={(value) => handleChangeText(value, "name")}
                    value={state.name}
                />
            </View>

            {/* Number Input */}
            <View style={styles.inputGroup}>
                <TextInput
                    placeholder="Número"
                    onChangeText={(value) => handleChangeText(value, "number")}
                    value={state.number}
                />
            </View>

            {/* Credits */}
            <View style={styles.inputGroup}>
                <TextInput
                    placeholder="Créditos"
                    onChangeText={(value) => handleChangeText(value, "credits")}
                    value={state.credits}
                />
            </View>

            {/* Profesor */}
            <View style={styles.inputGroup}>
                <TextInput
                    placeholder="Profesor"
                    onChangeText={(value) => handleChangeText(value, "profesor")}
                    value={state.profesor}
                />
            </View>

            <View style={styles.button}>
                <Button title="Guardar" onPress={() => saveNewCourse()} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 35,
    },
    inputGroup: {
        flex: 1,
        padding: 0,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#cccccc",
    },
    loader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default AddCourseScreen;
