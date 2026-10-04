const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Quiz = require("./models/Quiz");

dotenv.config();

/*
========================================================
DATABASE CONNECTION
========================================================
*/

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("==============================================");
        console.log("MongoDB connected successfully");
        console.log("==============================================");

    } catch (error) {

        console.error("MongoDB connection error:", error);
        process.exit(1);

    }
}


/*
========================================================
QUESTION DATA
========================================================
*/

const questionSets = {

    "JavaScript Advanced": [

        {
            questionText: "Which keyword is used to declare a block-scoped variable in JavaScript?",
            options: [
                "var",
                "let",
                "define",
                "variable"
            ],
            correctAnswer: "let",
            marks: 1
        },

        {
            questionText: "What does the === operator check in JavaScript?",
            options: [
                "Only value",
                "Only data type",
                "Value and data type",
                "Variable name"
            ],
            correctAnswer: "Value and data type",
            marks: 1
        },

        {
            questionText: "Which method converts a JSON string into a JavaScript object?",
            options: [
                "JSON.parse()",
                "JSON.stringify()",
                "JSON.convert()",
                "JSON.object()"
            ],
            correctAnswer: "JSON.parse()",
            marks: 1
        },

        {
            questionText: "Which method is used to add an element to the end of an array?",
            options: [
                "push()",
                "pop()",
                "shift()",
                "unshift()"
            ],
            correctAnswer: "push()",
            marks: 1
        },

        {
            questionText: "What is a closure in JavaScript?",
            options: [
                "A loop statement",
                "A function with access to its outer scope",
                "A JavaScript class",
                "A database connection"
            ],
            correctAnswer: "A function with access to its outer scope",
            marks: 1
        },

        {
            questionText: "Which function is used to execute code after a specified delay?",
            options: [
                "setTimeout()",
                "setDelay()",
                "delay()",
                "wait()"
            ],
            correctAnswer: "setTimeout()",
            marks: 1
        },

        {
            questionText: "Which keyword refers to the current object in JavaScript?",
            options: [
                "self",
                "this",
                "current",
                "object"
            ],
            correctAnswer: "this",
            marks: 1
        },

        {
            questionText: "Which array method creates a new array by applying a function to every element?",
            options: [
                "filter()",
                "map()",
                "reduce()",
                "find()"
            ],
            correctAnswer: "map()",
            marks: 1
        }

    ],


    "node JS basics": [

        {
            questionText: "What is Node.js?",
            options: [
                "A database",
                "A JavaScript runtime environment",
                "A CSS framework",
                "A programming language"
            ],
            correctAnswer: "A JavaScript runtime environment",
            marks: 1
        },

        {
            questionText: "Which engine is used by Node.js to execute JavaScript?",
            options: [
                "SpiderMonkey",
                "V8",
                "Chakra",
                "JavaScriptCore"
            ],
            correctAnswer: "V8",
            marks: 1
        },

        {
            questionText: "Which command is used to initialize a Node.js project?",
            options: [
                "node start",
                "npm init",
                "npm create",
                "node init"
            ],
            correctAnswer: "npm init",
            marks: 1
        },

        {
            questionText: "Which file normally contains Node.js project dependencies?",
            options: [
                "index.html",
                "package.json",
                "server.txt",
                "node.config"
            ],
            correctAnswer: "package.json",
            marks: 1
        },

        {
            questionText: "Which command is commonly used to start a Node.js application?",
            options: [
                "npm start",
                "node install",
                "npm run node",
                "start node"
            ],
            correctAnswer: "npm start",
            marks: 1
        },

        {
            questionText: "Which framework is commonly used to create web applications with Node.js?",
            options: [
                "Express.js",
                "Django",
                "Spring",
                "Laravel"
            ],
            correctAnswer: "Express.js",
            marks: 1
        },

        {
            questionText: "Which object is commonly used to work with environment variables in Node.js?",
            options: [
                "process.env",
                "node.env",
                "system.env",
                "environment.node"
            ],
            correctAnswer: "process.env",
            marks: 1
        },

        {
            questionText: "Which module is commonly used to create an HTTP server in Node.js?",
            options: [
                "http",
                "server",
                "web",
                "request"
            ],
            correctAnswer: "http",
            marks: 1
        }

    ]

};


/*
========================================================
SEED QUESTIONS
========================================================
*/

async function seedQuestions() {

    try {

        await connectDB();

        console.log("");
        console.log("==============================================");
        console.log("       STARTING QUESTION SEEDING");
        console.log("==============================================");


        for (const [quizTitle, questions] of Object.entries(questionSets)) {

            console.log("");
            console.log("----------------------------------------------");
            console.log(`Searching for: ${quizTitle}`);


            const quiz = await Quiz.findOne({
                title: quizTitle
            });


            if (!quiz) {

                console.log(`❌ Quiz not found: "${quizTitle}"`);
                console.log("   Skipping this quiz.");

                continue;
            }


            console.log(`✅ Quiz found: ${quiz.title}`);
            console.log(`   Quiz ID: ${quiz._id}`);
            console.log(`   Existing questions: ${quiz.questions.length}`);


            /*
            ------------------------------------------------
            PREVENT DUPLICATE SEEDING
            ------------------------------------------------
            */

            if (quiz.questions.length > 0) {

                console.log(
                    `⚠️ This quiz already has ${quiz.questions.length} question(s).`
                );

                console.log(
                    "   Existing questions will NOT be deleted."
                );

                console.log(
                    "   Skipping to prevent duplicates."
                );

                continue;
            }


            /*
            ------------------------------------------------
            ADD QUESTIONS
            ------------------------------------------------
            */

            quiz.questions = questions;

            await quiz.save();


            console.log(
                `✅ Added ${questions.length} questions successfully.`
            );

        }


        /*
        ====================================================
        FINAL DATABASE CHECK
        ====================================================
        */

        console.log("");
        console.log("==============================================");
        console.log("        QUESTION SEEDING COMPLETED");
        console.log("==============================================");


        const quizzes = await Quiz.find({});


        console.log("");
        console.log("========== QUIZZES AFTER SEEDING ==========");


        quizzes.forEach(quiz => {

            console.log(
                `${quiz._id} | ${quiz.title} | ${quiz.subject} | Questions: ${quiz.questions.length}`
            );

        });


        console.log("");
        console.log("==============================================");
        console.log("You can now open Quiz Management.");
        console.log("Click Questions to view the questions.");
        console.log("Then click Take Quiz to test the quiz.");
        console.log("==============================================");


    } catch (error) {

        console.error("");
        console.error("❌ QUESTION SEEDING ERROR");
        console.error(error);

    } finally {

        await mongoose.connection.close();

        console.log("");
        console.log("MongoDB connection closed.");

    }

}


/*
========================================================
RUN
========================================================
*/

seedQuestions();