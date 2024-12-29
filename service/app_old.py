from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import fitz
import openai
import re
import json
from bson import ObjectId
from dotenv import load_dotenv
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import urllib.parse
import certifi
from datetime import datetime
import pytz
from tzlocal import get_localzone

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})  
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

username = urllib.parse.quote_plus('apmc')
password = urllib.parse.quote_plus('apmc@neu2024')

connection_string = f"mongodb+srv://{username}:{password}@pepperuni.mtif7.mongodb.net/?retryWrites=true&w=majority&appName=PepperUni"

client = MongoClient(connection_string, tlsCAFile=certifi.where())

# client = MongoClient("mongodb://localhost:27017/")

db = client.pepperuni_dev
user_login_collection = db.User_Login
user_profile_collection = db.User_Profile
user_resume_collection = db.User_Resume

@app.route("/api/signup", methods=["POST"])
def signup():
    try:
        
        data = request.get_json()  
        
        
        student_name = data.get("studentName")
        email = data.get("email")
        password = data.get("password")
        
        
        if not student_name or not email or not password:
            return jsonify({"error": "All fields are required"}), 400
        
        
        if user_login_collection.find_one({"email": email}):
            return jsonify({"error": "Email already exists"}), 409
        
        
        hashed_password = generate_password_hash(password)

        
        new_user = {
            "studentName": student_name,
            "email": email,
            "password": hashed_password,  
        }
        user_login_collection.insert_one(new_user)
        
        return jsonify({"message": "User successfully registered"}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/signin', methods=['POST'])
def signin():
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    
    email = data.get('email')
    password = data.get('password')

    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    
    user = user_login_collection.find_one({"email": email})

    if user:
        
        if check_password_hash(user['password'], password):
            return jsonify({
                "message": "Login successful!",
                "studentName": user.get('studentName', ""),
                "email": user['email'],
                "id": str(user['_id'])
            }), 200
        else:
            return jsonify({"error": "Invalid password"}), 401
    else:
        return jsonify({"error": "User not found. Please sign up."}), 404

@app.route("/api/update_profile", methods=["POST"])
def update_profile():
    try:
        data = request.get_json()
        
        user_id = data.get("user_id")
        name = data.get("name")
        email = data.get("email")
        phone = data.get("phone")
        linkedin = data.get("linkedin")
        portfolio = data.get("portfolio")

        if user_id:
            user = user_login_collection.find_one({"_id": ObjectId(user_id)})
            if user:
                name = name or user.get("studentName")
                email = email or user.get("email")

            new_profile = {
                "user_id": user_id,
                "name": name,
                "email": email,
                "phone": phone,
                "linkedin": linkedin,
                "portfolio": portfolio
            }

            existing_profile = user_profile_collection.find_one({"user_id": user_id})
            if existing_profile:
                user_profile_collection.update_one(
                    {"user_id": user_id},
                    {"$set": new_profile}
                )
                return jsonify({"message": "Profile updated successfully!"}), 200

            user_profile_collection.insert_one(new_profile)
            return jsonify({"message": "Profile created successfully!"}), 201

        return jsonify({"error": "User ID is required"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/get_profile", methods=["GET"])
def get_profile():
    user_id = request.args.get("user_id")

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        user = user_profile_collection.find_one({"user_id": user_id})

        if user:
            print("Profile data fetched:", user)  # Debug log
            return jsonify({
                "name": user.get("name", ""),
                "email": user.get("email", ""),
                "phone": user.get("phone", ""),
                "linkedin": user.get("linkedin", ""),
                "portfolio": user.get("portfolio", "")
            }), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        print("Error fetching profile:", e)
        return jsonify({"error": "An error occurred", "details": str(e)}), 500


def extract_text_from_pdf(pdf_path):
    """Extracts text from each page of the PDF."""
    try:
        with fitz.open(pdf_path) as pdf:
            text = ""
            for page_num in range(pdf.page_count):
                page = pdf.load_page(page_num)
                text += page.get_text()
        return {
            "status": "success",
            "message": "Successfully extracted resume text.",
            "data": {
                "resume_text": text
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "message": "Failed to extract text from the PDF.",
            "data": {
                "error": str(e)
            }
        }

def extract_score_from_text(text):
    """Extracts the total preliminary score from the text."""
    try:
        match = re.search(r"Total Score[:*]*\s*(\d{1,3})", text)
        if match:
            return match.group(1)
        else:
            return "Score not found"
    except Exception as e:
        return f"Error extracting score: {str(e)}"

def edit_resume(text, job_description):
    """Edits the resume based on provided instructions using OpenAI API."""
    try:
       messages = [
        {"role": "system", "content": "You are a specialized resume editor focused on tailoring resumes for product management positions with expertise in data-centric SaaS and cloud platforms."},
        {"role": "user", "content": f"""
            Here is the resume:
            {text}

            Job Description:
            {job_description}

            You are a highly skilled resume editor tasked with tailoring this resume specifically for the provided product management role. Follow the detailed instructions below. 

            1. **Analyze the Resume & Job Description**:
               - Carefully review each section of the resume (skills, experience, projects) to identify existing skills, responsibilities, and achievements.
               - Extract and understand key skills, qualifications, and responsibilities from the job description, particularly data governance, metadata management, agile processes, and cloud technologies. Use these to inform your editing.

            2. **Edit and Align Experience with Job Description**:
               - Modify each bullet point in the experience section to align with the job description.
               - Integrate specific keywords (e.g., "data-centric SaaS," "metadata harmonization," "DevOps tools," "agile environments") naturally into relevant bullet points, reflecting alignment with the job’s required skills.
               - Reformat each bullet to emphasize impact, e.g., "Achieved [X]% improvement in [metric] by implementing [Y] technique."

            3. **Optimize the Skills Section**:
               - Highlight essential skills from the job description, such as "data governance," "recommendation systems," and cloud platforms like AWS, Azure, or Google Cloud. 
               - Add specific cloud and programming tools from the job description (e.g., Spark, Airflow, GitHub) where applicable to emphasize technical alignment.

            4. **Quantify Achievements**:
               - Ensure each bullet has a quantifiable metric (e.g., percentage improvements, user engagement) where applicable.
               - If quantifiable results aren’t provided, estimate logically based on standard industry outcomes for similar roles.

            5. **Use Impact-Oriented Action Verbs**:
               - Begin each bullet point with a strong action verb that communicates initiative, leadership, and results. Examples: Spearheaded, Optimized, Integrated, Enhanced.

            6. **Tailored Suggestions for Improvement**:
               - Provide **specific, resume-based suggestions** for improving alignment with the job description, such as:
                   - **Add Missing Keywords**: Identify any missing or underrepresented keywords from the job description and suggest where to include them for better alignment.
                   - **Highlight Relevant Certifications**: If the candidate has relevant certifications (e.g., Product Management, Agile, or Cloud certifications), ensure they’re highlighted under skills or a dedicated certifications section. If certifications are missing, suggest obtaining key industry-recognized credentials that align with product management.
                   - **Emphasize Product Development Experience**: Recommend elaborations in roles that may reflect hands-on experience in product lifecycle or data platform development.
                   - **Ensure Product Management Competency Visibility**: If product management skills and processes (e.g., roadmap planning, stakeholder management) aren’t prominent, suggest ways to highlight them in both the skills and experience sections.
                   - **Resume Format Consistency**: Check for and recommend uniform formatting throughout.

            7. **Scoring and Final Review**: The score provided must be the score considering the fact that all the above mentioned edits have been done in the resume. Grading must be based on the new edited resume.
               - Provide a Total Resume Score Out of 100: Simulate an ATS tracker to evaluate the resume holistically. Score based on the following weighted criteria:
               - Job Fit (20%): Assess how well the candidate's overall experience, skills, and achievements align with the role's key responsibilities and requirements.
               - Skill Alignment (25%): Match the resume's skills to those specified in the job description, including technical skills (e.g., data governance, metadata management, cloud platforms) and soft skills (e.g., agile collaboration, stakeholder management).
               - Experience Relevance (25%): Evaluate the relevance of professional roles and achievements to the job requirements, emphasizing areas like product lifecycle management, team collaboration, and tools usage.
               - Action Verbs and Clarity (15%): Assess the use of strong, impact-oriented action verbs and the clarity of each bullet point. Examples: Spearheaded, Enhanced, Optimized, Delivered.
               - Measurable Achievements (15%): Analyze whether the resume includes quantifiable results (e.g., increased efficiency by 20%, improved engagement rates by 30%) to demonstrate impact effectively.
               - Generate a Total Score: Aggregate the scores from all criteria to provide a single total score out of 100.

            Additional Instructions:
               - Ensure the tone remains professional and concise, fitting a mid- to senior-level product management position.
               - Tailor language to effectively convey the candidate’s qualifications for a product management role.
            Note - The final score should be referred to as "Total Score".

        """}
    ]
       try:
            response = openai.ChatCompletion.create(
                model="gpt-4-turbo",
                messages=messages,
                max_tokens=1500,
                temperature=0.7
            )
            edited_resume = response['choices'][0]['message']['content'].strip()
            score = extract_score_from_text(edited_resume)
            return edited_resume, score

       except Exception as e:
            return {
                "status": "error",
                "message": "Failed to edit resume.",
                "data": {
                    "error": str(e)
                }
            }
    except Exception as e:
        return f"Error: {e}"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/main_job/', methods=['POST'])
def main_job_api():
    try:
        if 'file' not in request.files:
            return jsonify({
                "success": False,
                "error": "File is missing in the request."
            }), 400

        if 'job_description' not in request.form:
            return jsonify({
                "success": False,
                "error": "Job description is missing in the request."
            }), 400
        file = request.files['file']
        full_filename = file.filename
        filename = os.path.splitext(full_filename)[0]

        job_title = request.form['job_title']
        job_description = request.form['job_description']
        user_id = request.form['user_id']

        utc_time = datetime.utcnow()
        local_timezone = get_localzone()
        local_time = pytz.utc.localize(utc_time).astimezone(local_timezone)
        formatted_time = local_time.strftime('%a, %d %b %Y %H:%M:%S %Z')


        temp_path = f"/tmp/{file.filename}"
        file.save(temp_path)
        
        resume_text = extract_text_from_pdf(temp_path)
        
        if resume_text:
            resume, score = edit_resume(resume_text, job_description)

            user_resume_data = {
                "user_id": user_id,
                "filename":filename,
                "job_title":job_title,
                "resume": resume,
                "score": score,
                "created_date": formatted_time
            }
            result = user_resume_collection.insert_one(user_resume_data)
            resume_id = str(result.inserted_id)
            return jsonify({
                "success": True,
                "resume_id": resume_id
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": "Failed to extract text from the PDF."
            }), 400
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/get_resume", methods=['GET'])
def get_resume():
    resume_id = request.args.get('resume_id')

    if not resume_id:
        return jsonify({"error": "Resume ID is required"}), 400
    if resume_id:
            resume_id = ObjectId(resume_id)
    try:
        user_resume = user_resume_collection.find_one({"_id": resume_id})
        if user_resume:
            return jsonify({"resume": user_resume["resume"],
                            "score": user_resume["score"]}), 200
        else:
            return jsonify({"error": "Resume not found."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/api/get_resume_details", methods=['GET'])
def get_resume_details():
    user_id = str(request.args.get('user_id', ''))

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        user_resume = list(user_resume_collection.find({"user_id": user_id}))
        if user_resume:
            resume_details = [
                {"filename": resume.get("filename", ""),
                 "resume_id": str(resume.get("_id")),
                 "job_title": resume.get("job_title", ""),
                 "created_date": resume.get("created_date", "")}
                for resume in user_resume
            ]
            return jsonify(resume_details), 200
        else:
            return jsonify({"error": "Resume not found."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)