const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mysql = require("mysql");
const cors = require("cors");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

var app = express();
// Require for Getting data
app.use(cors({
    origin: true,
    method: ["GET", "POST"],
    credentials: true
}));

// app.use(cors({
//     origin: ["http://localhost:3000"],
//     method: ["GET", "POST"],
//     credentials: true
// }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

var options = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'self_traker',
};
// const options = {
//     host: "db4free.net",
//     user: "selfroot",
//     port: 3306,
//     password: "Root2021",
//     database: "selftraker",
// };

// making connection with database
var db = mysql.createConnection(options);
var sessionStore = new MySQLStore(options);

app.use(session({
    key: "UserId",
    secret: 'my secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24 * 1000,
    },
}));


app.listen(3001, () => {
    console.log("Server is running");
});


app.post('/login', function(req, res) {
    // sess = req.session;
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM users WHERE username=(?) AND password=(?)",
        [username, password],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                const a = result.length;
                if (a === 1) {
                    req.session.user_id = result[0].id;
                    req.session.isAuth = true;
                }
                res.send(req.session.isAuth);
            }
        }
    );
});

app.get('/auth', function(req, res) {
    if (req.session.isAuth) {
        res.send(req.session.isAuth);
    }

});
app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if (!err) {
            console.log("Log Out!");
        } else {
            console.log(err);
        }
    });
});

// Post Request For Inserting data for signup
app.post("/signup", (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "INSERT INTO users (name,username,password) VALUES (?,?,?)",
        [name, username, password],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("User Created");
            }
        }
    );
});
// Checking for duplicate username

app.post("/checkuser", (req, res) => {
    const username = req.body.username;
    db.query(
        "SELECT id FROM users WHERE username=(?)",
        [username],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Post Request For Login
// var sess = {
//     user_id: "",
//     username: "",
//     password: "",
//     isAuth: false,
// };
// var sess;


//////// AFTER LOGIN QURIES

// Checking for duplicate Subject Name
app.post("/checksubject", (req, res) => {
    const subName = req.body.subName;
    db.query(
        "SELECT id FROM subjects WHERE sub_name=(?) AND user_id=(?)",
        [subName, req.session.user_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});
// Post Request For Inserting data for subject
app.post("/addSubject", (req, res) => {
    const subName = req.body.subName;

    db.query(
        "INSERT INTO subjects (sub_name,user_id) VALUES (?,?)",
        [subName, req.session.user_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Subject Created");
            }
        }
    );
});
// Getting Data of All subjects
app.get("/getSubjects", (req, res) => {
    db.query(
        "SELECT * FROM subjects WHERE user_id=(?) ORDER BY id DESC",
        [req.session.user_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Checking for duplicate Category Name
app.post("/checkcat", (req, res) => {
    const catName = req.body.catName;

    db.query(
        "SELECT id FROM category WHERE cat_name=(?) AND user_id=(?)",
        [catName, req.session.user_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});
// Post Request For Inserting data for category
app.post("/addCat", (req, res) => {
    const catName = req.body.catName;

    db.query(
        "INSERT INTO category (cat_name,user_id) VALUES (?,?)",
        [catName, req.session.user_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Category Created");
            }
        }
    );
});
// Getting Data of All Categories
app.get("/getCats", (req, res) => {
    db.query(
        "SELECT * FROM category WHERE user_id=(?) ORDER BY id DESC",
        [req.session.user_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Getting all categories of a subject
app.post("/subCats", (req, res) => {
    const sub_id = req.body.sub_id;
    db.query(
        "SELECT * FROM category WHERE id IN(SELECT cat_id FROM sub_cat WHERE user_id=(?) AND sub_id=(?))",
        [req.session.user_id, sub_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Getting all categories left for a subject

app.post("/leftCats", (req, res) => {
    const sub_id = req.body.sub_id;
    db.query(
        "SELECT * FROM category WHERE user_id=(?) AND id NOT IN(SELECT cat_id FROM sub_cat WHERE user_id=(?) AND sub_id=(?))",
        [req.session.user_id, req.session.user_id, sub_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Adding Category to subject

app.post("/addCatToSub", (req, res) => {
    const sub_id = req.body.sub_id;
    const cat_id = req.body.cat_id;
    db.query(
        "INSERT INTO sub_cat(sub_id,cat_id,user_id) VALUES (?,?,?)",
        [sub_id, cat_id, req.session.user_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Category Added");
            }
        }
    );
});

// Removing Category from subject

app.post("/remCatToSub", (req, res) => {
    const sub_id = req.body.sub_id;
    const cat_id = req.body.cat_id;
    db.query(
        "DELETE FROM sub_cat WHERE sub_id =(?) AND cat_id=(?) AND user_id=(?)",
        [sub_id, cat_id, req.session.user_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Category Removed");
            }
        }
    );
});

// Getting all subjects of a category
app.post("/catSubs", (req, res) => {
    const cat_id = req.body.cat_id;
    db.query(
        "SELECT * FROM subjects WHERE id IN(SELECT sub_id FROM sub_cat WHERE user_id=(?) AND cat_id=(?))",
        [req.session.user_id, cat_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Getting all subject left for category

app.post("/leftSubs", (req, res) => {
    const cat_id = req.body.cat_id;
    db.query(
        "SELECT * FROM subjects WHERE user_id=(?) AND id NOT IN(SELECT sub_id FROM sub_cat WHERE user_id=(?) AND cat_id=(?))",
        [req.session.user_id, req.session.user_id, cat_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Adding subject to category

app.post("/addSubToCat", (req, res) => {
    const sub_id = req.body.sub_id;
    const cat_id = req.body.cat_id;
    db.query(
        "INSERT INTO sub_cat(sub_id,cat_id,user_id) VALUES (?,?,?)",
        [sub_id, cat_id, req.session.user_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Subject Added");
            }
        }
    );
});

// Removing Category from subject

app.post("/remSubToCat", (req, res) => {
    const sub_id = req.body.sub_id;
    const cat_id = req.body.cat_id;
    db.query(
        "DELETE FROM sub_cat WHERE sub_id =(?) AND cat_id=(?) AND user_id=(?)",
        [sub_id, cat_id, req.session.user_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Subject Removed");
            }
        }
    );
});

// Getting Data of All active subjects
app.get("/getactiveSubjects", (req, res) => {
    db.query(
        "SELECT * FROM subjects WHERE user_id=(?)AND active=1 ORDER BY id DESC",
        [req.session.user_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Post Request For Inserting data for category
app.post("/addData", (req, res) => {
    const subId = req.body.subId;
    const duration = req.body.duration;
    const date = req.body.date;
    const month = req.body.month;
    const year = req.body.year;
    const com_date = req.body.com_date;

    db.query(
        "INSERT INTO data (user_id,date,month,year,com_date,duration,sub_id) VALUES (?,?,?,?,?,?,?)",
        [req.session.user_id, date, month, year, com_date, duration, subId],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Data Added");
            }
        }
    );
});
// Getting time left
app.post("/timeLeft", (req, res) => {
    const date = req.body.date;
    const month = req.body.month;
    const year = req.body.year;

    db.query(
        "SELECT SUM(duration) AS total_duration FROM data WHERE date=(?) AND month=(?) AND year=(?) AND user_id=(?)",
        [date, month, year, req.session.user_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Getting today enterd Data
app.post("/todayData", (req, res) => {
    const date = req.body.date;
    const month = req.body.month;
    const year = req.body.year;

    db.query(
        "SELECT subjects.sub_name,data.id,data.date,data.month,data.year,data.user_id,data.duration FROM subjects INNER JOIN data ON subjects.id = data.sub_id WHERE data.date=(?) AND data.month=(?) AND data.year=(?) AND data.user_id=(?) ORDER BY data.id DESC",
        [date, month, year, req.session.user_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Removing a data entry
app.post("/removeData", (req, res) => {
    const list_id = req.body.list_id;

    db.query("DELETE FROM data WHERE id =(?)", [list_id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send("Entry Removed");
        }
    });
});

// Get Last 7 Data of Subjct
app.post("/subseven", (req, res) => {
    const sub_id = req.body.sub_id;
    const day1 = req.body.day1;
    const day2 = req.body.day2;
    const day3 = req.body.day3;
    const day4 = req.body.day4;
    const day5 = req.body.day5;
    const day6 = req.body.day6;
    const day7 = req.body.day7;
    const days = [day1, day2, day3, day4, day5, day6, day7];

    const resultData = [];
    for (let i = 0; i < 7; i++) {
        db.query(
            "SELECT SUM(duration) AS total,date,month,year FROM data WHERE sub_id=(?) AND user_id=(?) AND com_date =? GROUP BY date,month,year",
            [sub_id, req.session.user_id, days[i]],
            (err, result) => {
                const a = result[0];
                if (err) {
                    console.log(err);
                } else {
                    resultData.push(a);
                }
                if (i === 6) {
                    res.send(resultData);
                }
            }
        );
    }
});

// Get Last 7 Data of Subjct
app.post("/catseven", (req, res) => {
    const cat_id = req.body.cat_id;
    const day1 = req.body.day1;
    const day2 = req.body.day2;
    const day3 = req.body.day3;
    const day4 = req.body.day4;
    const day5 = req.body.day5;
    const day6 = req.body.day6;
    const day7 = req.body.day7;
    const days = [day1, day2, day3, day4, day5, day6, day7];

    const resultData1 = [];
    for (let i = 0; i < 7; i++) {
        db.query(
            "SELECT SUM(duration) AS total,date,month,year FROM data WHERE user_id=(?) AND com_date =? AND sub_id IN( SELECT sub_id FROM sub_cat WHERE cat_id=(?)) GROUP BY date,month,year ",
            [req.session.user_id, days[i], cat_id],
            (err, result) => {
                const a = result[0];
                if (err) {
                    console.log(err);
                } else {
                    resultData1.push(a);
                }
                if (i === 6) {
                    res.send(resultData1);
                }
            }
        );
    }
});