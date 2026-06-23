const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
const SECRET_KEY = "mysecretkey";
function getuserdata() {
    const response = fs.readFileSync("db.json", "utf8");
    const data = JSON.parse(response);
    return data.users;
}
function saveuserdata(users) {
    const userdata = JSON.stringify(
        {users: users,
         students: getstudentdata()
        },null,2
    );
    fs.writeFileSync("db.json", userdata);
}
function getstudentdata() {
    const response = fs.readFileSync("db.json", "utf8");
    const data = JSON.parse(response);
    return data.students;
}
function savestudentdata(students) {
    const stddata = JSON.stringify(
        {users: getuserdata(),
        students: students
        },
        null,
        2
    );
    fs.writeFileSync("db.json", stddata);
}
function authenticateToken(req,res,next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: "Token Required"
        });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token,SECRET_KEY,(err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid Token"});
            }
            req.user = user;
            next();
        }
    );
}
app.post("/login", (req, res) => {
    const {username,password} = req.body;
    const users = getuserdata();
    const user = users.find(u =>u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({message:"Invalid Username or Password"});
    }
    const token = jwt.sign({id: user.id,username: user.username},
        SECRET_KEY,{expiresIn: "1h"});
    res.json({message: "Login Successful",token: token
    });
});
app.get("/users",authenticateToken,(req, res) => {
    res.json(getuserdata());
    }
);
app.get("/users/:id",authenticateToken,(req, res) => {
        const id = req.params.id;
        const users =getuserdata();
        const user =users.find(u => u.id == id);
        if (user) { res.json(user);} 
        else {res.status(404).json({message:"User not found"});
        }
    }
);
app.post("/users", (req, res) => {
    const users = getuserdata();
    const user = req.body;
    user.id = users.length > 0 ? users[ users.length - 1].id + 1 : 1;
    users.push(user);
    saveuserdata(users);
    res.status(201).send("User added successfully");
});

app.put("/users/:id",authenticateToken,(req, res) => {
        const id =req.params.id;
        const users =getuserdata();
        const idx =users.findIndex(u => u.id == id);
        if (idx > -1) {users[idx] = {...users[idx],
                ...req.body
            };
        saveuserdata(users);
        res.send("User updated");
        } else {
            res.status(404).json({message:"User not found"});
        }
    }
);
app.delete("/users/:id",authenticateToken,(req, res) => {
        const id =req.params.id;
        let users =getuserdata();
        const user = users.find(u => u.id == id);
        if (user) {
            users = users.filter(u => u.id != id);
            saveuserdata(users);
            res.send(
                "User deleted"
            );
        } 
        else {
            res.status(404).json({message:"User not found"
            });
        }
    }
);

app.get("/students",authenticateToken,(req, res) => {
    res.json(getstudentdata());
    }
);
app.get("/students/:id",authenticateToken,(req, res) => {
        const id = req.params.id;
        const students = getstudentdata();
        const student =students.find(s => s.id == id);
        if (student) {
            res.json(student);
        } else {
            res.status(404).json({
                message:"Student not found"
            });
        }
    }
);

app.post("/students",authenticateToken,(req, res) => {
        const students =getstudentdata();
        const student =req.body;
        student.id =
            students.length > 0
                ? students[
                      students.length -
                          1
                  ].id + 1
                : 1;

        students.push(student);

        savestudentdata(
            students
        );

        res.status(201).send(
            "Student added successfully"
        );
    }
);

app.put(
    "/students/:id",
    authenticateToken,
    (req, res) => {
        const id =
            req.params.id;

        const students =
            getstudentdata();

        const idx =
            students.findIndex(
                s => s.id == id
            );

        if (idx > -1) {
            students[idx] = {
                ...students[idx],
                ...req.body
            };

            savestudentdata(
                students
            );

            res.send(
                "Student updated successfully"
            );
        } else {
            res.status(404).json({
                message:
                    "Student not found"
            });
        }
    }
);

app.delete(
    "/students/:id",
    authenticateToken,
    (req, res) => {
        const id =
            req.params.id;

        let students =
            getstudentdata();

        const student =
            students.find(
                s => s.id == id
            );

        if (student) {
            students =
                students.filter(
                    s => s.id != id
                );

            savestudentdata(
                students
            );

            res.send(
                "Student deleted successfully"
            );
        } else {
            res.status(404).json({
                message:
                    "Student not found"
            });
        }
    }
);

app.listen(3000, () => {
    console.log(
        "Server running at port 3000"
    );
});