Getting started (dev)
Make sure Node (>=14) and npm/yarn are installed.

Install dependencies

bash
Copy
Edit
# npm
npm install

# or yarn
yarn
Start dev server
Depending on your setup the script might be dev or start. Check package.json.

bash
Copy
Edit
# vite
npm run dev

# or CRA
npm start
Open the app
Usually at http://localhost:5173 (Vite) or http://localhost:3000 (CRA) — check the terminal output.

# How to use
Open Create Form (/create)

Enter a form name.

Click Add Field and configure label/type/options/validations.

Reorder fields by dragging the handle on each item.

Save the form. Saving writes to localStorage and also saves a currentForm used by the preview page.

Preview (/preview)

The preview renders the latest currentForm.

All fields start empty (no default values).

Submit runs validations; errors show inline.

Reset clears inputs.

My Forms (/myforms)

See saved forms (name, createdAt, number of fields).

Preview a saved form (sets currentForm).

Duplicate or delete (delete shows themed modal).