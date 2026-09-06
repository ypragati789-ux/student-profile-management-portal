from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

DATABASE = "students.db"


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            gender TEXT,
            dob TEXT,
            email TEXT,
            mobile TEXT,
            branch TEXT,
            semester TEXT,
            address TEXT
        )
    """)

    conn.commit()
    conn.close()


# Home
@app.route("/")
def home():
    return jsonify({
        "message": "Student Profile Management Portal API",
        "status": "API is running"
    })


# GET - all students
@app.route("/api/students", methods=["GET"])
def get_students():
    conn = get_db()
    students = conn.execute(
        "SELECT * FROM students ORDER BY id DESC"
    ).fetchall()
    conn.close()

    return jsonify([dict(student) for student in students])


# GET - single student
@app.route("/api/students/<int:id>", methods=["GET"])
def get_student(id):
    conn = get_db()
    student = conn.execute(
        "SELECT * FROM students WHERE id = ?", (id,)
    ).fetchone()
    conn.close()

    if student is None:
        return jsonify({"error": "Student not found"}), 404

    return jsonify(dict(student))


# POST - add student
@app.route("/api/students", methods=["POST"])
def add_student():
    data = request.get_json()

    required = ["student_id", "name"]

    for field in required:
        if not data.get(field):
            return jsonify({
                "error": f"{field} is required"
            }), 400

    conn = get_db()

    try:
        conn.execute("""
            INSERT INTO students
            (student_id, name, gender, dob, email, mobile,
             branch, semester, address)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data.get("student_id"),
            data.get("name"),
            data.get("gender"),
            data.get("dob"),
            data.get("email"),
            data.get("mobile"),
            data.get("branch"),
            data.get("semester"),
            data.get("address")
        ))

        conn.commit()

    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({
            "error": "Student ID already exists"
        }), 409

    conn.close()

    return jsonify({
        "message": "Student added successfully"
    }), 201


# PUT - update student
@app.route("/api/students/<int:id>", methods=["PUT"])
def update_student(id):
    data = request.get_json()

    conn = get_db()

    student = conn.execute(
        "SELECT * FROM students WHERE id = ?", (id,)
    ).fetchone()

    if student is None:
        conn.close()
        return jsonify({"error": "Student not found"}), 404

    conn.execute("""
        UPDATE students SET
        student_id = ?,
        name = ?,
        gender = ?,
        dob = ?,
        email = ?,
        mobile = ?,
        branch = ?,
        semester = ?,
        address = ?
        WHERE id = ?
    """, (
        data.get("student_id", student["student_id"]),
        data.get("name", student["name"]),
        data.get("gender", student["gender"]),
        data.get("dob", student["dob"]),
        data.get("email", student["email"]),
        data.get("mobile", student["mobile"]),
        data.get("branch", student["branch"]),
        data.get("semester", student["semester"]),
        data.get("address", student["address"]),
        id
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Student updated successfully"
    })


# DELETE - delete student
@app.route("/api/students/<int:id>", methods=["DELETE"])
def delete_student(id):
    conn = get_db()

    cursor = conn.execute(
        "DELETE FROM students WHERE id = ?", (id,)
    )

    conn.commit()
    conn.close()

    if cursor.rowcount == 0:
        return jsonify({
            "error": "Student not found"
        }), 404

    return jsonify({
        "message": "Student deleted successfully"
    })


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
