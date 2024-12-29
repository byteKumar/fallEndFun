import openai
from dotenv import load_dotenv
import os
import fitz
import json

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

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

def edit_resume(text, job_description):
    """Edits the resume based on provided instructions using OpenAI API."""
    messages = [
        {"role": "system", "content": "You are a specialized resume editor focused on tailoring resumes for product management positions with expertise in data-centric SaaS and cloud platforms."},
        {"role": "user", "content": f"""
            Here is the resume:
            {text}

            Job Description:
            {job_description}

            You are a professional - product manager resume evaluator equipped with advanced AI tools to analyze resumes for alignment with job descriptions. Your task is to provide a detailed evaluation of the resume uploaded by the candidate. Follow the steps below to generate a comprehensive analysis:
            Provide a detailed breakdown of the strengths and weaknesses across the following categories:

            
            1. **Analyze the Resume & Job Description**:
               - Carefully review each section of the resume (skills, experience, projects) to identify existing skills, responsibilities, and achievements.
               - Extract and understand key skills, qualifications, and responsibilities from the job description, particularly data governance, metadata management, agile processes, and cloud technologies. Use these to inform your editing.

            2. **Edit and Align Experience with Job Description**:
               - Modify each bullet point in the experience section to align with the job description.
               - Integrate specific keywords related to product management roles naturally into relevant bullet points, reflecting alignment with the job’s required skills.
               - Reformat each bullet to emphasize impact, e.g., "Achieved [X]% improvement in [metric] by implementing [Y] technique."

            3. **Optimize the Skills Section**:
               - Highlight essential skills from the job description and certifications (if any) required for the product based role.
               - Add specific cloud and programming tools from the job description where applicable to emphasize technical alignment.

            4. **Quantify Achievements**:
               - Ensure each bullet has a quantifiable metric (e.g., percentage improvements, user engagement) where applicable.
               - If quantifiable results aren’t provided, estimate logically based on standard industry outcomes for similar roles.

            5. **Quantify Achievements**:
                - Ensure each bullet has a quantifiable metric (e.g., percentage improvements, user engagement) where applicable.
                - If quantifiable results aren’t provided, estimate logically based on standard industry outcomes for similar roles.

            6. **Use Impact-Oriented Action Verbs**:
               - Begin each bullet point with a strong action verb that communicates initiative, leadership, and results. Examples: Spearheaded, Optimized, Integrated, Enhanced.

            7. **Tailored Suggestions for Improvement**:
               - Provide **specific, resume-based suggestions** for improving alignment with the job description, such as:
                   - **Add Missing Keywords**: Identify any missing or underrepresented keywords from the job description and suggest where to include them for better alignment.
                   - **Highlight Relevant Certifications**: If the candidate has relevant certifications (e.g., Product Management, Agile, or Cloud certifications), ensure they’re highlighted under skills or a dedicated certifications section. If certifications are missing, suggest obtaining key industry-recognized credentials that align with product management.
                   - **Emphasize Product Development Experience**: Recommend elaborations in roles that may reflect hands-on experience in product lifecycle or data platform development.
                   - **Ensure Product Management Competency Visibility**: If product management skills and processes (e.g., roadmap planning, stakeholder management) aren’t prominent, suggest ways to highlight them in both the skills and experience sections.
                   - **Resume Format Consistency**: Check for and recommend uniform formatting throughout.

            8. **Scoring Criteria: Assign a total score out of 100, considering the following weighted criteria**:
                - Relevance to Job Roles (30%): Evaluate whether the skills and experience listed are pertinent to a product management role.
                - Use of Keywords (25%): Assess whether the resume includes product management critical keywords like "agile development," "data governance," "cloud platforms," and "product lifecycle management."
                - Formatting & Presentation (20%): Judge the visual appeal and structural organization of the resume.
                - Quantifiable Achievements (15%): Score based on how effectively the resume demonstrates impact using metrics or tangible results.
                - Language & Professional Tone (10%): Evaluate the professionalism and clarity of the text.

            9. **Scoring and Suggestions Delivery**:
                - Conclude with a concise summary of the resume's strengths and a prioritized list of next steps for improvement.
                - Present the total score alongside the analysis for clarity.
                - This prompt ensures the feedback in the first frame is constructive, thorough, and actionable for the candidate..
                - Tailor language to effectively convey the candidate’s qualifications for a product management role.

            Additional Instructions:
               - Ensure the tone remains professional and concise, fitting a mid- to senior-level product management position.
               - Tailor language to effectively convey the candidate’s qualifications for a data-centric product management role.
            
            Note - The final score should be referred to as "Total Score".
            Only evaluate resumes against job descriptions focused on product management or related product-based roles. If a provided job description is unrelated, I will clearly state that the evaluation applies only to product-related descriptions.

        """}
    ]

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo",
            messages=messages,
            max_tokens=1500,
            temperature=0.7
        )
        return {
            "status": "success",
            "message": "Resume edited successfully.",
            "data": {
                "edited_resume": response['choices'][0]['message']['content'].strip()
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "message": "Failed to edit resume.",
            "data": {
                "error": str(e)
            }
        }

def main():
    pdf_path = input("Enter the path of the PDF file containing the resume: ")
    job_description = input("Enter the job description for the position you are applying for: ")

    # Extract resume text
    extraction_result = extract_text_from_pdf(pdf_path)
    print(json.dumps(extraction_result, indent=4))

    if extraction_result["status"] == "success":
        resume_text = extraction_result["data"]["resume_text"]

        # Edit the resume
        edited_resume_result = edit_resume(resume_text, job_description)
        print(json.dumps(edited_resume_result, indent=4))
    else:
        print(json.dumps({"status": "error", "message": "Failed to process the resume text."}, indent=4))

if __name__ == "__main__":
    main()
