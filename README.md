# blablabla

This repository provides a scaffold for a simple full-stack application.

## Architecture

- `frontend/` – Web UI built with Next.js and Tailwind CSS.
- `backend/` – API and provisioning services using Node.js/Express or Django.
- `infra/` – Infrastructure-as-code for cloud resources with Terraform or Ansible.

## Setup

1. Clone the repository.
2. Install dependencies for each component:
   - `frontend/` and `backend/` require Node.js (or Python for a Django backend).
   - Run `npm install` (or `pip install -r requirements.txt`) inside the respective directory.
3. Provision infrastructure from `infra/` with Terraform or Ansible.
4. Start development servers:
   - Frontend: `npm run dev` in `frontend/`.
   - Backend: `npm run start` (or `python manage.py runserver`) in `backend/`.

