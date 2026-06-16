const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

function getuserdata() {
    const response = fs.readFileSync("db.json", "utf8");
    const data = JSON.parse(response);
    return data.users;
}

function saveuserdata(users) {
    const userdata = JSON.stringify({
        users: users,
        students: getstudentdata()
    });
    fs.writeFileSync("db.json", userdata);
}

function getstudentdata() {
    const response = fs.readFileSync("db.json", "utf8");
    const data = JSON.parse(response);
    return data.students;
}

function savestudentdata(students) {
    const stddata = JSON.stringify({
        users: getuserdata(),
        students: students
    });
    fs.writeFileSync("db.json", stddata);
}

app.get("/users", (req, res) => {
    res.json(getuserdata());
});

app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    const users = getuserdata();

    const user = users.find(u => u.id == id);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

app.post("/users", (req, res) => {
    const users = getuserdata();
    const user = req.body;

    user.id = users.length > 0
        ? users[users.length - 1].id + 1
        : 1;

    users.push(user);

    saveuserdata(users);

    res.status(201).send("user added successfully");
});
app.put("/users/:id", (req, res) => {
    const id = req.params.id;
    const users = getuserdata();

    const idx = users.findIndex(u => u.id == id);
    if(idx>-1)
    {
        users[idx]={...users[idx],...req.body}
        saveuserdata(users)
        res.send("user updated")
    }
    else{
        res.status(404).json({message:"user not found"})
    }

});
app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    let users = getuserdata();
    const user=users.find(u=>u.id==id)
    if(user){
        users=users.filter(u=>u.id!=id)
        saveuserdata(users)
        res.send("user deleted")
    }
    else{
        res.send("user not found")
    }
});

app.get("/students", (req, res) => {
    res.json(getstudentdata());
});

app.get("/students/:id", (req, res) => {
    const id = req.params.id;
    const students = getstudentdata();

    const student = students.find(s => s.id == id);

    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ message: "Student not found" });
    }
});

app.post("/students", (req, res) => {
    const students = getstudentdata();
    const student = req.body;

    student.id = students.length > 0
        ? students[students.length - 1].id + 1
        : 1;

    students.push(student);

    savestudentdata(students);

    res.status(201).send("Student added successfully");
});

app.put("/students/:id", (req, res) => {
    const id = req.params.id;
    const students = getstudentdata();

    const idx = students.findIndex(s => s.id == id);

    if (idx > -1) {
        students[idx] = { ...students[idx], ...req.body };

        savestudentdata(students);

        res.send("Student updated successfully");
    } else {
        res.status(404).json({ message: "Student not found" });
    }
});

app.delete("/students/:id", (req, res) => {
    const id = req.params.id;
    let students = getstudentdata();

    const student = students.find(s => s.id == id);

    if (student) {
        students = students.filter(s => s.id != id);

        savestudentdata(students);

        res.send("Student deleted successfully");
    } else {
        res.status(404).json({ message: "Student not found" });
    }
});

app.listen(3000, () => {
    console.log("Server running at port 3000");
});