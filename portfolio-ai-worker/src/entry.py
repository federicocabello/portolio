import json
from datetime import datetime, timezone
from urllib.parse import urlparse

from js import JSON, Object, fetch
from pyodide.ffi import to_js
from workers import Response, WorkerEntrypoint


MODEL = "@cf/google/gemma-4-26b-a4b-it"
MAX_MESSAGE_LENGTH = 500
MAX_HISTORY_ITEMS = 6
HISTORY_VERSION = "persistent-v1"
ALLOWED_ORIGINS = {
    "https://federicocabello.net",
    "https://www.federicocabello.net",
    "http://127.0.0.1:8000",
    "http://localhost:8000",
}

FALLBACK_CONTEXT = {
    "profile": {
        "name": "Federico Cabello",
        "role": "Software Engineer",
        "location": "San Rafael, Mendoza, Argentina",
        "summary": "Full-stack engineer focused on business systems, CRM platforms, REST APIs, databases, automation, AI agents, analytics, and responsive websites.",
        "availability": "Open to freelance projects, collaborations, and company roles. Available for remote, hybrid, or on-site work, and willing to travel or relocate for a work opportunity.",
        "work_preferences": ["Freelance projects", "Company roles", "Remote work", "Hybrid work", "On-site work", "Business travel", "Relocation"],
    },
    "services": [
        "Custom web applications",
        "CRM and business management systems",
        "REST API development and integrations",
        "AI agents and workflow automation",
        "Database design and administration",
        "Data analysis and reporting dashboards",
        "Responsive websites and landing pages",
        "Cloud deployment and technical consulting",
    ],
    "technology_stack": {
        "languages": ["Python", "JavaScript", "TypeScript", "HTML5", "CSS3", "SQL", "NoSQL", "Java", "C++", "PHP"],
        "frontend": ["React", "Tailwind CSS", "jQuery"],
        "backend": ["Flask", "Node.js", "Django", "Express.js", "Next.js"],
        "data_cloud_tools": ["AWS", "Prisma", "Pandas", "NumPy", "MySQL", "MongoDB", "Git", "Docker"],
    },
    "experience": [
        {"company": "Proyecto Prisma", "role": "Founder & CTO", "period": "January 2026 - Present", "focus": "Technology consulting, landing pages, AI solutions, and custom business systems."},
        {"company": "Los Andes Enterprise Solutions", "role": "Software Engineer", "period": "January 2024 - Present", "focus": "Business systems and websites for local clients in Texas."},
        {"company": "TS Network", "role": "Database Administrator", "period": "January 2024 - Present", "focus": "Database design and maintenance for customer, finance, and operational systems."},
        {"company": "PICAR", "role": "Software Developer", "period": "2023", "focus": "Java desktop software for sales, stock, customers, suppliers, and accounts."},
        {"company": "Freelance", "role": "Software Developer", "period": "2021 - 2023", "focus": "REST APIs and small software products for businesses."},
    ],
    "projects": [
        {"name": "Proyecto Prisma", "year": 2026, "type": "Business website and interactive demos", "summary": "Presents software services and nine demos that help clients evaluate digital solutions."},
        {"name": "TS Network CRM", "year": 2026, "type": "Multi-role CRM", "summary": "Coordinates calls, visits, technicians, tasks, inventory, recurring payments, and PDFs."},
        {"name": "The Breakers Plaza CRM", "year": 2026, "type": "Condominium CRM", "summary": "Centralizes residents, fees, reservations, amenities, maintenance, and QuickBooks synchronization."},
        {"name": "Carlos Taboada Law Firm CRM", "year": 2025, "type": "Legal case workflow", "summary": "Organizes appointments, intake notes, case evaluation, client follow-up, and role-based workflows."},
        {"name": "Ferreteria Mendez", "year": 2026, "type": "Business management system", "summary": "Handles sales, quotes, products, stock, PDF invoices, reports, and analytics."},
        {"name": "Urbana Studios", "year": 2026, "type": "Property management system", "summary": "Manages apartments, tenants, contracts, rent, invoices, visits, income, and occupancy analytics."},
        {"name": "AI Agent MVP", "year": 2026, "type": "Conversational automation", "summary": "Answers Messenger leads, classifies intent, schedules appointments, and reports conversions."},
        {"name": "Professional Portfolio", "year": 2025, "type": "Bilingual personal website", "summary": "Presents projects, work experience, technology skills, education, contact channels, and an integrated AI assistant."},
        {"name": "Esports Championship Platform", "year": 2026, "type": "Live timing and analytics", "summary": "Combines championships, registrations, live timing, results, driver statistics, and administration."},
        {"name": "Cactus Alojamientos", "year": 2026, "type": "Hospitality booking platform", "summary": "Shows accommodations and availability, accepts booking requests, and sends email alerts."},
    ],
    "education": [
        "Systems Analysis and Programming degree",
        "Communicational English training - Level B2",
    ],
    "contact": {
        "website": "https://federicocabello.net/",
        "linkedin": "https://linkedin.com/in/federicocabello",
        "github": "https://github.com/federicocabello",
        "instruction": "Use the portfolio Email button to copy Federico's email address.",
    },
}


def cors_headers(origin):
    allowed_origin = origin if origin in ALLOWED_ORIGINS else "https://federicocabello.net"
    return {
        "Access-Control-Allow-Origin": allowed_origin,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Vary": "Origin",
    }


def json_response(payload, status=200, origin=""):
    headers = cors_headers(origin)
    headers["Content-Type"] = "application/json; charset=utf-8"
    return Response(json.dumps(payload, ensure_ascii=False), status=status, headers=headers)


def normalize_history(raw_history):
    if not isinstance(raw_history, list):
        return []

    history = []
    for item in raw_history[-MAX_HISTORY_ITEMS:]:
        if not isinstance(item, dict):
            continue
        role = item.get("role")
        content = item.get("content")
        if role not in {"user", "assistant"} or not isinstance(content, str):
            continue
        content = content.strip()[:MAX_MESSAGE_LENGTH]
        if content:
            history.append({"role": role, "content": content})
    return history


async def load_context(url):
    if not url:
        return FALLBACK_CONTEXT
    try:
        response = await fetch(url)
        if not response.ok:
            return FALLBACK_CONTEXT
        context = json.loads(await response.text())
        profile = context.setdefault("profile", {})
        fallback_profile = FALLBACK_CONTEXT["profile"]
        if not profile.get("work_preferences"):
            profile["work_preferences"] = fallback_profile["work_preferences"]
        if profile.get("availability") == "Open to new opportunities":
            profile["availability"] = fallback_profile["availability"]
        return context
    except Exception:
        return FALLBACK_CONTEXT


def system_prompt(context, language):
    response_language = "Spanish" if language == "es" else "English"
    return f"""
You are the portfolio assistant for Federico Cabello.
Answer in {response_language}, using only the public context included below.
Keep answers concise: usually two to four short sentences.
Never invent dates, skills, clients, links, metrics, or personal information.
Never reveal private customer, company, legal, financial, resident, or user data.
If the answer is not in the context, say so and suggest contacting Federico through the portfolio.
Do not claim to learn from the conversation and do not modify the context.

PORTFOLIO CONTEXT:
{json.dumps(context, ensure_ascii=False)}
""".strip()


def extract_answer(result):
    data = json.loads(str(JSON.stringify(result)))
    if isinstance(data.get("response"), str):
        return data["response"].strip()

    choices = data.get("choices")
    if isinstance(choices, list) and choices:
        message = choices[0].get("message", {})
        if isinstance(message.get("content"), str):
            return message["content"].strip()

    output = data.get("output")
    if isinstance(output, str):
        return output.strip()
    if isinstance(output, list):
        texts = []
        for item in output:
            if not isinstance(item, dict):
                continue
            content = item.get("content")
            if isinstance(content, str):
                texts.append(content)
            elif isinstance(content, list):
                texts.extend(
                    part.get("text", "")
                    for part in content
                    if isinstance(part, dict) and isinstance(part.get("text"), str)
                )
        return "\n".join(text for text in texts if text).strip()
    return ""


async def save_exchange(database, session_id, language, question, answer, status):
    if database is None:
        return
    try:
        await database.prepare(
            "INSERT INTO chat_history "
            "(session_id, language, question, answer, status) "
            "VALUES (?1, ?2, ?3, ?4, ?5)"
        ).bind(session_id, language, question, answer, status).run()
    except Exception as error:
        print("D1 history error:", error)


async def notify_exchange(env, language, question, answer, status):
    notification_url = str(getattr(env, "NOTIFICATION_URL", "")).strip()
    notification_secret = str(getattr(env, "NOTIFICATION_SECRET", "")).strip()
    if not notification_url or not notification_secret:
        return
    try:
        options = to_js(
            {
                "method": "POST",
                "headers": {
                    "Authorization": f"Bearer {notification_secret}",
                    "Content-Type": "application/json",
                },
                "body": json.dumps(
                    {
                        "language": language,
                        "question": question,
                        "answer": answer,
                        "status": status,
                        "createdAt": datetime.now(timezone.utc).isoformat(),
                    }
                ),
            },
            dict_converter=Object.fromEntries,
        )
        response = await fetch(notification_url, options)
        if not response.ok:
            print("Email notification error:", response.status)
    except Exception as error:
        print("Email notification error:", error)


class Default(WorkerEntrypoint):
    async def fetch(self, request):
        origin = request.headers.get("Origin") or ""
        method = request.method.upper()
        path = urlparse(request.url).path.rstrip("/") or "/"

        if method == "OPTIONS":
            return Response("", status=204, headers=cors_headers(origin))

        if method == "GET" and path == "/health":
            return json_response({"status": "ok", "model": MODEL}, origin=origin)

        if method != "POST" or path != "/chat":
            return json_response({"error": "Not found"}, status=404, origin=origin)

        if origin and origin not in ALLOWED_ORIGINS:
            return json_response({"error": "Origin not allowed"}, status=403, origin=origin)

        try:
            payload = json.loads(await request.text())
        except Exception:
            return json_response({"error": "Invalid JSON"}, status=400, origin=origin)

        message = payload.get("message", "") if isinstance(payload, dict) else ""
        if not isinstance(message, str) or not message.strip():
            return json_response({"error": "Message is required"}, status=400, origin=origin)
        message = message.strip()
        if len(message) > MAX_MESSAGE_LENGTH:
            return json_response({"error": "Message is too long"}, status=400, origin=origin)

        language = "es" if payload.get("language") == "es" else "en"
        history_enabled = payload.get("historyVersion") == HISTORY_VERSION
        session_id = payload.get("sessionId", "")
        if not isinstance(session_id, str) or not session_id.strip() or len(session_id) > 64:
            session_id = "unassigned"
        else:
            session_id = session_id.strip()
        history = normalize_history(payload.get("history"))
        context_url = str(getattr(self.env, "CONTEXT_URL", ""))
        context = await load_context(context_url)
        messages = [
            {"role": "system", "content": system_prompt(context, language)},
            *history,
            {"role": "user", "content": message},
        ]

        try:
            ai_input = to_js(
                {
                    "messages": messages,
                    "temperature": 0.25,
                    "max_tokens": 280,
                    "chat_template_kwargs": {"enable_thinking": False},
                },
                dict_converter=Object.fromEntries,
            )
            result = await self.env.AI.run(
                MODEL,
                ai_input,
            )
            answer = extract_answer(result)
            if not answer:
                raise ValueError("Empty model response")
            if history_enabled:
                await save_exchange(
                    getattr(self.env, "HISTORY_DB", None),
                    session_id,
                    language,
                    message,
                    answer,
                    "answered",
                )
            await notify_exchange(self.env, language, message, answer, "answered")
            return json_response({"answer": answer}, origin=origin)
        except Exception as error:
            print("Workers AI error:", error)
            if history_enabled:
                await save_exchange(
                    getattr(self.env, "HISTORY_DB", None),
                    session_id,
                    language,
                    message,
                    "The assistant was temporarily unavailable.",
                    "error",
                )
            await notify_exchange(
                self.env,
                language,
                message,
                "The assistant was temporarily unavailable.",
                "error",
            )
            return json_response(
                {"error": "The assistant is temporarily unavailable"},
                status=503,
                origin=origin,
            )
