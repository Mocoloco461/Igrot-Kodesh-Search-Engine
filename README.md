# Igrot Kodesh Search Engine / מנוע חיפוש אגרות קודש

**Igrot Kodesh Search** is a modern, fast, and user-friendly web application for searching and exploring the letters of the Lubavitcher Rebbe. Built with React (Vite) and Python (FastAPI), it offers instant search capabilities, highlighting, and a premium reading experience.

**מנוע חיפוש אגרות קודש** הוא יישום אינטרנט מודרני, מהיר וידידותי למשתמש לחיפוש ועיון באגרות קודש של הרבי מליובאוויטש. המערכת נבנתה באמצעות React ו-Python, ומציעה חיפוש מיידי, הדגשת מילות חיפוש וחווית קריאה איכותית.

## Installation & Running / התקנה והרצה

### Prerequisites / דרישות מוקדמות
- Docker & Docker Compose

### Quick Start / התחלה מהירה

1. **Clone the repository / שכפל את המאגר:**
   ```bash
   git clone <repository-url>
   cd igrot-kodsh-search
   ```

2. **Add Data / הוסף נתונים:**
   Place your `IgrotKodesh_*.json` files in the `data/` directory.
   הנח את קבצי ה-JSON (`IgrotKodesh_*.json`) בתיקיית `data/`.

3. **Run with Docker / הרץ באמצעות Docker:**
   ```bash
   docker-compose up --build
   ```

4. **Access the App / כנס לאפליקציה:**
   Open your browser at [http://localhost](http://localhost).
   פתח את הדפדפן בכתובת [http://localhost](http://localhost).

---

### Development / פיתוח (ללא Docker)

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
